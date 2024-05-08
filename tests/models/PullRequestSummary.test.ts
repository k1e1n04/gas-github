import { PullRequestSummary } from "@/models/pulls/PullRequestSummary";
import { PullRequestSummaryIngredients } from "@/types/params/PullRequestSummaryIngredients";
import mockPullRequestDetail from "@/clients/data/PullRequestDetail.json";
import mockReviewList from "@/clients/data/ReviewList.json";
import { State } from "@/types/responses/State";
import dayjs from "dayjs";
import { spreadSheetUtil } from "@/utils/spreadSheetUtil";
describe("PullRequestSummary", () => {
  describe("new", () => {
    it("should create a new PullRequestSummary", () => {
      const mockIngredients: PullRequestSummaryIngredients = {
        pr: {
          ...mockPullRequestDetail,
          state: mockPullRequestDetail.state as State,
        },
        repository: "test-repo",
        reviews: mockReviewList,
      };

      const result = PullRequestSummary.new(mockIngredients);

      expect(result.pullNumber).toEqual(mockIngredients.pr.number);
      expect(result.title).toEqual(mockIngredients.pr.title);
      expect(result.user).toEqual(mockIngredients.pr.user.login);
      expect(result.status).toEqual(mockIngredients.pr.state);
      expect(result.milestone).toEqual(mockIngredients.pr.milestone?.title);
      expect(result.comments).toEqual(mockIngredients.pr.comments);
      expect(result.reviewComments).toEqual(mockIngredients.pr.review_comments);
      expect(result.commits).toEqual(mockIngredients.pr.commits);
      expect(result.additions).toEqual(mockIngredients.pr.additions);
      expect(result.deletions).toEqual(mockIngredients.pr.deletions);
      expect(result.changeFiles).toEqual(mockIngredients.pr.changed_files);
      expect(result.draft).toEqual(mockIngredients.pr.draft);
      expect(result.createdAt).toEqual(mockIngredients.pr.created_at);
      expect(result.updatedAt).toEqual(mockIngredients.pr.updated_at);
      expect(result.closedAt).toEqual(mockIngredients.pr.closed_at);
      expect(result.mergedAt).toEqual(mockIngredients.pr.merged_at);
      expect(result.firstReviewedAt).toEqual(
        mockIngredients.reviews[0].submitted_at,
      );
      expect(result.timeToFirstReview).toEqual(
        dayjs(mockIngredients.reviews[0].submitted_at).diff(
          dayjs(mockIngredients.pr.created_at),
          "hour",
        ),
      );
      expect(result.timeToClose).toEqual(spreadSheetUtil.defaultValueOfNull());
    });

    it("should create a new PullRequestSummary without mergedAt", () => {
      const mockIngredients: PullRequestSummaryIngredients = {
        pr: {
          ...mockPullRequestDetail,
          state: mockPullRequestDetail.state as State,
          merged_at: null,
        },
        repository: "test-repo",
        reviews: mockReviewList,
      };

      const result = PullRequestSummary.new(mockIngredients);

      expect(result.pullNumber).toEqual(mockIngredients.pr.number);
      expect(result.title).toEqual(mockIngredients.pr.title);
      expect(result.user).toEqual(mockIngredients.pr.user.login);
      expect(result.status).toEqual(mockIngredients.pr.state);
      expect(result.milestone).toEqual(mockIngredients.pr.milestone?.title);
      expect(result.comments).toEqual(mockIngredients.pr.comments);
      expect(result.reviewComments).toEqual(mockIngredients.pr.review_comments);
      expect(result.commits).toEqual(mockIngredients.pr.commits);
      expect(result.additions).toEqual(mockIngredients.pr.additions);
      expect(result.deletions).toEqual(mockIngredients.pr.deletions);
      expect(result.changeFiles).toEqual(mockIngredients.pr.changed_files);
      expect(result.draft).toEqual(mockIngredients.pr.draft);
      expect(result.createdAt).toEqual(mockIngredients.pr.created_at);
      expect(result.updatedAt).toEqual(mockIngredients.pr.updated_at);
      expect(result.closedAt).toEqual(mockIngredients.pr.closed_at);
      expect(result.mergedAt).toEqual(spreadSheetUtil.defaultValueOfNull());
      expect(result.firstReviewedAt).toEqual(
        mockIngredients.reviews[0].submitted_at,
      );
      expect(result.timeToFirstReview).toEqual(
        dayjs(mockIngredients.reviews[0].submitted_at).diff(
          dayjs(mockIngredients.pr.created_at),
          "hour",
        ),
      );
      expect(result.timeToClose).toEqual(spreadSheetUtil.defaultValueOfNull());
    });

    it("should create a new PullRequestSummary without reviews", () => {
      const mockIngredients: PullRequestSummaryIngredients = {
        pr: {
          ...mockPullRequestDetail,
          state: mockPullRequestDetail.state as State,
        },
        repository: "test-repo",
        reviews: [],
      };

      const result = PullRequestSummary.new(mockIngredients);

      expect(result.pullNumber).toEqual(mockIngredients.pr.number);
      expect(result.title).toEqual(mockIngredients.pr.title);
      expect(result.user).toEqual(mockIngredients.pr.user.login);
      expect(result.status).toEqual(mockIngredients.pr.state);
      expect(result.milestone).toEqual(mockIngredients.pr.milestone?.title);
      expect(result.comments).toEqual(mockIngredients.pr.comments);
      expect(result.reviewComments).toEqual(mockIngredients.pr.review_comments);
      expect(result.commits).toEqual(mockIngredients.pr.commits);
      expect(result.additions).toEqual(mockIngredients.pr.additions);
      expect(result.deletions).toEqual(mockIngredients.pr.deletions);
      expect(result.changeFiles).toEqual(mockIngredients.pr.changed_files);
      expect(result.draft).toEqual(mockIngredients.pr.draft);
      expect(result.createdAt).toEqual(mockIngredients.pr.created_at);
      expect(result.updatedAt).toEqual(mockIngredients.pr.updated_at);
      expect(result.closedAt).toEqual(mockIngredients.pr.closed_at);
      expect(result.mergedAt).toEqual(mockIngredients.pr.merged_at);
      expect(result.firstReviewedAt).toEqual(
        spreadSheetUtil.defaultValueOfNull(),
      );
      expect(result.timeToFirstReview).toEqual(
        spreadSheetUtil.defaultValueOfNull(),
      );
      expect(result.timeToClose).toEqual(spreadSheetUtil.defaultValueOfNull());
    });
  });

  describe("from", () => {
    it("should restore the PullRequestSummary from the record", () => {
      const mockRecord = {
        pull_number: "1",
        repository: "test-repo",
        title: "Test PR",
        user: "test-user",
        status: "open",
        milestone: "v1.0",
        comments: "10",
        review_comments: "5",
        commits: "2",
        additions: "100",
        deletions: "50",
        change_files: "3",
        draft: "false",
        created_at: "2022-01-01T00:00:00Z",
        updated_at: "2022-01-02T00:00:00Z",
        closed_at: "2022-01-03T00:00:00Z",
        merged_at: "2022-01-04T00:00:00Z",
        first_reviewed_at: "2022-01-02T00:00:00Z",
        time_to_first_review: "24",
        time_to_close: "72",
      };

      const result = PullRequestSummary.from(mockRecord);

      expect(result.pullNumber).toEqual(Number(mockRecord.pull_number));
      expect(result.repository).toEqual(mockRecord.repository);
      expect(result.title).toEqual(mockRecord.title);
      expect(result.user).toEqual(mockRecord.user);
      expect(result.status).toEqual(mockRecord.status);
      expect(result.milestone).toEqual(mockRecord.milestone);
      expect(result.comments).toEqual(Number(mockRecord.comments));
      expect(result.reviewComments).toEqual(Number(mockRecord.review_comments));
      expect(result.commits).toEqual(Number(mockRecord.commits));
      expect(result.additions).toEqual(Number(mockRecord.additions));
      expect(result.deletions).toEqual(Number(mockRecord.deletions));
      expect(result.changeFiles).toEqual(Number(mockRecord.change_files));
      expect(result.draft).toEqual(mockRecord.draft === "true");
      expect(result.createdAt).toEqual(mockRecord.created_at);
      expect(result.updatedAt).toEqual(mockRecord.updated_at);
      expect(result.closedAt).toEqual(mockRecord.closed_at);
      expect(result.mergedAt).toEqual(mockRecord.merged_at);
      expect(result.firstReviewedAt).toEqual(mockRecord.first_reviewed_at);
      expect(result.timeToFirstReview).toEqual(
        Number(mockRecord.time_to_first_review),
      );
      expect(result.timeToClose).toEqual(Number(mockRecord.time_to_close));
    });
  });
});
