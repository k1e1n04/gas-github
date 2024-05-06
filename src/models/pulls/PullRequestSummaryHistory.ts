import { ValueObject } from "@/models/ValueObject";
import { PullRequestSummary } from "@/models/pulls/PullRequestSummary";
import { datetimeUtil } from "@/utils/datetimeUtil";

/**
 * Pull request summary history
 */
export class PullRequestSummaryHistory extends ValueObject {
  readonly date: string;
  readonly prCount: number;
  readonly lastPrUpdatedAt: string;

  /**
   * Constructor
   * @param date - Date
   * @param prCount - Pull request count
   * @param lastPrUpdatedAt - Last pull request updated at
   */
  private constructor(date: string, prCount: number, lastPrUpdatedAt: string) {
    super();
    this.date = date;
    this.prCount = prCount;
    this.lastPrUpdatedAt = lastPrUpdatedAt;
  }

  /**
   * Create a new PullRequestSummaryHistory
   * @param filteredPrSummaries - Filtered pull request summaries
   * @param lastPrSummaryHistory - Last pull request summary history
   * @returns PullRequestSummaryHistory
   */
  public static new(
    filteredPrSummaries: PullRequestSummary[],
    lastPrSummaryHistory?: PullRequestSummaryHistory,
  ): PullRequestSummaryHistory {
    return new PullRequestSummaryHistory(
      datetimeUtil.now(),
        filteredPrSummaries.length,
      this.getLastPrUpdatedAt(filteredPrSummaries) ||
        lastPrSummaryHistory?.lastPrUpdatedAt ||
        datetimeUtil.now(),
    );
  }

  /**
   * Restore the PullRequestSummaryHistory from the record
   * @param record - Record
   * @returns PullRequestSummaryHistory
   */
  public static from(
    record: Record<string, string>,
  ): PullRequestSummaryHistory {
    return new PullRequestSummaryHistory(
      record.date,
      Number(record.prCount),
      record.lastPrUpdatedAt,
    );
  }

  /**
   * Get the last pull request updated at
   * @param prSummaries - Pull request summaries
   * @returns Last pull request updated at
   * @private
   */
  private static getLastPrUpdatedAt(
    prSummaries: PullRequestSummary[],
  ): string | undefined {
    if (prSummaries.length === 0) {
      return undefined;
    }
    return prSummaries.reduce((currentSummary, nextSummary) => {
      return currentSummary.updated_at > nextSummary.updated_at
        ? currentSummary
        : nextSummary;
    }).updated_at;
  }
}
