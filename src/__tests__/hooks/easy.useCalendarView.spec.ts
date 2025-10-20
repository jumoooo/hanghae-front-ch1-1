import { act, renderHook } from '@testing-library/react';

import { useCalendarView } from '../../hooks/useCalendarView.ts';
// import { assertDate } from '../utils.ts';

const toDay = new Date();

/**
 * type Date 인자를 '2025-10-10' 으로 포맷 하는 함수
 * @param date
 * @returns '2025-10-10' 으로 포맷
 */
const formatDateMock = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;
};
describe('초기 상태', () => {
  it('view는 "month"이어야 한다', () => {
    const { result } = renderHook(() => useCalendarView());
    const expectedData = 'month';

    expect(result.current.view).toBe(expectedData);
  });

  it('currentDate는 오늘 날짜인 "2025-10-01"이어야 한다', () => {
    const { result } = renderHook(() => useCalendarView());
    const expectedData = formatDateMock(toDay); // 오늘 날짜 ex) 2025-10-21

    expect(formatDateMock(result.current.currentDate)).toEqual(expectedData);
  });

  it('holidays는 10월 휴일인 개천절, 한글날, 추석이 지정되어 있어야 한다', () => {
    const { result } = renderHook(() => useCalendarView());
    const expectedData = {
      '2025-10-05': '추석',
      '2025-10-06': '추석',
      '2025-10-07': '추석',
      '2025-10-03': '개천절',
      '2025-10-09': '한글날',
    };
    expect(result.current.holidays).toEqual(expectedData);
  });
});

describe('날짜 상태 변경', () => {
  it("view를 'week'으로 변경 시 적절하게 반영된다", () => {
    const { result } = renderHook(() => useCalendarView());
    const expectedData = 'week';
    act(() => {
      result.current.setView('week');
    });
    expect(result.current.view).toEqual(expectedData);
  });

  it("주간 뷰에서 다음으로 navigate시 7일 후 '2025-10-08' 날짜로 지정이 된다", () => {
    const { result } = renderHook(() => useCalendarView());
    const nextWeek = new Date(toDay);
    nextWeek.setDate(toDay.getDate() + 7);

    act(() => {
      result.current.setView('week');
    });
    act(() => {
      result.current.navigate('next');
    });
    expect(formatDateMock(result.current.currentDate)).toEqual(formatDateMock(nextWeek));
  });

  it("주간 뷰에서 이전으로 navigate시 7일 후 '2025-09-24' 날짜로 지정이 된다", () => {
    const { result } = renderHook(() => useCalendarView());
    const nextWeek = new Date(toDay);
    nextWeek.setDate(toDay.getDate() - 7);

    act(() => {
      result.current.setView('week');
    });
    act(() => {
      result.current.navigate('prev');
    });
    expect(formatDateMock(result.current.currentDate)).toEqual(formatDateMock(nextWeek));
  });

  it("월간 뷰에서 다음으로 navigate시 한 달 후 '2025-11-01' 날짜여야 한다", () => {
    const { result } = renderHook(() => useCalendarView());
    const nextMonth = new Date(toDay);
    nextMonth.setMonth(toDay.getMonth() + 1);
    nextMonth.setDate(1); // 날짜 1로 고정

    act(() => {
      result.current.navigate('next');
    });
    expect(formatDateMock(result.current.currentDate)).toEqual(formatDateMock(nextMonth));
  });

  it("월간 뷰에서 이전으로 navigate시 한 달 전 '2025-09-01' 날짜여야 한다", () => {
    const { result } = renderHook(() => useCalendarView());
    const prevMonth = new Date(toDay);
    prevMonth.setMonth(toDay.getMonth() - 1);
    prevMonth.setDate(1); // 날짜 1로 고정

    act(() => {
      result.current.navigate('prev');
    });
    expect(formatDateMock(result.current.currentDate)).toEqual(formatDateMock(prevMonth));
  });

  it("currentDate가 '2025-03-01' 변경되면 3월 휴일 '삼일절'로 업데이트되어야 한다", async () => {
    const { result } = renderHook(() => useCalendarView());
    const expectData = { '2025-03-01': '삼일절' };

    act(() => {
      result.current.setCurrentDate(new Date('2025-03-01'));
    });
    expect(result.current.holidays).toEqual(expectData);
  });
});
