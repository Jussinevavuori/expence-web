export class MoneyAmount {
  /**
   * Value of money amount as integer in cents
   */
  private _value: number;

  /**
   * Construct a money amount from an integer value in cents.
   *
   * @throws Error if input value is not an integer.
   */
  constructor(cents: number) {
    if (Math.trunc(cents) !== cents) {
      throw new Error("Cannot construct money amount from non-integer value");
    }
    this._value = cents;
  }

  /**
   * The money amount's value as an integer in cents.
   */
  get value(): number {
    return this._value;
  }

  /**
   * The money amount's value in euros.
   */
  get decimalValue(): number {
    return this._value / 100;
  }

  /**
   * Get the value in euros as an integer
   */
  get euros() {
    return Math.trunc(this._value / 100);
  }

  /**
   * Get the amount of cents in value
   *
   * Returns the remainder when converting the value to euros,
   * i.e. a value between 0 - 99, not the full value counted in cents.
   */
  get cents() {
    return Math.floor(Math.abs(this._value) % 100);
  }

  /**
   * Gets the sign of the money amount
   *
   * - Returns -1 for negative money amounts
   * - Returns 0 for zero amounts
   * - Returns +1 for positive money amounts
   */
  get sign(): -1 | 0 | 1 {
    return this._value === 0 ? 0 : this._value > 0 ? 1 : -1;
  }

  /**
   * True if the amount is a positive amount (> 0)
   */
  get isPositive() {
    return this._value > 0;
  }

  /**
   * True if the amount is a positive amount or zero (>= 0)
   */
  get isNonNegative() {
    return this._value >= 0;
  }

  /**
   * True if the amount is zero (== 0)
   */
  get isZero() {
    return this._value === 0;
  }

  /**
   * True if the amount is a negative amount or zero (<= 0)
   */
  get isNonPositive() {
    return this._value <= 0;
  }

  /**
   * True if the amount is a negative amount (< 0)
   */
  get isNegative() {
    return this._value < 0;
  }

  /**
   * Format the money amount to a string according to the given options
   */
  format(): string {
    return this.decimalValue.toLocaleString("fi-FI", {
      style: "currency",
      currency: "EUR",
    });
  }

  add(that: MoneyAmount) {
    return new MoneyAmount(this._value + that._value);
  }

  subtract(that: MoneyAmount) {
    return new MoneyAmount(this._value - that._value);
  }

  static sum(values: MoneyAmount[]) {
    return values.reduce((sum, value) => sum.add(value), new MoneyAmount(0));
  }
}