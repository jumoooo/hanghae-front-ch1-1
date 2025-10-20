import { Event, RepeatInfo } from '../../types';
import {
  convertEventToDateRange,
  findOverlappingEvents,
  isOverlapping,
  parseDateTime,
} from '../../utils/eventOverlap';

describe('parseDateTime', () => {
  it('2025-07-01 14:30을 정확한 Date 객체로 변환한다', () => {
    const inputDate = '2025-07-01 14:30'; // 2025-07-01 14:30
    const expectedDate = new Date(2025, 6, 1, 14, 30); // 2025-07-01 14:30

    const [date, time] = inputDate.split(' ');

    expect(parseDateTime(date, time)).toEqual(expectedDate);
  });

  it('잘못된 날짜 형식에 대해 Invalid Date를 반환한다', () => {
    const date = '2025-13-01';
    const time = '14:30'; // Invalid Date

    const res = parseDateTime(date, time);
    expect(isNaN(res.getDate())).toBe(true);
  });

  it('잘못된 시간 형식에 대해 Invalid Date를 반환한다', () => {
    const date = '2025-12-01';
    const time = '55:30'; // Invalid Date

    const res = parseDateTime(date, time);
    expect(isNaN(res.getTime())).toBe(true);
  });

  it('날짜 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    const date = ' ';
    const time = '14:30';

    const res = parseDateTime(date, time);
    expect(isNaN(res.getTime())).toBe(true);
  });
});

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

describe('convertEventToDateRange', () => {
  const mockEvents: Event[] = [
    {
      ...defaultEvent,
      id: '1',
      title: '일반적인 이벤트',
      date: '2025-07-01',
      startTime: '14:30',
      endTime: '15:30',
    },
    {
      ...defaultEvent,
      id: '2',
      title: '잘못된 날짜 이벤트',
      date: '2025-29-02',
      startTime: '14:30',
      endTime: '15:30',
    },
    {
      ...defaultEvent,
      id: '3',
      title: '잘못된 시간 이벤트',
      date: '2025-07-02',
      startTime: '14:30',
      endTime: '15:30',
    },
  ];

  it('일반적인 이벤트를 올바른 시작 및 종료 시간을 가진 객체로 변환한다', () => {
    const expectedData = {
      start: new Date(2025, 6, 1, 14, 30),
      end: new Date(2025, 6, 1, 15, 30),
    };
    const inputData = mockEvents.find((e) => e.title === '일반적인 이벤트') as Event;
    expect(convertEventToDateRange(inputData)).toEqual(expectedData);
  });

  it('잘못된 날짜 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const inputData = mockEvents.find((e) => e.title === '잘못된 날짜 이벤트') as Event;
    const res = convertEventToDateRange(inputData);

    expect(isNaN(res.start.getTime())).toBe(true);
  });

  it('잘못된 시간 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const inputData = mockEvents.find((e) => e.title === '잘못된 시간 이벤트') as Event;
    const res = convertEventToDateRange(inputData);

    [res.start, res.end].forEach((date) => {
      expect(isNaN(date.getTime())).toBe(true);
    });
  });
});

describe('isOverlapping', () => {
  it('두 이벤트의 시간이 겹치는 경우 true를 반환한다', () => {
    const [event_A1, event_A2] = [
      {
        ...defaultEvent,
        id: '1',
        title: 'A 이벤트',
        date: '2025-07-01',
        startTime: '14:30',
        endTime: '15:30',
      },
      {
        ...defaultEvent,
        id: '2',
        title: 'A 이벤트',
        date: '2025-07-01',
        startTime: '15:00',
        endTime: '15:30',
      },
    ] as Event[];
    expect(isOverlapping(event_A1, event_A2)).toBe(true);
  });

  it('두 이벤트의 시간이 겹치지 않는 경우 false를 반환한다', () => {
    const [event_A, event_B] = [
      {
        ...defaultEvent,
        id: '1',
        title: 'A 이벤트',
        date: '2025-07-01',
        startTime: '14:30',
        endTime: '15:30',
      },
      {
        ...defaultEvent,
        id: '3',
        title: 'B 이벤트',
        date: '2025-07-01',
        startTime: '16:00',
        endTime: '17:00',
      },
    ] as Event[];
    expect(isOverlapping(event_A, event_B)).toBe(false);
  });
});

describe('findOverlappingEvents', () => {
  const events = [
    {
      ...defaultEvent,
      id: '1',
      title: 'A 이벤트',
      date: '2025-07-01',
      startTime: '14:30',
      endTime: '15:30',
    },
    {
      ...defaultEvent,
      id: '2',
      title: 'B 이벤트',
      date: '2025-07-01',
      startTime: '15:00',
      endTime: '15:30',
    },
  ] as Event[];
  it('새 이벤트와 겹치는 모든 이벤트를 반환한다', () => {
    const newEvent: Event = {
      ...defaultEvent,
      id: '3',
      title: 'C 이벤트',
      date: '2025-07-01',
      startTime: '15:10',
      endTime: '15:30',
    };
    expect(findOverlappingEvents(newEvent, events)).toEqual(events);
  });

  it('겹치는 이벤트가 없으면 빈 배열을 반환한다', () => {
    const newEvent: Event = {
      ...defaultEvent,
      id: '3',
      title: 'D 이벤트',
      date: '2025-08-30',
      startTime: '15:10',
      endTime: '15:30',
    };
    expect(findOverlappingEvents(newEvent, events)).toEqual([]);
  });
});
