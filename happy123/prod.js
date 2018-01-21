const prev = 'https://maxwin-z.github.io/happy123/'
;['common.js', 'index.js?1'].forEach(src => {
  const script = document.createElement('script')
  script.src = `${prev}${src}`
  console.log(`append ${src}`)
  document.querySelector('head').appendChild(script)
})
;['index.css'].forEach(css => {
  const link = document.createElement('link')
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('href', `${prev}${css}`)
  document.querySelector('head').appendChild(link)
})
console.log('in prod.js')
