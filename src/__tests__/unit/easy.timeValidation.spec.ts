import { getTimeErrorMessage, TimeValidationResult } from '../../utils/timeValidation';

describe('getTimeErrorMessage >', () => {
  const expectedData_valid: TimeValidationResult = {
    startTimeError: '시작 시간은 종료 시간보다 빨라야 합니다.',
    endTimeError: '종료 시간은 시작 시간보다 늦어야 합니다.',
  };
  const expectedData_null: TimeValidationResult = {
    startTimeError: null,
    endTimeError: null,
  };

  it('시작 시간이 종료 시간보다 늦을 때 에러 메시지를 반환한다', () => {
    const start = '10:25';
    const end = '10:20';
    expect(getTimeErrorMessage(start, end)).toEqual(expectedData_valid);
  });

  it('시작 시간과 종료 시간이 같을 때 에러 메시지를 반환한다', () => {
    const start = '10:25';
    const end = '10:25';
    expect(getTimeErrorMessage(start, end)).toEqual(expectedData_valid);
  });

  // it.each([
  //   { start: '10:25', end: '10:20', desc: '시작 시간과 종료 시간이 같을 때' },
  //   { start: '10:25', end: '10:25', desc: '시작 시간이 비어있을 때' },
  // ])('$desc 에러 메시지를 반환한다', ({ start, end }) => {
  //   expect(getTimeErrorMessage(start, end)).toEqual(expectedData_valid);
  // });

  it('시작 시간이 종료 시간보다 빠를 때 null을 반환한다', () => {
    const start = '10:20';
    const end = '10:25';
    expect(getTimeErrorMessage(start, end)).toEqual(expectedData_null);
  });

  it('시작 시간이 비어있을 때 null을 반환한다', () => {
    const start = '';
    const end = '10:25';
    expect(getTimeErrorMessage(start, end)).toEqual(expectedData_null);
  });

  it('종료 시간이 비어있을 때 null을 반환한다', () => {
    const start = '10:20';
    const end = '';
    expect(getTimeErrorMessage(start, end)).toEqual(expectedData_null);
  });

  it('시작 시간과 종료 시간이 모두 비어있을 때 null을 반환한다', () => {
    const start = '';
    const end = '';
    expect(getTimeErrorMessage(start, end)).toEqual(expectedData_null);
  });

  // it.each([
  //   { start: '10:20', end: '10:25', desc: '시작 시간이 종료 시간보다 빠를 때' },
  //   { start: '', end: '10:25', desc: '시작 시간이 비어있을 때' },
  //   { start: '10:20', end: '', desc: '종료 시간이 비어있을 때' },
  //   { start: '', end: '', desc: '시작 시간과 종료 시간이 모두 비어있을 때' },
  // ])('$desc null을 반환한다', ({ start, end }) => {
  //   expect(getTimeErrorMessage(start, end)).toEqual(expectedData_null);
  // });
});
