import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/axios'

interface Service {
  id: number
  name: string
  description: string | null
  duration_minutes: number
  price: string
  is_active: boolean
}

interface ServiceForm {
  name: string
  description?: string
  duration_minutes: number
  price: number
  is_active: boolean
}

export const useServicesStore = defineStore('services', () => {
  const services = ref<Service[]>([])
  const loading = ref(false)
  const error = ref('')

  async function fetchServices() {
    loading.value = true
    error.value = ''
    try {
      const response = await api.get('/services')
      services.value = response.data
    } catch (e) {
      error.value = 'Erreur lors du chargement des services.'
    } finally {
      loading.value = false
    }
  }

  async function createService(data: ServiceForm) {
    const response = await api.post('/services', data)
    services.value.unshift(response.data)
  }

  async function updateService(id: number, data: ServiceForm) {
    const response = await api.put(`/services/${id}`, data)
    const index = services.value.findIndex((s) => s.id === id)
    if (index !== -1) {
      services.value[index] = response.data
    }
  }

  async function deleteService(id: number) {
    await api.delete(`/services/${id}`)
    services.value = services.value.filter((s) => s.id !== id)
  }

  return { services, loading, error, fetchServices, createService, updateService, deleteService }
})