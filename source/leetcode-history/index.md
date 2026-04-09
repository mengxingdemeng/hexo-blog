---
title: LeetCode刷题历史
date: 2026-04-09 23:50:00
type: page
layout: page
---

# 📊 LeetCode 刷题历史统计

<div id="main-chart" style="width:100%;height:400px;margin:20px 0;"></div>

| 日期 | 总题数 | 简单 | 中等 | 困难 |
| ---- | ------ | ---- | ---- | ---- |
<tbody id="history-table"></tbody>

<script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
<script>
// ✅ 正确路径：适配你的子目录 /hexo-blog/
fetch("/hexo-blog/leetcode-history/leetcode-history.json")
  .then(res => {
    if (!res.ok) throw new Error(`HTTP错误: ${res.status}`);
    return res.json();
  })
  .then(data => {
    console.log("✅ 成功加载数据:", data); // F12控制台可验证

    if (!data || data.length === 0) {
      document.getElementById("history-table").innerHTML = "<tr><td colspan='5'>暂无刷题历史数据</td></tr>";
      return;
    }

    // 按日期正序排列（旧→新，图表更直观）
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

    // 1. 渲染表格（严格对应JSON字段：data.hard / data.easy / data.medium / data.solved）
    let tableHtml = "";
    sortedData.forEach(item => {
      tableHtml += `
      <tr>
        <td>${item.date}</td>
        <td>${item.solved}</td>
        <td>${item.easy}</td>
        <td>${item.medium}</td>
        <td>${item.hard}</td>
      </tr>`;
    });
    document.getElementById("history-table").innerHTML = tableHtml;

    // 2. 渲染折线图
    const chart = echarts.init(document.getElementById("main-chart"));
    chart.setOption({
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: sortedData.map(i => i.date)
      },
      yAxis: { type: "value" },
      series: [{
        name: "总AC数",
        type: "line",
        data: sortedData.map(i => i.solved),
        smooth: true,
        lineStyle: { width: 3 },
        itemStyle: { color: "#FFA116" } // 对应你SVG的主题色
      }]
    });

    // 窗口大小变化时自动调整图表
    window.addEventListener("resize", () => chart.resize());
  })
  .catch(err => {
    console.error("❌ 数据加载失败:", err);
    document.getElementById("history-table").innerHTML = `<tr><td colspan='5'>数据加载失败: ${err.message}</td></tr>`;
  });
</script>