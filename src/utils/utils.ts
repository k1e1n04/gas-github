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
   * Append data to a Google Spreadsheet
   * @param sheet - Google Spreadsheet sheet
   * @param records - data to append
   * @returns - void
   */
  appendDataToSpreadsheet(
    sheet: GoogleAppsScript.Spreadsheet.Sheet,
    records: Record<string, unknown>[],
  ): void {
    if (records.length === 0) {
      return;
    }
    const keys = Object.keys(records[0]);
    const lastRow = sheet.getLastRow();
    const rangeForNewData = sheet.getRange(
      lastRow + 1,
      1,
        records.length,
      keys.length,
    );

    // If the sheet is empty, set the header row
    if (lastRow === 0) {
      const rangeForHeader = sheet.getRange(1, 1, 1, keys.length);
      rangeForHeader.setValues([keys]);
    }

    // Append new data
    rangeForNewData.setValues(
      records.map((record) => keys.map((key) => record[key])),
    );
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
