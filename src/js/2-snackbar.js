import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

document.addEventListener("DOMContentLoaded", function () {
const form = document.querySelector(".form");

form.addEventListener("submit", function (event) {
    event.preventDefault();
    const delayInput = document.querySelector('input[name="delay"]');
    const delay = parseInt(delayInput.value);

    const stateRadios = document.querySelectorAll('input[name="state"]');
    let state;
    for (const radio of stateRadios) {
    if (radio.checked) {
        state = radio.value;
        break;
    }
    }

    const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        if (state === "fulfilled") {
        resolve(delay);
        } else if (state === "rejected") {
        reject(delay);
        }
    }, delay);
    });

    promise.then(
      (delay) => {
        iziToast.success({
          title: "Success",
          message: `✅ Fulfilled promise in ${delay}ms`,
        });
      },
      (delay) => {
        iziToast.error({
          title: "Error",
          message: `❌ Rejected promise in ${delay}ms`,
        });
      }
    );
  });
});
