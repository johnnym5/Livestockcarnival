export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  venue: string;
  startIso: string;
  endIso: string;
}

export function generateICS(event: CalendarEvent): void {
  const formatDate = (isoStr: string): string => {
    const d = new Date(isoStr);
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const startStamp = formatDate(event.startIso);
  const endStamp = formatDate(event.endIso);
  const nowStamp = formatDate(new Date().toISOString());

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Livestock Carnival Abuja 2026//Festival Timetable//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}-2026@livestockcarnival.ng`,
    `DTSTAMP:${nowStamp}`,
    `DTSTART:${startStamp}`,
    `DTEND:${endStamp}`,
    `SUMMARY:${event.title} - Livestock Carnival 2026`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.venue}, Old Parade Ground, Area 10, Garki, Abuja`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  const blob = new Blob([icsLines.join('\r\n')], {
    type: 'text/calendar;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.id}_${event.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
