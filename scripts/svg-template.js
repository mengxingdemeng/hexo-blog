const fs = require('fs');
const path = require('path');

function generateStatsCard(data, platform, outputPath) {
  const theme = {
    leetcode: {
      bg: '#1E1E2E',
      primary: '#FFA116',
      easy: '#22C55E',
      medium: '#EAB308',
      hard: '#EF4444',
      text: '#FFFFFF',
      subtext: '#A6ADBB'
    }
  }[platform] || {};

  const svg = `
<!-- 只在这里加了 xmlns:xlink 让点击生效 -->
<svg width="450" height="220" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <!-- 背景 -->
  <rect width="450" height="220" fill="${theme.bg}" rx="14" ry="14"/>
  
  <!-- 标题 -->
  <text x="30" y="40" font-size="22" font-weight="bold" fill="${theme.text}">LeetCode 刷题统计</text>
  <text x="30" y="65" font-size="14" fill="${theme.subtext}">用户 ${data.name}</text>

  <!-- 总AC -->
  <text x="30" y="100" font-size="26" font-weight="bold" fill="${theme.primary}">
    AC ${data.solved} / ${data.total} 题
  </text>

  <!-- 排名 -->
  <text x="300" y="100" font-size="16" fill="${theme.subtext}">
    全站排名 ${data.rank}
  </text>

  <!-- 进度条 -->
  <rect x="30" y="120" width="390" height="14" fill="#313244" rx="7"/>
  <rect x="30" y="120" width="${390 * (data.solved / data.total)}" height="14" fill="${theme.primary}" rx="7"/>

  <!-- 难度统计（只改这里） -->
  <text x="30" y="160" font-size="15" fill="${theme.easy}">简单 ${data.easy}/${data.totalEasy}</text>
  <text x="130" y="160" font-size="15" fill="${theme.medium}">中等 ${data.medium}/${data.totalMedium}</text>
  <text x="230" y="160" font-size="15" fill="${theme.hard}">困难 ${data.hard}/${data.totalHard}</text>

</svg>
  `;

  const output = path.join(__dirname, '..', outputPath);
  fs.writeFileSync(output, svg);
  console.log('✅ SVG 已保存到:', output);
}

module.exports = { generateStatsCard };