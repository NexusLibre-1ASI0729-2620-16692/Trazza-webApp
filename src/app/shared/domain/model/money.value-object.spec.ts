import {Money} from './money.value-object';

describe('Money', () => {
  it('formats soles without decimals for integers', () => {
    expect(new Money({ amount: 180 }).formatted).toBe('S/ 180');
  });

  it('formats soles with two decimals', () => {
    expect(new Money({ amount: 39.9 }).formatted).toBe('S/ 39.90');
  });

  it('rejects negative amounts', () => {
    expect(() => new Money({ amount: -1 })).toThrowError('validation.money-invalid');
  });

  it('adds amounts of the same currency', () => {
    expect(new Money({ amount: 10 }).add(new Money({ amount: 5.5 })).amount).toBe(15.5);
  });
});
