document.addEventListener('DOMContentLoaded', () => {
    loadJournalEntries();
});

function saveJournalEntry() {
    const stressLevel = document.getElementById('stressLevel');
    const happyLevel = document.getElementById('happyLevel');
    const exercise = document.getElementById('exercise');
    const reflection = document.getElementById('reflection');
    let isValid = true;

    [stressLevel, happyLevel, reflection].forEach(input => {
        if (!input.value) {
            input.style.border = '2px solid red';
            isValid = false;
        } else {
            input.style.border = '1px solid #ccc';
        }
    });

    if (!isValid) {
        return;
    }

    const journalEntry = {
        date: new Date().toLocaleDateString(),
        stressLevel: parseInt(stressLevel.value),
        happyLevel: parseInt(happyLevel.value),
        exercise: exercise.value,
        reflection: reflection.value
    };

    let journalEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    journalEntries.push(journalEntry);
    localStorage.setItem('journalEntries', JSON.stringify(journalEntries));

    alert('Journal entry saved successfully!');
    document.getElementById('journalForm').reset();
}


function loadJournalEntries() {
    const journalEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    console.log('Loaded journal entries:', journalEntries);
}

// Function to calculate and display statistics
function calculateStatistics() {
    const journalEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    if (journalEntries.length === 0) {
        document.getElementById('statistics').innerText = 'No journaling data available.';
        return;
    }

    let totalStress = 0;
    let totalHappy = 0;
    let exerciseCount = 0;

    journalEntries.forEach(entry => {
        totalStress += entry.stressLevel;
        totalHappy += entry.happyLevel;
        if (entry.exercise === 'yes') {
            exerciseCount++;
        }
    });

    const averageStress = (totalStress / journalEntries.length).toFixed(2);
    const averageHappy = (totalHappy / journalEntries.length).toFixed(2);
    const exercisePercentage = ((exerciseCount / journalEntries.length) * 100).toFixed(2);

    const statsText = `
        Average Stress Level: ${averageStress}
        Average Happiness Level: ${averageHappy}
        Percentage of Days Exercised: ${exercisePercentage}%
    `;

    document.getElementById('statistics').innerText = statsText;
}
