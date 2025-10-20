import { Event, RepeatInfo } from '../../types';
import { getFilteredEvents } from '../../utils/eventUtils';

describe('getFilteredEvents', () => {
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
      date: '2025-07-22',
      startTime: '15:00',
      endTime: '15:30',
    },
    {
      ...defaultEvent,
      id: '3',
      title: '테스트 데이터',
      date: '2025-07-04',
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
    {
      ...defaultEvent,
      id: '5',
      title: '테스트 1',
      date: '2025-08-31',
      startTime: '15:00',
      endTime: '15:30',
    },
  ] as Event[];

  it("검색어 '이벤트 2'에 맞는 이벤트만 반환한다", () => {
    const searchTerm = '이벤트 2';
    const currentDate = new Date(2025, 6, 22); // 2025-07-22
    const expectedData = events.filter((e) => e.title === '이벤트 2');

    expect(getFilteredEvents(events, searchTerm, currentDate, 'week')).toEqual(expectedData);
    expect(getFilteredEvents(events, searchTerm, currentDate, 'month')).toEqual(expectedData);
  });

  it('주간 뷰에서 2025-07-01 주의 이벤트만 반환한다', () => {
    const searchTerm = '';
    const currentDate = new Date(2025, 6, 1); // 2025-07-01
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
        id: '3',
        title: '테스트 데이터',
        date: '2025-07-04',
        startTime: '15:00',
        endTime: '15:30',
      },
    ];

    expect(getFilteredEvents(events, searchTerm, currentDate, 'week')).toEqual(expectedData);
  });

  it('월간 뷰에서 2025년 7월의 모든 이벤트를 반환한다', () => {
    const searchTerm = '';
    const currentDate = new Date(2025, 6, 1);
    const expectedData = events.filter((e) => e.date.includes('2025-07'));

    expect(getFilteredEvents(events, searchTerm, currentDate, 'month')).toEqual(expectedData);
  });

  it("검색어 '이벤트'와 주간 뷰 필터링을 동시에 적용한다", () => {
    const searchTerm = '이벤트';
    const currentDate = new Date(2025, 6, 1); // 2025-07-01
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

    expect(getFilteredEvents(events, searchTerm, currentDate, 'week')).toEqual(expectedData);
  });

  // 검색어가 없을 때 모든 이벤트가 아니라 '월간', '주간' 으로 인한 1차 필터가 된 모든 이벤트이다.
  it('검색어가 없을 때 모든 이벤트를 반환한다', () => {
    const searchTerm = '';
    const currentDate = new Date(2025, 6, 1); // 2025-07-01
    const expectedData_month = events.filter((e) => e.date.includes('2025-07'));

    expect(getFilteredEvents(events, searchTerm, currentDate, 'month')).toEqual(expectedData_month);

    const expectedData_week = [
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
        id: '3',
        title: '테스트 데이터',
        date: '2025-07-04',
        startTime: '15:00',
        endTime: '15:30',
      },
    ];
    expect(getFilteredEvents(events, searchTerm, currentDate, 'week')).toEqual(expectedData_week);
  });

  it('검색어가 대소문자를 구분하지 않고 작동한다', () => {
    const searchTerm = 'event 3';
    const currentDate = new Date(2025, 7, 6); // 2025-08-06
    const expectedData = [
      {
        ...defaultEvent,
        id: '4',
        title: 'eVenT 3',
        date: '2025-08-08',
        startTime: '15:00',
        endTime: '15:30',
      },
    ];

    expect(getFilteredEvents(events, searchTerm, currentDate, 'week')).toEqual(expectedData);
    expect(getFilteredEvents(events, searchTerm, currentDate, 'month')).toEqual(expectedData);
  });

  it('월의 경계에 있는 이벤트를 올바르게 필터링한다', () => {
    const events_endWeek = [
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
        date: '2025-07-31',
        startTime: '15:00',
        endTime: '15:30',
      },
      {
        ...defaultEvent,
        id: '3',
        title: '이벤트 2',
        date: '2025-08-01',
        startTime: '15:00',
        endTime: '15:30',
      },
    ] as Event[];

    const searchTerm = '';
    const currentDate_week = new Date(2025, 5, 30); // 2025-06-30
    const expectedData_week = events_endWeek.filter((e) => e.date.includes('2025-07-01'));
    expect(getFilteredEvents(events_endWeek, searchTerm, currentDate_week, 'week')).toEqual(
      expectedData_week
    );

    const currentDate_month = new Date(2025, 6, 5); // 2025-07-05
    const expectedData_month = events_endWeek.filter((e) => e.date.includes('2025-07'));

    expect(getFilteredEvents(events_endWeek, searchTerm, currentDate_month, 'month')).toEqual(
      expectedData_month
    );
  });

  it('빈 이벤트 리스트에 대해 빈 배열을 반환한다', () => {
    const searchTerm = '';
    const currentDate_week = new Date(2025, 5, 30); // 2025-06-30
    expect(getFilteredEvents([], searchTerm, currentDate_week, 'week')).toEqual([]);
  });
});
