document.addEventListener('DOMContentLoaded', () => {
    calculateStatistics();
    setTimeout(drawCharts, 500); // Delay to ensure charts are drawn correctly
});

function calculateStatistics() {
    const journalEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    if (journalEntries.length === 0) {
        document.getElementById('statistics').innerText = 'No journaling data available.';
        return;
    }

    let totalStress = 0;
    let totalHappy = 0;
    let exerciseCount = 0;
    let daysJournaled = journalEntries.length;
    let streak = 1;
    let maxStreak = 1;
    let daysOfWeek = { Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0 };
    let previousDate = new Date(journalEntries[0].date);
    let stressWithExercise = 0;
    let happyWithExercise = 0;
    let exerciseDays = 0;

    journalEntries.forEach((entry, index) => {
        totalStress += entry.stressLevel;
        totalHappy += entry.happyLevel;
        daysOfWeek[new Date(entry.date).toLocaleString('en-US', { weekday: 'long' })]++;
        if (entry.exercise === 'yes') {
            exerciseCount++;
            stressWithExercise += entry.stressLevel;
            happyWithExercise += entry.happyLevel;
            exerciseDays++;
        }
        
        if (index > 0) {
            const currentDate = new Date(entry.date);
            const timeDiff = currentDate - previousDate;
            if (timeDiff === 86400000) { // 1 day in milliseconds
                streak++;
                maxStreak = Math.max(maxStreak, streak);
            } else {
                streak = 1;
            }
            previousDate = currentDate;
        }
    });

    const averageStress = (totalStress / journalEntries.length).toFixed(2);
    const averageHappy = (totalHappy / journalEntries.length).toFixed(2);
    const exercisePercentage = ((exerciseCount / journalEntries.length) * 100).toFixed(2);
    const averageStressWithExercise = exerciseDays > 0 ? (stressWithExercise / exerciseDays).toFixed(2) : 'N/A';
    const averageHappyWithExercise = exerciseDays > 0 ? (happyWithExercise / exerciseDays).toFixed(2) : 'N/A';
    const mostJournaledDay = Object.keys(daysOfWeek).reduce((a, b) => daysOfWeek[a] > daysOfWeek[b] ? a : b);

    const statsText = `
        <p>Days Journaled in Total: ${daysJournaled}</p>
        <p>Journaling Streak (Days in a Row): ${maxStreak}</p>
        <p>Day of Week with Most Journal Entries: ${mostJournaledDay}</p>
        <p>Average Stress Level: ${averageStress}</p>
        <p>Average Happiness Level: ${averageHappy}</p>
        <p>Percentage of Days Exercised: ${exercisePercentage}%</p>
        <p>Average Stress Level on Days with Exercise: ${averageStressWithExercise}</p>
        <p>Average Happiness Level on Days with Exercise: ${averageHappyWithExercise}</p>
    `;

    document.getElementById('statistics').innerHTML = statsText;
}

function drawCharts() {
    const journalEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    if (journalEntries.length === 0) {
        return;
    }

    const ctxStress = document.getElementById('stressChart').getContext('2d');
    const ctxHappy = document.getElementById('happyChart').getContext('2d');
    const ctxExercise = document.getElementById('exerciseChart').getContext('2d');
    let labels = [];
    let stressLevels = [];
    let happyLevels = [];
    let exerciseData = [];

    journalEntries.forEach(entry => {
        labels.push(entry.date);
        stressLevels.push(entry.stressLevel);
        happyLevels.push(entry.happyLevel);
        exerciseData.push(entry.exercise === 'yes' ? 1 : 0);
    });

    new Chart(ctxStress, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Stress Level Over Time',
                data: stressLevels,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5
                }
            }
        }
    });

    new Chart(ctxHappy, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Happiness Level Over Time',
                data: happyLevels,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5
                }
            }
        }
    });

    new Chart(ctxExercise, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Exercise Days Over Time',
                data: exerciseData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1
                }
            }
        }
    });
}
