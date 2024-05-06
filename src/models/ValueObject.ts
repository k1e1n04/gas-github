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
   * Convert the object to the record format
   *
   * @returns - record
   */
  public toRecord(): Record<string, unknown> {
    return JSON.parse(JSON.stringify(this));
  }
}
