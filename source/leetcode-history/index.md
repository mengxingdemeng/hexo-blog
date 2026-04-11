---
title: LeetCode刷题历史
date: 2026-04-09 23:50:00
type: page
layout: page
---

# 📊 LeetCode刷题历史统计

## 📋 每日刷题记录表
| 日期 | 总题数 | 简单 | 中等 | 困难 |
| ---- | ------ | ---- | ---- | ---- |
<tbody id="history-table"></tbody>

---

## 📈 总题数趋势图（原版保留）
<div id="original-chart" style="width:100%;height:400px;margin:20px 0;"></div>

---

## 🚀 刷题趋势大盘（豪华增强版）
<div id="advance-chart" style="width:100%;height:500px;margin:30px 0;"></div>

---

## 🔥 今日新增刷题数据（当天完成量）
<div id="today-stats" style="display:flex;gap:20px;margin:30px 0;flex-wrap:wrap;">
  <div style="flex:1;min-width:150px;padding:22px;border-radius:12px;background:#fff9e5;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
    <h3 style="margin:0 0 10px 0;color:#cc7722;">今日新增</h3>
    <p id="today-add-total" style="font-size:30px;font-weight:bold;margin:0;color:#FF8C00;">0</p>
  </div>
  <div style="flex:1;min-width:150px;padding:22px;border-radius:12px;background:#e6fffa;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
    <h3 style="margin:0 0 10px 0;color:#28a745;">简单</h3>
    <p id="today-add-easy" style="font-size:30px;font-weight:bold;margin:0;color:#28a745;">0</p>
  </div>
  <div style="flex:1;min-width:150px;padding:22px;border-radius:12px;background:#f0f7ff;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
    <h3 style="margin:0 0 10px 0;color:#007bff;">中等</h3>
    <p id="today-add-medium" style="font-size:30px;font-weight:bold;margin:0;color:#007bff;">0</p>
  </div>
  <div style="flex:1;min-width:150px;padding:22px;border-radius:12px;background:#fff0f0;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
    <h3 style="margin:0 0 10px 0;color:#dc3545;">困难</h3>
    <p id="today-add-hard" style="font-size:30px;font-weight:bold;margin:0;color:#dc3545;">0</p>
  </div>
</div>

## 📊 累计总刷题数据（LeetCode 总数）
<div id="total-stats" style="display:flex;gap:20px;margin:30px 0;flex-wrap:wrap;">
  <div style="flex:1;min-width:150px;padding:22px;border-radius:12px;background:#f8f9fa;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
    <h3 style="margin:0 0 10px 0;color:#444;">累计总题数</h3>
    <p id="total-all" style="font-size:30px;font-weight:bold;margin:0;color:#222;">0</p>
  </div>
  <div style="flex:1;min-width:150px;padding:22px;border-radius:12px;background:#f8f9fa;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
    <h3 style="margin:0 0 10px 0;color:#444;">累计简单</h3>
    <p id="total-easy" style="font-size:30px;font-weight:bold;margin:0;color:#28a745;">0</p>
  </div>
  <div style="flex:1;min-width:150px;padding:22px;border-radius:12px;background:#f8f9fa;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
    <h3 style="margin:0 0 10px 0;color:#444;">累计中等</h3>
    <p id="total-medium" style="font-size:30px;font-weight:bold;margin:0;color:#007bff;">0</p>
  </div>
  <div style="flex:1;min-width:150px;padding:22px;border-radius:12px;background:#f8f9fa;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
    <h3 style="margin:0 0 10px 0;color:#444;">累计困难</h3>
    <p id="total-hard" style="font-size:30px;font-weight:bold;margin:0;color:#dc3545;">0</p>
  </div>
</div>

---

# 📜 每日刷题明细（10条/页 分页展示）
<div id="daily-list" style="margin:30px 0;"></div>
<div id="pagination" style="text-align:center;margin:25px 0;"></div>

<script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
<script>
// ==============================================
// 【核心配置】严格适配Hexo环境，路径100%正确
// ==============================================
const CONFIG = {
  // JSON数据路径：适配Hexo子目录/hexo-blog/，本地+线上通用
  jsonUrl: "/hexo-blog/leetcode-history/leetcode-history.json",
  // 图表主题色：与博客Butterfly主题适配
  theme: {
    total: "#FFA116",
    easy: "#28A745",
    medium: "#007BFF",
    hard: "#DC3545",
    bg: "#f8f9fa",
    text: "#333"
  },
  // 图表渲染延迟：确保DOM完全加载，避免Hexo渲染顺序问题
  renderDelay: 200,
  pageSize: 10
};

// ==============================================
// 全局数据
// ==============================================
let allData = [];
let allDataReverse = [];
let currentPage = 1;

// ==============================================
// 【工具函数】通用方法，提升代码可维护性
// ==============================================
/**
 * 等待DOM完全加载后执行回调
 * @param {Function} callback 回调函数
 */
function waitForDOMReady(callback) {
  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(callback, CONFIG.renderDelay);
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(callback, CONFIG.renderDelay);
    });
  }
}

/**
 * 格式化日期为YYYY-MM-DD
 * @param {Date} date 日期对象
 * @returns {string} 格式化后的日期
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * 按日期正序排序数据（旧→新）
 * @param {Array} data 原始数据
 * @returns {Array} 排序后的数据
 */
function sortDataByDate(data) {
  return [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
}

// ==============================================
// 【数据加载】核心逻辑，处理JSON请求与错误
// ==============================================
/**
 * 加载LeetCode历史数据
 * @returns {Promise<Array>} 排序后的数据
 */
async function loadLeetCodeData() {
  try {
    console.log("🔄 开始加载LeetCode历史数据...");
    const res = await fetch(CONFIG.jsonUrl);
    
    if (!res.ok) {
      throw new Error(`HTTP请求失败，状态码：${res.status}，请检查路径是否正确`);
    }

    const data = await res.json();
    console.log("✅ 数据加载成功，共", data.length, "条记录");

    if (!data || data.length === 0) {
      console.warn("⚠️ 数据为空，显示默认提示");
      return [];
    }

    const sortedData = sortDataByDate(data);
    allData = sortedData;
    allDataReverse = [...sortedData].reverse();
    return sortedData;
  } catch (err) {
    console.error("❌ 数据加载失败：", err);
    // 渲染错误提示到页面
    document.getElementById("history-table").innerHTML = `<tr><td colspan='5'>数据加载失败：${err.message}</td></tr>`;
    return [];
  }
}

// ==============================================
// 【原版功能1：表格渲染】100%保留原有逻辑
// ==============================================
/**
 * 渲染每日刷题记录表
 * @param {Array} data 排序后的数据
 */
function renderHistoryTable(data) {
  const tableBody = document.getElementById("history-table");
  if (!tableBody) {
    console.error("❌ 找不到表格元素#history-table");
    return;
  }

  if (!data || data.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='5'>暂无刷题历史数据</td></tr>";
    return;
  }

  let tableHtml = "";
  data.forEach(item => {
    tableHtml += `
    <tr>
      <td>${item.date}</td>
      <td>${item.solved}</td>
      <td>${item.easy}</td>
      <td>${item.medium}</td>
      <td>${item.hard}</td>
    </tr>`;
  });

  tableBody.innerHTML = tableHtml;
  console.log("✅ 表格渲染完成");
}

// ==============================================
// 【原版功能2：总题数折线图】100%保留原有样式
// ==============================================
/**
 * 渲染原版总题数趋势图
 * @param {Array} data 排序后的数据
 */
function renderOriginalChart(data) {
  const chartDom = document.getElementById("original-chart");
  if (!chartDom) {
    console.error("❌ 找不到原版图表容器#original-chart");
    return;
  }

  if (!data || data.length === 0) {
    chartDom.innerHTML = "<p style='text-align:center;color:#999;line-height:400px;'>暂无数据，图表无法渲染</p>";
    return;
  }

  const chart = echarts.init(chartDom);
  const dates = data.map(item => item.date);
  const solvedData = data.map(item => item.solved);

  chart.setOption({
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255,255,255,0.9)",
      borderColor: "#eee",
      textStyle: { color: CONFIG.theme.text }
    },
    xAxis: {
      type: "category",
      data: dates,
      axisLabel: { color: CONFIG.theme.text },
      axisLine: { lineStyle: { color: "#ccc" } }
    },
    yAxis: {
      type: "value",
      axisLabel: { color: CONFIG.theme.text },
      axisLine: { lineStyle: { color: "#ccc" } },
      splitLine: { lineStyle: { color: "#f0f0f0" } }
    },
    series: [{
      name: "总AC数",
      type: "line",
      data: solvedData,
      smooth: true,
      lineStyle: { width: 3, color: CONFIG.theme.total },
      itemStyle: { color: CONFIG.theme.total },
      symbol: "circle",
      symbolSize: 8,
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: `${CONFIG.theme.total}80`
          }, {
            offset: 1,
            color: `${CONFIG.theme.total}00`
          }]
        }
      }
    }]
  });

  // 窗口大小变化自动适配
  window.addEventListener("resize", () => chart.resize());
  console.log("✅ 原版总题数图表渲染完成");
}

// ==============================================
// 【豪华功能1：多维度趋势图】4条折线完整增强
// ==============================================
/**
 * 渲染豪华版多维度趋势图
 * @param {Array} data 排序后的数据
 */
function renderAdvanceChart(data) {
  const chartDom = document.getElementById("advance-chart");
  if (!chartDom) {
    console.error("❌ 找不到豪华图表容器#advance-chart");
    return;
  }

  if (!data || data.length === 0) {
    chartDom.innerHTML = "<p style='text-align:center;color:#999;line-height:500px;'>暂无数据，图表无法渲染</p>";
    return;
  }

  const chart = echarts.init(chartDom);
  const dates = data.map(item => item.date);
  const solvedData = data.map(item => item.solved);
  const easyData = data.map(item => item.easy);
  const mediumData = data.map(item => item.medium);
  const hardData = data.map(item => item.hard);

  chart.setOption({
    title: {
      text: '📚 LeetCode 刷题多维度趋势统计',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: CONFIG.theme.text
      },
      top: 10
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,0,0,0.8)',
      borderColor: 'transparent',
      textStyle: { color: '#fff' },
      axisPointer: {
        type: 'cross',
        lineStyle: { color: '#fff', type: 'dashed' }
      }
    },
    legend: {
      data: ['总题数', '简单', '中等', '困难'],
      top: 50,
      left: 'center',
      textStyle: { color: CONFIG.theme.text },
      icon: 'roundRect',
      itemWidth: 12,
      itemHeight: 12
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      top: '18%',
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: dates,
      axisLabel: {
        color: CONFIG.theme.text,
        rotate: 30,
        interval: 'auto'
      },
      axisLine: { lineStyle: { color: "#ccc" } },
      axisTick: { lineStyle: { color: "#ccc" } }
    },
    yAxis: {
      type: "value",
      axisLabel: { color: CONFIG.theme.text },
      axisLine: { lineStyle: { color: "#ccc" } },
      axisTick: { lineStyle: { color: "#ccc" } },
      splitLine: { lineStyle: { color: "#f0f0f0" } },
      min: 0
    },
    series: [
      {
        name: '总题数',
        type: 'line',
        data: solvedData,
        smooth: true,
        symbolSize: 8,
        lineStyle: { width: 3, color: CONFIG.theme.total },
        itemStyle: { color: CONFIG.theme.total },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: `${CONFIG.theme.total}60`
            }, {
              offset: 1,
              color: `${CONFIG.theme.total}00`
            }]
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: `${CONFIG.theme.total}80`
          }
        }
      },
      {
        name: '简单',
        type: 'line',
        data: easyData,
        smooth: true,
        lineStyle: { width: 2, color: CONFIG.theme.easy },
        itemStyle: { color: CONFIG.theme.easy },
        symbol: 'circle',
        symbolSize: 6,
        emphasis: {
          itemStyle: {
            shadowBlur: 8,
            shadowColor: `${CONFIG.theme.easy}80`
          }
        }
      },
      {
        name: '中等',
        type: 'line',
        data: mediumData,
        smooth: true,
        lineStyle: { width: 2, color: CONFIG.theme.medium },
        itemStyle: { color: CONFIG.theme.medium },
        symbol: 'circle',
        symbolSize: 6,
        emphasis: {
          itemStyle: {
            shadowBlur: 8,
            shadowColor: `${CONFIG.theme.medium}80`
          }
        }
      },
      {
        name: '困难',
        type: 'line',
        data: hardData,
        smooth: true,
        lineStyle: { width: 2, color: CONFIG.theme.hard },
        itemStyle: { color: CONFIG.theme.hard },
        symbol: 'circle',
        symbolSize: 6,
        emphasis: {
          itemStyle: {
            shadowBlur: 8,
            shadowColor: `${CONFIG.theme.hard}80`
          }
        }
      }
    ]
  });

  window.addEventListener("resize", () => chart.resize());
  console.log("✅ 豪华版多维度图表渲染完成");
}

// ==============================================
// 【原版今日卡片】100%保留
// ==============================================
function renderTodayCard(data) {
  if (!data || data.length === 0) {
    console.warn("⚠️ 无数据，今日卡片显示默认值");
    return;
  }

  // 获取最新一条数据（最后一条，已按日期正序排序）
  const latestData = data[data.length - 1];
  const today = formatDate(new Date());

  // 更新卡片数据
  const todayTotal = document.getElementById("today-total");
  const todayEasy = document.getElementById("today-easy");
  const todayMedium = document.getElementById("today-medium");
  const todayHard = document.getElementById("today-hard");
  
  if (todayTotal) todayTotal.textContent = latestData.solved;
  if (todayEasy) todayEasy.textContent = latestData.easy;
  if (todayMedium) todayMedium.textContent = latestData.medium;
  if (todayHard) todayHard.textContent = latestData.hard;

  console.log("✅ 今日数据卡片渲染完成，最新日期：", latestData.date);
}

// ==============================================
// 【新增】今日新增做题数（严格按自然日匹配，修复断更错误）
// ==============================================
function renderTodayAdd() {
  if (!allData || allData.length < 1) return;
  
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const todayStr = today.toISOString().split("T")[0];
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const todayItem = allData.find(i => i.date === todayStr);
  const yesterdayItem = allData.find(i => i.date === yesterdayStr);

  const todayData = todayItem || { solved: 0, easy: 0, medium: 0, hard: 0 };
  const yesterdayData = yesterdayItem || { solved: 0, easy: 0, medium: 0, hard: 0 };

  const addTotal = Math.max(0, todayData.solved - yesterdayData.solved);
  const addEasy = Math.max(0, todayData.easy - yesterdayData.easy);
  const addMedium = Math.max(0, todayData.medium - yesterdayData.medium);
  const addHard = Math.max(0, todayData.hard - yesterdayData.hard);

  document.getElementById("today-add-total").innerText = addTotal;
  document.getElementById("today-add-easy").innerText = addEasy;
  document.getElementById("today-add-medium").innerText = addMedium;
  document.getElementById("today-add-hard").innerText = addHard;
}

// ==============================================
// 【新增】累计总数卡片
// ==============================================
function renderTotalSummary() {
  if (!allData || allData.length === 0) return;
  const last = allData[allData.length - 1];

  const t1 = document.getElementById("total-all");
  const t2 = document.getElementById("total-easy");
  const t3 = document.getElementById("total-medium");
  const t4 = document.getElementById("total-hard");

  if (t1) t1.innerText = last.solved;
  if (t2) t2.innerText = last.easy;
  if (t3) t3.innerText = last.medium;
  if (t4) t4.innerText = last.hard;
}

// ==============================================
// 【新增】每日刷题明细列表
// ==============================================
function renderDailyList() {
  const dom = document.getElementById("daily-list");
  if (!dom || !allDataReverse || allDataReverse.length === 0) {
    if (dom) dom.innerHTML = "<div style='text-align:center;padding:30px;'>暂无每日明细</div>";
    return;
  }

  const start = (currentPage - 1) * CONFIG.pageSize;
  const end = start + CONFIG.pageSize;
  const pageData = allDataReverse.slice(start, end);

  let html = '<div style="display:flex;flex-direction:column;gap:14px;">';
  pageData.forEach(item => {
    html += `
    <div style="padding:18px;border-radius:12px;background:#fafafa;border:1px solid #eee;">
      <div style="font-weight:bold;font-size:17px;">📅 ${item.date}</div>
      <div style="margin-top:8px;display:flex;gap:16px;">
        <span>总：${item.solved}</span>
        <span style="color:${CONFIG.theme.easy}">简单：${item.easy}</span>
        <span style="color:${CONFIG.theme.medium}">中等：${item.medium}</span>
        <span style="color:${CONFIG.theme.hard}">困难：${item.hard}</span>
      </div>
    </div>`;
  });
  html += "</div>";
  dom.innerHTML = html;
}

// ==============================================
// 【新增】分页按钮
// ==============================================
function renderPagination() {
  const dom = document.getElementById("pagination");
  if (!dom || !allDataReverse || allDataReverse.length === 0) {
    if (dom) dom.innerHTML = "";
    return;
  }

  const totalPage = Math.ceil(allDataReverse.length / CONFIG.pageSize);
  let html = "";
  for (let i = 1; i <= totalPage; i++) {
    html += `<button onclick="goPage(${i})"
      style="width:44px;height:40px;margin:0 8px;border-radius:8px;border:none;cursor:pointer;
      ${currentPage === i ? 'background:#FFA116;color:white' : 'background:#f1f1f1'}">
      ${i}
    </button>`;
  }
  dom.innerHTML = html;
}

function goPage(page) {
  currentPage = page;
  renderDailyList();
  renderPagination();
  window.scrollTo({
    top: document.getElementById("daily-list").offsetTop - 100,
    behavior: "smooth"
  });
}

// ==============================================
// 【主入口】页面加载完成后执行所有渲染逻辑
// ==============================================
waitForDOMReady(async () => {
  console.log("🚀 页面DOM加载完成，开始执行渲染...");
  
  // 1. 加载数据
  const data = await loadLeetCodeData();
  if (!data || data.length === 0) {
    console.warn("⚠️ 无有效数据，终止后续渲染");
    return;
  }

  // 2. 渲染原版所有功能
  renderHistoryTable(data);
  renderOriginalChart(data);
  renderAdvanceChart(data);
  renderTodayCard(data);
  
  // 3. 渲染新增功能
  renderTodayAdd();
  renderTotalSummary();
  renderDailyList();
  renderPagination();

  console.log("🎉 所有模块渲染完成，页面正常运行！");
});

// ==============================================
// 【Hexo环境适配】监听Hexo热重载事件，重新渲染图表
// ==============================================
if (typeof window !== "undefined" && window.location.hostname === "localhost") {
  // 本地开发环境：监听热重载，自动重新渲染
  window.addEventListener("message", (event) => {
    if (event.data && event.data.type === "hexo.reload") {
      console.log("🔄 监听到Hexo热重载，重新渲染页面...");
      waitForDOMReady(async () => {
        const data = await loadLeetCodeData();
        renderHistoryTable(data);
        renderOriginalChart(data);
        renderAdvanceChart(data);
        renderTodayCard(data);
        renderTodayAdd();
        renderTotalSummary();
        renderDailyList();
        renderPagination();
      });
    }
  });
  console.log("✅ 已适配Hexo本地热重载");
}
</script>