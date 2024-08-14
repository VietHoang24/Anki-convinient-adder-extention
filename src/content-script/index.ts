import './index.scss'

const src = chrome.runtime.getURL('src/content-script/iframe/index.html')

const iframe = new DOMParser().parseFromString(
  `<iframe class="crx-iframe" src="${src}"></iframe>`,
  'text/html'
).body.firstElementChild

if (iframe) {
  document.body?.append(iframe)
}

self.onerror = function (message, source, lineno, colno, error) {
  console.info(
    `Error: ${message}\nSource: ${source}\nLine: ${lineno}\nColumn: ${colno}\nError object: ${error}`
  )
}

let selectedText = ''

document.addEventListener('mouseup', () => {
  selectedText = window.getSelection().toString()
  console.log('selectedText :>> ', selectedText)
  if (selectedText.length) {
    chrome.runtime.sendMessage(
      { action: 'setText', data: selectedText },
      (response) => {
        // Bạn có thể xử lý phản hồi từ background script tại đây nếu cần
        console.log('Response from background script:', response)
      }
    )
  }
})

console.log('hahhahaa')
