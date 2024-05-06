import { PullRequestDetailResponse } from "@/types/responses/pulls/PullRequestDetailResponse";
import { ReviewResponse } from "@/types/responses/reviews/ReviewResponse";

/**
 * Pull request summary ingredients type
 */
export type PullRequestSummaryIngredients = {
  readonly repository: string;
  readonly pr: PullRequestDetailResponse;
  readonly reviews: ReviewResponse[];
};
