import { act, renderHook } from '@testing-library/react';

import { useSearch } from '../../hooks/useSearch.ts';
import { Event, RepeatInfo } from '../../types.ts';

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

// Mock 이벤트 Data
const events: Event[] = [
  {
    ...defaultEvent,
    id: '1',
    title: '이벤트 1',
    date: '2025-07-01',
    startTime: '14:30',
    endTime: '15:30',
    description: '첫번째',
  },
  {
    ...defaultEvent,
    id: '2',
    title: '이벤트 2',
    date: '2025-07-03',
    startTime: '14:30',
    endTime: '15:30',
    location: '서울',
  },
  {
    ...defaultEvent,
    id: '3',
    title: '점심',
    date: '2025-08-22',
    startTime: '15:00',
    endTime: '15:30',
  },
  {
    ...defaultEvent,
    id: '4',
    title: '이벤트 4',
    date: '2025-07-22',
    startTime: '14:30',
    endTime: '15:30',
    description: '두번째',
  },
];

describe('검색어 [주간] 테스트 ', () => {
  const toDay = new Date(2025, 6, 2); // 2025-07-02
  it('[주간] 검색어가 비어있을 때 모든 이벤트를 반환해야 한다', () => {
    const { result: result_week } = renderHook(() => useSearch(events, toDay, 'week'));
    act(() => {
      result_week.current.setSearchTerm('');
    });
    const expectData_week = [
      {
        ...defaultEvent,
        id: '1',
        title: '이벤트 1',
        date: '2025-07-01',
        startTime: '14:30',
        endTime: '15:30',
        description: '첫번째',
      },
      {
        ...defaultEvent,
        id: '2',
        title: '이벤트 2',
        date: '2025-07-03',
        startTime: '14:30',
        endTime: '15:30',
        location: '서울',
      },
    ];

    expect(result_week.current.filteredEvents).toEqual(expectData_week);
  });

  it('[주간] 검색어에 맞는 이벤트만 필터링해야 한다', () => {
    const { result: result_week } = renderHook(() => useSearch(events, toDay, 'week'));
    const expectData_week = [
      {
        ...defaultEvent,
        id: '1',
        title: '이벤트 1',
        date: '2025-07-01',
        startTime: '14:30',
        endTime: '15:30',
        description: '첫번째',
      },
    ];
    act(() => {
      result_week.current.setSearchTerm('이벤트 1');
    });

    expect(result_week.current.filteredEvents).toEqual(expectData_week);
  });

  it('[주간] 검색어가 제목, 설명, 위치 중 하나라도 일치하면 해당 이벤트를 반환해야 한다', () => {
    const { result: result_week } = renderHook(() => useSearch(events, toDay, 'week'));
    // 제목 검색
    act(() => {
      result_week.current.setSearchTerm('이벤트 1');
    });
    const expectData_title = [
      {
        ...defaultEvent,
        id: '1',
        title: '이벤트 1',
        date: '2025-07-01',
        startTime: '14:30',
        endTime: '15:30',
        description: '첫번째',
      },
    ];
    expect(result_week.current.filteredEvents).toEqual(expectData_title);

    // 설명 검색
    act(() => {
      result_week.current.setSearchTerm('첫번째');
    });
    const expectData_description = [
      {
        ...defaultEvent,
        id: '1',
        title: '이벤트 1',
        date: '2025-07-01',
        startTime: '14:30',
        endTime: '15:30',
        description: '첫번째',
      },
    ];
    expect(result_week.current.filteredEvents).toEqual(expectData_description);

    // 위치 검색
    act(() => {
      result_week.current.setSearchTerm('서울');
    });
    const expectData_location = [
      {
        ...defaultEvent,
        id: '2',
        title: '이벤트 2',
        date: '2025-07-03',
        startTime: '14:30',
        endTime: '15:30',
        location: '서울',
      },
    ];
    expect(result_week.current.filteredEvents).toEqual(expectData_location);
  });
});
describe('검색어 [월간] 테스트', () => {
  const toDay = new Date(2025, 6, 2); // 2025-07-02
  it('[월간] 검색어가 비어있을 때 모든 이벤트를 반환해야 한다', () => {
    const { result: result_month } = renderHook(() => useSearch(events, toDay, 'month'));
    act(() => {
      result_month.current.setSearchTerm('');
    });
    const expectData_month = [
      {
        ...defaultEvent,
        id: '1',
        title: '이벤트 1',
        date: '2025-07-01',
        startTime: '14:30',
        endTime: '15:30',
        description: '첫번째',
      },
      {
        ...defaultEvent,
        id: '2',
        title: '이벤트 2',
        date: '2025-07-03',
        startTime: '14:30',
        endTime: '15:30',
        location: '서울',
      },
      {
        ...defaultEvent,
        id: '4',
        title: '이벤트 4',
        date: '2025-07-22',
        startTime: '14:30',
        endTime: '15:30',
        description: '두번째',
      },
    ];

    expect(result_month.current.filteredEvents).toEqual(expectData_month);
  });

  it('[월간] 검색어에 맞는 이벤트만 필터링해야 한다', () => {
    const { result: result_month } = renderHook(() => useSearch(events, toDay, 'month'));
    const expectData_month = [
      {
        ...defaultEvent,
        id: '1',
        title: '이벤트 1',
        date: '2025-07-01',
        startTime: '14:30',
        endTime: '15:30',
        description: '첫번째',
      },
    ];
    act(() => {
      result_month.current.setSearchTerm('이벤트 1');
    });

    expect(result_month.current.filteredEvents).toEqual(expectData_month);
  });

  it('[월간] 검색어가 제목, 설명, 위치 중 하나라도 일치하면 해당 이벤트를 반환해야 한다', () => {
    const { result: result_month } = renderHook(() => useSearch(events, toDay, 'month'));
    // 제목 검색
    act(() => {
      result_month.current.setSearchTerm('이벤트 1');
    });
    const expectData_title = [
      {
        ...defaultEvent,
        id: '1',
        title: '이벤트 1',
        date: '2025-07-01',
        startTime: '14:30',
        endTime: '15:30',
        description: '첫번째',
      },
    ];
    expect(result_month.current.filteredEvents).toEqual(expectData_title);

    // 설명 검색
    act(() => {
      result_month.current.setSearchTerm('두번째');
    });
    const expectData_description = [
      {
        ...defaultEvent,
        id: '4',
        title: '이벤트 4',
        date: '2025-07-22',
        startTime: '14:30',
        endTime: '15:30',
        description: '두번째',
      },
    ];
    expect(result_month.current.filteredEvents).toEqual(expectData_description);

    // 위치 검색
    act(() => {
      result_month.current.setSearchTerm('서울');
    });
    const expectData_location = [
      {
        ...defaultEvent,
        id: '2',
        title: '이벤트 2',
        date: '2025-07-03',
        startTime: '14:30',
        endTime: '15:30',
        location: '서울',
      },
    ];
    expect(result_month.current.filteredEvents).toEqual(expectData_location);
  });
});

// 이미 위의 주간, 월간 테스트에서 진행 함 으로 주석 처리
// it('현재 뷰(주간/월간)에 해당하는 이벤트만 반환해야 한다', () => {});

it("검색어를 '회의'에서 '점심'으로 변경하면 필터링된 결과가 즉시 업데이트되어야 한다", () => {
  const toDay = new Date(2025, 7, 2); // 2025-08-02
  const { result } = renderHook(() => useSearch(events, toDay, 'month'));

  // 회의 검색
  act(() => {
    result.current.setSearchTerm('회의');
  });
  const expectedData_01: Event[] = [];
  expect(result.current.filteredEvents).toEqual(expectedData_01);

  // 점심 검색
  act(() => {
    result.current.setSearchTerm('점심');
  });
  const expectedData_02: Event[] = [
    {
      ...defaultEvent,
      id: '3',
      title: '점심',
      date: '2025-08-22',
      startTime: '15:00',
      endTime: '15:30',
    },
  ];
  expect(result.current.filteredEvents).toEqual(expectedData_02);
});
