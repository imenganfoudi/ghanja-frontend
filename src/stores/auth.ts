import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/axios'

interface User {
  id: number
  name: string
  email: string
  is_admin: number
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  async function login(email: string, password: string) {
    const response = await api.post('/login', { email, password })
    token.value = response.data.token
    user.value = response.data.user
    localStorage.setItem('token', response.data.token)
  }

  async function logout() {
    await api.post('/logout')
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  async function fetchUser() {
    const response = await api.get('/me')
    user.value = response.data
  }

  return { user, token, login, logout, fetchUser }
})