<template>
  <div class="container">
    <h2>Создать секрет</h2>
    <textarea 
      v-model="content" 
      placeholder="Введите текст секрета..." 
      rows="5"
    ></textarea>
    
    <button 
  @click="createSecret" 
  :disabled="loading || !content.trim()"
>
  {{ loading ? 'Сохраняю...' : 'Сгенерировать ссылку' }}
</button>

    <div v-if="link" class="success">
      <p>Секрет сохранён! Ссылка:</p>
      <a :href="link" target="_blank">{{ link }}</a>
    </div>
    
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const content = ref('')
const link = ref('')
const error = ref('')
const loading = ref(false)

async function createSecret() {

  if (!content.value.trim()) {
    error.value = 'Пожалуйста, введите текст секрета.'
    return
  }
  
  loading.value = true
  error.value = ''
  link.value = ''

  try {
    const res = await fetch('http://localhost:3000/api/secrets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: content.value })
    })
    
    const data = await res.json()
    
    if (data.link) {
      link.value = data.link
      content.value = '' // очищаем поле
    } else {
      error.value = data.error || 'Ошибка создания'
    }
  } catch (e) {
    error.value = 'Ошибка соединения с сервером. Проверьте, запущен ли backend.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.container { max-width: 500px; margin: 50px auto; text-align: center; padding: 20px; }
textarea { width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 6px; font-size: 16px; resize: vertical; }
button { padding: 12px 24px; background: #42b983; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; transition: background 0.2s; }
button:hover:not(:disabled) { background: #3aa876; }
button:disabled { background: #ccc; cursor: not-allowed; }
.success { margin-top: 20px; padding: 15px; background: #e8f5e9; border-radius: 6px; border: 1px solid #c8e6c9; }
.success a { color: #2e7d32; font-weight: bold; word-break: break-all; }
.error { margin-top: 15px; color: #d32f2f; background: #ffebee; padding: 10px; border-radius: 6px; }
</style>