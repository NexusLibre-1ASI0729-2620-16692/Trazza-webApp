export class Money {
  static readonly CURRENCIES: Readonly<Record<string, string>> = Object.freeze({ PEN: 'S/' });

  readonly #amount: number;
  readonly #currency: string;

  constructor(props: { amount: number; currency?: string }) {
    const value = Number(props.amount);
    const currency = props.currency ?? 'PEN';
    if (props.amount === null || props.amount === undefined || !Number.isFinite(value) || value < 0) throw new Error('validation.money-invalid');
    if (!Object.hasOwn(Money.CURRENCIES, currency)) throw new Error('validation.currency-invalid');
    this.#amount = Math.round(value * 100) / 100;
    this.#currency = currency;
  }

  static zero(currency = 'PEN'): Money {
    return new Money({ amount: 0, currency });
  }

  get amount(): number {
    return this.#amount;
  }

  get currency(): string {
    return this.#currency;
  }

  get formatted(): string {
    const decimals = Number.isInteger(this.#amount) ? 0 : 2;
    return `${Money.CURRENCIES[this.#currency]} ${this.#amount.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: 2 })}`;
  }

  add(other: Money): Money {
    this.#assertSameCurrency(other);
    return new Money({ amount: this.#amount + other.amount, currency: this.#currency });
  }

  multiply(factor: number): Money {
    return new Money({ amount: this.#amount * factor, currency: this.#currency });
  }

  equals(other: Money): boolean {
    return other.amount === this.#amount && other.currency === this.#currency;
  }

  isGreaterThan(other: Money): boolean {
    this.#assertSameCurrency(other);
    return this.#amount > other.amount;
  }

  #assertSameCurrency(other: Money): void {
    if (other.currency !== this.#currency) throw new Error('validation.currency-mismatch');
  }
}
