const axios = require('axios');
const { generateStatsCard } = require('./svg-template');

// 填入你的洛谷 UID（纯数字）
const LUOGU_UID = '1570933';

async function fetchLuogu() {
  try {
    console.log('正在拉取洛谷数据...');

    const response = await axios({
      url: 'https://api.luogu.com.cn/user/get',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        Origin: 'https://www.luogu.com.cn',
        Referer: 'https://www.luogu.com.cn/'
      },
      data: {
        id: parseInt(LUOGU_UID)
      },
      timeout: 10000
    });

    const user = response.data.user;
    const name = user.name || '洛谷用户';
    const solved = user.accepted || 0;
    const rating = user.rating || 0;
    const acRate = (user.accepted / (user.submitted || 1) * 100).toFixed(1);

    generateStatsCard(
      { name, solved, total: 3000, rating, acRate },
      'luogu',
      'source/shuati/luogu-stats.svg'
    );

    console.log('✅ 洛谷拉取成功！');
  } catch (e) {
    console.error('❌ 拉取失败，但不影响其他功能', e.message);
  }
}

fetchLuogu();