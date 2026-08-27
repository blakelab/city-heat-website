const dateInput = document.getElementById('event-date');

dateInput.min = new Date().toISOString().split('T')[0];
