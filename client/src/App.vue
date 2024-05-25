<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

import { Crypto } from './types/crypto';
import CryptoCard from './components/CryptoCard.vue';
import AppHeader from './components/AppHeader.vue';


const localStorageKey = 'crypto';

const checkLocalStorage = () => {
  if (localStorage.getItem(localStorageKey)) {
    savedCrypto.value = JSON.parse(localStorage.getItem(localStorageKey)!);
  }
}

const savedCrypto = ref<Crypto[]>([])
checkLocalStorage();

const addCrypto = (crypto: Crypto): void => {
  savedCrypto.value = [...savedCrypto.value, crypto];
  updateLocalStorage();
}

const removeCrypto = (crypto: Crypto): void => {
  savedCrypto.value = savedCrypto.value.filter(c => c.id !== crypto.id);
  updateLocalStorage();
}

const updatePrice = (crypto: Crypto, newPrice: number): void => {
  savedCrypto.value = [{ ...crypto, price: newPrice }]
    .concat(savedCrypto.value.filter(c => c.id !== crypto.id));
  updateLocalStorage();
}

const updateLocalStorage = () => {
  localStorage.setItem(localStorageKey, JSON.stringify(savedCrypto.value));
}

const isSaved = (crypto: Crypto): boolean => {
  return savedCrypto.value.findIndex(c => c.id === crypto.id) !== -1;
}

const initialLoad = ref<boolean>(true);
const searchText = ref<string>('');
const searchResults = ref<Crypto[]>([]);
const searchTimeout = ref<number | undefined>();
const searchError = ref<boolean>(false);

const searchCrypto = (): void => {
  clearTimeout(searchTimeout.value);
  searchTimeout.value = setTimeout(async () => {
    try {
      const result = await axios
        .get<{ data: Crypto[] }>(
          'http://localhost:3000/coins',
          { params: { q: searchText.value } }
        );

      searchResults.value = result.data.data;
      searchError.value = false;
    } catch {
      searchError.value = true;
      searchResults.value = [];
    } finally {
      initialLoad.value = false;
    }
  }, 300);
}


const getSavedCryptoRemote = async (): Promise<void> => {
  const result = await Promise.allSettled(savedCrypto.value.map(c => {
    return axios.get<Crypto>(`http://localhost:3000/coins/${c.id}`);
  }));

  savedCrypto.value = result.map((res, idx) => {
    if (res.status === 'rejected') {
      return savedCrypto.value[idx];
    } else {
      return res.value.data;
    }
  });

  updateLocalStorage();
}

getSavedCryptoRemote();
searchCrypto();

const refreshTimeInSecs = ref<number | null>(null);
const refreshInterval = ref<number | undefined>();

const refreshPrices = (): void => {
  clearInterval(refreshInterval.value);
  if (refreshTimeInSecs.value === null) {
    return;
  }

  refreshInterval.value = setInterval(async () => {
    try {
      await getSavedCryptoRemote();
    } catch { }
  }, refreshTimeInSecs.value * 1000);
}

</script>

<template>
  <AppHeader></AppHeader>
  <main class="container">
    <div>
      <div class="flex flex-col flex-1 gap-2 items-center">
        <div class="my-4 max-w-screen-md w-full">
          <input type="search" v-model="searchText" @input="searchCrypto" placeholder="Search for a cryptocurrency"
            class="base-input w-full">
        </div>

        <div class="max-w-screen-md w-full">
          <div v-if="searchError" class="bg-slate-900 rounded-lg p-4">
            <p class="text-white">Something bad happend, try again</p>
          </div>        
          <div v-else-if="searchResults.length === 0 && !initialLoad" class="bg-slate-900 rounded-lg p-4">
            <p class="text-white">No results matching your query</p>
          </div>
          <div v-else-if="initialLoad" class="bg-slate-900 rounded-lg p-4">
            <p class="text-white">Loading the most popular assets for you</p>
          </div>
          <div v-else class="flex flex-col md:flex-row gap-4 overflow-x-auto py-4">
            <div v-for="crypto in searchResults" :key="crypto.id">
              <CryptoCard :crypto="crypto" :saved="isSaved(crypto)" @add="addCrypto" @remove="removeCrypto"
                @new-price="updatePrice" />
            </div>
          </div>
        </div>

        <hr class="border my-4 max-w-screen-md w-full">

        <div class="mb-1 max-w-screen-md w-full flex flex-1 justify-between">
          <h2 class="text-white uppercase font-bold">My crypto</h2>
          <select class="base-input w-[150px]" v-model="refreshTimeInSecs" @change="refreshPrices">
            <option :value="null">No refresh</option>
            <option v-for="value in [10, 15, 30, 60]" :value="value">{{ value }}s</option>
          </select>
        </div>

        <div class="max-w-screen-md w-full">
          <div class="flex flex-col md:flex-row gap-4 overflow-x-auto py-4">
            <div v-for="crypto in savedCrypto" :key="crypto.id">
              <CryptoCard :crypto="crypto" :saved="isSaved(crypto)" @add="addCrypto" @remove="removeCrypto"
                @new-price="updatePrice" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
