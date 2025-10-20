import { act, renderHook } from '@testing-library/react';

import { useSearch } from '../../hooks/useSearch.ts';
import { Event, RepeatInfo } from '../../types.ts';

const toDay = new Date(2025, 6, 2); // 2025-07-02
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

const events: Event[] = [
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
    date: '2025-07-03',
    startTime: '14:30',
    endTime: '15:30',
  },
  {
    ...defaultEvent,
    id: '3',
    title: '테스트 데이터',
    date: '2025-07-22',
    startTime: '15:00',
    endTime: '15:30',
  },
];

it('[주간] 검색어가 비어있을 때 모든 이벤트를 반환해야 한다', () => {
  const { result: result_week } = renderHook(() => useSearch(events, toDay, 'week'));
  const expectData_week = [
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
      date: '2025-07-03',
      startTime: '14:30',
      endTime: '15:30',
    },
  ];

  expect(result_week.current.filteredEvents).toEqual(expectData_week);
});
it('[월간] 검색어가 비어있을 때 모든 이벤트를 반환해야 한다', () => {
  const { result: result_month } = renderHook(() => useSearch(events, toDay, 'month'));
  const expectData_month = [
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
      date: '2025-07-03',
      startTime: '14:30',
      endTime: '15:30',
    },
    {
      ...defaultEvent,
      id: '3',
      title: '테스트 데이터',
      date: '2025-07-22',
      startTime: '15:00',
      endTime: '15:30',
    },
  ];

  expect(result_month.current.filteredEvents).toEqual(expectData_month);
});

it('검색어에 맞는 이벤트만 필터링해야 한다', () => {});

it('검색어가 제목, 설명, 위치 중 하나라도 일치하면 해당 이벤트를 반환해야 한다', () => {});

it('현재 뷰(주간/월간)에 해당하는 이벤트만 반환해야 한다', () => {});

it("검색어를 '회의'에서 '점심'으로 변경하면 필터링된 결과가 즉시 업데이트되어야 한다", () => {});
