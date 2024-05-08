import { ReviewResponse } from "@/types/responses/reviews/ReviewResponse";

/**
 * Pull request review summary ingredients type
 */
export type PullRequestReviewSummaryIngredients = {
  /**
   * Review
   */
  review: ReviewResponse;
  /**
   * Pull request number
   */
  pullNumber: number;
  /**
   * Repository name
   */
  repository: string;
};
