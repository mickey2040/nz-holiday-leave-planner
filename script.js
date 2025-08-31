// Main application logic
let currentYear = 2025;
let currentRegion = 'wellington';

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Set up event listeners
    document.getElementById('year').addEventListener('change', handleYearChange);
    document.getElementById('region').addEventListener('change', handleRegionChange);
    document.getElementById('exportCalendar').addEventListener('click', exportToCalendar);
    
    // Initial render
    updateDisplay();
});

function handleYearChange(e) {
    currentYear = parseInt(e.target.value);
    updateDisplay();
}

function handleRegionChange(e) {
    currentRegion = e.target.value;
    updateDisplay();
}

function updateDisplay() {
    updateStats();
    renderCalendar();
    renderOpportunities();
    renderHolidaysList();
}

function updateStats() {
    const holidays = [...holidaysData[currentYear].national];
    if (holidaysData[currentYear].regional[currentRegion]) {
        holidays.push(holidaysData[currentYear].regional[currentRegion]);
    }
    
    // Count public holidays
    document.getElementById('publicHolidayCount').textContent = holidays.length;
    
    // Count long weekends (Friday or Monday holidays)
    const longWeekends = holidays.filter(h => {
        const day = new Date(h.observed).getDay();
        return day === 1 || day === 5;
    }).length;
    document.getElementById('longWeekendCount').textContent = longWeekends;
    
    // Calculate best leave ratio
    const opportunities = calculateOpportunities(currentYear, currentRegion);
    if (opportunities.length > 0) {
        const bestRatio = opportunities.reduce((best, opp) => {
            const ratio = opp.totalDays / opp.leaveDays;
            return ratio > best.ratio ? { ratio, opp } : best;
        }, { ratio: 0, opp: null });
        
        if (bestRatio.opp) {
            document.getElementById('bestLeaveRatio').textContent = 
                `${bestRatio.opp.totalDays} for ${bestRatio.opp.leaveDays}`;
        }
    }
}

function renderCalendar() {
    const calendarEl = document.getElementById('calendar');
    calendarEl.innerHTML = '';
    
    const holidays = [...holidaysData[currentYear].national];
    if (holidaysData[currentYear].regional[currentRegion]) {
        holidays.push(holidaysData[currentYear].regional[currentRegion]);
    }
    
    const holidayDates = new Set(holidays.map(h => h.observed));
    
    // Render each month
    for (let month = 0; month < 12; month++) {
        const monthEl = createMonthElement(currentYear, month, holidayDates);
        calendarEl.appendChild(monthEl);
    }
}

function createMonthElement(year, month, holidayDates) {
    const monthEl = document.createElement('div');
    monthEl.className = 'month';
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Month header
    const headerEl = document.createElement('div');
    headerEl.className = 'month-header';
    headerEl.textContent = monthNames[month];
    monthEl.appendChild(headerEl);
    
    // Weekday headers
    const weekdaysEl = document.createElement('div');
    weekdaysEl.className = 'weekdays';
    ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(day => {
        const dayEl = document.createElement('div');
        dayEl.className = 'weekday';
        dayEl.textContent = day;
        weekdaysEl.appendChild(dayEl);
    });
    monthEl.appendChild(weekdaysEl);
    
    // Days grid
    const daysEl = document.createElement('div');
    daysEl.className = 'days-grid';
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        const emptyEl = document.createElement('div');
        emptyEl.className = 'day empty';
        daysEl.appendChild(emptyEl);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateStr = formatDateISO(date);
        const dayOfWeek = date.getDay();
        
        const dayEl = document.createElement('div');
        dayEl.className = 'day';
        dayEl.textContent = day;
        
        // Add classes for styling
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            dayEl.classList.add('weekend');
        }
        
        if (holidayDates.has(dateStr)) {
            dayEl.classList.add('holiday');
            const holiday = [...holidaysData[year].national, 
                           holidaysData[year].regional[currentRegion]]
                           .find(h => h && h.observed === dateStr);
            if (holiday) {
                dayEl.title = holiday.name;
            }
        }
        
        daysEl.appendChild(dayEl);
    }
    
    monthEl.appendChild(daysEl);
    return monthEl;
}

function renderOpportunities() {
    const opportunitiesEl = document.getElementById('opportunities');
    const opportunities = calculateOpportunities(currentYear, currentRegion);
    
    opportunitiesEl.innerHTML = '';
    
    if (opportunities.length === 0) {
        opportunitiesEl.innerHTML = '<p>No optimization opportunities found for this year and region.</p>';
        return;
    }
    
    // Sort by efficiency (total days / leave days)
    opportunities.sort((a, b) => (b.totalDays / b.leaveDays) - (a.totalDays / a.leaveDays));
    
    opportunities.forEach(opp => {
        const card = document.createElement('div');
        card.className = 'opportunity-card';
        
        const header = document.createElement('div');
        header.className = 'opportunity-header';
        
        const title = document.createElement('div');
        title.className = 'opportunity-title';
        title.textContent = opp.period;
        
        const badge = document.createElement('div');
        badge.className = 'opportunity-badge';
        const efficiency = (opp.totalDays / opp.leaveDays).toFixed(1);
        badge.textContent = `${efficiency}x efficiency`;
        
        header.appendChild(title);
        header.appendChild(badge);
        
        const details = document.createElement('div');
        details.className = 'opportunity-details';
        details.innerHTML = `
            <strong>📅 Period:</strong> ${opp.dates}<br>
            <strong>🎯 Strategy:</strong> ${opp.description}<br>
            <strong>📊 Result:</strong> Use ${opp.leaveDays} leave day${opp.leaveDays > 1 ? 's' : ''} 
            to get ${opp.totalDays} consecutive days off
        `;
        
        card.appendChild(header);
        card.appendChild(details);
        opportunitiesEl.appendChild(card);
    });
}

function renderHolidaysList() {
    const listEl = document.getElementById('holidaysList');
    listEl.innerHTML = '';
    
    const holidays = [...holidaysData[currentYear].national];
    const regionalHoliday = holidaysData[currentYear].regional[currentRegion];
    
    // Combine and sort all holidays
    const allHolidays = holidays.map(h => ({ ...h, type: 'national' }));
    if (regionalHoliday) {
        allHolidays.push({ ...regionalHoliday, type: 'regional' });
    }
    
    allHolidays.sort((a, b) => new Date(a.observed) - new Date(b.observed));
    
    allHolidays.forEach(holiday => {
        const item = document.createElement('div');
        item.className = 'holiday-item';
        
        const nameEl = document.createElement('div');
        nameEl.className = 'holiday-name';
        nameEl.textContent = holiday.name;
        
        const dateEl = document.createElement('div');
        dateEl.className = 'holiday-date';
        const date = new Date(holiday.observed);
        const dayName = date.toLocaleDateString('en-NZ', { weekday: 'long' });
        dateEl.textContent = `${dayName}, ${date.toLocaleDateString('en-NZ', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        })}`;
        
        const typeEl = document.createElement('div');
        typeEl.className = `holiday-type ${holiday.type}`;
        typeEl.textContent = holiday.type;
        
        item.appendChild(nameEl);
        item.appendChild(dateEl);
        item.appendChild(typeEl);
        listEl.appendChild(item);
    });
}

function exportToCalendar() {
    const holidays = [...holidaysData[currentYear].national];
    if (holidaysData[currentYear].regional[currentRegion]) {
        holidays.push(holidaysData[currentYear].regional[currentRegion]);
    }
    
    let icsContent = 'BEGIN:VCALENDAR\n';
    icsContent += 'VERSION:2.0\n';
    icsContent += 'PRODID:-//NZ Holiday Planner//EN\n';
    icsContent += 'CALSCALE:GREGORIAN\n';
    
    holidays.forEach(holiday => {
        const date = new Date(holiday.observed);
        const dateStr = formatDateICS(date);
        
        icsContent += 'BEGIN:VEVENT\n';
        icsContent += `SUMMARY:${holiday.name} (NZ Public Holiday)\n`;
        icsContent += `DTSTART;VALUE=DATE:${dateStr}\n`;
        icsContent += `DTEND;VALUE=DATE:${dateStr}\n`;
        icsContent += 'STATUS:CONFIRMED\n';
        icsContent += 'END:VEVENT\n';
    });
    
    icsContent += 'END:VCALENDAR';
    
    // Create download link
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nz-holidays-${currentYear}.ics`;
    link.click();
    URL.revokeObjectURL(url);
}

// Utility functions
function formatDateISO(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDateICS(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}