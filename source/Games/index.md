# 🎮 我的小游戏

<div class="game-grid">
  <a href="/hexo-blog/Games/2048.html" target="_blank" class="game-card">
    <div class="title">2048游戏</div>
    <div class="desc">经典数字合成</div>
  </a>
  <a href="/hexo-blog/Games/tetris.html" target="_blank" class="game-card">
    <div class="title">俄罗斯方块</div>
    <div class="desc">复古经典消除</div>
  </a>
  <a href="/hexo-blog/Games/snake.html" target="_blank" class="game-card">
    <div class="title">贪吃蛇</div>
    <div class="desc">休闲走位闯关</div>
  </a>
</div>

<style>
.game-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin: 20px 0;
}
.game-card {
  flex: 1;
  min-width: 180px;
  padding: 24px;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: var(--shadow);
  text-align: center;
  text-decoration: none !important;
  color: var(--text-color) !important;
  transition: transform 0.3s, box-shadow 0.3s;
}
.game-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}
.game-card .title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 6px;
}
.game-card .desc {
  font-size: 14px;
  opacity: 0.7;
}
</style>