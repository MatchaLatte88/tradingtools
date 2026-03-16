export function generateNFP(year) {
  const events = [];
  for (let month = 0; month < 12; month++) {
    // First Friday of the month
    let date = new Date(year, month, 1);
    while (date.getDay() !== 5) {
      date.setDate(date.getDate() + 1);
    }
    events.push({
      title: 'NFP',
      date: date.toISOString().split('T')[0],
      time: '13:30'
    });
  }
  return events;
}

export function generateCPI(year) {
  const events = [];
  for (let month = 0; month < 12; month++) {
    // Second Wednesday of the month
    let date = new Date(year, month, 1);
    let wednesdayCount = 0;
    while (wednesdayCount < 2) {
      if (date.getDay() === 3) {
        wednesdayCount++;
      }
      if (wednesdayCount < 2) {
        date.setDate(date.getDate() + 1);
      }
    }
    events.push({
      title: 'CPI',
      date: date.toISOString().split('T')[0],
      time: '13:30'
    });
  }
  return events;
}

export function generatePMI(year) {
  const events = [];
  for (let month = 0; month < 12; month++) {
    // First business day (Mon-Fri)
    let date = new Date(year, month, 1);
    while (date.getDay() === 0 || date.getDay() === 6) {
      date.setDate(date.getDate() + 1);
    }
    events.push({
      title: 'PMI',
      date: date.toISOString().split('T')[0],
      time: '15:00'
    });
  }
  return events;
}

export function getAllEvents(fomcData) {
  const startYear = 2024;
  const endYear = 2030;
  let dynamicEvents = [];

  for (let year = startYear; year <= endYear; year++) {
    dynamicEvents = [
      ...dynamicEvents,
      ...generateNFP(year),
      ...generateCPI(year),
      ...generatePMI(year)
    ];
  }

  return [...fomcData, ...dynamicEvents];
}
