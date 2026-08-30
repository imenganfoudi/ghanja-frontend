import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/axios'

interface Staff {
  id: number
  name: string
  email: string | null
  phone: string | null
  is_active: boolean
}

interface StaffForm {
  name: string
  email?: string
  phone?: string
  is_active: boolean
}

export const useStaffStore = defineStore('staff', () => {
  const staff = ref<Staff[]>([])
  const loading = ref(false)
  const error = ref('')

  async function fetchStaff() {
    loading.value = true
    error.value = ''
    try {
      const response = await api.get('/staff')
      staff.value = response.data
    } catch (e) {
      error.value = 'Erreur lors du chargement des employés.'
    } finally {
      loading.value = false
    }
  }

  async function createStaff(data: StaffForm) {
    const response = await api.post('/staff', data)
    staff.value.unshift(response.data)
  }

  async function updateStaff(id: number, data: StaffForm) {
    const response = await api.put(`/staff/${id}`, data)
    const index = staff.value.findIndex((s) => s.id === id)
    if (index !== -1) {
      staff.value[index] = response.data
    }
  }

  async function deleteStaff(id: number) {
    await api.delete(`/staff/${id}`)
    staff.value = staff.value.filter((s) => s.id !== id)
  }

  return { staff, loading, error, fetchStaff, createStaff, updateStaff, deleteStaff }
})