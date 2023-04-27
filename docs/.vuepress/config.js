module.exports = {
  // 网站的一些基本配置
  // base:配置部署站点的基础路径，后续再介绍
  title: 'urnotlynley的笔记', // 网站的标题
  description: 'urnotlynley的笔记', // 网站的描述，它将会以 <meta> 标签渲染到当前页面的 HTML 中。
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }], // 需要被注入到当前页面的 HTML <head> 中的标签
  ],
  themeConfig: {
    search: false, // 设置是否使用导航栏上的搜索框
    searchMaxSuggestions: 10  // 搜索框显示的搜索结果数量
  },
  themeConfig: {
    nav: [
      // 直接跳转，'/'为不添加路由，跳转至首页，以/结尾的最终对应的都是/index.html,也就是README.md文件编译后的页面
      { text: 'Home', link: '/' },
      // 对应blog/fontend/README.md
      // { text: 'slidev', link: '/blog/slidev/' },
      // { text: 'Vue3', link: '/blog/Vue3/' },
      // 对应/guide/guide.md
      // { text: '导航', link: '/guide/guide' },
    ],
    // 禁用导航栏
    // navbar: false,
    sidebar: [
      {
        title: 'slidev',
        collapsable: false,
        children: ['/blog/slidev/'],
      },
      {
        title: 'Vue',
        collapsable: true,
        children: ['/blog/Vue3/'],
      },
      {
        title: '正则匹配',
        collapsable: true,
        children: ['/blog/RegExp/'],
      },
      {
        title: 'Electron',
        collapsable: true,
        children: ['/blog/Electron/'],
      },
      {
        title: 'Nuxt',
        collapsable: true,
        children: ['/blog/Nuxt/'],
      },
      {
        title: 'react',
        collapsable: true,
        children: ['/blog/react/'],
      },
      {
        title: 'ts',
        collapsable: true,
        children: ['/blog/ts/'],
      },
      {
        title: 'V3使用记录',
        collapsable: true,
        children: ['/blog/v3true/'],
      },
    ],
    sidebarDepth: 1,
  },
}
