<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppointmentsStore } from '../stores/appointments'

const store = useAppointmentsStore()
const router = useRouter()

const serviceId = ref<number | null>(null)
const staffId = ref<number | null>(null)
const customerName = ref('')
const customerEmail = ref('')
const customerPhone = ref('')
const date = ref('')
const selectedSlot = ref('')
const notes = ref('')

const availableSlots = ref<string[]>([])
const loadingSlots = ref(false)
const submitting = ref(false)
const error = ref('')

onMounted(() => {
  store.fetchBookingData()
})

watch([serviceId, date, staffId], async () => {
  if (serviceId.value && date.value) {
    loadingSlots.value = true
    selectedSlot.value = ''
    try {
      availableSlots.value = await store.fetchAvailableSlots(
        serviceId.value,
        date.value,
        staffId.value ?? undefined
      )
    } finally {
      loadingSlots.value = false
    }
  }
})

async function handleSubmit() {
  if (!serviceId.value || !selectedSlot.value) {
    error.value = 'Veuillez sélectionner un service et un créneau.'
    return
  }

  error.value = ''
  submitting.value = true

  try {
    await store.createAppointment({
      service_id: serviceId.value,
      staff_id: staffId.value,
      customer_name: customerName.value,
      customer_email: customerEmail.value,
      customer_phone: customerPhone.value,
      appointment_date: date.value,
      start_time: selectedSlot.value,
      notes: notes.value,
    })
    router.push('/appointments')
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Erreur lors de la création du rendez-vous.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 class="text-2xl font-bold text-purple-600 mb-6">Nouveau rendez-vous</h1>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm text-gray-600 mb-1">Service</label>
          <select v-model="serviceId" required class="w-full border border-gray-300 rounded px-3 py-2">
            <option :value="null" disabled>Choisir un service</option>
            <option v-for="s in store.services" :key="s.id" :value="s.id">
              {{ s.name }} — {{ s.duration_minutes }} min — {{ s.price }} €
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">Employé (optionnel)</label>
          <select v-model="staffId" class="w-full border border-gray-300 rounded px-3 py-2">
            <option :value="null">Peu importe</option>
            <option v-for="st in store.staff" :key="st.id" :value="st.id">{{ st.name }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">Date</label>
          <input v-model="date" type="date" required class="w-full border border-gray-300 rounded px-3 py-2" />
        </div>

        <div v-if="serviceId && date">
          <label class="block text-sm text-gray-600 mb-1">Créneau</label>
          <div v-if="loadingSlots" class="text-sm text-gray-500">Chargement des créneaux...</div>
          <div v-else-if="availableSlots.length === 0" class="text-sm text-red-500">
            Aucun créneau disponible pour cette date.
          </div>
          <select v-else v-model="selectedSlot" required class="w-full border border-gray-300 rounded px-3 py-2">
            <option value="" disabled>Choisir un créneau</option>
            <option v-for="slot in availableSlots" :key="slot" :value="slot">{{ slot }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">Nom du client</label>
          <input v-model="customerName" type="text" required class="w-full border border-gray-300 rounded px-3 py-2" />
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">Email</label>
          <input v-model="customerEmail" type="email" required class="w-full border border-gray-300 rounded px-3 py-2" />
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">Téléphone</label>
          <input v-model="customerPhone" type="text" required class="w-full border border-gray-300 rounded px-3 py-2" />
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">Notes (optionnel)</label>
          <textarea v-model="notes" class="w-full border border-gray-300 rounded px-3 py-2"></textarea>
        </div>

        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

        <button
          type="submit"
          :disabled="submitting"
          class="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {{ submitting ? 'Envoi...' : 'Créer le rendez-vous' }}
        </button>
      </form>
    </div>
  </div>
</template>