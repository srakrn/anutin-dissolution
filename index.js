async function fetchData() {
  try {
    const raw = await fetch('/data.json')
    const response = await raw.json()
    return {
      targetDate: new Date(response.targetDate),
      dissolDate: response.dissolDate ? new Date(response.dissolDate) : null
    }
  } catch (error) {
    console.error('Error fetching dissolution date:', error);
    return {
      targetDate: '2026-01-31T23:59:59.999+07:00',
      dissolDate: null
    }
  }
}

function padNumber(num, size) {
  if (typeof num === "number")
    return Math.max(0, num).toFixed(0).padStart(size, '0');
  else
    return padNumber(0, size);
}

function calCountdown(diff) {
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

function updateCountdown({ days, hours, minutes, seconds }) {
  document.getElementById('days').textContent = padNumber(days, 3);
  document.getElementById('hours').textContent = padNumber(hours, 2);
  document.getElementById('minutes').textContent = padNumber(minutes, 2);
  document.getElementById('seconds').textContent = padNumber(seconds, 2);
}

function showBanner() {
  const banner = document.getElementById('diagonal-banner');
  banner.style.display = 'block';
}

function render({ targetDate, dissolDate }) {
  const now = dissolDate ? dissolDate : new Date();
  const diff = targetDate - now;

  const countdown = calCountdown(diff);
  updateCountdown(countdown);

  console.log("rendering", countdown, Date.now())
}

async function main() {
  const data = await fetchData();

  if (data.dissolDate === null) {
    render(data);
    setInterval(() => render(data), 1000);
    return;
  }

  updateCountdown(calCountdown(0));
  showBanner()
}

void main()
