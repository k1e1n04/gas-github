import { PullRequestSummaryIngredients } from "@/types/params/PullRequestSummaryIngredients";
import {utils} from "@/utils/utils";

export class PullRequestSummary {
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
   * Milestone
   */
  readonly milestone: string;

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
   * Closed at
   */
  readonly closed_at?: string;

  /**
   * Merged at
   */
  readonly merged_at?: string;

  /**
   * Time taken to close the pull request
   *
   * @returns - time taken to close the pull request
   */
  get timeToClose(): number {
    if (this.merged_at) {
      return utils.diffHour(this.created_at, this.merged_at);
    } else {
      return utils.diffHour(this.created_at, this.closed_at);
    }
  }

  /**
   * @param ingredients
   * @constructor
   */
  constructor(ingredients: PullRequestSummaryIngredients) {
    this.pull_number = ingredients.pr.number;
    this.repository = ingredients.repository;
    this.title = ingredients.pr.title;
    this.user = ingredients.pr.user.login;
    this.milestone = ingredients.pr.milestone.title;
    this.comments = ingredients.pr.comments;
    this.review_comments = ingredients.pr.review_comments;
    this.commits = ingredients.pr.commits;
    this.additions = ingredients.pr.additions;
    this.deletions = ingredients.pr.deletions;
    this.change_files = ingredients.pr.changed_files;
    this.draft = ingredients.pr.draft;
    this.created_at = ingredients.pr.created_at;
    this.closed_at = ingredients.pr.closed_at;
    this.merged_at = ingredients.pr.merged_at;
  }
}
