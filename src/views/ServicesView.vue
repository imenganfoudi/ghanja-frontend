<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useServicesStore } from '../stores/services'

const store = useServicesStore()

const editingId = ref<number | null>(null)
const showForm = ref(false)

const name = ref('')
const description = ref('')
const duration = ref(30)
const price = ref(0)
const isActive = ref(true)

const submitting = ref(false)
const error = ref('')

onMounted(() => {
  store.fetchServices()
})

function openNewForm() {
  editingId.value = null
  name.value = ''
  description.value = ''
  duration.value = 30
  price.value = 0
  isActive.value = true
  showForm.value = true
}

function openEditForm(service: any) {
  editingId.value = service.id
  name.value = service.name
  description.value = service.description || ''
  duration.value = service.duration_minutes
  price.value = parseFloat(service.price)
  isActive.value = service.is_active
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  error.value = ''
}

async function handleSubmit() {
  error.value = ''
  submitting.value = true

  const data = {
    name: name.value,
    description: description.value,
    duration_minutes: duration.value,
    price: price.value,
    is_active: isActive.value,
  }

  try {
    if (editingId.value) {
      await store.updateService(editingId.value, data)
    } else {
      await store.createService(data)
    }
    closeForm()
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Erreur lors de l\'enregistrement.'
  } finally {
    submitting.value = false
  }
}

async function handleDelete(id: number) {
  if (confirm('Supprimer ce service ?')) {
    await store.deleteService(id)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-3xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-purple-600">Services</h1>
        <button
          @click="openNewForm"
          class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          + Nouveau
        </button>
      </div>

      <div v-if="showForm" class="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 class="text-lg font-bold mb-4">{{ editingId ? 'Modifier' : 'Ajouter' }} un service</h2>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1">Nom</label>
            <input v-model="name" type="text" required class="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">Description</label>
            <textarea v-model="description" class="w-full border border-gray-300 rounded px-3 py-2"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Durée (min)</label>
              <input v-model.number="duration" type="number" required min="5" class="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Prix (€)</label>
              <input v-model.number="price" type="number" required min="0" step="0.01" class="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
          </div>
          <div class="flex items-center gap-2">
            <input v-model="isActive" type="checkbox" id="isActive" />
            <label for="isActive" class="text-sm text-gray-600">Actif</label>
          </div>

          <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

          <div class="flex gap-2">
            <button
              type="submit"
              :disabled="submitting"
              class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {{ submitting ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
            <button
              type="button"
              @click="closeForm"
              class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>

      <div v-if="store.loading" class="text-gray-500">Chargement...</div>
      <div v-else-if="store.error" class="text-red-500">{{ store.error }}</div>

      <div v-else class="bg-white rounded-lg shadow-md divide-y">
        <div
          v-for="service in store.services"
          :key="service.id"
          class="p-4 flex justify-between items-center"
        >
          <div>
            <div class="font-medium flex items-center gap-2">
              {{ service.name }}
              <span v-if="!service.is_active" class="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                Inactif
              </span>
            </div>
            <div class="text-sm text-gray-500">
              {{ service.duration_minutes }} min — {{ service.price }} €
            </div>
          </div>
          <div class="flex gap-3">
            <button @click="openEditForm(service)" class="text-purple-600 hover:underline text-sm">
              Modifier
            </button>
            <button @click="handleDelete(service.id)" class="text-red-500 hover:underline text-sm">
              Supprimer
            </button>
          </div>
        </div>

        <div v-if="store.services.length === 0" class="p-6 text-center text-gray-500">
          Aucun service pour le moment.
        </div>
      </div>
    </div>
  </div>
</template>