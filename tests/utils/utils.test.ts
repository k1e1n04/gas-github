import { datetimeUtil } from "@/utils/datetimeUtil";

global.UrlFetchApp = {
  fetch: jest.fn(),
  fetchAll: jest.fn(),
  getRequest: jest.fn(),
};

describe("utils", () => {
  describe("customFetch", () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
      jest.clearAllMocks();
      spy = jest.spyOn(UrlFetchApp, "fetch");
    });

    it("should fetch data from the URL and return the response", () => {
      const url = "https://api.github.com";
      const options = {};

      spy.mockImplementation(() => {
        return {
          getResponseCode: () => 200,
          getContentText: () => "hello world",
        };
      });

      const res = datetimeUtil.customFetch(url, options);

      expect(res).toEqual({
        status: 200,
        body: "hello world",
      });
    });
  });

  describe("writeSpreadsheet", () => {
    let mockSheet: any;

    beforeEach(() => {
      mockSheet = {
        getRange: jest.fn().mockReturnThis(),
        setValues: jest.fn(),
      };
    });

    it("should write data to a Google Spreadsheet", () => {
      const dictArray = [
        { name: "John", age: 30 },
        { name: "Jane", age: 25 },
      ];

      datetimeUtil.writeSpreadsheet(mockSheet, dictArray);

      expect(mockSheet.getRange).toHaveBeenCalledWith(
        1,
        1,
        dictArray.length + 1,
        Object.keys(dictArray[0]).length,
      );
      expect(mockSheet.setValues).toHaveBeenCalledWith([
        ["name", "age"],
        ["John", 30],
        ["Jane", 25],
      ]);
    });
  });
});
