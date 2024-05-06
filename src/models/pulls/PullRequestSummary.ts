import { PullRequestSummaryIngredients } from "@/types/params/PullRequestSummaryIngredients";
import { datetimeUtil } from "@/utils/datetimeUtil";
import { ValueObject } from "@/models/ValueObject";

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
  readonly closed_at?: string;

  /**
   * Merged at
   */
  readonly merged_at?: string;

  /**
   * First reviewed at
   */
  readonly firstReviewedAt?: string;

  /**
   * Time taken to close the pull request
   */
  readonly timeToClose: number;

  /**
   * Time taken to first review
   */
  readonly timeToFirstReview: number;

  /**
   * Time taken to close the pull request
   *
   * @returns - time taken to close the pull request
   */
  private getTimeToClose(): number {
    if (this.merged_at) {
      return datetimeUtil.diffHour(this.created_at, this.merged_at);
    } else {
      return datetimeUtil.diffHour(this.created_at, this.closed_at);
    }
  }

  /**
   * Time taken to first review
   *
   * @returns - time taken to first review
   */
  private getTimeToFirstReview(): number {
    if (this.firstReviewedAt) {
      return datetimeUtil.diffHour(this.created_at, this.firstReviewedAt);
    } else {
      return 0;
    }
  }

  /**
   * @param ingredients
   * @constructor
   */
  constructor(ingredients: PullRequestSummaryIngredients) {
    super();
    this.pull_number = ingredients.pr.number;
    this.repository = ingredients.repository;
    this.title = ingredients.pr.title;
    this.user = ingredients.pr.user.login;
    this.status = ingredients.pr.state;
    this.milestone = ingredients.pr.milestone?.title;
    this.comments = ingredients.pr.comments;
    this.review_comments = ingredients.pr.review_comments;
    this.commits = ingredients.pr.commits;
    this.additions = ingredients.pr.additions;
    this.deletions = ingredients.pr.deletions;
    this.change_files = ingredients.pr.changed_files;
    this.draft = ingredients.pr.draft;
    this.created_at = ingredients.pr.created_at;
    this.updated_at = ingredients.pr.updated_at;
    this.closed_at = ingredients.pr.closed_at;
    this.merged_at = ingredients.pr.merged_at;
    this.firstReviewedAt =
      ingredients.reviews.length > 0
        ? ingredients.reviews[0].submitted_at
        : undefined;
    this.timeToFirstReview = this.getTimeToFirstReview();
    this.timeToClose = this.getTimeToClose();
    Object.freeze(this);
  }
}
