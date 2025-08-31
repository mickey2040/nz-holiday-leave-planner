// New Zealand Public Holidays Data
const holidaysData = {
    2025: {
        national: [
            { name: "New Year's Day", date: "2025-01-01", observed: "2025-01-01" },
            { name: "Day after New Year's Day", date: "2025-01-02", observed: "2025-01-02" },
            { name: "Waitangi Day", date: "2025-02-06", observed: "2025-02-06" },
            { name: "Good Friday", date: "2025-04-18", observed: "2025-04-18" },
            { name: "Easter Monday", date: "2025-04-21", observed: "2025-04-21" },
            { name: "ANZAC Day", date: "2025-04-25", observed: "2025-04-25" },
            { name: "Queen's Birthday", date: "2025-06-02", observed: "2025-06-02" },
            { name: "Matariki", date: "2025-06-20", observed: "2025-06-20" },
            { name: "Labour Day", date: "2025-10-27", observed: "2025-10-27" },
            { name: "Christmas Day", date: "2025-12-25", observed: "2025-12-25" },
            { name: "Boxing Day", date: "2025-12-26", observed: "2025-12-26" }
        ],
        regional: {
            "northland": { name: "Northland Anniversary", date: "2025-01-27", observed: "2025-01-27" },
            "auckland": { name: "Auckland Anniversary", date: "2025-01-27", observed: "2025-01-27" },
            "bay-of-plenty": { name: "Auckland Anniversary", date: "2025-01-27", observed: "2025-01-27" },
            "waikato": { name: "Auckland Anniversary", date: "2025-01-27", observed: "2025-01-27" },
            "gisborne": { name: "Auckland Anniversary", date: "2025-01-27", observed: "2025-01-27" },
            "taranaki": { name: "Taranaki Anniversary", date: "2025-03-10", observed: "2025-03-10" },
            "hawkes-bay": { name: "Hawke's Bay Anniversary", date: "2025-10-24", observed: "2025-10-24" },
            "manawatu-wanganui": { name: "Wellington Anniversary", date: "2025-01-20", observed: "2025-01-20" },
            "wellington": { name: "Wellington Anniversary", date: "2025-01-20", observed: "2025-01-20" },
            "marlborough": { name: "Marlborough Anniversary", date: "2025-11-03", observed: "2025-11-03" },
            "nelson": { name: "Nelson Anniversary", date: "2025-02-03", observed: "2025-02-03" },
            "west-coast": { name: "West Coast Anniversary", date: "2025-12-01", observed: "2025-12-01" },
            "canterbury": { name: "Canterbury Anniversary", date: "2025-11-14", observed: "2025-11-14" },
            "otago": { name: "Otago Anniversary", date: "2025-03-24", observed: "2025-03-24" },
            "southland": { name: "Southland Anniversary", date: "2025-01-20", observed: "2025-01-20" }
        }
    },
    2026: {
        national: [
            { name: "New Year's Day", date: "2026-01-01", observed: "2026-01-01" },
            { name: "Day after New Year's Day", date: "2026-01-02", observed: "2026-01-02" },
            { name: "Waitangi Day", date: "2026-02-06", observed: "2026-02-06" },
            { name: "Good Friday", date: "2026-04-03", observed: "2026-04-03" },
            { name: "Easter Monday", date: "2026-04-06", observed: "2026-04-06" },
            { name: "ANZAC Day", date: "2026-04-25", observed: "2026-04-27" }, // Falls on Saturday, observed Monday
            { name: "Queen's Birthday", date: "2026-06-01", observed: "2026-06-01" },
            { name: "Matariki", date: "2026-07-10", observed: "2026-07-10" },
            { name: "Labour Day", date: "2026-10-26", observed: "2026-10-26" },
            { name: "Christmas Day", date: "2026-12-25", observed: "2026-12-25" },
            { name: "Boxing Day", date: "2026-12-26", observed: "2026-12-28" } // Falls on Saturday, observed Monday
        ],
        regional: {
            "northland": { name: "Northland Anniversary", date: "2026-01-26", observed: "2026-01-26" },
            "auckland": { name: "Auckland Anniversary", date: "2026-01-26", observed: "2026-01-26" },
            "bay-of-plenty": { name: "Auckland Anniversary", date: "2026-01-26", observed: "2026-01-26" },
            "waikato": { name: "Auckland Anniversary", date: "2026-01-26", observed: "2026-01-26" },
            "gisborne": { name: "Auckland Anniversary", date: "2026-01-26", observed: "2026-01-26" },
            "taranaki": { name: "Taranaki Anniversary", date: "2026-03-09", observed: "2026-03-09" },
            "hawkes-bay": { name: "Hawke's Bay Anniversary", date: "2026-10-23", observed: "2026-10-23" },
            "manawatu-wanganui": { name: "Wellington Anniversary", date: "2026-01-19", observed: "2026-01-19" },
            "wellington": { name: "Wellington Anniversary", date: "2026-01-19", observed: "2026-01-19" },
            "marlborough": { name: "Marlborough Anniversary", date: "2026-11-02", observed: "2026-11-02" },
            "nelson": { name: "Nelson Anniversary", date: "2026-02-02", observed: "2026-02-02" },
            "west-coast": { name: "West Coast Anniversary", date: "2026-11-30", observed: "2026-11-30" },
            "canterbury": { name: "Canterbury Anniversary", date: "2026-11-13", observed: "2026-11-13" },
            "otago": { name: "Otago Anniversary", date: "2026-03-23", observed: "2026-03-23" },
            "southland": { name: "Southland Anniversary", date: "2026-01-19", observed: "2026-01-19" }
        }
    }
};

// Leave optimization opportunities
function calculateOpportunities(year, region) {
    const opportunities = [];
    const holidays = [...holidaysData[year].national];
    
    if (holidaysData[year].regional[region]) {
        holidays.push(holidaysData[year].regional[region]);
    }
    
    // Sort holidays by date
    holidays.sort((a, b) => new Date(a.observed) - new Date(b.observed));
    
    // Check for long weekend opportunities
    holidays.forEach(holiday => {
        const date = new Date(holiday.observed);
        const dayOfWeek = date.getDay();
        
        // Thursday or Tuesday holidays
        if (dayOfWeek === 4) { // Thursday
            opportunities.push({
                period: holiday.name,
                dates: `${formatDate(date)} - ${formatDate(addDays(date, 3))}`,
                leaveDays: 1,
                totalDays: 4,
                leaveDate: formatDate(addDays(date, 1)),
                description: `Take Friday off for a 4-day weekend`
            });
        } else if (dayOfWeek === 2) { // Tuesday
            opportunities.push({
                period: holiday.name,
                dates: `${formatDate(addDays(date, -3))} - ${formatDate(date)}`,
                leaveDays: 1,
                totalDays: 4,
                leaveDate: formatDate(addDays(date, -1)),
                description: `Take Monday off for a 4-day weekend`
            });
        }
    });
    
    // Check for holiday clusters (holidays within 5 days of each other)
    for (let i = 0; i < holidays.length - 1; i++) {
        const current = new Date(holidays[i].observed);
        const next = new Date(holidays[i + 1].observed);
        const daysBetween = Math.floor((next - current) / (1000 * 60 * 60 * 24));
        
        if (daysBetween > 1 && daysBetween <= 5) {
            const workDaysBetween = calculateWorkDays(current, next);
            if (workDaysBetween > 0 && workDaysBetween <= 3) {
                opportunities.push({
                    period: `${holidays[i].name} to ${holidays[i + 1].name}`,
                    dates: `${formatDate(current)} - ${formatDate(next)}`,
                    leaveDays: workDaysBetween,
                    totalDays: daysBetween + 1,
                    description: `Bridge ${workDaysBetween} day${workDaysBetween > 1 ? 's' : ''} between holidays for ${daysBetween + 1} consecutive days off`
                });
            }
        }
    }
    
    // Special Christmas/New Year opportunity
    if (year === 2025) {
        opportunities.push({
            period: "Christmas to New Year",
            dates: "Dec 25, 2025 - Jan 2, 2026",
            leaveDays: 3,
            totalDays: 9,
            description: "Take Dec 29-31 off for 9 consecutive days"
        });
    }
    
    return opportunities;
}

function calculateWorkDays(startDate, endDate) {
    let count = 0;
    let current = new Date(startDate);
    current.setDate(current.getDate() + 1);
    
    while (current < endDate) {
        const dayOfWeek = current.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not weekend
            count++;
        }
        current.setDate(current.getDate() + 1);
    }
    
    return count;
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function formatDate(date) {
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-NZ', options);
}