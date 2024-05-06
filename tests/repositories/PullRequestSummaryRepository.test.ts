import { PullRequestSummaryRepository } from "@/repositories/PullRequestSummaryRepository";
import { PullRequestSummary } from "@/models/pulls/PullRequestSummary";
import { spreadSheetUtil } from "@/utils/spreadSheetUtil";

jest.mock("@/utils/spreadSheetUtil");

describe("PullRequestSummaryRepository", () => {
  let repository: PullRequestSummaryRepository;
  let mockSpreadSheetUtil = spreadSheetUtil as jest.Mocked<
    typeof spreadSheetUtil
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PullRequestSummaryRepository();
  });

  describe("store", () => {
    it("should store the PullRequestSummary data to the Google Spreadsheet", () => {
      const mockSummaries = [
        PullRequestSummary.from({
          pull_number: "1",
          repository: "test-repo",
          title: "test-title",
          user: "test-user",
          status: "open",
          milestone: "test-milestone",
          comments: "10",
          review_comments: "5",
          firstReviewedAt: "2022-01-01T00:00:00Z",
          commits: "2",
          additions: "100",
          deletions: "50",
          change_files: "3",
          draft: "false",
          created_at: "2022-01-01T00:00:00Z",
          updated_at: "2022-01-01T00:00:00Z",
          closed_at: "2022-01-01T00:00:00Z",
          merged_at: "2022-01-01T00:00:00Z",
          firstReviewRequestedAt: "2022-01-01T00:00:00Z",
          timeToFirstReview: "1000",
          timeToClose: "2000",
        }),
        PullRequestSummary.from({
          pull_number: "2",
          repository: "test-repo",
          title: "test-title",
          user: "test-user",
          status: "closed",
          milestone: "test-milestone",
          comments: "15",
          review_comments: "7",
          firstReviewedAt: "2022-01-01T00:00:00Z",
          commits: "3",
          additions: "150",
          deletions: "75",
          change_files: "4",
          draft: "false",
          created_at: "2022-01-01T00:00:00Z",
          updated_at: "2022-01-01T00:00:00Z",
          closed_at: "2022-01-01T00:00:00Z",
          merged_at: "2022-01-01T00:00:00Z",
          firstReviewRequestedAt: "2022-01-01T00:00:00Z",
          timeToFirstReview: "2000",
          timeToClose: "4000",
        }),
      ];

      repository.store(mockSummaries);

      expect(mockSpreadSheetUtil.appendDataToSpreadsheet).toHaveBeenCalledWith(
        "PullRequestSummary",
        mockSummaries.map((summary) => summary.toRecord()),
      );
    });
  });
});
