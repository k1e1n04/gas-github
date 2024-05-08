import { ValueObject } from "@/models/ValueObject";
import { PullRequestReviewSummaryParam } from "@/types/params/PullRequestReviewSummaryParam";
import { PullRequestReviewSummaryIngredients } from "@/types/params/PullRequestReviewSummaryIngredients";

/**
 * Pull request review summary
 */
export class PullRequestReviewSummary extends ValueObject {
  /**
   * Pull request number
   */
  readonly pullNumber: number;

  /**
   * Repository name
   */
  readonly repository: string;

  /**
   * Reviewer
   */
  readonly reviewer?: string;

  /**
   * Review submitted at
   */
  readonly submittedAt: string;

  /**
   * Create PullRequestReviewSummary
   * @param param - PullRequestReviewSummaryParam
   * @private
   */
  private constructor(param: PullRequestReviewSummaryParam) {
    super();
    this.pullNumber = param.pullNumber;
    this.repository = param.repository;
    this.reviewer = param.reviewer;
    this.submittedAt = param.submittedAt;
    Object.freeze(this);
  }

  /**
   * Create PullRequestReviewSummary
   * @param ingredients - PullRequestReviewSummaryIngredients
   * @returns PullRequestReviewSummary
   * @static
   */
  public static new(
    ingredients: PullRequestReviewSummaryIngredients,
  ): PullRequestReviewSummary {
    return new PullRequestReviewSummary({
      pullNumber: ingredients.pullNumber,
      repository: ingredients.repository,
      reviewer: ingredients.review.user?.login,
      submittedAt: ingredients.review.submitted_at,
    });
  }

  /**
   * Restore the PullRequestReviewSummary from the record
   * @param record - Record<string, string>
   * @returns PullRequestReviewSummary
   */
  public static from(record: Record<string, string>): PullRequestReviewSummary {
    return new PullRequestReviewSummary({
      pullNumber: Number(record.pullNumber),
      repository: record.repository,
      reviewer: record.reviewer,
      submittedAt: record.submittedAt,
    });
  }
}
