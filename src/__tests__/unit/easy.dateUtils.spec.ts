import { Event, RepeatInfo } from '../../types';
import {
  fillZero,
  formatDate,
  formatMonth,
  formatWeek,
  getDaysInMonth,
  getEventsForDay,
  getWeekDates,
  getWeeksAtMonth,
  isDateInRange,
} from '../../utils/dateUtils';

describe('getDaysInMonth', () => {
  it('1월은 31일 수를 반환한다', () => {
    const daysInMonth = getDaysInMonth(2025, 1);
    expect(daysInMonth).toBe(31);
  });

  it('4월은 30일 일수를 반환한다', () => {
    const daysInMonth = getDaysInMonth(2025, 4);
    expect(daysInMonth).toBe(30);
  });

  it('윤년의 2월에 대해 29일을 반환한다', () => {
    const daysInMonth = getDaysInMonth(2024, 2);
    expect(daysInMonth).toBe(29);
  });

  it('평년의 2월에 대해 28일을 반환한다', () => {
    const daysInMonth = getDaysInMonth(2025, 2);
    expect(daysInMonth).toBe(28);
  });

  it.each([
    ['0 이하 월', 0],
    ['12 초과 월', 13],
    ['음수 월', -1],
    ['큰수 월', 1000],
  ])('유효하지 않은 월(%s)에 대해 적절히 처리한다', (_, month) => {
    const daysInMonth = getDaysInMonth(2025, month);
    expect(daysInMonth).toBe(0);
  });
});

// // 함수 넣는건 똑같은데 반복문 없나? => each
// describe('getDaysInMonth', () => {
//   it.each([
//     [2025, 1, 31], // 2025년 1월 => 31일
//     [2025, 4, 30], // 2025년 4월 => 30일
//     [2024, 2, 29], // [윤년] 2월 => 29일
//     [2025, 2, 28], // [평년] 2월 => 28일
//   ])('%i년 %i월은 %i일을 반환한다', (year, month, expected) => {
//     expect(getDaysInMonth(year, month)).toBe(expected);
//   });
// });

describe('getWeekDates', () => {
  // 미국식 : 일요일 부터 주 시작
  const usWeek = [
    [2025, 9, 19], // 2025-10-19
    [2025, 9, 20],
    [2025, 9, 21],
    [2025, 9, 22],
    [2025, 9, 23],
    [2025, 9, 24],
    [2025, 9, 25],
  ];
  // ISO 식 : 월요일 부터 주 시작
  const isoWeek = [
    [2025, 9, 20],
    [2025, 9, 21],
    [2025, 9, 22],
    [2025, 9, 23],
    [2025, 9, 24],
    [2025, 9, 25],
    [2025, 9, 26],
  ];

  it('[미국식] 주중의 날짜(수요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const inputDate = new Date(2025, 9, 22); // 2025-10-22 수요일
    const expectedDateArray = usWeek.map(([year, month, date]) => new Date(year, month, date));
    expect(getWeekDates(inputDate)).toEqual(expectedDateArray);
  });

  it('[미국식] 주의 시작(일요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const inputDate = new Date(2025, 9, 19); // 2025-10-19 일요일
    const expectedDateArray = usWeek.map(([year, month, date]) => new Date(year, month, date));
    expect(getWeekDates(inputDate)).toEqual(expectedDateArray);
  });

  it('[미국식] 주의 끝(토요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const inputDate = new Date(2025, 9, 25); // 2025-10-25 토요일
    const expectedDateArray = usWeek.map(([year, month, date]) => new Date(year, month, date));
    expect(getWeekDates(inputDate)).toEqual(expectedDateArray);
  });

  it('[ISO식] 주중의 날짜(수요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const inputDate = new Date(2025, 9, 22); // 2025-10-22 수요일
    const expectedDateArray = isoWeek.map(([year, month, date]) => new Date(year, month, date));
    expect(getWeekDates(inputDate, true)).toEqual(expectedDateArray);
  });

  it('[ISO식] 주의 시작(월요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const inputDate = new Date(2025, 9, 20); // 2025-10-20 월요일
    const expectedDateArray = isoWeek.map(([year, month, date]) => new Date(year, month, date));
    expect(getWeekDates(inputDate, true)).toEqual(expectedDateArray);
  });

  it('[ISO식] 주의 끝(일요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const inputDate = new Date(2025, 9, 26); // 2025-10-26 일요일
    const expectedDateArray = isoWeek.map(([year, month, date]) => new Date(year, month, date));
    expect(getWeekDates(inputDate, true)).toEqual(expectedDateArray);
  });

  const crossYearWeekDates = [
    [2025, 11, 28],
    [2025, 11, 29],
    [2025, 11, 30],
    [2025, 11, 31],
    [2026, 0, 1],
    [2026, 0, 2],
    [2026, 0, 3],
  ];
  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연말)', () => {
    const inputDate = new Date(2025, 11, 31); // 2025-12-31 수요일
    const expectedDateArray = crossYearWeekDates.map(
      ([year, month, date]) => new Date(year, month, date)
    );
    expect(getWeekDates(inputDate)).toEqual(expectedDateArray);
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연초)', () => {
    const inputDate = new Date(2026, 0, 2); // 2026-1-2 금요일
    const expectedDateArray = crossYearWeekDates.map(
      ([year, month, date]) => new Date(year, month, date)
    );
    expect(getWeekDates(inputDate)).toEqual(expectedDateArray);
  });

  it('윤년의 2월 29일을 포함한 주를 올바르게 처리한다', () => {
    const inputDate = new Date(2024, 1, 28); // 2024-2-28 수요일 (윤년)
    const leapYearWeekDates = [
      [2024, 1, 25],
      [2024, 1, 26],
      [2024, 1, 27],
      [2024, 1, 28],
      [2024, 1, 29],
      [2024, 2, 1],
      [2024, 2, 2],
    ];
    const expectedDateArray = leapYearWeekDates.map(
      ([year, month, date]) => new Date(year, month, date)
    );
    expect(getWeekDates(inputDate)).toEqual(expectedDateArray);
  });

  it('월의 마지막 날짜를 포함한 주를 올바르게 처리한다', () => {
    const inputDate = new Date(2025, 8, 30); // 2025-9-30 화요일
    const endMonthWeekDates = [
      [2025, 8, 28],
      [2025, 8, 29],
      [2025, 8, 30],
      [2025, 9, 1],
      [2025, 9, 2],
      [2025, 9, 3],
      [2025, 9, 4],
    ];
    const expectedDateArray = endMonthWeekDates.map(
      ([year, month, date]) => new Date(year, month, date)
    );
    expect(getWeekDates(inputDate)).toEqual(expectedDateArray);
  });
});

describe('getWeeksAtMonth', () => {
  it('2025년 7월 1일의 올바른 주 정보를 반환해야 한다', () => {
    const inputDate = new Date(2025, 6, 1); // 2025-07-01
    const monthWeekDates = [
      [null, null, 1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10, 11, 12],
      [13, 14, 15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24, 25, 26],
      [27, 28, 29, 30, 31, null, null],
    ];
    expect(getWeeksAtMonth(inputDate)).toEqual(monthWeekDates);
  });
});

describe('getEventsForDay', () => {
  // 기본 Repect
  const defaultRepeat: RepeatInfo = {
    type: 'none',
    interval: 1,
    endDate: '2025-10-20',
  };
  // 기본 Event
  const defaultEvent: Event = {
    id: '0',
    title: '0일 이벤트',
    date: '2025-07-01',
    startTime: '',
    endTime: '',
    description: '',
    location: '',
    category: '',
    repeat: { ...defaultRepeat },
    notificationTime: 30,
  };

  const mockEvents: Event[] = [
    { ...defaultEvent, id: '1', title: '1일 이벤트', date: '2025-07-01' },
    { ...defaultEvent, id: '2', title: '2일 이벤트', date: '2025-07-02' },
  ];
  it('특정 날짜(1일)에 해당하는 이벤트만 정확히 반환한다', () => {
    const inputDate = 1; // 1 일
    const expectedEvents: Event[] = mockEvents.filter((e) => e.title === '1일 이벤트');
    expect(getEventsForDay(mockEvents, inputDate)).toEqual(expectedEvents);
  });

  it('해당 날짜에 이벤트가 없을 경우 빈 배열을 반환한다', () => {
    const inputDate = 3; // 3 일
    const expectedEvents: Event[] = [];
    expect(getEventsForDay(mockEvents, inputDate)).toEqual(expectedEvents);
  });

  it('날짜가 0일 경우 빈 배열을 반환한다', () => {
    const inputDate = 0; // 0 일
    const expectedEvents: Event[] = [];
    expect(getEventsForDay(mockEvents, inputDate)).toEqual(expectedEvents);
  });

  it('날짜가 32일 이상인 경우 빈 배열을 반환한다', () => {
    const inputDate = 32; // 32 일
    const expectedEvents: Event[] = [];
    expect(getEventsForDay(mockEvents, inputDate)).toEqual(expectedEvents);
  });
});

describe('formatWeek', () => {
  it('월의 중간 날짜에 대해 올바른 주 정보를 반환한다', () => {
    const inputDate = new Date(2025, 9, 9); // 2025-10-9
    const expectedWeek = '2025년 10월 2주';

    expect(formatWeek(inputDate)).toBe(expectedWeek);
  });

  it('월의 첫 주에 대해 올바른 주 정보를 반환한다', () => {
    const inputDate = new Date(2025, 9, 1); // 2025-10-1
    const expectedWeek = '2025년 10월 1주';

    expect(formatWeek(inputDate)).toBe(expectedWeek);
  });

  it('월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    const inputDate = new Date(2025, 9, 31); // 2025-10-31
    const expectedWeek = '2025년 10월 5주';

    expect(formatWeek(inputDate)).toBe(expectedWeek);
  });

  it('연도가 바뀌는 주에 대해 올바른 주 정보를 반환한다', () => {
    const inputDate = new Date(2025, 11, 30); // 2025-12-31
    const expectedWeek = '2026년 1월 1주';

    expect(formatWeek(inputDate)).toBe(expectedWeek);
  });

  it('윤년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    const inputDate = new Date(2024, 1, 29); // 2024-2-29
    const expectedWeek = '2024년 2월 5주';
    expect(formatWeek(inputDate)).toBe(expectedWeek);
  });

  it('평년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    const inputDate = new Date(2025, 1, 28); // 2025-2-28
    const expectedWeek = '2025년 2월 4주';
    expect(formatWeek(inputDate)).toBe(expectedWeek);
  });
});

describe('formatMonth', () => {
  it("2025년 7월 10일을 '2025년 7월'로 반환한다", () => {
    const inputDate = new Date(2025, 10); // 2025 년 11월
    const expectedDate = '2025년 11월';
    expect(formatMonth(inputDate)).toBe(expectedDate);
  });
});

describe('isDateInRange', () => {
  it('범위 내의 날짜 2025-07-10에 대해 true를 반환한다', () => {
    const inputDate = new Date(2025, 6, 10); // 2025-07-10
    const startDate = new Date(2025, 6, 3);
    const endDate = new Date(2025, 6, 15);

    expect(isDateInRange(inputDate, startDate, endDate)).toBe(true);
  });
  // 첫날도 범위 내로 포함 하는가?
  it('범위의 시작일 2025-07-01에 대해 true를 반환한다', () => {
    const inputDate = new Date(2025, 6, 1); // 2025-07-01
    const startDate = new Date(2025, 6, 1); // 2025-07-01
    const endDate = new Date(2025, 6, 15);

    expect(isDateInRange(inputDate, startDate, endDate)).toBe(true);
  });

  // 마지막날도 범위 내로 포함 하는가?
  it('범위의 종료일 2025-07-31에 대해 true를 반환한다', () => {
    const inputDate = new Date(2025, 6, 31); // 2025-07-31
    const startDate = new Date(2025, 6, 1);
    const endDate = new Date(2025, 6, 31); // 2025-07-31

    expect(isDateInRange(inputDate, startDate, endDate)).toBe(true);
  });

  it('범위 이전의 날짜 2025-12-30에 대해 false를 반환한다', () => {
    const inputDate = new Date(2025, 11, 30); // 2025-12-30
    const startDate = new Date(2025, 12, 31);
    const endDate = new Date(2026, 1, 30); // 2025-07-31

    expect(isDateInRange(inputDate, startDate, endDate)).toBe(false);
  });

  it('범위 이후의 날짜 2025-08-01에 대해 false를 반환한다', () => {
    const inputDate = new Date(2025, 7, 1); // 2025-08-01
    const startDate = new Date(2025, 6, 25); // 2025-07-25
    const endDate = new Date(2025, 6, 30); // 2025-07-30

    expect(isDateInRange(inputDate, startDate, endDate)).toBe(false);
  });

  it('시작일이 종료일보다 늦은 경우 모든 날짜에 대해 false를 반환한다', () => {
    const inputDate = new Date(2025, 6, 27); // 2025-07-27
    const startDate = new Date(2025, 6, 30); // 2025-07-30
    const endDate = new Date(2025, 6, 25); // 2025-07-25

    expect(isDateInRange(inputDate, startDate, endDate)).toBe(false);
  });
});

describe('fillZero', () => {
  it("5를 2자리로 변환하면 '05'를 반환한다", () => {
    expect(fillZero(5, 2)).toBe('05');
  });

  it("10을 2자리로 변환하면 '10'을 반환한다", () => {
    expect(fillZero(10, 2)).toBe('10');
  });

  it("3을 3자리로 변환하면 '003'을 반환한다", () => {
    expect(fillZero(3, 3)).toBe('003');
  });

  it("100을 2자리로 변환하면 '100'을 반환한다", () => {
    expect(fillZero(100, 2)).toBe('100');
  });

  it("0을 2자리로 변환하면 '00'을 반환한다", () => {
    expect(fillZero(0, 2)).toBe('00');
  });

  it("1을 5자리로 변환하면 '00001'을 반환한다", () => {
    expect(fillZero(1, 5)).toBe('00001');
  });

  // // 함수 넣는건 똑같은데 반복문 없나? => each
  // it.each([
  //   [5, 2, '05'],
  //   [10, 2, '10'],
  //   [3, 3, '003'],
  //   [100, 2, '100'],
  //   [0, 2, '00'],
  //   [1, 5, '00001'],
  // ])(`%i을 %i자리로 변환하면 '%s' 을 반환한다`, (value, length, expeted) => {
  //   expect(fillZero(value, length)).toBe(expeted);
  // });

  it("소수점이 있는 3.14를 5자리로 변환하면 '03.14'를 반환한다", () => {
    expect(fillZero(3.14, 5)).toBe('03.14');
  });

  it('size 파라미터를 생략하면 기본값 2를 사용한다', () => {
    expect(fillZero(3)).toBe('03');
  });

  it('value가 지정된 size보다 큰 자릿수를 가지면 원래 값을 그대로 반환한다', () => {
    expect(fillZero(300, 2)).toBe('300');
  });
});

describe('formatDate', () => {
  it('날짜를 YYYY-MM-DD 형식으로 포맷팅한다', () => {
    const inputDate = new Date(2025, 9, 20); // 2025-10-20
    const expectedDate = '2025-10-20';

    expect(formatDate(inputDate)).toBe(expectedDate);
  });

  it('day 파라미터가 제공되면 해당 일자로 포맷팅한다', () => {
    const inputDate = new Date(2025, 9, 20); // 2025-10-20
    const expectedDate = '2025-10-15';

    expect(formatDate(inputDate, { day: 15 })).toBe(expectedDate);
  });

  it('월이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {
    const inputDate = new Date(2025, 8, 20); // 2025-9-20
    const expectedDate = '2025-09-20';

    expect(formatDate(inputDate)).toBe(expectedDate);
  });

  it('일이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {
    const inputDate = new Date(2025, 8, 2); // 2025-9-2
    const expectedDate = '2025-09-02';

    expect(formatDate(inputDate)).toBe(expectedDate);
  });

  it('날짜 포맷팅의 분리문자 추가시 문자에 맞게 포맷팅한다', () => {
    const inputDate = new Date(2025, 8, 2); // 2025-9-2
    const expectedDate = '2025/09/02';

    expect(formatDate(inputDate, { separator: '/' })).toBe(expectedDate);
  });
});
