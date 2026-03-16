<script setup>
import { computed, ref } from 'vue';
import { CalendarRange, ChevronLeft, ChevronRight, Clock3 } from 'lucide-vue-next';
import fomcData from '../data/fomc-events.json';
import { getAllEvents } from '../utils/eventGenerator';
import Modal from './Modal.vue';

const events = getAllEvents(fomcData);
const currentDate = ref(new Date());
const today = new Date();

const currentYear = computed(() => currentDate.value.getFullYear());
const currentMonth = computed(() => currentDate.value.getMonth());

const monthName = computed(() =>
  currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' }),
);

const daysInMonth = computed(() => new Date(currentYear.value, currentMonth.value + 1, 0).getDate());
const firstDayOfMonth = computed(() => new Date(currentYear.value, currentMonth.value, 1).getDay());

const prevMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1);
};

const nextMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1);
};

const getEventsForDateStr = (dateStr) => events.filter((event) => event.date === dateStr);

const getEventsForDay = (day) => {
  const dateStr = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return getEventsForDateStr(dateStr);
};

const hasEvents = (day) => getEventsForDay(day).length > 0;

const isToday = (day) =>
  day === today.getDate() &&
  currentMonth.value === today.getMonth() &&
  currentYear.value === today.getFullYear();

const eventsToday = computed(() => {
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  return getEventsForDateStr(dateStr);
});

const eventDaysThisMonth = computed(() => {
  let count = 0;
  for (let day = 1; day <= daysInMonth.value; day += 1) {
    if (hasEvents(day)) count += 1;
  }
  return count;
});

const isModalOpen = ref(false);
const selectedDay = ref(null);
const selectedEvents = ref([]);

const openModal = (day) => {
  if (hasEvents(day) || isToday(day)) {
    selectedDay.value = day;
    selectedEvents.value = getEventsForDay(day);
    isModalOpen.value = true;
  }
};

const formattedSelectedDate = computed(() => {
  if (!selectedDay.value) return '';
  const date = new Date(currentYear.value, currentMonth.value, selectedDay.value);
  return date.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });
});

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="mb-6 grid gap-3 sm:grid-cols-[1.6fr_1fr]">
      <div class="rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400 dark:text-zinc-500">Today</p>
            <p class="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {{ eventsToday.length ? eventsToday.map((event) => event.title).join(', ') : 'No scheduled events' }}
            </p>
          </div>
          <div class="rounded-md bg-emerald-100 p-3 text-emerald-500 dark:bg-emerald-500/15 dark:text-emerald-300">
            <CalendarRange class="h-5 w-5" />
          </div>
        </div>
        <p class="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          {{ today.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' }) }}
        </p>
      </div>

      <div class="rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400 dark:text-zinc-500">This Month</p>
        <p class="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{{ eventDaysThisMonth }}</p>
        <p class="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Highlighted event days</p>
      </div>
    </div>

    <div class="mb-5 flex items-center justify-between gap-4">
      <div>
        <h3 class="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{{ monthName }}</h3>
        <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Select an event day to open the details modal.</p>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="prevMonth"
          class="flex h-11 w-11 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 text-zinc-600 transition-all duration-200 hover:border-emerald-300 hover:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-emerald-500/40 dark:hover:text-emerald-300"
          type="button"
          aria-label="Previous month"
        >
          <ChevronLeft class="h-5 w-5" />
        </button>
        <button
          @click="nextMonth"
          class="flex h-11 w-11 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 text-zinc-600 transition-all duration-200 hover:border-emerald-300 hover:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-emerald-500/40 dark:hover:text-emerald-300"
          type="button"
          aria-label="Next month"
        >
          <ChevronRight class="h-5 w-5" />
        </button>
      </div>
    </div>

    <div class="mb-3 grid grid-cols-7 gap-2">
      <div
        v-for="day in weekdays"
        :key="day"
        class="py-2 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400 dark:text-zinc-500"
      >
        {{ day }}
      </div>
    </div>

    <div class="grid flex-1 grid-cols-7 gap-2">
      <div
        v-for="empty in firstDayOfMonth"
        :key="`empty-${empty}`"
        class="aspect-square rounded-sm border border-dashed border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950"
      ></div>

      <button
        v-for="day in daysInMonth"
        :key="day"
        @click="openModal(day)"
        type="button"
        class="group relative aspect-square rounded-sm border text-left transition-all duration-200"
        :class="[
          hasEvents(day)
            ? 'border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600'
            : isToday(day)
              ? 'border-sky-500 bg-sky-500 text-white hover:bg-sky-600'
              : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:bg-zinc-900'
        ]"
      >
        <div class="flex h-full flex-col justify-between p-2.5 sm:p-3">
          <div class="flex items-start justify-between gap-2">
            <span
              class="text-sm font-semibold sm:text-base"
              :class="hasEvents(day) || isToday(day) ? 'text-white' : 'text-zinc-800 dark:text-zinc-200'"
            >
              {{ day }}
            </span>
            <span
              v-if="hasEvents(day)"
              class="h-2.5 w-2.5 rounded-full bg-white"
            ></span>
            <span
              v-else-if="isToday(day)"
              class="rounded-sm border border-white/40 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90"
            >
              Now
            </span>
          </div>

          <div class="flex items-end justify-between gap-2">
            <span
              v-if="hasEvents(day)"
              class="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80"
            >
              Event
            </span>
            <span
              v-else-if="isToday(day)"
              class="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80"
            >
              Today
            </span>
            <span
              v-else
              class="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:text-zinc-600"
            >
              Open
            </span>
          </div>
        </div>
      </button>
    </div>

    <Modal :isOpen="isModalOpen" :title="formattedSelectedDate" @close="isModalOpen = false">
      <div v-if="selectedEvents.length > 0" class="space-y-3">
        <div
          v-for="(event, index) in selectedEvents"
          :key="index"
          class="rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-start gap-3">
              <div class="mt-1 h-10 w-1.5 rounded-full bg-emerald-500"></div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400 dark:text-zinc-500">FOMC Event</p>
                <h4 class="mt-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">{{ event.title }}</h4>
              </div>
            </div>
            <div class="inline-flex items-center gap-2 rounded-sm border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              <Clock3 class="h-3.5 w-3.5 text-emerald-500" />
              <span>{{ event.time }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="rounded-md border border-dashed border-zinc-200 bg-zinc-50 px-5 py-10 text-center dark:border-zinc-800 dark:bg-zinc-950">
        <p class="text-base font-semibold text-zinc-800 dark:text-zinc-100">No events scheduled for this day.</p>
        <p class="mt-2 text-sm text-zinc-500 dark:text-zinc-400">This date is clear in the current macro calendar.</p>
      </div>
    </Modal>
  </div>
</template>
