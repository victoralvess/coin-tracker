<template>
  <Teleport to="body">
    <Transition name="modal-container">
      <div v-show="modalOpen"
        class="absolute w-full bg-black bg-opacity-30 h-screen top-0 left-0 flex justify-center px-8"
        @click="$emit('close-modal')"
      >
        <Transition name="modal-content">
          <div
            v-if="modalOpen"
            class="p-4 bg-white self-start mt-32 max-w-screen-md rounded-lg"
            @click.stop
        >
            <slot></slot>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineEmits<{ 'close-modal': [] }>();
defineProps<{ modalOpen?: boolean }>();
</script>

<style scoped>
.modal-container-enter-active,
.modal-container-leave-active {
  transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-container-enter-from,
.modal-container-leave-to {
  opacity: 0;
}

.modal-content-enter-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}

.modal-content-leave-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-content-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.modal-content-leave-to {
  transform: scale(0.8);
}
</style>