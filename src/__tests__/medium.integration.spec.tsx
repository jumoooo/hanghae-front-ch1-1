import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen, within, act, renderHook, fireEvent } from '@testing-library/react';
import { UserEvent, userEvent } from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { SnackbarProvider } from 'notistack';
import { ReactElement } from 'react';

import App from '../App';
import { server } from '../setupTests';
import { Event } from '../types';
import { setupMockHandlers } from '../__mocks__/handlersUtils';
import { useEventOperations } from '../hooks/useEventOperations';

// ! HINT. event를 추가 제거하고 저장하는 로직을 잘 살펴보고, 만약 그대로 구현한다면 어떤 문제가 있을 지 고민해보세요.
describe('일정 CRUD 및 기본 기능', () => {
  beforeEach(() => {
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
  });

  it('입력한 새로운 일정 정보에 맞춰 모든 필드가 이벤트 리스트에 정확히 저장된다.', async () => {
    render(<App />);
    const user = userEvent.setup();
    const { result } = renderHook(() => useEventOperations(true));
    const nowDate = new Date();

    const title_input = screen.getByLabelText('제목');
    const date_input = screen.getByLabelText('날짜');
    const startTime_input = screen.getByLabelText('시작 시간');
    const endTime_input = screen.getByLabelText('종료 시간');
    const description_input = screen.getByLabelText('설명');
    const location_input = screen.getByLabelText('위치');
    const category_input = screen.getByLabelText('카테고리');
    const repeatType_checkbox = screen.getByLabelText('반복 일정');
    // const notificationTime_input = screen.getByLabelText('알림 설정');

    await user.type(title_input, '회의 일정 테스트');
    fireEvent.change(date_input, { target: { value: '2025-10-20' } });
    fireEvent.change(startTime_input, { target: { value: '01:00' } });
    fireEvent.change(endTime_input, { target: { value: '02:00' } });
    await user.type(description_input, '설명 추가 기입');
    await user.type(location_input, '위치 기입 테스트');

    // await user.click(category_input);
    // const familyOption = await screen.findByRole('option', { name: '가족' });
    // await user.click(familyOption);

    await user.click(category_input);
    const menu = await screen.findByRole('listbox'); // 비동기 탐색
    const familyOption = within(menu).getByRole('option', { name: '가족' });
    await user.click(familyOption);
    // await user.type(title_input, '회의 일정 테스트');
    // await user.type(title_input, '회의 일정 테스트');
    // await user.type(title_input, '회의 일정 테스트');
    // await user.type(title_input, '회의 일정 테스트');
    // await user.type(title_input, '회의 일정 테스트');
    // await user.type(title_input, '회의 일정 테스트');
    await userEvent.click(repeatType_checkbox);
    // await user.type(title_input, '회의 일정 테스트');

    expect(title_input).toHaveValue('회의 일정 테스트');
    expect(repeatType_checkbox).not.toBeChecked();
    expect(date_input).toHaveValue('2025-10-20');
    expect(startTime_input).toHaveValue('01:00');
    expect(description_input).toHaveValue('설명 추가 기입');
    expect(location_input).toHaveValue('위치 기입 테스트');
    expect(category_input).toHaveValue('위치 기입 테스트');
    expect(category_input).toHaveTextContent('가족');
  });

  it('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영된다', async () => {});

  it('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {});
});

describe('일정 뷰', () => {
  it('주별 뷰를 선택 후 해당 주에 일정이 없으면, 일정이 표시되지 않는다.', async () => {});

  it('주별 뷰 선택 후 해당 일자에 일정이 존재한다면 해당 일정이 정확히 표시된다', async () => {});

  it('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {});

  it('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {});

  it('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {});
});

describe('검색 기능', () => {
  it('검색 결과가 없으면, "검색 결과가 없습니다."가 표시되어야 한다.', async () => {});

  it("'팀 회의'를 검색하면 해당 제목을 가진 일정이 리스트에 노출된다", async () => {});

  it('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {});
});

describe('일정 충돌', () => {
  it('겹치는 시간에 새 일정을 추가할 때 경고가 표시된다', async () => {});

  it('기존 일정의 시간을 수정하여 충돌이 발생하면 경고가 노출된다', async () => {});
});

it('notificationTime을 10으로 하면 지정 시간 10분 전 알람 텍스트가 노출된다', async () => {});
