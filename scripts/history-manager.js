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
  // 按日期倒序排列，最新的在最前面
  history.sort((a, b) => new Date(b.date) - new Date(a.date));
  fs.writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2), 'utf8');
  console.log('✅ 历史数据已保存');
}

function appendTodayData(data) {
  const today = new Date().toISOString().split('T')[0]; // 格式：YYYY-MM-DD
  const history = loadHistory();

  // 自动去重：如果今天已经有记录，就更新；没有就新增
  const existingIndex = history.findIndex(item => item.date === today);
  if (existingIndex >= 0) {
    history[existingIndex] = { date: today, ...data };
    console.log(`🔄 今日数据已更新 (${today})`);
  } else {
    history.push({ date: today, ...data });
    console.log(`✅ 新增今日记录 (${today})`);
  }

  saveHistory(history);
}

module.exports = { appendTodayData };