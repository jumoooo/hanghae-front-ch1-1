import { Event } from '../types';

const SECOND = 1000; // 초
const MINUTES = SECOND * 60; // 분

export function getUpcomingEvents(events: Event[], now: Date, notifiedEvents: string[]) {
  return events.filter((event) => {
    const eventStart = new Date(`${event.date}T${event.startTime}`);
    const timeDiff = (eventStart.getTime() - now.getTime()) / MINUTES;
    return timeDiff > 0 && timeDiff <= event.notificationTime && !notifiedEvents.includes(event.id);
  });
}

export function createNotificationMessage({ notificationTime, title }: Event) {
  return `${notificationTime}분 후 ${title} 일정이 시작됩니다.`;
}
