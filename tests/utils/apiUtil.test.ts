import { apiUtil } from "@/utils/apiUtil";

global.UrlFetchApp = {
  fetch: jest.fn(),
  fetchAll: jest.fn(),
  getRequest: jest.fn(),
};

describe("apiUtil", () => {
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
          getResponseCode: (): number => 200,
          getContentText: (): string => "hello world",
        };
      });

      const res = apiUtil.customFetch(url, options);

      expect(res).toEqual({
        status: 200,
        body: "hello world",
      });
    });
  });
});
