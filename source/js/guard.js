(function() {
  // 白名单：允许访问登录页
  if (location.pathname.indexOf("lock.html") !== -1) {
    return;
  }

  // 如果没登录，强制跳转到登录页
  if (!localStorage.getItem("blogAuth")) {
    location.replace("/hexo-blog/lock.html");
  }
})();