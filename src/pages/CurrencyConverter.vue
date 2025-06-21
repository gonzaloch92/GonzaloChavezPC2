<template>
  <q-page class="q-pa-md">
    <q-card flat bordered class="q-pa-lg shadow-2" style="max-width: 500px; margin: auto">
      <q-card-section>
        <div class="text-h6 text-center">💱 Conversor de Monedas</div>
      </q-card-section>

      <q-card-section class="q-gutter-md">
        <q-input v-model="amount" type="number" label="Monto a convertir" filled />

        <q-select
          v-model="from"
          :options="currencyOptions"
          label="Moneda Origen"
          emit-value
          map-options
          filled
        />

        <q-select
          v-model="to"
          :options="currencyOptions"
          label="Moneda Destino"
          emit-value
          map-options
          filled
        />

        <div class="row items-center q-gutter-sm">
          <q-btn label="Convertir" color="primary" @click="convertCurrency" />
          <q-btn icon="swap_horiz" flat dense @click="swapCurrencies" />
        </div>

        <div v-if="result" class="q-mt-md text-subtitle1">
          {{ result }}
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const amount = ref(null)
const from = ref(null)
const to = ref(null)
const result = ref('')
const currencyOptions = ref([])

const fetchCurrencies = async () => {
  try {
    const res = await axios.get('https://api.frankfurter.app/currencies')
    currencyOptions.value = Object.entries(res.data).map(([code, name]) => ({
      label: `${code} - ${name}`,
      value: code,
    }))
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Error al cargar monedas',
      position: 'top',
      timeout: 3000,
      icon: 'error',
    })
  }
}

const convertCurrency = async () => {
  if (!amount.value || isNaN(amount.value) || amount.value <= 0) {
    $q.notify({
      type: 'negative',
      message: 'Ingrese un monto válido mayor que cero',
      position: 'top',
      timeout: 3000,
      icon: 'warning',
    })
    return
  }

  if (!from.value || !to.value) {
    $q.notify({
      type: 'negative',
      message: 'Debe seleccionar ambas monedas',
      position: 'top',
      timeout: 3000,
      icon: 'error',
    })
    return
  }

  if (from.value === to.value) {
    result.value = `${amount.value} ${from.value} equivalen a ${amount.value} ${to.value}`
    return
  }

  try {
    const url = `https://api.frankfurter.app/latest?amount=${amount.value}&from=${from.value}&to=${to.value}`
    const res = await axios.get(url)
    const converted = res.data.rates[to.value]
    result.value = `${amount.value} ${from.value} equivalen a ${converted.toFixed(2)} ${to.value}`
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Error al convertir monedas',
      position: 'top',
      timeout: 3000,
      icon: 'close',
    })
  }
}

const swapCurrencies = () => {
  const temp = from.value
  from.value = to.value
  to.value = temp
}

onMounted(fetchCurrencies)
</script>
