const axios = require('axios');
const { generateStatsCard } = require('./svg-template');

// 替换为你的 LeetCode 用户名（主页URL中的slug，如 https://leetcode.cn/u/xxx/ 中的 xxx）
const LEETCODE_USERNAME = 'confident-varahamihiracj1';

async function fetchLeetCodeData() {
  try {
    // LeetCode中国站 最新稳定公开API（官方文档可查，无封号风险）
    const query = `
      query userQuestionProgress($userSlug: String!) {
        userProfileUserQuestionProgress(userSlug: $userSlug) {
          numAcceptedQuestions {
            difficulty
            count
          }
          numFailedQuestions {
            difficulty
            count
          }
          numUntouchedQuestions {
            difficulty
            count
          }
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
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
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

    const progress = data.data.userProfileUserQuestionProgress;
    const accepted = progress.numAcceptedQuestions;

    // 提取各难度数据
    const easy = accepted.find(i => i.difficulty === 'EASY')?.count || 0;
    const medium = accepted.find(i => i.difficulty === 'MEDIUM')?.count || 0;
    const hard = accepted.find(i => i.difficulty === 'HARD')?.count || 0;
    const solved = easy + medium + hard;

    // LeetCode中国站当前总题数（可动态获取，这里用固定值更稳定）
    const total = 3500;

    generateStatsCard({
      name: LEETCODE_USERNAME,
      solved,
      total,
      easy,
      medium,
      hard
    }, 'leetcode', 'source/shuati/leetcode-stats.svg');

    console.log('✅ LeetCode 统计卡片生成成功');
  } catch (err) {
    console.error('❌ LeetCode 拉取失败', err.response?.data || err.message);
  }
}

fetchLeetCodeData();