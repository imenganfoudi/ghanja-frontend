<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  authStore.fetchUser()
})

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold text-purple-600">Dashboard</h1>
        <button @click="handleLogout" class="text-red-500 hover:underline">
          Déconnexion
        </button>
      </div>
      <p v-if="authStore.user" class="text-gray-700 mb-4">
        Bienvenue, {{ authStore.user.name }} ({{ authStore.user.email }})
      </p>

      <router-link
        to="/appointments"
        class="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Voir les rendez-vous
      </router-link>
    </div>
  </div>
</template>