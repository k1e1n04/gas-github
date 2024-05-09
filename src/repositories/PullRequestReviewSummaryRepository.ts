import { PullRequestReviewSummary } from "@/models/pulls/PullRequestReviewSummary";
import { spreadSheetUtil } from "@/utils/spreadSheetUtil";

/**
 * This class is responsible for handling the data access of the PullRequestReviewSummary
 */
export class PullRequestReviewSummaryRepository {
  private readonly sheetName: string = "PullRequestReviewSummary";

  /**
   * Store the PullRequestReviewSummary data to the Google Spreadsheet
   * @param summaries - Array of PullRequestReviewSummary
   */
  store(summaries: PullRequestReviewSummary[]): void {
    spreadSheetUtil.appendDataToSpreadsheet(
      this.sheetName,
      this.toRecords(summaries),
    );
  }

  /**
   * Convert PullRequestReviewSummary data to the Google Spreadsheet record format
   * @param summaries
   * @returns Record<string, unknown>[]
   */
  private toRecords(
    summaries: PullRequestReviewSummary[],
  ): Record<string, unknown>[] {
    return summaries.map((summary) => {
      return summary.toRecord();
    });
  }
}
