/**
 * PullRequestReviewSummaryParam
 */
export type PullRequestReviewSummaryParam = {
  readonly pullNumber: number;
  readonly repository: string;
  readonly reviewer?: string;
  readonly submittedAt: string;
};
