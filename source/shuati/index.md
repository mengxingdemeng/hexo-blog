name: 更新LeetCode数据
on:
  workflow_dispatch:
  schedule:
    - cron: "0 0 * * *" # 每天UTC 0点，对应北京时间8点自动更新

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: write # 核心：给Actions写入仓库权限
    steps:
      - name: 检出代码
        uses: actions/checkout@v4
        with:
          persist-credentials: false
          fetch-depth: 0

      - name: 生成LeetCode统计卡片（使用官方维护的Action，彻底避坑）
        uses: 2754LM/leetcode-card@master
        with:
          username: "confident-varahamihiracj1" # 你的LeetCode用户名
          cn: "true" # 国内站点
          theme: "light" # 主题
          output: "source/images/leetcode.svg" # 输出路径，和你的页面完全匹配

      - name: 提交并推送
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"
          git add source/images/leetcode.svg
          git commit -m "Auto Update LeetCode Stats" || echo "No changes to commit"
          git push origin master