import { act, renderHook, waitFor } from '@testing-library/react';
// import { http, HttpResponse } from 'msw';

import {
  setupMockHandlers,
  // setupMockHandlerDeletion,
  // setupMockHandlerUpdating,
} from '../../__mocks__/handlersUtils.ts';
import { useEventOperations } from '../../hooks/useEventOperations.ts';
// import { server } from '../../setupTests.ts';
import { Event } from '../../types.ts';
// import { wait } from '@testing-library/user-event/dist/cjs/utils/index.js';
import { useNotifications } from '../../hooks/useNotifications.ts';

const enqueueSnackbarFn = vi.fn();

vi.mock('notistack', async () => {
  const actual = await vi.importActual('notistack');
  return {
    ...actual,
    useSnackbar: () => ({
      enqueueSnackbar: enqueueSnackbarFn,
    }),
  };
});
describe('useEventOperations 네트워크 정상시 테스트', () => {
  it('저장되어있는 초기 이벤트 데이터를 적절하게 불러온다', async () => {
    setupMockHandlers([
      {
        id: '1',
        title: '기존 회의2',
        date: '2025-10-15',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ]);
    const { result } = renderHook(() => useEventOperations(false));
    const expectedData = [
      {
        id: '1',
        title: '기존 회의2',
        date: '2025-10-15',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ];
    await act(async () => {
      await result.current.fetchEvents();
    });

    await waitFor(() => {
      expect(result.current.events).toEqual(expectedData);
    });
  });

  it('정의된 이벤트 정보를 기준으로 적절하게 저장이 된다', async () => {
    setupMockHandlers([
      {
        id: '1',
        title: '기존 회의2',
        date: '2025-10-15',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ]);
    const { result } = renderHook(() => useEventOperations(false));
    const saveEventData: Event = {
      id: '2',
      title: '추가 회의',
      date: '2025-10-22',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 A',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };
    const expectedData = [
      {
        id: '1',
        title: '기존 회의2',
        date: '2025-10-15',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '추가 회의',
        date: '2025-10-22',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 A',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ];
    act(() => {
      result.current.saveEvent(saveEventData);
    });
    await waitFor(() => {
      expect(result.current.events).toEqual(expectedData);
    });
  });

  it("새로 정의된 'title', 'endTime' 기준으로 적절하게 일정이 업데이트 된다", async () => {
    const { result } = renderHook(() => useEventOperations(true));

    const editEventData: Event = {
      id: '1',
      title: '기존 회의 제목 수정',
      date: '2025-10-15',
      startTime: '09:00',
      endTime: '11:55',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };
    act(() => {
      result.current.saveEvent(editEventData);
    });
    await waitFor(() => {
      expect(result.current.events).toEqual([editEventData]);
    });
  });

  it('존재하는 이벤트 삭제 시 에러없이 아이템이 삭제된다.', async () => {
    setupMockHandlers([
      {
        id: '1',
        title: '기존 회의 제목 수정',
        date: '2025-10-15',
        startTime: '09:00',
        endTime: '11:55',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ]);
    const { result } = renderHook(() => useEventOperations(false));
    const delete_id = '1';

    act(() => {
      result.current.deleteEvent(delete_id);
    });
    await waitFor(() => {
      expect(enqueueSnackbarFn).not.toHaveBeenCalledWith('이벤트 로딩 실패', {
        variant: 'error',
      });
      expect(result.current.events).toEqual([]);
    });
  });

  it("존재하지 않는 이벤트 수정 시 '일정 저장 실패'라는 토스트가 노출되며 에러 처리가 되어야 한다", async () => {
    setupMockHandlers([
      {
        id: '1',
        title: '기존 회의 제목 수정',
        date: '2025-10-15',
        startTime: '09:00',
        endTime: '11:55',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ]);
    const { result } = renderHook(() => useEventOperations(true));

    const editEventData: Event = {
      id: '2',
      title: '기존 회의 제목 수정',
      date: '2025-10-15',
      startTime: '09:00',
      endTime: '11:55',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };
    act(() => {
      result.current.saveEvent(editEventData);
    });
    await waitFor(() => {
      expect(enqueueSnackbarFn).toHaveBeenCalledWith('일정 저장 실패', {
        variant: 'error',
      });
    });
  });
});
describe('useEventOperations 네트워크 오류시 테스트', () => {
  let originalFetch: typeof global.fetch;

  beforeAll(() => {
    originalFetch = global.fetch;
  });
  beforeEach(() => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network Error')));
  });
  afterAll(() => {
    global.fetch = originalFetch;
  });

  it("이벤트 로딩 실패 시 '이벤트 로딩 실패'라는 텍스트와 함께 에러 토스트가 표시되어야 한다", async () => {
    setupMockHandlers([
      {
        id: '1',
        title: '기존 회의 제목 수정',
        date: '2025-10-15',
        startTime: '09:00',
        endTime: '11:55',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ]);
    const { result } = renderHook(() => useEventOperations(false));
    await act(async () => {
      await result.current.fetchEvents();
    });
    await waitFor(() => {
      expect(enqueueSnackbarFn).toHaveBeenCalledWith('이벤트 로딩 실패', {
        variant: 'error',
      });
    });
  });

  it("네트워크 오류 시 '일정 삭제 실패'라는 텍스트가 노출되며 이벤트 삭제가 실패해야 한다", async () => {
    let events: Event[] = [
      {
        id: '1',
        title: '기존 회의 제목 수정',
        date: '2025-10-15',
        startTime: '09:00',
        endTime: '11:55',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ];
    setupMockHandlers(events);
    const { result } = renderHook(() => useEventOperations(true));
    const delete_id = '1';

    await act(async () => {
      await result.current.deleteEvent(delete_id);
    });
    await waitFor(() => {
      expect(enqueueSnackbarFn).toHaveBeenCalledWith('일정 삭제 실패', {
        variant: 'error',
      });
    });
  });
});
