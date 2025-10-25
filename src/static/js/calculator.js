/**
 * Sleep Calculator
 * Calculates optimal bedtime and wake times based on 90-minute sleep cycles
 */

// Constants
const CYCLE_LENGTH_MINUTES = 90;
const FALL_ASLEEP_MINUTES = 14;
const NUM_RESULTS = 6;
const RECOMMENDED_CYCLES = [4, 5, 6]; // 6-9 hours of sleep

// State
let currentMode = 'wake'; // 'wake' or 'sleep'
let demoTime = null; // For demo screenshots, use format HH:MM (24-hour)

/**
 * Get current time (or demo time if set)
 */
function getCurrentTime() {
    if (demoTime) {
        const [hours, minutes] = demoTime.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    }
    return new Date();
}

/**
 * Format time as HH:MM AM/PM
 */
function formatTime(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12

    const minutesStr = minutes < 10 ? '0' + minutes : minutes;

    return `${hours}:${minutesStr} ${ampm}`;
}

/**
 * Format time for display with optional cycle count
 */
function formatTimeCard(date, cycleNum) {
    const time = formatTime(date);
    const cycles = cycleNum + 1;
    const hours = (cycles * CYCLE_LENGTH_MINUTES) / 60;

    return {
        time,
        cycles,
        hours: hours.toFixed(1),
        isRecommended: RECOMMENDED_CYCLES.includes(cycles)
    };
}

/**
 * Calculate bedtimes based on wake time
 */
function calculateBedtimes(wakeTimeStr) {
    const [hours, minutes] = wakeTimeStr.split(':').map(Number);
    const wakeTime = new Date();
    wakeTime.setHours(hours, minutes, 0, 0);

    const results = [];

    for (let i = 0; i < NUM_RESULTS; i++) {
        const sleepTime = new Date(wakeTime.getTime() -
            ((i + 1) * CYCLE_LENGTH_MINUTES + FALL_ASLEEP_MINUTES) * 60000);
        results.push(formatTimeCard(sleepTime, i));
    }

    return results.reverse();
}

/**
 * Calculate wake times based on current time (sleeping now)
 */
function calculateWakeTimes() {
    const now = getCurrentTime();
    const sleepTime = new Date(now.getTime() + FALL_ASLEEP_MINUTES * 60000);

    const results = [];

    for (let i = 0; i < NUM_RESULTS; i++) {
        const wakeTime = new Date(sleepTime.getTime() +
            (i + 1) * CYCLE_LENGTH_MINUTES * 60000);
        results.push(formatTimeCard(wakeTime, i));
    }

    return results;
}

/**
 * Render time rows to the table
 */
function renderResults(results) {
    const tbody = document.getElementById('results-body');
    tbody.innerHTML = '';

    results.forEach(result => {
        const row = document.createElement('tr');
        row.className = 'fade-in';

        row.innerHTML = `
            <td>${result.hours} hours (${result.cycles} cycle${result.cycles !== 1 ? 's' : ''})</td>
            <td class="${result.isRecommended ? 'recommended' : ''}">${result.time}</td>
        `;

        tbody.appendChild(row);
    });
}

/**
 * Update the calculator based on current mode
 */
function updateCalculator() {
    if (currentMode === 'wake') {
        const wakeTime = document.getElementById('wake-time').value;
        const results = calculateBedtimes(wakeTime);
        renderResults(results);
        document.getElementById('results-heading').textContent = 'Recommended bedtimes';
    } else {
        const results = calculateWakeTimes();
        renderResults(results);
        document.getElementById('results-heading').textContent = 'Recommended wake times';
        updateCurrentTime();
    }
}

/**
 * Update current time display
 */
function updateCurrentTime() {
    const now = getCurrentTime();
    document.getElementById('current-time').textContent = formatTime(now);
}

/**
 * Toggle between wake and sleep modes
 */
function toggleMode() {
    const toggle = document.getElementById('mode-toggle');
    const wakeMode = document.getElementById('wake-mode');
    const sleepMode = document.getElementById('sleep-mode');
    const wakeLabel = document.getElementById('wake-label');
    const sleepLabel = document.getElementById('sleep-label');

    if (toggle.checked) {
        // Switch to sleep mode
        currentMode = 'sleep';
        wakeMode.classList.add('hidden');
        sleepMode.classList.remove('hidden');
        wakeLabel.classList.add('text-braun-text-dim');
        wakeLabel.classList.remove('text-braun-text');
        sleepLabel.classList.remove('text-braun-text-dim');
        sleepLabel.classList.add('text-braun-text');
    } else {
        // Switch to wake mode
        currentMode = 'wake';
        wakeMode.classList.remove('hidden');
        sleepMode.classList.add('hidden');
        wakeLabel.classList.remove('text-braun-text-dim');
        wakeLabel.classList.add('text-braun-text');
        sleepLabel.classList.add('text-braun-text-dim');
        sleepLabel.classList.remove('text-braun-text');
    }

    updateCalculator();
}

/**
 * Initialize the calculator
 */
function init() {
    // Check for demoTime URL parameter
    const params = new URLSearchParams(window.location.search);
    if (params.has('demoTime')) {
        demoTime = params.get('demoTime');
    }

    const toggle = document.getElementById('mode-toggle');
    const wakeTimeInput = document.getElementById('wake-time');

    // Set default wake time to 7:00 AM
    const now = new Date();
    const defaultWakeTime = '07:00';
    wakeTimeInput.value = defaultWakeTime;

    // Event listeners
    toggle.addEventListener('change', toggleMode);
    wakeTimeInput.addEventListener('change', updateCalculator);

    // Update current time every second when in sleep mode
    setInterval(() => {
        if (currentMode === 'sleep') {
            updateCurrentTime();
            updateCalculator();
        }
    }, 30000);

    // Initial calculation
    updateCalculator();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
