import { Event, RepeatInfo } from '../../types';
import { createNotificationMessage, getUpcomingEvents } from '../../utils/notificationUtils';

const defaultRepeat: RepeatInfo = {
  type: 'none',
  interval: 1,
  endDate: '2025-10-20',
};
// 기본 Event
const defaultEvent: Event = {
  id: '0',
  title: '',
  date: '2025-07-01',
  startTime: '',
  endTime: '',
  description: '',
  location: '',
  category: '',
  repeat: { ...defaultRepeat },
  notificationTime: 30,
};
describe('getUpcomingEvents', () => {
  const events = [
    {
      ...defaultEvent,
      id: '1',
      title: '이벤트 1',
      date: '2025-07-01',
      startTime: '14:30',
      endTime: '15:30',
    },
    {
      ...defaultEvent,
      id: '2',
      title: '이벤트 2',
      date: '2025-07-01',
      startTime: '14:30',
      endTime: '15:30',
    },
    {
      ...defaultEvent,
      id: '3',
      title: '테스트 데이터',
      date: '2025-06-04',
      startTime: '15:00',
      endTime: '15:30',
    },
    {
      ...defaultEvent,
      id: '4',
      title: 'eVenT 3',
      date: '2025-08-08',
      startTime: '15:00',
      endTime: '15:30',
    },
  ] as Event[];

  // 알림 시점 바로 이전까지만 도래한 이벤트 반환
  it('알림 시간이 정확히 도래한 이벤트를 반환한다', () => {
    const now = new Date(2025, 6, 1, 14, 29); // 2025-07-01 14:29, 30분전 알람 설정 됨.
    const expectedData = [
      {
        ...defaultEvent,
        id: '1',
        title: '이벤트 1',
        date: '2025-07-01',
        startTime: '14:30',
        endTime: '15:30',
      },
      {
        ...defaultEvent,
        id: '2',
        title: '이벤트 2',
        date: '2025-07-01',
        startTime: '14:30',
        endTime: '15:30',
      },
    ];
    expect(getUpcomingEvents(events, now, [])).toEqual(expectedData);
  });

  it('이미 알림이 간 이벤트는 제외한다', () => {
    const notifiedEvents = ['2']; // 이미 'id:2' 알람 울렸음
    const now = new Date(2025, 6, 1, 14, 29); // 2025-07-01 14:29, 30분전 알람 설정 됨.
    const expectedData = [
      {
        ...defaultEvent,
        id: '1',
        title: '이벤트 1',
        date: '2025-07-01',
        startTime: '14:30',
        endTime: '15:30',
      },
    ];
    expect(getUpcomingEvents(events, now, notifiedEvents)).toEqual(expectedData);
  });

  it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', () => {
    const now = new Date(2025, 6, 1, 13); // 2025-07-01 13:00, 30분전 알람 설정 됨.
    expect(getUpcomingEvents(events, now, [])).toEqual([]);
  });

  it('알림 시간이 지난 이벤트는 반환하지 않는다', () => {
    const now = new Date(2025, 10, 1, 13); // 2025-11-01 13:00, 30분전 알람 설정 됨.
    expect(getUpcomingEvents(events, now, [])).toEqual([]);
  });
});

describe('createNotificationMessage', () => {
  it('올바른 알림 메시지를 생성해야 한다', () => {
    const title = '이벤트 1';
    const notificationTime = 30;

    const event: Event = {
      ...defaultEvent,
      id: '1',
      title: title,
      date: '2025-07-01',
      startTime: '14:30',
      endTime: '15:30',
      notificationTime: notificationTime,
    };
    const expectedStr = `${notificationTime}분 후 ${title} 일정이 시작됩니다.`;
    expect(createNotificationMessage(event)).toBe(expectedStr);
  });
});
