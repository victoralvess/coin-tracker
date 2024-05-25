<script setup lang="ts">
import { Crypto } from '../types/crypto';

defineProps<{ crypto: Crypto, saved: boolean }>()
defineEmits<{ add: [crypto: Crypto], remove: [crypto: Crypto] }>()
</script>

<template>
  <div class="relative flex gap-5 items-center rounded-lg border min-w-[400px] w-full h-[100px] px-4 bg-slate-600 text-white">
    <div>
      <img :src="crypto.icon" class="w-auto h-[60px]">
    </div>
    <div>
      <h3 class="font-bold mt-2">{{ crypto.symbol }}</h3>
      <p class="text-sm mt-1">${{ crypto.price.toFixed(2) }}</p>
    </div>
    <div class="absolute top-4 right-4">
      <button v-if="saved" @click="$emit('remove', crypto)">
        <i class="fa-solid fa-circle-minus text-2xl text-white-400 hover:text-gray-200"></i>
      </button>
      <button v-else @click="$emit('add', crypto)">
        <i class="fa-solid fa-circle-plus text-2xl text-white-400 hover:text-gray-200"></i>
      </button>
    </div>
  </div>
</template>

<style scoped></style>