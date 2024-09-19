import { mount } from '@vue/test-utils';
import Timer from '@/components/Timer.vue';
import { nextTick } from 'vue';

// Mocking DatePicker component and Multiselect
jest.mock('vue3-datepicker', () => ({
  __esModule: true,
  default: {
    name: 'DatePicker',
    template: '<input />',
  },
}));

jest.mock('vue-multiselect', () => ({
  __esModule: true,
  default: {
    name: 'Multiselect',
    template: '<select multiple></select>',
  },
}));

describe('Timer.vue', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(Timer);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders the timer app correctly', () => {
    expect(wrapper.find('h1').text()).toBe('Timer Application');
    expect(wrapper.find('.input-section label').text()).toBe('Select Date and Time:');
    expect(wrapper.find('.multiselect-label').text()).toBe('Disable Months:');
    expect(wrapper.find('.button-section button').exists()).toBe(true);
  });

  it('allows selecting a date and starts the timer', async () => {
    const testDate = new Date();
    wrapper.vm.selectedDate = testDate; // Manually setting the selectedDate value for test

    wrapper.find('button').trigger('click');
    await nextTick();

    // Check if the timer has started
    expect(wrapper.vm.secondsElapsed).toBeGreaterThan(0);
  });

  it('resets the timer when clear selection is clicked', async () => {
    const testDate = new Date();
    wrapper.vm.selectedDate = testDate; // Manually setting the selectedDate value for test

    wrapper.find('button').trigger('click');
    await nextTick();

    expect(wrapper.vm.secondsElapsed).toBeGreaterThan(0);

    wrapper.find('.button-section button:nth-child(2)').trigger('click'); // Clear Selection button

    await nextTick();

    expect(wrapper.vm.secondsElapsed).toBe(0);
    expect(wrapper.vm.selectedDate).toBeNull();
  });

  it('disables months correctly', async () => {
    const disabledMonth = { id: 0, name: 'January' }; // Disabling January for test

    wrapper.vm.disabledMonths = [disabledMonth]; // Manually setting disabledMonths

    const testDate = new Date();
    testDate.setMonth(0); // Setting the date to January

    wrapper.vm.selectedDate = testDate;
    await nextTick();

    wrapper.find('button').trigger('click');
    await nextTick();

    // Timer should not start as January is disabled
    expect(wrapper.vm.secondsElapsed).toBe(0);
  });

  it('displays an error message if the selected date is in a disabled month', async () => {
    const disabledMonth = { id: 0, name: 'January' };

    wrapper.vm.disabledMonths = [disabledMonth];

    const testDate = new Date();
    testDate.setMonth(0);

    wrapper.vm.selectedDate = testDate;
    await nextTick();

    wrapper.find('button').trigger('click');
    await nextTick();

    const errorMessage = wrapper.find('.error-message').text();
    expect(errorMessage).toBe('The selected date is in a disabled month. Please choose a valid date.');
  });
});
