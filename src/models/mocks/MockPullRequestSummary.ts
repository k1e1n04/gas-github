import { PullRequestSummary } from "@/models/pulls/PullRequestSummary";

/**
 * Generate a mock PullRequestSummary
 * @param pull_number
 * @param repository
 * @param title
 * @param user
 * @param status
 * @param milestone
 * @param comments
 * @param review_comments
 * @param commits
 * @param firstReviewedAt
 * @param additions
 * @param deletions
 * @param change_files
 * @param draft
 * @param created_at
 * @param updated_at
 * @param closed_at
 * @param merged_at
 * @param firstReviewRequestedAt
 * @param timeToFirstReview
 * @param timeToClose
 */
export const generateMockPullRequestSummary = ({
  pull_number = 1,
  repository = "repository",
  title = "title",
  user = "user",
  status = "open",
  milestone = "milestone",
  comments = 10,
  review_comments = 5,
  commits = 2,
  firstReviewedAt = "2022-01-01T00 =00 =00Z",
  additions = 150,
  deletions = 75,
  change_files = 4,
  draft = "false",
  created_at = "2022-01-01T00 =00 =00Z",
  updated_at = "2022-01-01T00 =00 =00Z",
  closed_at = "2022-01-01T00 =00 =00Z",
  merged_at = "2022-01-01T00 =00 =00Z",
  firstReviewRequestedAt = "2022-01-01T00 =00 =00Z",
  timeToFirstReview = 2000,
  timeToClose = 4000,
}): PullRequestSummary => {
  return PullRequestSummary.from({
    pull_number: pull_number.toString(),
    repository: repository,
    title: title,
    user: user,
    status: status,
    milestone: milestone,
    comments: comments.toString(),
    review_comments: review_comments.toString(),
    commits: commits.toString(),
    additions: additions.toString(),
    deletions: deletions.toString(),
    change_files: change_files.toString(),
    draft: draft,
    created_at: created_at,
    updated_at: updated_at,
    closed_at: closed_at,
    merged_at: merged_at,
    firstReviewedAt: firstReviewedAt,
    timeToFirstReview: timeToFirstReview.toString(),
    timeToClose: timeToClose.toString(),
  });
};
