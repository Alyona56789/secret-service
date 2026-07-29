<template>
  <div class="container">
    <!-- Состояние загрузки -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Расшифровываем секрет...</p>
    </div>

    <div v-else-if="error" class="error-box">
  <div class="icon-error">😕</div>
  <h2>Секрет не найден</h2>
  <p>{{ error }}</p>
  <p class="hint">Возможно, ссылка была скопирована неверно или секрет уже был удалён.</p>
  <router-link to="/" class="btn-home">← Вернуться к созданию секрета</router-link>
</div>

    <!-- Успешная расшифровка -->
    <div v-else-if="secretContent" class="success-box">
      <h2>Ваш секрет:</h2>
      <div class="content-display">{{ secretContent }}</div>
      
      <button @click="copyToClipboard" class="btn-copy">
        {{ copied ? 'Скопировано!' : 'Скопировать' }}
      </button>
      
      <router-link to="/" class="link-home">← Создать новый секрет</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const secretContent = ref('')
const loading = ref(true)
const error = ref('')
const copied = ref(false)

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(secretContent.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch (err) {
    console.error('Не удалось скопировать', err)
  }
}

onMounted(async () => {
  const hash = route.params.hash 
  
  try {
    const res = await fetch(`http://localhost:3000/${hash}`)
    const data = await res.json()

    if (data.content) {
      secretContent.value = data.content
    } else {
      error.value = data.error || 'Секрет не найден или ссылка неверна.'
    }
  } catch (e) {
    error.value = 'Ошибка соединения с сервером.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.container { max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
.loading { color: #666; }
.spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #42b983; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 15px; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.error-box { background: #ffebee; color: #c62828; padding: 30px; border-radius: 8px; border: 1px solid #ef9a9a; }
.success-box { background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #eee; }
.content-display { background: #f5f7fa; padding: 20px; border-radius: 6px; font-size: 18px; color: #333; word-break: break-word; margin-bottom: 20px; text-align: left; white-space: pre-wrap; }
.btn-copy { background: #42b983; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px; transition: 0.2s; }
.btn-copy:hover { background: #3aa876; }
.link-home { display: block; margin-top: 20px; color: #42b983; text-decoration: none; }
.link-home:hover { text-decoration: underline; }
.icon-error { font-size: 48px; margin-bottom: 10px; }
.hint { font-size: 14px; color: #666; margin-top: 10px; }
.btn-home { 
  display: inline-block; 
  margin-top: 20px; 
  padding: 10px 20px; 
  background: #42b983; 
  color: white; 
  text-decoration: none; 
  border-radius: 6px; 
  transition: 0.2s;
}
.btn-home:hover { background: #3aa876; }
</style>