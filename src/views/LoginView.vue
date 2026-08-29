<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const authStore = useAuthStore()
const router = useRouter()

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await authStore.login(email.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = 'Email ou mot de passe incorrect.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <form @submit.prevent="handleLogin" class="bg-white p-8 rounded-lg shadow-md w-96">
      <h1 class="text-2xl font-bold text-purple-600 mb-6">Connexion</h1>

      <div class="mb-4">
        <label class="block text-sm text-gray-600 mb-1">Email</label>
        <input
          v-model="email"
          type="email"
          required
          class="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm text-gray-600 mb-1">Mot de passe</label>
        <input
          v-model="password"
          type="password"
          required
          class="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>

      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-50"
      >
        {{ loading ? 'Connexion...' : 'Se connecter' }}
      </button>
    </form>
  </div>
</template>