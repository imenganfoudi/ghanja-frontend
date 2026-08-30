<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppointmentsStore } from '../stores/appointments'

const store = useAppointmentsStore()

onMounted(() => {
  store.fetchAppointments()
})

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmé',
    cancelled: 'Annulé',
    completed: 'Terminé',
  }
  return labels[status] || status
}

function statusColor(status: string) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-gray-100 text-gray-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

async function handleStatusChange(id: number, event: Event) {
  const newStatus = (event.target as HTMLSelectElement).value
  await store.updateStatus(id, newStatus)
}

async function handleDelete(id: number) {
  if (confirm('Supprimer ce rendez-vous ?')) {
    await store.deleteAppointment(id)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-5xl mx-auto">
      <h1 class="text-2xl font-bold text-purple-600 mb-6">Rendez-vous</h1>

      <div v-if="store.loading" class="text-gray-500">Chargement...</div>
      <div v-else-if="store.error" class="text-red-500">{{ store.error }}</div>

      <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="p-3 text-sm text-gray-600">Client</th>
              <th class="p-3 text-sm text-gray-600">Service</th>
              <th class="p-3 text-sm text-gray-600">Date</th>
              <th class="p-3 text-sm text-gray-600">Heure</th>
              <th class="p-3 text-sm text-gray-600">Statut</th>
              <th class="p-3 text-sm text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="appointment in store.appointments"
              :key="appointment.id"
              class="border-b last:border-0"
            >
              <td class="p-3">
                <div class="font-medium">{{ appointment.customer_name }}</div>
                <div class="text-sm text-gray-500">{{ appointment.customer_email }}</div>
              </td>
              <td class="p-3">{{ appointment.service.name }}</td>
              <td class="p-3">{{ new Date(appointment.appointment_date).toLocaleDateString('fr-FR') }}</td>
              <td class="p-3">{{ appointment.start_time.slice(0, 5) }}</td>
              <td class="p-3">
                <select
                  :value="appointment.status"
                  @change="handleStatusChange(appointment.id, $event)"
                  :class="['text-xs px-2 py-1 rounded-full border-0', statusColor(appointment.status)]"
                >
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmé</option>
                  <option value="cancelled">Annulé</option>
                  <option value="completed">Terminé</option>
                </select>
              </td>
              <td class="p-3">
                <button
                  @click="handleDelete(appointment.id)"
                  class="text-red-500 hover:underline text-sm"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="store.appointments.length === 0" class="p-6 text-center text-gray-500">
          Aucun rendez-vous pour le moment.
        </div>
      </div>
    </div>
  </div>
</template>