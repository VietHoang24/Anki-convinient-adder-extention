<template lang="">
  <div class="mb-5">
    <label
      for="Make sense"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-left"
    >
      {{ field }}
    </label>
    <textarea
      @paste="handlePaste"
      @input="$emit('update', { field, value: $event.target.value })"
      :value="value"
      :id="field"
      class="h-auto shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
      rows="1"
      contenteditable="true"
    />
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  field: string
  value: string
}>()

onMounted(() => {
  document.getElementById(props.field).addEventListener('input', function () {
    this.style.height = 'auto' // Đặt chiều cao tự động
    this.style.height = this.scrollHeight + 'px' // Cập nhật chiều cao theo chiều cao nội dung
  })
})
</script>
<style lang=""></style>
