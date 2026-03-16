<script setup>
import { X } from 'lucide-vue-next';

defineProps({
  isOpen: Boolean,
  title: String,
});

defineEmits(['close']);
</script>

<template>
  <Transition name="modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/55 p-4"
      @click.self="$emit('close')"
    >
      <div class="w-full max-w-xl overflow-hidden rounded-md border border-zinc-200 bg-white shadow-[0_16px_38px_-20px_rgba(15,23,42,0.34)] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-[0_20px_45px_-24px_rgba(0,0,0,0.8)]">
        <div class="border-b border-zinc-200 bg-zinc-50 px-6 py-5 dark:border-zinc-800 dark:bg-zinc-950 sm:px-7">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400 dark:text-zinc-500">Event Details</p>
              <h3 class="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{{ title }}</h3>
            </div>
            <button
              @click="$emit('close')"
              class="inline-flex h-11 w-11 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 transition-all duration-200 hover:border-emerald-300 hover:text-emerald-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-emerald-500/40 dark:hover:text-emerald-300"
              type="button"
              aria-label="Close modal"
            >
              <X class="h-5 w-5" />
            </button>
          </div>
        </div>

        <div class="max-h-[65vh] overflow-y-auto px-6 py-6 custom-scrollbar sm:px-7">
          <slot></slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.24s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.24s ease, opacity 0.24s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  opacity: 0;
  transform: translateY(14px) scale(0.97);
}
</style>
