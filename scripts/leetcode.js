const axios = require('axios');
const { generateStatsCard } = require('./svg-template');
const { appendTodayData } = require('./history-manager'); 

const LEETCODE_USERNAME = 'confident-varahamihiracj1';

async function fetchLeetCodeData() {
  try {
    const query = `
      query getAllData($userSlug: String!) {
        userProfilePublicProfile(userSlug: $userSlug) {
          siteRanking
        }
        userProfileUserQuestionProgress(userSlug: $userSlug) {
          numAcceptedQuestions { difficulty count }
          numUntouchedQuestions { difficulty count }
        }
      }
    `;

    const { data } = await axios.post(
      'https://leetcode.cn/graphql/',
      {
        query,
        variables: { userSlug: LEETCODE_USERNAME }
      },
      {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Origin': 'https://leetcode.cn',
          'Referer': `https://leetcode.cn/u/${LEETCODE_USERNAME}/`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    if (data.errors) {
      throw new Error(JSON.stringify(data.errors));
    }

    const ranking = data.data.userProfilePublicProfile.siteRanking;
    const progress = data.data.userProfileUserQuestionProgress;
    const accepted = progress.numAcceptedQuestions;
    const untouched = progress.numUntouchedQuestions;

    const easy = accepted.find(i => i.difficulty === 'EASY')?.count || 0;
    const medium = accepted.find(i => i.difficulty === 'MEDIUM')?.count || 0;
    const hard = accepted.find(i => i.difficulty === 'HARD')?.count || 0;
    const solved = easy + medium + hard;

    // 自动计算真实总题数（和你力扣页面完全一致）
    const totalEasy = easy + (untouched.find(i => i.difficulty === 'EASY')?.count || 0);
    const totalMedium = medium + (untouched.find(i => i.difficulty === 'MEDIUM')?.count || 0);
    const totalHard = hard + (untouched.find(i => i.difficulty === 'HARD')?.count || 0);
    const total = totalEasy + totalMedium + totalHard;

    generateStatsCard({
      name: LEETCODE_USERNAME,
      solved,
      total: total,
      easy,
      medium,
      hard,
      rank: ranking,
      totalEasy,      // 只加这一行
      totalMedium,    // 只加这一行
      totalHard       // 只加这一行
    }, 'leetcode', 'source/shuati/leetcode-stats.svg');

    appendTodayData({ solved, easy, medium, hard });
    
    console.log('✅ LeetCode 卡片生成成功！');
  } catch (err) {
    console.error('❌ 拉取失败:', err.response?.data || err.message);
  }
}

fetchLeetCodeData();