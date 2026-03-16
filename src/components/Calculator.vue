<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { Delete, Equal } from 'lucide-vue-next';

const display = ref('0');
const prevValue = ref(null);
const operator = ref(null);
const waitingForSecondOperand = ref(false);

const appendNumber = (num) => {
  if (waitingForSecondOperand.value) {
    display.value = String(num);
    waitingForSecondOperand.value = false;
  } else {
    display.value = display.value === '0' ? String(num) : display.value + num;
  }
};

const appendDecimal = () => {
  if (waitingForSecondOperand.value) {
    display.value = '0.';
    waitingForSecondOperand.value = false;
    return;
  }
  if (!display.value.includes('.')) {
    display.value += '.';
  }
};

const clear = () => {
  display.value = '0';
  prevValue.value = null;
  operator.value = null;
  waitingForSecondOperand.value = false;
};

const handleOperator = (nextOperator) => {
  const inputValue = parseFloat(display.value);

  if (operator.value && waitingForSecondOperand.value) {
    operator.value = nextOperator;
    return;
  }

  if (prevValue.value === null) {
    prevValue.value = inputValue;
  } else if (operator.value) {
    const result = calculate(prevValue.value, inputValue, operator.value);
    display.value = `${parseFloat(result.toFixed(7))}`;
    prevValue.value = result;
  }

  waitingForSecondOperand.value = true;
  operator.value = nextOperator;
};

const calculate = (first, second, op) => {
  if (op === '+') return first + second;
  if (op === '-') return first - second;
  if (op === '*') return first * second;
  if (op === '/') return first / second;
  return second;
};

const handleEquals = () => {
  const inputValue = parseFloat(display.value);

  if (operator.value && !waitingForSecondOperand.value) {
    const result = calculate(prevValue.value, inputValue, operator.value);
    display.value = `${parseFloat(result.toFixed(7))}`;
    prevValue.value = null;
    operator.value = null;
    waitingForSecondOperand.value = false;
  }
};

const handleBackspace = () => {
  display.value = display.value.length > 1 ? display.value.slice(0, -1) : '0';
};

const handleKeyDown = (event) => {
  if (event.key >= '0' && event.key <= '9') appendNumber(event.key);
  if (event.key === '.') appendDecimal();
  if (event.key === '+') handleOperator('+');
  if (event.key === '-') handleOperator('-');
  if (event.key === '*') handleOperator('*');
  if (event.key === '/') handleOperator('/');
  if (event.key === 'Enter' || event.key === '=') handleEquals();
  if (event.key === 'Escape') clear();
  if (event.key === 'Backspace') handleBackspace();
};

onMounted(() => window.addEventListener('keydown', handleKeyDown));
onUnmounted(() => window.removeEventListener('keydown', handleKeyDown));

const buttons = [
  { label: 'C', type: 'clear', action: clear },
  { label: '/', type: 'op', action: () => handleOperator('/'), displayLabel: '/' },
  { label: '*', type: 'op', action: () => handleOperator('*'), displayLabel: 'x' },
  { label: '-', type: 'op', action: () => handleOperator('-'), displayLabel: '-' },
  { label: '7', type: 'num', action: () => appendNumber('7') },
  { label: '8', type: 'num', action: () => appendNumber('8') },
  { label: '9', type: 'num', action: () => appendNumber('9') },
  { label: '+', type: 'op', action: () => handleOperator('+') },
  { label: '4', type: 'num', action: () => appendNumber('4') },
  { label: '5', type: 'num', action: () => appendNumber('5') },
  { label: '6', type: 'num', action: () => appendNumber('6') },
  { label: '=', type: 'equals', action: handleEquals, span: 'row-span-3' },
  { label: '1', type: 'num', action: () => appendNumber('1') },
  { label: '2', type: 'num', action: () => appendNumber('2') },
  { label: '3', type: 'num', action: () => appendNumber('3') },
  { label: '0', type: 'num', action: () => appendNumber('0'), span: 'col-span-2' },
  { label: '.', type: 'num', action: appendDecimal },
];

const activeOperator = (value) => operator.value === value;
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="mb-5 rounded-md border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <div class="rounded-md bg-zinc-950 px-5 py-5 text-right text-white dark:bg-black">
        <div class="mb-3 flex items-center justify-end">
          <button
            @click="handleBackspace"
            class="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-white/10 text-zinc-400 transition-colors duration-200 hover:border-emerald-400/40 hover:text-emerald-300"
            type="button"
            aria-label="Delete last digit"
          >
            <Delete class="h-4 w-4" />
          </button>
        </div>
        <div class="min-h-[24px] text-sm font-medium text-zinc-500">
          {{ operator ? `${prevValue} ${operator}` : '' }}
        </div>
        <div class="mt-3 truncate font-mono text-4xl font-bold tracking-tight sm:text-[2.7rem]">
          {{ display }}
        </div>
      </div>
    </div>

    <div class="grid flex-1 grid-cols-4 gap-3">
      <template v-for="btn in buttons" :key="btn.label">
        <button
          @click="btn.action"
          class="relative flex min-h-[72px] items-center justify-center overflow-hidden rounded-md border text-lg font-semibold transition-all duration-150 active:scale-[0.98]"
          :class="[
            btn.span || '',
            btn.type === 'num'
              ? 'border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:border-zinc-700 dark:hover:bg-zinc-900'
              : '',
            btn.type === 'op'
              ? activeOperator(btn.label)
                ? 'border-emerald-500 bg-emerald-500 text-white'
                : 'border-zinc-200 bg-zinc-100 text-zinc-700 hover:border-emerald-300 hover:text-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-emerald-500/40 dark:hover:text-emerald-300'
              : '',
            btn.type === 'clear'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-500 hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/15'
              : '',
            btn.type === 'equals'
              ? 'border-zinc-950 bg-zinc-950 text-white hover:bg-zinc-800 dark:border-emerald-500/30 dark:bg-emerald-500 dark:hover:bg-emerald-400'
              : '',
          ]"
          type="button"
        >
          <span v-if="btn.type === 'equals'" class="flex items-center gap-2">
            <Equal class="h-5 w-5" />
            <span>{{ btn.label }}</span>
          </span>
          <span v-else>{{ btn.displayLabel || btn.label }}</span>
        </button>
      </template>
    </div>
  </div>
</template>
