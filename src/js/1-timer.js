import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const datetimePicker = document.getElementById("datetime-picker");
const startButton = document.querySelector("[data-start]");
let userSelectedDate = null;

window.onload = () => {
  startButton.disabled = true;
  document.querySelector("[data-days]").setAttribute("id", "days");
  document.querySelector("[data-hours]").setAttribute("id", "hours");
  document.querySelector("[data-minutes]").setAttribute("id", "minutes");
  document.querySelector("[data-seconds]").setAttribute("id", "seconds");
};

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
        position: 'topRight',
        timeout: 5000,
        closeOnClick: true,
      });
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
};

flatpickr(datetimePicker, options);

function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

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
      position: 'topRight',
      timeout: 5000,
      closeOnClick: true,
    });
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(timeLeft);

  document.getElementById("days").textContent = addLeadingZero(days);
  document.getElementById("hours").textContent = addLeadingZero(hours);
  document.getElementById("minutes").textContent = addLeadingZero(minutes);
  document.getElementById("seconds").textContent = addLeadingZero(seconds);
}

let timerInterval;
startButton.addEventListener("click", () => {
  if (!userSelectedDate || userSelectedDate < new Date()) return;

  startButton.disabled = true;
  datetimePicker.disabled = true;

  timerInterval = setInterval(updateTimer, 1000);
});
