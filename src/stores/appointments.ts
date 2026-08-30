import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api/axios'

interface Service {
  id: number
  name: string
  duration_minutes: number
  price: string
}

interface Staff {
  id: number
  name: string
  email: string
}

interface Appointment {
  id: number
  customer_name: string
  customer_email: string
  customer_phone: string
  appointment_date: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes: string | null
  service: Service
  staff: Staff | null
}

interface NewAppointment {
  service_id: number
  staff_id?: number | null
  customer_name: string
  customer_email: string
  customer_phone: string
  appointment_date: string
  start_time: string
  notes?: string
}

export const useAppointmentsStore = defineStore('appointments', () => {
  const appointments = ref<Appointment[]>([])
  const services = ref<Service[]>([])
  const staff = ref<Staff[]>([])
  const loading = ref(false)
  const error = ref('')

  async function fetchAppointments() {
    loading.value = true
    error.value = ''
    try {
      const response = await api.get('/appointments')
      appointments.value = response.data.data
    } catch (e) {
      error.value = 'Erreur lors du chargement des rendez-vous.'
    } finally {
      loading.value = false
    }
  }

  async function fetchBookingData() {
    const response = await api.get('/booking-data')
    services.value = response.data.services
    staff.value = response.data.staff
  }

  async function fetchAvailableSlots(serviceId: number, date: string, staffId?: number) {
    const params: Record<string, string | number> = { service_id: serviceId, date }
    if (staffId) params.staff_id = staffId
    const response = await api.get('/available-slots', { params })
    return response.data.slots as string[]
  }

  async function createAppointment(data: NewAppointment) {
    const response = await api.post('/appointments', data)
    appointments.value.unshift(response.data.appointment)
  }

  async function updateStatus(id: number, status: string) {
    const response = await api.put(`/appointments/${id}`, { status })
    const index = appointments.value.findIndex((a) => a.id === id)
    if (index !== -1) {
      appointments.value[index] = response.data
    }
  }

  async function deleteAppointment(id: number) {
    await api.delete(`/appointments/${id}`)
    appointments.value = appointments.value.filter((a) => a.id !== id)
  }

  return {
    appointments,
    services,
    staff,
    loading,
    error,
    fetchAppointments,
    fetchBookingData,
    fetchAvailableSlots,
    createAppointment,
    updateStatus,
    deleteAppointment,
  }
})