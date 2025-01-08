import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const datetimePicker = document.getElementById("datetime-picker");
const startButton = document.querySelector("[data-start]");
let userSelectedDate = null;

// Деактивація кнопки при першому завантаженні
window.onload = () => {
  startButton.disabled = true;

  // Додаємо ідентифікатори до елементів із data-атрибутами
  document.querySelector("[data-days]").setAttribute("id", "days");
  document.querySelector("[data-hours]").setAttribute("id", "hours");
  document.querySelector("[data-minutes]").setAttribute("id", "minutes");
  document.querySelector("[data-seconds]").setAttribute("id", "seconds");
};

// Ініціалізація flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    if (userSelectedDate && userSelectedDate < new Date()) {
      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future",
      });
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
};

flatpickr(datetimePicker, options);

// Додавання ведучого нуля
function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

// Конвертація мілісекунд у дні, години, хвилини, секунди
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

// Оновлення таймера
function updateTimer() {
  const now = new Date();
  const timeLeft = userSelectedDate - now;

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    document.getElementById("days").textContent = "00";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
    startButton.disabled = false;
    datetimePicker.disabled = false;
    iziToast.success({
      title: "Success",
      message: "The timer has finished!",
    });
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(timeLeft);

  document.getElementById("days").textContent = addLeadingZero(days);
  document.getElementById("hours").textContent = addLeadingZero(hours);
  document.getElementById("minutes").textContent = addLeadingZero(minutes);
  document.getElementById("seconds").textContent = addLeadingZero(seconds);
}

// Запуск таймера
let timerInterval;
startButton.addEventListener("click", () => {
  if (!userSelectedDate || userSelectedDate < new Date()) return;

  startButton.disabled = true;
  datetimePicker.disabled = true;

  timerInterval = setInterval(updateTimer, 1000);
});
