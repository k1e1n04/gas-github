/**
 * ValueObject abstract class
 */
export abstract class ValueObject {
  /**
   * Check if the object is equal to the other object
   * @param other - other object
   * @returns - true if the object is equal to the other object
   */
  public equals(other: ValueObject): boolean {
    return JSON.stringify(this) === JSON.stringify(other);
  }

  /**
   * Convert the object to the JSON string
   * @returns - JSON string
   */
  private toSnakeLowerCase(str: string): string {
    return str.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`);
  }

  /**
   * Convert the object to the record format with snake case keys
   *
   * @returns - record
   */
  public toRecord(): Record<string, unknown> {
    const record = JSON.parse(JSON.stringify(this));
    return Object.fromEntries(
      Object.entries(record).map(([key, value]) => [
        this.toSnakeLowerCase(key),
        value,
      ]),
    );
  }
}
