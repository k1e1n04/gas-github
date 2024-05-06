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
}
