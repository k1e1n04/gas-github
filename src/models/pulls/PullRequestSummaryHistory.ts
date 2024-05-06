import { ValueObject } from "@/models/ValueObject";
import { PullRequestSummary } from "@/models/pulls/PullRequestSummary";
import { utils } from "@/utils/utils";

/**
 * Pull request summary history
 */
export class PullRequestSummaryHistory extends ValueObject {
  readonly date: string;
  readonly prCount: number;
  readonly lastPrUpdatedAt: string;

  /**
   * Constructor
   * @param prSummaries - Pull request summaries
   * @param lastPrSummaryHistory - Last pull request summary history
   */
  constructor(
    prSummaries: PullRequestSummary[],
    lastPrSummaryHistory: PullRequestSummaryHistory,
  ) {
    super();
    this.date = utils.now();
    this.prCount = prSummaries.length;
    this.lastPrUpdatedAt =
      this.getLastPrUpdatedAt(prSummaries) ||
      lastPrSummaryHistory.lastPrUpdatedAt;
  }

  /**
   * Get the last pull request updated at
   * @param prSummaries - Pull request summaries
   * @returns Last pull request updated at
   * @private
   */
  private getLastPrUpdatedAt(
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
