<script setup lang="ts">
import { ref } from 'vue';
import CryptoCard from './components/CryptoCard.vue'
import { Crypto } from './types/crypto';
import axios from 'axios';

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

const updateLocalStorage = () => {
  localStorage.setItem(localStorageKey, JSON.stringify(savedCrypto.value));
}

const isSaved = (crypto: Crypto): boolean => {
  return savedCrypto.value.findIndex(c => c.id === crypto.id) !== -1;
}


const searchText = ref<string>('');
const searchResults = ref<Crypto[]>([]);
const searchTimeout = ref<number | undefined>();

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
    } catch {
      searchResults.value = [];
    }
  }, 300);
}
</script>

<template>
  <main class="container">
    <div>
      <div class="flex flex-col flex-1 gap-2 items-center">
        <div class="my-4 max-w-screen-md w-full">
          <input type="search" v-model="searchText" @input="searchCrypto" placeholder="Search for a cryptocurrency"
            class="px-4 py-2 w-full border-b rounded-t-md focus:outline-none bg-slate-600 caret-slate-50 text-white">
        </div>

        <div class="max-w-screen-md w-full">
          <div class="flex flex-col md:flex-row gap-4 overflow-x-auto py-4">
            <div v-for="crypto in searchResults" :key="crypto.id">
              <CryptoCard :crypto="crypto" :saved="isSaved(crypto)" @add="addCrypto" @remove="removeCrypto" />
            </div>
          </div>
        </div>

        <hr class="border my-4 max-w-screen-md w-full">

        <div class="mb-1 max-w-screen-md w-full">
          <h2 class="text-white uppercase font-bold">My crypto</h2>
        </div>

        <div class="max-w-screen-md w-full">
          <div class="flex flex-col md:flex-row gap-4 overflow-x-auto py-4">
            <div v-for="crypto in savedCrypto" :key="crypto.id">
              <CryptoCard :crypto="crypto" :saved="isSaved(crypto)" @add="addCrypto" @remove="removeCrypto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
