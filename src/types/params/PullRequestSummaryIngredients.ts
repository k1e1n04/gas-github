import { PullRequestDetailResponse } from "@/types/responses/pulls/PullRequestDetailResponse";

/**
 * Pull request summary ingredients type
 */
export type PullRequestSummaryIngredients = {
  readonly repository: string;
  readonly pr: PullRequestDetailResponse;
};
