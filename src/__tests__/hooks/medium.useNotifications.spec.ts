import { act, renderHook, waitFor } from '@testing-library/react';

import { useNotifications } from '../../hooks/useNotifications.ts';
import { Event } from '../../types.ts';
import { formatDate } from '../../utils/dateUtils.ts';
import { parseHM } from '../utils.ts';

it('초기 상태에서는 알림이 없어야 한다', () => {
  let events: Event[] = [];
  const { result } = renderHook(() => useNotifications(events));
  expect(result.current.notifications).toEqual([]);
});

describe('useNotifications', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-10-15T09:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('지정된 시간이 된 경우 알림이 새롭게 생성되어 추가된다', async () => {
    const now = new Date();
    const future = new Date(now.getTime() + 10 * 60 * 1000);
    const startTime = `${future.getHours().toString().padStart(2, '0')}:${future
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    let events: Event[] = [
      {
        id: '1',
        title: '기존 회의',
        date: '2025-10-15',
        startTime,
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ];
    const { result } = renderHook(() => useNotifications(events));

    expect(result.current.notifications).toEqual([]);

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.notifications).toEqual([
      { id: '1', message: '10분 후 기존 회의 일정이 시작됩니다.' },
    ]);
  });

  it('이미 알림이 발생한 이벤트에 대해서는 중복 알림이 발생하지 않아야 한다', async () => {
    const now = new Date();
    const future = new Date(now.getTime() + 10 * 60 * 1000);
    const startTime = `${future.getHours().toString().padStart(2, '0')}:${future
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    let events: Event[] = [
      {
        id: '1',
        title: '기존 회의',
        date: '2025-10-15',
        startTime,
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ];
    const { result } = renderHook(() => useNotifications(events));

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.notifications).toHaveLength(1);

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.notifications).toHaveLength(1);
  });
});

it('index를 기준으로 알림을 적절하게 제거할 수 있다', () => {
  let events: Event[] = [];
  const { result } = renderHook(() => useNotifications(events));

  act(() => result.current.setNotifications([{ id: '1', message: '삭제될 메시지' }]));

  waitFor(() => {
    expect(events).toEqual([{ id: '1', message: '삭제될 메시지' }]);
    act(() => result.current.removeNotification(0));
  });

  expect(events).toEqual([]);
});
