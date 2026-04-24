# ===================== 【只改这里！】 =====================
JSON_PATH = r"H:\hexo-blog\myblog\source\luogu-history\luogu-history.json"
# ==========================================================

import json
import datetime
import os
import traceback

def main():
    os.system("cls")
    print("=" * 50)
    print("📊 洛谷刷题数据自动更新工具（EXE版）")
    print("=" * 50)

    # 先检查文件是否存在
    if not os.path.exists(JSON_PATH):
        print(f"\n❌ 错误：文件不存在！路径：{JSON_PATH}")
        input("按回车退出...")
        return

    try:
        with open(JSON_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
    except json.JSONDecodeError:
        print("\n❌ 错误：JSON文件格式错误（不是合法的JSON）！")
        print("💡 请确保文件内容是标准的JSON数组，比如 []")
        input("按回车退出...")
        return
    except Exception as e:
        print(f"\n❌ 读取文件失败：{e}")
        print("错误详情：")
        traceback.print_exc()
        input("按回车退出...")
        return

    # 兼容空文件的情况（第一次用的时候）
    if not data:
        print("\n⚠️  注意：JSON文件为空，将以0题作为初始数据")
        last = {"solved":0, "easy":0, "medium":0, "hard":0}
    else:
        last = data[-1]
        print(f"✅ 上次累计：总数 {last['solved']} | 简单 {last['easy']} | 中等 {last['medium']} | 困难 {last['hard']}")

    try:
        e = int(input("\n今日新增 简单："))
        m = int(input("今日新增 中等："))
        h = int(input("今日新增 困难："))
    except ValueError:
        print("❌ 请输入纯数字，不要输入字母或空格！")
        input("按回车退出...")
        return

    new_e = last["easy"] + e
    new_m = last["medium"] + m
    new_h = last["hard"] + h
    new_s = new_e + new_m + new_h

    today = datetime.date.today().strftime("%Y-%m-%d")
    new_item = {
        "date": today,
        "solved": new_s,
        "easy": new_e,
        "medium": new_m,
        "hard": new_h
    }

    # 如果是空文件，直接初始化列表再追加
    if not data:
        data = [new_item]
    else:
        data.append(new_item)

    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\n✅ 今日数据已成功追加！")
    print(f"📅 {today} 累计：{new_s} 题")
    input("按回车退出...")

if __name__ == "__main__":
    main()