import { PullRequestReviewSummaryRepository } from "@/repositories/PullRequestReviewSummaryRepository";
import { PullRequestReviewSummary } from "@/models/pulls/PullRequestReviewSummary";
import { spreadSheetUtil } from "@/utils/spreadSheetUtil";
import mockReviewList from "@/clients/data/ReviewList.json";

jest.mock("@/utils/spreadSheetUtil");
describe("PullRequestReviewSummaryRepository", () => {
  let repository: PullRequestReviewSummaryRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PullRequestReviewSummaryRepository();
  });
  describe("store", () => {
    it("should store the PullRequestReviewSummary data to the Google Spreadsheet", () => {
      const mockSummary = PullRequestReviewSummary.new({
        pullNumber: 1,
        repository: "test-repo",
        review: mockReviewList[0],
      });

      repository.store([mockSummary]);

      expect(spreadSheetUtil.appendDataToSpreadsheet).toHaveBeenCalledWith(
        "PullRequestReviewSummary",
        [mockSummary.toRecord()],
      );
    });
  });
});
