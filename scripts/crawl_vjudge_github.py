import requests
import json
import os
import hashlib
from datetime import datetime, timedelta
import time
import re

# ========== 配置区 ==========
VJUDGE_USERNAME = "liulixian"
DATA_FILE = "static/data/vjudge-record.json"
BASE_URL = f"https://vjudge.net/user/{VJUDGE_USERNAME}"
SIMULATE_DAY_RANGE = 30
SIMULATE_MIN_DAY = 1
SIMULATE_MAX_DAY = 8
REQUEST_DELAY = 1
# ===========================

def get_vjudge_data():
    data_dir = os.path.dirname(DATA_FILE)
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
        print(f"已创建目录: {data_dir}")

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    }

    print(f"正在访问 Vjudge: {BASE_URL}")
    time.sleep(REQUEST_DELAY)

    try:
        resp = requests.get(BASE_URL, headers=headers, timeout=15)
        resp.raise_for_status()
    except requests.exceptions.RequestException as e:
        raise Exception(f"网络请求失败: {e}")

    text = resp.text
    patterns = [
        r'Solved[:：]\s*(\d+)',
        r'AC[:：]\s*(\d+)',
        r'总通过[:：]\s*(\d+)',
        r'<span[^>]*>Solved<\/span>\s*<span[^>]*>(\d+)<\/span>',
        r'<span[^>]*>AC<\/span>\s*<span[^>]*>(\d+)<\/span>',
    ]

    total_solved = 0
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            total_solved = int(match.group(1))
            break

    if total_solved == 0:
        lines = text.split('\n')
        for line in lines:
            if 'Solved' in line or 'AC' in line:
                numbers = re.findall(r'\d+', line)
                if numbers:
                    total_solved = int(numbers[0])
                    break

    if total_solved == 0:
        raise Exception("未能抓取到总做题数")

    today_str = datetime.now().strftime("%Y-%m-%d")
    print(f"✅ 抓取成功，累计总题量：{total_solved}，今日日期：{today_str}")
    return total_solved, today_str

def generate_initial_data(current_total, today_str):
    data = {
        "dateList": [],
        "countList": [],
        "records": [],
        "updateTime": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    end_day = datetime.strptime(today_str, "%Y-%m-%d")
    start_day = end_day - timedelta(days=SIMULATE_DAY_RANGE)
    current_total_back = current_total

    current_date = start_day
    while current_date <= end_day:
        date_str = current_date.strftime("%Y-%m-%d")
        hash_obj = hashlib.sha256(date_str.encode("utf8"))
        num_hash = int.from_bytes(hash_obj.digest(), byteorder="big")
        daily = (num_hash % (SIMULATE_MAX_DAY - SIMULATE_MIN_DAY + 1)) + SIMULATE_MIN_DAY

        data["dateList"].append(date_str)
        data["countList"].append(daily)
        data["records"].append({
            "date": date_str,
            "daily": daily,
            "total": current_total_back
        })
        current_total_back -= daily
        current_date += timedelta(days=1)

    print(f"📊 生成初始数据：{len(data['records'])} 条记录")
    return data

def update_record(total_solved, today_str):
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        print(f"读取历史数据，共 {len(data.get('records', []))} 条记录")
    else:
        print("首次运行，生成初始数据...")
        data = generate_initial_data(total_solved, today_str)

    records = data.setdefault("records", [])
    dateList = data.setdefault("dateList", [])
    countList = data.setdefault("countList", [])

    exist_today = any(r["date"] == today_str for r in records)

    if exist_today:
        last_total = 0
        for rec in reversed(records):
            if rec["date"] != today_str:
                last_total = rec["total"]
                break
        daily_add = total_solved - last_total
        if daily_add < 0:
            daily_add = 0

        for idx, rec in enumerate(records):
            if rec["date"] == today_str:
                rec["daily"] = daily_add
                rec["total"] = total_solved
                countList[idx] = daily_add
                break
        print(f"🔄 更新今日记录，当日新增：{daily_add}")
    else:
        if len(records) == 0:
            daily_add = total_solved
        else:
            daily_add = total_solved - records[-1]["total"]
        if daily_add < 0:
            daily_add = 0

        dateList.append(today_str)
        countList.append(daily_add)
        records.append({"date": today_str, "daily": daily_add, "total": total_solved})

    data["updateTime"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # 确保数据一致性
    data["dateList"] = [r["date"] for r in records]
    data["countList"] = [r["daily"] for r in records]
    
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"💾 数据已保存至 {DATA_FILE}")
    return data

def main():
    print("="*50)
    print("🚀 Vjudge刷题统计脚本 (GitHub Actions 版)")
    print("="*50)
    print(f"👤 用户名: {VJUDGE_USERNAME}")
    print(f"📁 数据文件: {DATA_FILE}")
    print("="*50)
    
    try:
        total_solved, today_str = get_vjudge_data()
        data = update_record(total_solved, today_str)
        print(f"\n📊 当前统计:")
        print(f"   - 总记录数: {len(data.get('records', []))}")
        print(f"   - 最后更新: {data.get('updateTime', '未知')}")
        print("\n✅ 数据生成完成！")
    except Exception as e:
        print(f"\n❌ 执行失败：{str(e)}")
        import traceback
        traceback.print_exc()
        exit(1)

if __name__ == "__main__":
    main()