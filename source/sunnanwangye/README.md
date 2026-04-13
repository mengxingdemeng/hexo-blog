# 个人主页（深色风格仿照示例）

这是一个纯静态个人主页示例：`index.html` + `styles.css` + `script.js`。不依赖框架，直接打开即可预览。

## 预览方式

1. 直接双击 `index.html` 用浏览器打开。
2. 或者在该目录启动一个本地静态服务（推荐，便于后续扩展资源）：
   - 若你有 Python：
     - `python -m http.server 5500`
     - 浏览器访问：`http://localhost:5500/`

## 新增：华为云风格页面

- 入口文件：`huawei.html`（配套 `huawei.css`、`huawei.js`）
- 布局包含：顶部工具条、主导航、横幅轮播、产品Tab、解决方案区块、开发者/活动分区、多列底部
- 参考布局来源：华为云官网（`https://www.huaweicloud.com/?utm_source=zh-cn&utm_medium=organic`），本项目为原创实现与学习用途

## 你可以快速改的地方

- `index.html` 里的个人信息（姓名、头衔、简介、邮箱等）
- `styles.css` 里的颜色变量（`--accent / --bg*`）
- `script.js` 里的星空动效开关（`prefers-reduced-motion`）和滚动行为
- 联系表单目前是前端模拟（无后端），提交处可接入你自己的接口

