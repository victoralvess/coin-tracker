<script setup lang="ts">
import { ref } from 'vue';

import { Crypto } from '../types/crypto';
import Modal from './Modal.vue';
import { ApexOptions } from 'apexcharts';

const props = defineProps<{ crypto: Crypto, saved: boolean }>()
const emit = defineEmits<{
  add: [crypto: Crypto],
  remove: [crypto: Crypto],
  'new-price': [crypto: Crypto, price: number]
}>()

const setDefaultIcon = (evt: Event): void => {
  (evt.target! as HTMLImageElement).src
    = 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/white/generic.png'
}

const modalOpen = ref<boolean>(false);
const toggleModal = () => {
  modalOpen.value = !modalOpen.value;
  toggleWs();
};

const localStorageKey = `chartSeries.${props.crypto.id}`;
const getLocalStorageData = (): [number, number][] => {
  try {
    return JSON.parse(localStorage.getItem(localStorageKey) ?? '[]');
  } catch {
    return [];
  }
}

const chartSeries = ref<{ name: string, data: [number, number][] }>({
  name: props.crypto.symbol,
  data: getLocalStorageData()
});

const MAX_HISTORIC_DATA_LENGTH = 100;

const pricesWs = ref<WebSocket | null>(null);
const toggleWs = () => {
  if (modalOpen.value) {
    pricesWs.value = new WebSocket(`wss://ws.coincap.io/prices?assets=${props.crypto.id}`);
    pricesWs.value.onmessage = (msg: { data: string }): void => {
      try {
        const newPrice = Number(JSON.parse(msg.data)[props.crypto.id]);
        chartSeries.value.data.push([Date.now(), newPrice]);
        
        emit('new-price', props.crypto, newPrice);
        
        if (chartSeries.value.data.length > MAX_HISTORIC_DATA_LENGTH) {
          chartSeries.value.data = chartSeries.value.data.slice(
            chartSeries.value.data.length - MAX_HISTORIC_DATA_LENGTH
          );
        }

        localStorage.setItem(localStorageKey, JSON.stringify(chartSeries.value.data));
      } catch { }
    }
  } else if (pricesWs.value !== null) {
    pricesWs.value.close();
    pricesWs.value = null;
  }
}

const chartOptions: ApexOptions = {
  chart: {
    type: 'area',
    stacked: false,
    height: 350,
    zoom: {
      enabled: false,
      autoScaleYaxis: true
    },
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  markers: {
    size: 0
  },
  title: {
    text: `${props.crypto.symbol} Price Movement`,
    align: 'center'
  },
  colors: ['#6366f1'],
  fill: {
    type: 'gradient',
    colors: ['#6366f1'],
    gradient: {
      shadeIntensity: 1,
      inverseColors: false,
      opacityFrom: 0.5,
      opacityTo: 0,
      stops: [0, 90, 100]
    }
  },
  yaxis: {
    title: {
      text: 'Price'
    }
  },
  xaxis: {
    type: 'datetime',
    labels: {
      datetimeUTC: false
    }
  }
};
</script>

<template>
  <div>
    <div
      class="relative flex gap-5 items-center rounded-lg border min-w-[280px] w-full h-[100px] px-4 bg-slate-600 text-white">
      <div>
        <img :src="crypto.icon" class="w-auto h-[60px]" @error="setDefaultIcon">
      </div>
      <div>
        <h3 class="font-bold mt-2">{{ crypto.symbol }}</h3>
        <p class="text-sm mt-1">${{ crypto.price.toFixed(2) }}</p>
      </div>
      <div class="absolute top-4 right-4">
        <button v-if="saved" @click="toggleModal" class="mr-3">
          <i class="fa-solid fa-magnifying-glass-chart text-xl text-white-400 hover:text-gray-200"></i>
        </button>
        <button v-if="saved" @click="$emit('remove', crypto)">
          <i class="fa-solid fa-circle-minus text-xl text-white-400 hover:text-gray-200"></i>
        </button>
        <button v-else @click="$emit('add', crypto)">
          <i class="fa-solid fa-circle-plus text-xl text-white-400 hover:text-gray-200"></i>
        </button>
      </div>
    </div>

    <Modal :modal-open="modalOpen" @close-modal="toggleModal">
      <div>
        <apexchart width="500" type="area" :options="chartOptions" :series="[chartSeries]"></apexchart>
      </div>
    </Modal>
  </div>
</template>

<style scoped></style>