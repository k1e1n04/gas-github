/**
 * Utility functions for Google Spreadsheet
 */
export const spreadSheetUtil = {
  /**
   * Append data to a Google Spreadsheet
   * @param sheetName - name of the sheet
   * @param records - data to append
   * @returns - void
   */
  appendDataToSpreadsheet(
    sheetName: string,
    records: Record<string, unknown>[],
  ): void {
    if (records.length === 0) {
      return;
    }
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      // If the sheet does not exist, create a new sheet
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetName);
    }
    const keys = Object.keys(records[0]);
    const lastRow = sheet.getLastRow();

    // If the sheet is empty, set the header row
    if (lastRow === 0) {
      const rangeForHeader = sheet.getRange(1, 1, 1, keys.length);
      rangeForHeader.setValues([keys]);
    }

    const rangeForNewData = sheet.getRange(
      // If the sheet is empty, start from the second row
      lastRow === 0 ? 2 : lastRow + 1,
      1,
      records.length,
      keys.length,
    );
    // Append new data
    rangeForNewData.setValues(
      records.map((record) => keys.map((key) => record[key])),
    );
  },

  /**
   * Fetch the latest data from a Google Spreadsheet
   * @param sheetName - name of the sheet
   * @returns - latest data
   */
  fetchLatestData(sheetName: string): Record<string, string> | undefined {
    const sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      return undefined;
    }
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      return undefined;
    }
    const lastColumn = sheet.getLastColumn();
    const range = sheet.getRange(lastRow, 1, 1, lastColumn);
    const values = range.getValues();
    const keys = values[0];
    const data = values[1];
    return keys.reduce(
      (acc, key, index) => {
        acc[key] = data[index];
        return acc;
      },
      {} as Record<string, unknown>,
    );
  },
};
