import { Availability } from '@/app/lib/types';

interface MatchCount {
  [key: string]: {
    count: number;
    user_ids: Set<string>;
  };
}

interface Result {
  group_field_id: string;
  date: string;
  timeSlot: string;
  count: number;
  user_ids: string[];
}

function formatTime(time: string): string {
  // If the time is already in HH:MM format, return it
  if (/^\d{2}:\d{2}$/.test(time)) {
    return time;
  }
  // If the time is in HH:MM:SS format, remove the seconds
  if (/^\d{2}:\d{2}:\d{2}$/.test(time)) {
    return time.substring(0, 5);
  }
  // If it's in any other format, try to parse it and format to HH:MM
  const [hours, minutes] = time.split(':').map(Number);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function findMostCommonTimeSlots(availabilityList: Availability[]): Result[] {
  function generateHourlySlots(start: string, end: string): string[] {
    const slots: string[] = [];
    let current = new Date(`2000-01-01T${formatTime(start)}`);
    let endTime = new Date(`2000-01-01T${formatTime(end)}`);

    // If end time is before start time, assume it's the next day
    if (endTime <= current) {
      endTime = new Date(`2000-01-02T${formatTime(end)}`);
    }

    while (current < endTime) {
      const slotStart = current.toTimeString().slice(0, 5);
      current.setHours(current.getHours() + 1);
      const slotEnd = current < endTime ? current.toTimeString().slice(0, 5) : formatTime(end);
      slots.push(`${slotStart}-${slotEnd}`);
    }

    return slots;
  }

  function extractDateOnly(date: string | Date): string {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    if (typeof date === 'string') {
      // Check if it's already in YYYY-MM-DD format
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
      }
      // Attempt to parse as ISO string
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString().split('T')[0];
      }
    }
    // If all else fails, return the original value as a string
    return String(date);
  }

  const matchCounts: MatchCount = {};
  availabilityList.forEach(item => {
    const dateOnly = extractDateOnly(item.date);
    const key = `${item.group_field_id}|${dateOnly}`;
    const slots = generateHourlySlots(formatTime(item.start_time), formatTime(item.end_time));
    
    slots.forEach(slot => {
      const fullKey = `${key}|${slot}`;
      if (!matchCounts[fullKey]) {
        matchCounts[fullKey] = { count: 0, user_ids: new Set() };
      }
      matchCounts[fullKey].count += 1;
      matchCounts[fullKey].user_ids.add(item.user_id);
    });
  });

  const results: Result[] = Object.entries(matchCounts).map(([key, value]) => {
    const [group_field_id, date, timeSlot] = key.split('|');
    return { 
      group_field_id, 
      date,
      timeSlot, 
      count: value.count,
      user_ids: Array.from(value.user_ids)
    };
  });

  results.sort((a, b) => b.count - a.count);

  return results;
}

export { findMostCommonTimeSlots }