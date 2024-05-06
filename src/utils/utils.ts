import { FetchResponse } from "@/types/responses/FetchResponse";
import dayjs from "dayjs";

/**
 * Utility functions
 */
export const utils = {
  /**
   * Custom fetch function
   * @param url - URL to fetch
   * @param options - fetch options
   * @returns - response from the fetch request
   */
  customFetch(
    url: string,
    options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions,
  ): FetchResponse {
    const res = UrlFetchApp.fetch(url, options);
    return {
      status: res.getResponseCode(),
      body: res.getContentText(),
    };
  },

  /**
   * Write data to a Google Spreadsheet
   * @param sheet - Google Spreadsheet sheet
   * @param dictArray - array of dictionaries to write to the sheet
   * @returns - void
   */
  writeSpreadsheet(
    sheet: GoogleAppsScript.Spreadsheet.Sheet,
    dictArray: { [key: string]: string | number }[],
  ): void {
    const keys = Object.keys(dictArray[0]);
    const range = sheet.getRange(1, 1, dictArray.length + 1, keys.length);
    range.setValues([
      keys,
      ...dictArray.map((dict) => keys.map((key) => dict[key])),
    ]);
  },

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
};
