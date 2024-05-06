import { PullRequestSummary } from "@/models/pulls/PullRequestSummary";
import { spreadSheetUtil } from "@/utils/spreadSheetUtil";

/**
 * This class is responsible for handling the data access of the PullRequestSummary entity.
 */
export class PullRequestSummaryRepository {
  private readonly sheetName: string = "PullRequestSummary";

  /**
   * Store the PullRequestSummary data to the Google Spreadsheet
   * @param summaries
   */
  store(summaries: PullRequestSummary[]): void {
    spreadSheetUtil.appendDataToSpreadsheet(
      this.sheetName,
      this.toRecords(summaries),
    );
  }

  /**
   * Convert PullRequestSummary data to the Google Spreadsheet record format
   * @param summaries
   * @returns
   */
  private toRecords(
    summaries: PullRequestSummary[],
  ): Record<string, unknown>[] {
    return summaries.map((summary) => {
      return summary.toRecord();
    });
  }
}
