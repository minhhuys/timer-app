<template>
  <div class="timer-app">
    <h1>Timer Application</h1>

    <div class="input-section">
      <label for="datetime-picker">Select Date and Time:</label>
      <DatePicker
        v-model="selectedDate"
        format="YYYY-MM-DD HH:mm:ss"
        :disabled-dates="isMonthDisabled"
        id="datetime-picker"
        :enable-time-picker="true"
        :minute-interval="1"
        :time-picker-options="{
          startTime: '00:00',
          endTime: '23:59',
          step: 1
        }"
        placeholder="Choose date"
        :input-class="'datepicker fancy-input'"
      />
    </div>

    <div class="multiselect-section">
      <label for="month-select" class="multiselect-label">Disable Months:</label>
      <div class="multiselect-container">
        <Multiselect
          v-model="disabledMonths"
          :options="monthOptions"
          multiple
          placeholder="Select months to disable"
          id="month-select"
          label="name"
          track-by="id"
          class="custom-multiselect"
        />
      </div>
    </div>

    <div class="button-section">
      <button @click="startTimer">Start Timer</button>
      <button @click="clearSelection">Clear Selection</button>
    </div>

    <div class="timer-display">
      <p v-if="selectedDate && !isDateInDisabledMonth">
        Time Elapsed: {{ formattedTime }} seconds
      </p>
      <p v-else-if="isDateInDisabledMonth" class="error-message">
        The selected date is in a disabled month. Please choose a valid date.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import DatePicker from 'vue3-datepicker';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.css';

export default defineComponent({
  components: {
    DatePicker,
    Multiselect,
  },
  setup() {
    const selectedDate = ref<Date | null>(null);
    const disabledMonths = ref<any[]>([]);
    const secondsElapsed = ref<number>(0);
    let intervalId: number | undefined = undefined;

    const monthOptions = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      name: new Date(0, i).toLocaleString('default', { month: 'long' }),
    }));

    const isMonthDisabled = (date: Date) => {
      return disabledMonths.value.some((month: any) => month.id === date.getMonth());
    };

    const isDateInDisabledMonth = computed(() => {
      if (!selectedDate.value) return false;
      return isMonthDisabled(selectedDate.value);
    });

    const startTimer = () => {
      if (intervalId) clearInterval(intervalId);

      if (selectedDate.value && !isDateInDisabledMonth.value) {
        const now = new Date();
        const timeDiff = Math.floor((now.getTime() - selectedDate.value.getTime()) / 1000);
        secondsElapsed.value = timeDiff > 0 ? timeDiff : 0;

        intervalId = setInterval(() => {
          secondsElapsed.value++;
        }, 1000);
      } else if (isDateInDisabledMonth.value) {
        alert("The selected date is in a disabled month. Please choose a valid date.");
        clearSelection();
      }
    };

    const clearSelection = () => {
      if (intervalId) clearInterval(intervalId);
      selectedDate.value = null;
      secondsElapsed.value = 0;
    };

    const formattedTime = computed(() => secondsElapsed.value);

    return {
      selectedDate,
      disabledMonths,
      monthOptions,
      isMonthDisabled,
      isDateInDisabledMonth,
      formattedTime,
      startTimer,
      clearSelection,
    };
  },
});
</script>

<style scoped>
/* Overall app styling */
.timer-app {
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: 'Arial', sans-serif;
}

h1 {
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
}

/* Input section styling */
.input-section, .multiselect-section {
  margin-bottom: 20px;
}

.input-section label, .multiselect-label {
  font-size: 18px;
  font-weight: 600;
  color: #444;
  display: block;
  margin-bottom: 12px;
}

/* Custom DatePicker Input */
.custom-datepicker-input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  background-color: #fafafa;
  color: #333;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.custom-datepicker-input:hover {
  border-color: #007bff;
}

.custom-datepicker-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
}

.custom-datepicker-input::placeholder {
  color: #aaa;
}

/* Button section styling */
.button-section {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.button-section button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.button-section button:hover {
  background-color: #0056b3;
}

.button-section button:active {
  transform: scale(0.98);
}

/* Timer display styling */
.timer-display {
  margin-top: 20px;
  font-size: 28px;
  font-weight: 700;
  color: #333;
}

.error-message {
  color: red;
  font-weight: 600;
}

/* Multiselect dropdown styling */
.custom-multiselect {
  width: inherit;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fafafa;
  font-size: 16px;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@media only screen and (max-width: 600px) {
  .button-section {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
