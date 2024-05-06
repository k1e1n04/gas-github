import { PullRequestSummaryIngredients } from "@/types/params/PullRequestSummaryIngredients";
import { datetimeUtil } from "@/utils/datetimeUtil";
import { ValueObject } from "@/models/ValueObject";
import { PullRequestSummaryParam } from "@/types/params/PullRequestSummaryParam";

/**
 * Pull request summary
 */
export class PullRequestSummary extends ValueObject {
  /**
   * Pull request number
   */
  readonly pull_number: number;

  /**
   * Repository name
   */
  readonly repository: string;

  /**
   * Pull request title
   */
  readonly title: string;

  /**
   * Username who created the pull request
   */
  readonly user: string;

  /**
   * Status
   */
  readonly status: string;

  /**
   * Milestone
   */
  readonly milestone?: string;

  /**
   * Number of comments
   */
  readonly comments: number;

  /**
   * Number of review comments
   */
  readonly review_comments: number;

  /**
   * Number of commits
   */
  readonly commits: number;

  /**
   * Number of additions
   */
  readonly additions: number;

  /**
   * Number of deletions
   */
  readonly deletions: number;

  /**
   * Number of changed files
   */
  readonly change_files: number;

  /**
   * Is draft
   */
  readonly draft?: boolean;

  /**
   * Created at
   */
  readonly created_at: string;

  /**
   * Updated at
   */
  readonly updated_at: string;

  /**
   * Closed at
   */
  readonly closed_at?: string | null;

  /**
   * Merged at
   */
  readonly merged_at?: string | null;

  /**
   * First reviewed at
   */
  readonly firstReviewedAt?: string;

  /**
   * Time taken to close the pull request
   */
  readonly timeToClose?: number;

  /**
   * Time taken to first review
   */
  readonly timeToFirstReview?: number;

  /**
   * Time taken to close the pull request
   *
   * @returns - time taken to close the pull request
   */
  private static getTimeToClose(
    created_at: string,
    merged_at: string | undefined | null,
    closed_at: string | undefined | null,
  ): number | undefined {
    if (merged_at) {
      return datetimeUtil.diffHour(created_at, merged_at);
    } else if (closed_at) {
      return datetimeUtil.diffHour(created_at, closed_at);
    } else {
      return undefined;
    }
  }

  /**
   * Time taken to first review
   *
   * @param firstReviewedAt - First reviewed at
   * @param created_at - Created at
   * @returns - time taken to first review
   */
  private static getTimeToFirstReview(
    firstReviewedAt: string | undefined,
    created_at: string,
  ): number | undefined {
    if (firstReviewedAt) {
      return datetimeUtil.diffHour(created_at, firstReviewedAt);
    } else {
      return undefined;
    }
  }

  /**
   * @param param - PullRequestSummaryParam
   * @constructor
   */
  private constructor(param: PullRequestSummaryParam) {
    super();
    this.pull_number = param.pull_number;
    this.repository = param.repository;
    this.title = param.title;
    this.user = param.user;
    this.status = param.status;
    this.milestone = param.milestone;
    this.comments = param.comments;
    this.review_comments = param.review_comments;
    this.commits = param.commits;
    this.additions = param.additions;
    this.deletions = param.deletions;
    this.change_files = param.change_files;
    this.draft = param.draft;
    this.created_at = param.created_at;
    this.updated_at = param.updated_at;
    this.closed_at = param.closed_at;
    this.merged_at = param.merged_at;
    this.firstReviewedAt = param.firstReviewedAt;
    this.timeToFirstReview = param.timeToFirstReview;
    this.timeToClose = param.timeToClose;
    Object.freeze(this);
  }

  /**
   * Create a new PullRequestSummary
   * @param ingredients - PullRequestSummaryIngredients
   * @returns PullRequestSummary
   */
  public static new(
    ingredients: PullRequestSummaryIngredients,
  ): PullRequestSummary {
    return new PullRequestSummary({
      pull_number: ingredients.pr.number,
      repository: ingredients.repository,
      title: ingredients.pr.title,
      user: ingredients.pr.user.login,
      status: ingredients.pr.state,
      milestone: ingredients.pr.milestone?.title,
      comments: ingredients.pr.comments,
      review_comments: ingredients.pr.review_comments,
      commits: ingredients.pr.commits,
      additions: ingredients.pr.additions,
      deletions: ingredients.pr.deletions,
      change_files: ingredients.pr.changed_files,
      draft: ingredients.pr.draft,
      created_at: ingredients.pr.created_at,
      updated_at: ingredients.pr.updated_at,
      closed_at: ingredients.pr.closed_at,
      merged_at: ingredients.pr.merged_at,
      firstReviewedAt:
        ingredients.reviews.length > 0
          ? ingredients.reviews[0].submitted_at
          : undefined,
      timeToFirstReview: this.getTimeToFirstReview(
        ingredients.reviews.length > 0
          ? ingredients.reviews[0].submitted_at
          : undefined,
        ingredients.pr.created_at,
      ),
      timeToClose: this.getTimeToClose(
        ingredients.pr.created_at,
        ingredients.pr.merged_at,
        ingredients.pr.closed_at,
      ),
    });
  }

  /**
   * Restore the PullRequestSummary from the record
   * @param record - Record
   * @returns PullRequestSummary
   */
  public static from(record: Record<string, string>): PullRequestSummary {
    return new PullRequestSummary({
      pull_number: Number(record.pull_number),
      repository: record.repository,
      title: record.title,
      user: record.user,
      status: record.status,
      milestone: record.milestone,
      comments: Number(record.comments),
      review_comments: Number(record.review_comments),
      commits: Number(record.commits),
      additions: Number(record.additions),
      deletions: Number(record.deletions),
      change_files: Number(record.change_files),
      draft: record.draft === "true",
      created_at: record.created_at,
      updated_at: record.updated_at,
      closed_at: record.closed_at,
      merged_at: record.merged_at,
      firstReviewedAt: record.firstReviewedAt,
      timeToFirstReview: record.timeToFirstReview
        ? Number(record.timeToFirstReview)
        : undefined,
      timeToClose: record.timeToClose ? Number(record.timeToClose) : undefined,
    });
  }
}
