import { fetchHolidays } from '../../apis/fetchHolidays';
describe('fetchHolidays', () => {
  // 공유일 1개만 반환 테스트
  it('주어진 월의 공휴일만 반환한다', () => {
    const inputData = new Date(2025, 11, 23); // 2025-12-23
    const expectedData = {
      '2025-12-25': '크리스마스',
    };
    expect(fetchHolidays(inputData)).toEqual(expectedData);
  });

  it('공휴일이 없는 월에 대해 빈 객체를 반환한다', () => {
    const inputData = new Date(2025, 1, 23); // 2025-02-23
    const expectedData = {};
    expect(fetchHolidays(inputData)).toEqual(expectedData);
  });

  it('여러 공휴일이 있는 월에 대해 모든 공휴일을 반환한다', () => {
    const inputData = new Date(2025, 0, 23); // 2025-01-23
    const expectedData = {
      '2025-01-01': '신정',
      '2025-01-29': '설날',
      '2025-01-30': '설날',
      '2025-01-31': '설날',
    };
    expect(fetchHolidays(inputData)).toEqual(expectedData);
  });
});
