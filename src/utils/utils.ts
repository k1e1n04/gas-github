import { FetchResponse } from "@/types/responses/FetchResponse";

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
};
