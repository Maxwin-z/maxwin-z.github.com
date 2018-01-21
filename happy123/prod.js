;['common.js', 'index.js'].forEach(src => {
  const script = document.createElement('script')
  script.src = `https://mysql.byutech.cn/${src}`
  console.log(`append ${src}`)
  document.querySelector('head').appendChild(script)
})
;['index.css'].forEach(css => {
  const link = document.createElement('link')
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('href', `https://mysql.byutech.cn/${css}`)
  document.querySelector('head').appendChild(link)
})
console.log('in dev.js')
