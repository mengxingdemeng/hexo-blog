const fs = require('fs');
const path = require('path');

function generateStatsCard(data, platform, outputPath) {
  const theme = {
    leetcode: { bg: '#1e1e2e', primary: '#ffa116', text: '#ffffff' },
    luogu: { bg: '#f5f5f5', primary: '#1e90ff', text: '#333333' },
    nowcoder: { bg: '#121212', primary: '#00b578', text: '#ffffff' }
  }[platform] || { bg: '#fff', primary: '#000', text: '#333' };

  const svg = `
<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="200" fill="${theme.bg}" rx="12" ry="12"/>
  <text x="20" y="30" font-size="18" font-weight="bold" fill="${theme.primary}">${data.name} 的 ${platform.toUpperCase()} 统计</text>
  <text x="20" y="60" font-size="24" font-weight="bold" fill="${theme.text}">已解决: ${data.solved} / ${data.total}</text>
  <rect x="20" y="90" width="360" height="12" fill="#e0e0e0" rx="6"/>
  <rect x="20" y="90" width="${360 * (data.solved / data.total)}" height="12" fill="${theme.primary}" rx="6"/>
  <text x="20" y="125" font-size="14" fill="${theme.text}">
    ${platform === 'leetcode' ? `简单 ${data.easy} 中等 ${data.medium} 困难 ${data.hard}` : ''}
    ${platform === 'luogu' ? `Rating ${data.rating} | AC率 ${data.acRate}%` : ''}
    ${platform === 'nowcoder' ? `Rating ${data.rating} | 排名 ${data.rank}` : ''}
  </text>
</svg>
  `;

  const output = path.join(__dirname, '..', outputPath);
  fs.writeFileSync(output, svg);
  console.log('✅ 生成成功:', output);
}

module.exports = { generateStatsCard };