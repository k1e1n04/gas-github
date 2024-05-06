import dayjs from "dayjs";

/**
 * Datetime utility functions
 */
export const datetimeUtil = {
  /**
   * Get the difference in hours between two times
   * @param time1 - time 1
   * @param time2 - time 2
   * @returns - difference in hours
   */
  diffHour(time1: string, time2?: string): number {
    const date1 = dayjs(time1);
    const date2 = dayjs(time2);
    return date2.diff(date1, "hour");
  },

  /**
   * Get the current time
   */
  now(): string {
    return dayjs().format("YYYY-MM-DDTHH:mm:ss[Z]");
  },
};
