const axios = require('axios');
const cheerio = require('cheerio');
const { generateStatsCard } = require('./svg-template');

// 改成你的牛客用户名
const NOWCODER_USERNAME = '张华翔';

async function fetchNowcoderData() {
  try {
    const { data } = await axios.get(`https://www.nowcoder.com/users/${NOWCODER_USERNAME}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const $ = cheerio.load(data);

    const name = $('.user-name').text().trim() || '牛客用户';
    const solved = parseInt($('.stat-item .num').eq(0).text()) || 0;
    const rating = parseInt($('.rating-score').text().trim()) || 0;
    const rank = $('.rank').text().trim() || '未知';

    generateStatsCard({
      name, solved, total: 2000, rating, rank
    }, 'nowcoder', 'source/shuati/nowcoder-stats.svg');

  } catch (err) {
    console.error('牛客拉取失败', err.message);
  }
}

fetchNowcoderData();