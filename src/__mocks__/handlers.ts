import { http, HttpHandler, HttpResponse } from 'msw';

import { events } from '../__mocks__/response/events.json' assert { type: 'json' };
import { Event } from '../types';

// ! HARD
// ! 각 응답에 대한 MSW 핸들러를 작성해주세요. GET 요청은 이미 작성되어 있는 events json을 활용해주세요.
export const handlers: HttpHandler[] = [
  // 조회
  http.get('/api/events', async () => {
    if (events.length === 0) {
      return HttpResponse.json(null, { status: 500 });
    }
    return HttpResponse.json({ events }, { status: 200 });
  }),

  // 등록
  http.post('/api/events', async ({ request }) => {
    const newEvent = (await request.json()) as Event;
    events.push(newEvent);
    return HttpResponse.json({ newEvent }, { status: 201 });
  }),

  // 수정
  http.put('/api/events/:id', async ({ params, request }) => {
    const editEventData = (await request.json()) as Event;
    const index = events.findIndex((e) => e.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    events[index] = editEventData;
    return HttpResponse.json({ editEventData }, { status: 200 });
  }),

  // 삭제
  http.delete('/api/events/:id', ({ params }) => {
    const index = events.findIndex((e) => e.id === params.id);
    events.slice(index, 1);
    if (index === -1) {
      return HttpResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    return HttpResponse.json({ message: 'Success' }, { status: 204 });
  }),
];
