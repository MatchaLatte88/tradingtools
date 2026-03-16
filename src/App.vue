<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import {
  Activity,
  Clock3,
  CalendarDays,
  Calculator,
  Moon,
  SunMedium,
  TrendingUp,
} from 'lucide-vue-next';
import Calendar from './components/Calendar.vue';
import CalculatorWidget from './components/Calculator.vue';
import Placeholder from './components/Placeholder.vue';
import RiskCalc from './components/RiskCalc.vue';

const THEME_KEY = 'theme';
const isDark = ref(false);
const userTheme = ref(null);
let mediaQuery;
let sessionTimer;

const now = ref(new Date());

const sessionDefinitions = [
  { name: 'NY PM', startHour: 16, startMinute: 0, endHour: 22, endMinute: 0 },
  { name: 'NY AM', startHour: 13, startMinute: 30, endHour: 16, endMinute: 0 },
  { name: 'London Session', startHour: 8, startMinute: 0, endHour: 12, endMinute: 0 },
  { name: 'Asian Session', startHour: 0, startMinute: 0, endHour: 9, endMinute: 0 },
];

const setTime = (baseDate, hour, minute) => {
  const next = new Date(baseDate);
  next.setHours(hour, minute, 0, 0);
  return next;
};

const formatCountdown = (targetDate) => {
  const diffMs = Math.max(0, targetDate.getTime() - now.value.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

const sessionState = computed(() => {
  const current = now.value;
  const activeSession = sessionDefinitions.find((session) => {
    const start = setTime(current, session.startHour, session.startMinute);
    const end = setTime(current, session.endHour, session.endMinute);
    return current >= start && current < end;
  }) ?? null;

  const candidateTransitions = [];

  for (let dayOffset = 0; dayOffset <= 1; dayOffset += 1) {
    const baseDate = new Date(current);
    baseDate.setDate(baseDate.getDate() + dayOffset);

    sessionDefinitions.forEach((session) => {
      const start = setTime(baseDate, session.startHour, session.startMinute);
      const end = setTime(baseDate, session.endHour, session.endMinute);

      if (start > current) {
        candidateTransitions.push({
          type: 'start',
          label: session.name,
          date: start,
        });
      }

      if (end > current) {
        candidateTransitions.push({
          type: 'end',
          label: session.name,
          date: end,
        });
      }
    });
  }

  candidateTransitions.sort((a, b) => a.date.getTime() - b.date.getTime());
  const nextTransition = candidateTransitions[0] ?? null;

  return {
    activeLabel: activeSession?.name ?? 'Off Session',
    isActive: Boolean(activeSession),
    nextLabel: nextTransition?.label ?? 'No upcoming session',
    nextType: nextTransition?.type ?? 'start',
    countdown: nextTransition ? formatCountdown(nextTransition.date) : '00:00:00',
    clock: current.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
  };
});

const applyTheme = (mode) => {
  const darkMode = mode === 'dark';
  isDark.value = darkMode;
  document.documentElement.classList.toggle('dark', darkMode);
  document.documentElement.setAttribute('data-theme', mode);
};

const resolveTheme = () => {
  if (userTheme.value) {
    applyTheme(userTheme.value);
    return;
  }

  const prefersDark = mediaQuery?.matches ?? window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
};

const toggleTheme = () => {
  userTheme.value = isDark.value ? 'light' : 'dark';
};

const handleSystemThemeChange = () => {
  if (!userTheme.value) {
    resolveTheme();
  }
};

watch(userTheme, (value) => {
  if (value) {
    localStorage.setItem(THEME_KEY, value);
  } else {
    localStorage.removeItem(THEME_KEY);
  }

  resolveTheme();
}, { immediate: true });

onMounted(() => {
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  userTheme.value = localStorage.getItem(THEME_KEY);
  resolveTheme();
  now.value = new Date();
  sessionTimer = window.setInterval(() => {
    now.value = new Date();
  }, 1000);

  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', handleSystemThemeChange);
  } else {
    mediaQuery.addListener(handleSystemThemeChange);
  }
});

onUnmounted(() => {
  if (!mediaQuery) return;

  if (typeof mediaQuery.removeEventListener === 'function') {
    mediaQuery.removeEventListener('change', handleSystemThemeChange);
  } else {
    mediaQuery.removeListener(handleSystemThemeChange);
  }

  if (sessionTimer) {
    window.clearInterval(sessionTimer);
  }
});

const cards = [
  {
    id: 1,
    title: 'Macro Calendar',
    description: 'Track key FOMC dates and inspect daily event details.',
    icon: CalendarDays,
    component: Calendar,
    className: 'lg:col-span-1',
  },
  {
    id: 2,
    title: 'Risk / Profit',
    description: 'Estimate the dollar impact of a move across supported futures contracts.',
    icon: TrendingUp,
    component: RiskCalc,
    className: 'lg:col-span-1',
  },
  {
    id: 3,
    title: 'Quick Calculator',
    description: 'Fast desk-side arithmetic with keyboard support built in.',
    icon: Calculator,
    component: CalculatorWidget,
    className: 'lg:col-span-1',
  },
  {
    id: 4,
    title: 'Signal Monitor',
    description: 'A styled placeholder for additional portfolio intelligence.',
    icon: Activity,
    component: Placeholder,
    props: {
      title: 'Future Module',
      description: 'Use this module for watchlists, alerts, or strategy notes.',
      badge: 'Roadmap',
    },
    className: 'lg:col-span-1',
  },
];
</script>

<template>
  <div class="min-h-screen bg-zinc-100 text-zinc-800 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-200">
    <div class="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-10 pt-4 sm:px-6 lg:px-8">
      <header class="sticky top-4 z-40 mb-6 overflow-hidden rounded-md border border-zinc-200 bg-white shadow-[0_6px_18px_-8px_rgba(15,23,42,0.18)] transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-[0_10px_22px_-14px_rgba(0,0,0,0.55)]">
        <div class="absolute inset-x-0 top-0 h-0.5 bg-emerald-500"></div>
        <div class="flex flex-col gap-3 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-11 w-11 items-center justify-center rounded-md bg-emerald-500 text-white shadow-sm">
              <TrendingUp class="h-5 w-5" />
            </div>
            <div>
              <h1 class="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-xl">Trading Hub</h1>
            </div>
          </div>

          <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div class="flex min-w-0 items-center gap-3 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2.5 dark:border-zinc-800 dark:bg-zinc-950">
              <div
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
                :class="sessionState.isActive ? 'bg-emerald-100 text-emerald-500 dark:bg-emerald-500/15 dark:text-emerald-300' : 'bg-zinc-200 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400'"
              >
                <Clock3 class="h-4 w-4" />
              </div>
              <div class="min-w-0">
                <div class="flex items-start justify-between gap-3">
                  <p
                    class="truncate text-base font-semibold leading-none sm:text-lg"
                    :class="sessionState.isActive ? 'text-emerald-500 dark:text-emerald-300' : 'text-zinc-700 dark:text-zinc-200'"
                  >
                    {{ sessionState.activeLabel }}
                  </p>
                  <span class="shrink-0 pt-0.5 text-[11px] font-medium leading-none text-zinc-400 dark:text-zinc-500">{{ sessionState.clock }}</span>
                </div>
                <p class="truncate pt-1 text-xs font-medium leading-none text-zinc-500 dark:text-zinc-400">
                  Next: {{ sessionState.nextLabel }} in {{ sessionState.countdown }}
                </p>
              </div>
            </div>

            <button
              @click="toggleTheme"
              class="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-all duration-200 hover:border-emerald-300 hover:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-emerald-500/40 dark:hover:bg-zinc-900"
              type="button"
              aria-label="Toggle color theme"
            >
              <component :is="isDark ? SunMedium : Moon" class="h-4 w-4" />
              <span>{{ isDark ? 'Light' : 'Dark' }}</span>
            </button>
          </div>
        </div>
      </header>

      <main class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section
          v-for="card in cards"
          :key="card.id"
          class="group relative overflow-hidden rounded-md border border-zinc-200 bg-white p-6 shadow-[0_6px_18px_-8px_rgba(15,23,42,0.14)] transition-all duration-200 hover:border-zinc-300 hover:shadow-[0_10px_24px_-12px_rgba(15,23,42,0.18)] dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:shadow-[0_12px_24px_-16px_rgba(0,0,0,0.6)]"
          :class="card.className"
        >
          <div class="absolute inset-x-0 top-0 h-0.5 bg-emerald-500"></div>
          <div class="mb-6 flex items-start justify-between gap-4">
            <div class="space-y-2">
              <div class="inline-flex items-center gap-2 rounded-sm border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-500 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                <component :is="card.icon" class="h-3.5 w-3.5" />
                <span>Module</span>
              </div>
              <div>
                <h2 class="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{{ card.title }}</h2>
                <p class="mt-1 max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">{{ card.description }}</p>
              </div>
            </div>
          </div>

          <div class="min-h-[420px]">
            <component :is="card.component" v-bind="card.props || {}" />
          </div>
        </section>
      </main>
    </div>
  </div>
</template>
