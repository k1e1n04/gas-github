import { spreadSheetUtil } from "@/utils/spreadSheetUtil";

const mockSpreadsheetApp = (): any => {
  const app: any = {};
  const methods = ["getActiveSpreadsheet", "getActiveSheet", "getActiveRange"];

  methods.forEach((method) => {
    app[method] = jest.fn();
  });

  return app;
};
global.SpreadsheetApp = mockSpreadsheetApp();

describe("spreadSheetUtil", () => {
  let spy: jest.SpyInstance;
  let mockSpreadSheet: any;
  let mockSheet: any;
  let mockRange: any;

  beforeEach(() => {
    jest.clearAllMocks();
    spy = jest.spyOn(SpreadsheetApp, "getActiveSpreadsheet");
    mockSpreadSheet = {
      getSheetByName: jest.fn(),
    };
    mockSheet = {
      getRange: jest.fn(),
      getLastRow: jest.fn(),
      getLastColumn: jest.fn(),
    };
    mockRange = {
      setValues: jest.fn(),
      getValues: jest.fn(),
    };
    spy.mockReturnValue(mockSpreadSheet);
    mockSpreadSheet.getSheetByName.mockReturnValue(mockSheet);
    mockSheet.getRange.mockReturnValue(mockRange);
  });

  describe("fetchLatestData", () => {
    it("should write data to a Google Spreadsheet if the sheet is empty", async () => {
      mockSheet.getLastRow.mockReturnValue(0);

      const dictArray: Record<string, unknown>[] = [
        { name: "John", age: 30 },
        { name: "Jane", age: 25 },
      ];

      spreadSheetUtil.appendDataToSpreadsheet("sheetName", dictArray);

      // Check the first call to getRange for setting the header row
      expect(mockSheet.getRange).toHaveBeenNthCalledWith(
        1,
        1,
        1,
        1,
        Object.keys(dictArray[0]).length,
      );
      expect(mockRange.setValues).toHaveBeenCalledWith([
        Object.keys(dictArray[0]),
      ]);

      // Check the second call to getRange for appending new data
      expect(mockSheet.getRange).toHaveBeenNthCalledWith(
        2,
        2,
        1,
        dictArray.length,
        Object.keys(dictArray[0]).length,
      );
      expect(mockRange.setValues).toHaveBeenCalledWith(
        dictArray.map((record) =>
          Object.keys(dictArray[0]).map((key) => record[key]),
        ),
      );
    });

    it("should write data to a Google Spreadsheet if the sheet is not empty", async () => {
      mockSheet.getLastRow.mockReturnValue(2);

      const dictArray: Record<string, unknown>[] = [
        { name: "John", age: 30 },
        { name: "Jane", age: 25 },
      ];

      spreadSheetUtil.appendDataToSpreadsheet("sheetName", dictArray);

      // Check the first call to getRange for appending new data
      expect(mockSheet.getRange).toHaveBeenNthCalledWith(
        1,
        3,
        1,
        dictArray.length,
        Object.keys(dictArray[0]).length,
      );
      expect(mockRange.setValues).toHaveBeenCalledWith(
        dictArray.map((record) =>
          Object.keys(dictArray[0]).map((key) => record[key]),
        ),
      );
    });

    it("should not write data to a Google Spreadsheet if the data is empty", async () => {
      const dictArray: Record<string, unknown>[] = [];
      spreadSheetUtil.appendDataToSpreadsheet("sheetName", dictArray);

      expect(mockSheet.getRange).not.toHaveBeenCalled();
      expect(mockRange.setValues).not.toHaveBeenCalled();
    });
  });

  describe("fetchLatestData", () => {
    it("should fetch the latest data from a Google Spreadsheet", async () => {
      const mockData = {
        name: "John",
        age: "30",
      };
      mockSheet.getLastRow.mockReturnValue(2);
      mockSheet.getLastColumn.mockReturnValue(2);
      mockRange.getValues.mockReturnValue([
        Object.keys(mockData),
        Object.values(mockData),
      ]);

      const result = spreadSheetUtil.fetchLatestData("sheetName");

      expect(result).toEqual(mockData);
    });

    it("should return undefined if the sheet does not exist", async () => {
      mockSpreadSheet.getSheetByName.mockReturnValue(undefined);

      const result = spreadSheetUtil.fetchLatestData("sheetName");

      expect(result).toBeUndefined();
    });

    it("should return undefined if the sheet is empty", async () => {
      mockSheet.getLastRow.mockReturnValue(0);

      const result = spreadSheetUtil.fetchLatestData("sheetName");

      expect(result).toBeUndefined();
    });
  });
});
