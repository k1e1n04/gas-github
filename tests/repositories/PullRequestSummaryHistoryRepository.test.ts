import { PullRequestSummaryHistoryRepository } from "@/repositories/PullRequestSummaryHistoryRepository";
import { PullRequestSummaryHistory } from "@/models/pulls/PullRequestSummaryHistory";
import { spreadSheetUtil } from "@/utils/spreadSheetUtil";

jest.mock("@/utils/spreadSheetUtil");

describe("PullRequestSummaryHistoryRepository", () => {
  let repository: PullRequestSummaryHistoryRepository;
  const mockSpreadSheetUtil = spreadSheetUtil as jest.Mocked<
    typeof spreadSheetUtil
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PullRequestSummaryHistoryRepository();
  });

  describe("store", () => {
    it("should store the PullRequestSummaryHistory data to the Google Spreadsheet", () => {
      const mockRecord = {
        date: "2022-01-01",
        prCount: "10",
        lastPrUpdatedAt: "2022-01-01",
      };
      const mockHistory = PullRequestSummaryHistory.from(mockRecord);

      repository.store(mockHistory);

      expect(mockSpreadSheetUtil.appendDataToSpreadsheet).toHaveBeenCalledWith(
        "PullRequestSummaryHistory",
        [mockHistory.toRecord()],
      );
    });
  });

  describe("getLatest", () => {
    it("should get the latest PullRequestSummaryHistory data from the Google Spreadsheet", () => {
      const mockRecord = {
        date: "2022-01-01",
        prCount: "10",
        lastPrUpdatedAt: "2022-01-01",
      };
      mockSpreadSheetUtil.fetchLatestData.mockReturnValue(mockRecord);

      const result = repository.getLatest();

      expect(mockSpreadSheetUtil.fetchLatestData).toHaveBeenCalledWith(
        "PullRequestSummaryHistory",
      );
      expect(result).toEqual(PullRequestSummaryHistory.from(mockRecord));
    });

    it("should return undefined if there is no latest record", () => {
      mockSpreadSheetUtil.fetchLatestData.mockReturnValue(undefined);

      const result = repository.getLatest();

      expect(mockSpreadSheetUtil.fetchLatestData).toHaveBeenCalledWith(
        "PullRequestSummaryHistory",
      );
      expect(result).toBeUndefined();
    });
  });
});
