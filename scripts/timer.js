let timerInterval;
function startTimer(seconds, onEnd) {
  let remain = seconds;
  const timerDiv = document.getElementById('timer');
  timerDiv.textContent = formatTime(remain);
  timerInterval = setInterval(() => {
    remain--;
    timerDiv.textContent = formatTime(remain);
    if (remain <= 0) {
      clearInterval(timerInterval);
      onEnd();
    }
  }, 1000);
}
function formatTime(sec) {
  const m = String(Math.floor(sec/60)).padStart(2, '0');
  const s = String(sec%60).padStart(2, '0');
  return `${m}:${s}`;
}
function stopTimer() {
  clearInterval(timerInterval);
}
