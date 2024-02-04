!function() {
  // 获取当前 script 标签
  const script = document.currentScript
  // 获取属性
  const mode = script.getAttribute("data-busuanzi-mode")
  const url = script.getAttribute("data-base-url")
  // 声明结果对象
  const result = {}
  // 判断 id 是否为不蒜子模式，设置容器 id
  if (mode) {
    result.page_pv_id = 'busuanzi_value_page_pv'
    result.page_uv_id = 'busuanzi_value_page_uv'
    result.site_pv_id = 'busuanzi_value_site_pv'
    result.site_uv_id = 'busuanzi_value_site_uv'
  } else {
    result.page_pv_id = 'page_pv'
    result.page_uv_id = 'page_uv'
    result.site_pv_id = 'site_pv'
    result.site_uv_id = 'site_uv'
  }
  // 定义获取路径函数
  function getLocation(href) {
    const result = document.createElement('a')
    result.href = href
    return result
  }
  // 初始化
  result.init = async function() {
    // 获取当前页面路径
    const location = getLocation(window.location.href)
    // 获取页面元素
    const page_pv = document.querySelector(`#${result.page_pv_id}`)
    const page_uv = document.querySelector(`#${result.page_uv_id}`)
    const site_pv = document.querySelector(`#${result.site_pv_id}`)
    const site_uv = document.querySelector(`#${result.site_uv_id}`)
    // 声明请求参数
    const params = {
      url: location.pathname,
      hostname: location.hostname,
      referrer: document.referrer
    }
    // 判断是否存在 pv 和 uv 元素
    if (page_pv) {
      params.page_pv = true
    }
    if (page_uv) {
      params.page_uv = true
    }
    if (site_pv) {
      params.site_pv = true
    }
    if (site_uv) {
      params.site_uv = true
    }
    // 发送请求
    let apiPath
    await (apiPath = `${url}/api/visit`, params, new Promise((e => {
      fetch(apiPath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
      }).then((e => e.json())).then((function (t) {
        e(t)
      })).catch((e => {
        console.error(e)
      }))
    }))).then((e => {
      if ("OK" != e.ret) return void console.error("flarecount.init error", e.message);
      // 获取返回数据
      const res = e.data
      // 设置页面 pv 和 uv
      if (page_pv) {
        page_pv.innerText = res.page_pv
      }
      if (page_uv) {
        page_uv.innerText = res.page_uv
      }
      if (site_pv) {
        site_pv.innerText = res.site_pv
      }
      if (site_uv) {
        site_uv.innerText = res.site_uv
      }
    })).catch((e => {
      console.log("flarecount.init fetch error", e)
    }))
  }
  // 执行初始化
  if ('undefined' !== typeof window) {
    result.init()
    window.flarecount = result
  }
  // 打印成功信息
  console.info('count success. xiaoyezi.')
}();






