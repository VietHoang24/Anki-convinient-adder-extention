<script setup lang="ts">
let selectedText = ''

document.addEventListener('mouseup', () => {
  selectedText = window.getSelection().toString()
  console.log('selectedText :>> ', selectedText)
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSelectedText') {
    sendResponse({ text: selectedText })
  }
})
</script>

<template>
  <div>
    <h1 class="text-red-800 font-bold text-xl">Content Script Iframe</h1>
    <button class="btn btn-primary">Sample Daisy UI Button</button>
  </div>
</template>

<style scoped></style>
