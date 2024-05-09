import { PullRequestReviewSummaryIngredients } from "@/types/params/PullRequestReviewSummaryIngredients";
import mockReviewList from "@/clients/data/ReviewList.json";
import { PullRequestReviewSummary } from "@/models/pulls/PullRequestReviewSummary";

describe("PullRequestReviewSummary", () => {
  it("should create a new PullRequestReviewSummary", () => {
    const mockIngredients: PullRequestReviewSummaryIngredients = {
      pullNumber: 1,
      repository: "test-repo",
      review: mockReviewList[0],
    };

    const result = PullRequestReviewSummary.new(mockIngredients);

    expect(result.pullNumber).toEqual(mockIngredients.pullNumber);
    expect(result.repository).toEqual(mockIngredients.repository);
    expect(result.reviewer).toEqual(mockIngredients.review.user?.login);
    expect(result.submittedAt).toEqual(mockIngredients.review.submitted_at);
  });

  it("should restore the PullRequestReviewSummary from the record", () => {
    const record: Record<string, string> = {
      pullNumber: "1",
      repository: "test-repo",
      reviewer: "test-user",
      submittedAt: "2021-01-01T00:00:00Z",
    };

    const result = PullRequestReviewSummary.from(record);

    expect(result.pullNumber).toEqual(Number(record.pullNumber));
    expect(result.repository).toEqual(record.repository);
    expect(result.reviewer).toEqual(record.reviewer);
    expect(result.submittedAt).toEqual(record.submittedAt);
  });
});
