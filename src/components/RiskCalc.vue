<script setup>
import { computed, ref } from 'vue';
import { ArrowLeftRight, CircleDollarSign, ShieldAlert, TrendingUp } from 'lucide-vue-next';

const assets = [
  {
    label: 'E-Mini NASDAQ',
    value: 'nq',
    pointValue: 20,
    tickValue: 5,
    tickSize: 0.25,
  },
  {
    label: 'Micro NASDAQ',
    value: 'mnq',
    pointValue: 2,
    tickValue: 0.5,
    tickSize: 0.25,
  },
  {
    label: 'E-Mini ES',
    value: 'es',
    pointValue: 50,
    tickValue: 12.5,
    tickSize: 0.25,
  },
  {
    label: 'Micro ES',
    value: 'mes',
    pointValue: 5,
    tickValue: 1.25,
    tickSize: 0.25,
  },
];

const solveForOptions = [
  { label: 'Risk', value: 'risk' },
  { label: 'Size', value: 'size' },
  { label: 'Distance', value: 'distance' },
];

const size = ref('1');
const distance = ref('1');
const risk = ref('20');
const rrr = ref('');
const distanceUnit = ref('points');
const selectedAsset = ref('nq');
const solveFor = ref('risk');

const asset = computed(() => assets.find((item) => item.value === selectedAsset.value) ?? assets[0]);

const parseLocaleNumber = (value) => {
  const normalized = String(value ?? '')
    .trim()
    .replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : NaN;
};

const formatNumber = (value, decimals = 2) => {
  if (!Number.isFinite(value)) return '';
  return value.toFixed(decimals).replace(/\.?0+$/, '');
};

const normalizedInputSize = computed(() => {
  const value = parseLocaleNumber(size.value);
  return Number.isFinite(value) && value > 0 ? value : 0;
});

const normalizedInputDistance = computed(() => {
  const value = parseLocaleNumber(distance.value);
  return Number.isFinite(value) && value > 0 ? value : 0;
});

const normalizedInputRisk = computed(() => {
  const value = parseLocaleNumber(risk.value);
  return Number.isFinite(value) && value > 0 ? value : 0;
});

const normalizedRrr = computed(() => {
  const value = parseLocaleNumber(rrr.value);
  return Number.isFinite(value) && value > 0 ? value : null;
});

const moveValuePerContract = computed(() =>
  distanceUnit.value === 'points' ? asset.value.pointValue : asset.value.tickValue,
);

const calculatedSize = computed(() => {
  if (moveValuePerContract.value <= 0 || normalizedInputDistance.value <= 0) return 0;
  return normalizedInputRisk.value / (normalizedInputDistance.value * moveValuePerContract.value);
});

const calculatedDistance = computed(() => {
  if (moveValuePerContract.value <= 0 || normalizedInputSize.value <= 0) return 0;
  return normalizedInputRisk.value / (normalizedInputSize.value * moveValuePerContract.value);
});

const calculatedRisk = computed(() => {
  if (moveValuePerContract.value <= 0) return 0;
  return normalizedInputSize.value * normalizedInputDistance.value * moveValuePerContract.value;
});

const effectiveSize = computed(() => (solveFor.value === 'size' ? calculatedSize.value : normalizedInputSize.value));
const effectiveDistance = computed(() => (solveFor.value === 'distance' ? calculatedDistance.value : normalizedInputDistance.value));
const effectiveRisk = computed(() => (solveFor.value === 'risk' ? calculatedRisk.value : normalizedInputRisk.value));

const distanceInPoints = computed(() =>
  distanceUnit.value === 'points'
    ? effectiveDistance.value
    : effectiveDistance.value * asset.value.tickSize,
);

const distanceInTicks = computed(() =>
  distanceUnit.value === 'ticks'
    ? effectiveDistance.value
    : effectiveDistance.value / asset.value.tickSize,
);

const projectedProfit = computed(() =>
  normalizedRrr.value ? effectiveRisk.value * normalizedRrr.value : effectiveRisk.value,
);

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);

const formattedSolvedValue = (field) => {
  if (field === 'size') return formatNumber(effectiveSize.value, 2);
  if (field === 'distance') return formatNumber(effectiveDistance.value, 2);
  if (field === 'risk') return formatNumber(effectiveRisk.value, 2);
  return '';
};
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="mb-5 grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
      <label class="flex flex-col gap-2">
        <span class="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500">Asset</span>
        <select
          v-model="selectedAsset"
          class="rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-800 outline-none transition-all duration-200 focus:border-emerald-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
        >
          <option v-for="option in assets" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>

      <label class="flex flex-col gap-2">
        <span class="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500">Unit</span>
        <div class="grid grid-cols-2 rounded-md border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-950">
          <button
            @click="distanceUnit = 'points'"
            type="button"
            class="rounded-sm px-3 py-2 text-sm font-semibold transition-all duration-200"
            :class="distanceUnit === 'points' ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-50' : 'text-zinc-500 dark:text-zinc-400'"
          >
            Points
          </button>
          <button
            @click="distanceUnit = 'ticks'"
            type="button"
            class="rounded-sm px-3 py-2 text-sm font-semibold transition-all duration-200"
            :class="distanceUnit === 'ticks' ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-50' : 'text-zinc-500 dark:text-zinc-400'"
          >
            Ticks
          </button>
        </div>
      </label>
    </div>

    <div class="mb-5">
      <span class="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500">Solve For</span>
      <div class="grid grid-cols-3 rounded-md border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-950">
        <button
          v-for="option in solveForOptions"
          :key="option.value"
          @click="solveFor = option.value"
          type="button"
          class="rounded-sm px-3 py-2 text-sm font-semibold transition-all duration-200"
          :class="solveFor === option.value ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-50' : 'text-zinc-500 dark:text-zinc-400'"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <div class="mb-5 grid gap-3 md:grid-cols-3">
      <label class="flex flex-col gap-2">
        <span class="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500">Size</span>
        <input
          v-if="solveFor === 'size'"
          :value="formattedSolvedValue('size')"
          type="text"
          inputmode="decimal"
          readonly
          class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-zinc-800 outline-none transition-all duration-200 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-zinc-100"
        />
        <input
          v-else
          v-model="size"
          type="text"
          inputmode="decimal"
          class="rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-800 outline-none transition-all duration-200 focus:border-emerald-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
        />
      </label>

      <label class="flex flex-col gap-2">
        <span class="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500">Distance</span>
        <input
          v-if="solveFor === 'distance'"
          :value="formattedSolvedValue('distance')"
          type="text"
          inputmode="decimal"
          readonly
          class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-zinc-800 outline-none transition-all duration-200 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-zinc-100"
        />
        <input
          v-else
          v-model="distance"
          type="text"
          inputmode="decimal"
          class="rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-800 outline-none transition-all duration-200 focus:border-emerald-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
        />
      </label>

      <label class="flex flex-col gap-2">
        <span class="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500">Risk ($)</span>
        <input
          v-if="solveFor === 'risk'"
          :value="formattedSolvedValue('risk')"
          type="text"
          inputmode="decimal"
          readonly
          class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-zinc-800 outline-none transition-all duration-200 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-zinc-100"
        />
        <input
          v-else
          v-model="risk"
          type="text"
          inputmode="decimal"
          class="rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-800 outline-none transition-all duration-200 focus:border-emerald-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
        />
      </label>
    </div>

    <div class="mb-5 grid gap-3 md:grid-cols-[1fr_0.8fr]">
      <label class="flex flex-col gap-2">
        <span class="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500">RRR</span>
        <input
          v-model="rrr"
          type="text"
          inputmode="decimal"
          placeholder="Optional"
          class="rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-800 outline-none transition-all duration-200 focus:border-emerald-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
        />
      </label>

      <div class="rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div class="mb-2 flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
          <CircleDollarSign class="h-4 w-4 text-emerald-500" />
          <span class="text-[11px] font-semibold uppercase tracking-[0.22em]">Per Contract</span>
        </div>
        <div class="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {{ formatCurrency(effectiveDistance * moveValuePerContract) }}
        </div>
      </div>
    </div>

    <div class="mb-5 grid gap-3 sm:grid-cols-2">
      <div class="rounded-md border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-500/20 dark:bg-emerald-500/10">
        <div class="mb-4 flex items-center justify-between">
          <div class="rounded-sm bg-white p-2 text-emerald-500 dark:bg-zinc-900 dark:text-emerald-300">
            <ShieldAlert class="h-5 w-5" />
          </div>
          <span class="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-500 dark:text-emerald-300">Risk</span>
        </div>
        <div class="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {{ formatCurrency(effectiveRisk) }}
        </div>
        <p class="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Dollar risk based on the solved position inputs.</p>
      </div>

      <div class="rounded-md border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-500/20 dark:bg-emerald-500/10">
        <div class="mb-4 flex items-center justify-between">
          <div class="rounded-sm bg-white p-2 text-emerald-500 dark:bg-zinc-900 dark:text-emerald-300">
            <TrendingUp class="h-5 w-5" />
          </div>
          <span class="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-500 dark:text-emerald-300">Profit</span>
        </div>
        <div class="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {{ formatCurrency(projectedProfit) }}
        </div>
        <p class="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          {{ normalizedRrr ? `Projected gain at ${normalizedRrr}:1 RRR.` : 'Dollar profit for the same favorable move.' }}
        </p>
      </div>
    </div>

    <div class="grid flex-1 gap-3 lg:grid-cols-2">
      <div class="rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div class="mb-3 flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
          <ArrowLeftRight class="h-4 w-4 text-emerald-500" />
          <span class="text-[11px] font-semibold uppercase tracking-[0.22em]">Points</span>
        </div>
        <div class="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{{ distanceInPoints.toFixed(2) }}</div>
      </div>

      <div class="rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div class="mb-3 flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
          <ArrowLeftRight class="h-4 w-4 text-emerald-500" />
          <span class="text-[11px] font-semibold uppercase tracking-[0.22em]">Ticks</span>
        </div>
        <div class="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{{ distanceInTicks.toFixed(0) }}</div>
      </div>
    </div>
  </div>
</template>
