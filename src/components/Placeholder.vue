<script setup>
import { Layers3 } from 'lucide-vue-next';

defineProps({
  title: {
    type: String,
    default: 'Future Module',
  },
  description: {
    type: String,
    default: 'This module is currently under development.',
  },
  badge: {
    type: String,
    default: 'Coming Soon',
  },
});
</script>

<template>
  <div class="flex h-full flex-col items-center justify-center rounded-md border border-dashed border-zinc-200 bg-zinc-50 px-8 py-12 text-center dark:border-zinc-800 dark:bg-zinc-950">
    <div class="inline-flex items-center gap-2 rounded-sm border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-500 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
      <span>{{ badge }}</span>
    </div>

    <div class="mt-6 flex h-24 w-24 items-center justify-center rounded-md border border-zinc-200 bg-white text-emerald-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-emerald-300">
      <Layers3 class="h-11 w-11" />
    </div>

    <h3 class="mt-6 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{{ title }}</h3>
    <p class="mt-3 max-w-sm text-sm leading-6 text-zinc-500 dark:text-zinc-400">{{ description }}</p>

    <div class="mt-8 grid w-full max-w-md gap-3 sm:grid-cols-3">
      <div class="rounded-md border border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Layout</p>
        <p class="mt-2 text-sm font-medium text-zinc-800 dark:text-zinc-100">Ready</p>
      </div>
      <div class="rounded-md border border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Design</p>
        <p class="mt-2 text-sm font-medium text-zinc-800 dark:text-zinc-100">Polished</p>
      </div>
      <div class="rounded-md border border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Status</p>
        <p class="mt-2 text-sm font-medium text-zinc-800 dark:text-zinc-100">Waiting</p>
      </div>
    </div>
  </div>
</template>
