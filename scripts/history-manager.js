const fs = require('fs');
const path = require('path');

const HISTORY_PATH = path.join(__dirname, '..', 'source', 'leetcode-history', 'leetcode-history.json');

function loadHistory() {
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
  history.sort((a, b) => new Date(a.date) - new Date(b.date));
  fs.writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2), 'utf8');
  console.log('✅ 历史数据已保存');
}

// ==============================
// 【已修复】正确补齐缺失日期
// ==============================
function fillMissingDates(history) {
  if (history.length === 0) return history;

  let sorted = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
  const filled = [];
  
  filled.push(sorted[0]);
  let lastData = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const currentDate = new Date(current.date);
    const checkDate = new Date(filled[filled.length - 1].date);

    while (true) {
      checkDate.setDate(checkDate.getDate() + 1);
      if (checkDate >= currentDate) break;

      const dateStr = checkDate.toISOString().split('T')[0];
      filled.push({
        date: dateStr,
        solved: lastData.solved,
        easy: lastData.easy,
        medium: lastData.medium,
        hard: lastData.hard
      });
    }

    filled.push(current);
    lastData = current;
  }

  return filled;
}

function appendTodayData(data) {
  const today = new Date().toISOString().split('T')[0];
  let history = loadHistory();

  const existingIndex = history.findIndex(item => item.date === today);
  if (existingIndex >= 0) {
    history[existingIndex] = { date: today, ...data };
    console.log(`🔄 今日数据已更新 (${today})`);
  } else {
    history.push({ date: today, ...data });
    console.log(`✅ 新增今日记录 (${today})`);
  }

  history = fillMissingDates(history);
  saveHistory(history);
}

module.exports = { appendTodayData };