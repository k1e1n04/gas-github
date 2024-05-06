import { PullRequestSummaryHistory } from "@/models/pulls/PullRequestSummaryHistory";
import { utils } from "@/utils/utils";

/**
 * This class is responsible for handling the data access of the PullRequestSummaryHistory entity.
 */
export class PullRequestSummaryHistoryRepository {
  private readonly sheetName: string = "PullRequestSummaryHistory";

  /**
   * Store the PullRequestSummaryHistory data to the Google Spreadsheet
   * @param history - PullRequestSummaryHistory
   */
  store(history: PullRequestSummaryHistory): void {
    utils.appendDataToSpreadsheet(this.sheetName, [history.toRecord()]);
  }

  /**
   * Get the latest PullRequestSummaryHistory data from the Google Spreadsheet
   * @returns PullRequestSummaryHistory
   */
  getLatest(): PullRequestSummaryHistory | undefined {
    const record = utils.fetchLatestData(this.sheetName);
    if (!record) {
      return undefined;
    }
    return record ? PullRequestSummaryHistory.from(record) : undefined;
  }
}
