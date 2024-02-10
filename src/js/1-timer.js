// Імпорт необхідних бібліотек та CSS
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Оголошення змінних
let userSelectedDate;
let timerInterval;

// Оголошення елементів DOM
const startButton = document.querySelector("[data-start]");
const dateTimePicker = document.getElementById("datetime-picker");
const daysDisplay = document.querySelector("[data-days]");
const hoursDisplay = document.querySelector("[data-hours]");
const minutesDisplay = document.querySelector("[data-minutes]");
const secondsDisplay = document.querySelector("[data-seconds]");

// Функція відображення часу таймера
function updateTimerDisplay(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);
  daysDisplay.textContent = addLeadingZero(days);
  hoursDisplay.textContent = addLeadingZero(hours);
  minutesDisplay.textContent = addLeadingZero(minutes);
  secondsDisplay.textContent = addLeadingZero(seconds);
}

// Функція оновлення стану кнопки та поля вибору дати після закриття вибору
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    if (userSelectedDate.getTime() > Date.now()) {
      startButton.disabled = false;
    } else {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight'
      });
      startButton.disabled = true;
    }
  },
};

// Ініціалізація flatpickr
flatpickr(dateTimePicker, options);

// Обробник події кліку на кнопку "Start"
startButton.addEventListener("click", () => {
  startButton.disabled = true;
  dateTimePicker.disabled = true;

  const endTime = userSelectedDate.getTime();
  
  // Відображення початкового таймеру
  updateTimerDisplay(endTime - Date.now());
  
  // Оновлення таймера кожної секунди
  timerInterval = setInterval(() => {
    const timeRemaining = endTime - Date.now();
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      updateTimerDisplay(0); // Оновлення таймера, якщо час вичерпаний
      startButton.disabled = true;
      dateTimePicker.disabled = false;
    } else {
      updateTimerDisplay(timeRemaining);
    }
  }, 1000);
});

// Функція форматування числа з переднім нулем, якщо число менше 10
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

// Функція конвертації мілісекунд у формат дні:години:хвилини:секунди
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
