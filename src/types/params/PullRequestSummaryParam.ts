/**
 * Pull request summary parameters
 */
export type PullRequestSummaryParam = {
  readonly pull_number: number;
  readonly repository: string;
  readonly title: string;
  readonly user: string;
  readonly status: string;
  readonly firstReviewedAt?: string;
  readonly milestone?: string;
  readonly comments: number;
  readonly review_comments: number;
  readonly commits: number;
  readonly additions: number;
  readonly deletions: number;
  readonly change_files: number;
  readonly draft?: boolean;
  readonly created_at: string;
  readonly updated_at: string;
  readonly closed_at?: string | null;
  readonly merged_at?: string | null;
  readonly timeToFirstReview?: number;
  readonly timeToClose?: number;
};
