document$.subscribe(function() {
    hljs.configure({ cssSelector: 'pre.hljs code, td.code code' });
    hljs.highlightAll();
})
