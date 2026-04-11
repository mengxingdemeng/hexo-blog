const fs = require('fs');
const path = require('path');

// 历史数据文件路径（放在source/leetcode-history下,方便管理）
const HISTORY_PATH = path.join(__dirname, '..', 'source', 'leetcode-history', 'leetcode-history.json');

function loadHistory() {
  // 如果文件不存在，初始化空数组
  if (!fs.existsSync(HISTORY_PATH)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf8'));
  } catch (e) {
    console.error('❌ 历史文件损坏，重置为空', e);
    return [];
  }
}

function saveHistory(history) {
  // 按日期正序排列（旧→新），保证前端渲染顺序正确
  history.sort((a, b) => new Date(a.date) - new Date(b.date));
  fs.writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2), 'utf8');
  console.log('✅ 历史数据已保存');
}

// 补全中间缺失的日期，缺失天默认题目数量为 0
function fillMissingDates(history) {
  if (history.length === 0) return history;

  // 排序
  let sorted = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
  const filled = [];
  let prevDate = new Date(sorted[0].date);

  filled.push(sorted[0]);

  for (let i = 1; i < sorted.length; i++) {
    const currDate = new Date(sorted[i].date);
    const nextDay = new Date(prevDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // 循环补齐中间缺失的每一天
    while (nextDay < currDate) {
      const dateStr = nextDay.toISOString().split('T')[0];
      filled.push({
        date: dateStr,
        solved: 0,
        easy: 0,
        medium: 0,
        hard: 0
      });
      nextDay.setDate(nextDay.getDate() + 1);
    }

    filled.push(sorted[i]);
    prevDate = currDate;
  }

  return filled;
}

function appendTodayData(data) {
  const today = new Date().toISOString().split('T')[0]; // 格式：YYYY-MM-DD
  let history = loadHistory();

  // 自动去重：如果今天已经有记录，就更新；没有就新增
  const existingIndex = history.findIndex(item => item.date === today);
  if (existingIndex >= 0) {
    history[existingIndex] = { date: today, ...data };
    console.log(`🔄 今日数据已更新 (${today})`);
  } else {
    history.push({ date: today, ...data });
    console.log(`✅ 新增今日记录 (${today})`);
  }

  // 自动补全缺失日期（核心新增，不影响原有逻辑）
  history = fillMissingDates(history);

  saveHistory(history);
}

module.exports = { appendTodayData };