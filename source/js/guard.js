(function() {
  if (location.pathname.includes('/lock.html')) return;
  
  if (!localStorage.blogAuth) {
    location.replace("/hexo-blog/lock.html");
  }
})();