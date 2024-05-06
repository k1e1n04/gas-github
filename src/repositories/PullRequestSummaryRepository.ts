import { PullRequestSummary } from "@/models/pulls/PullRequestSummary";
import {utils} from "@/utils/utils";

/**
 * This class is responsible for handling the data access of the PullRequestSummary entity.
 */
export class PullRequestSummaryRepository {
  private readonly sheet: GoogleAppsScript.Spreadsheet.Sheet;

  /**
   * Constructor
   * @param summaries
   * @param sheet
   */
    constructor(
        summaries: PullRequestSummary[],
        sheet: GoogleAppsScript.Spreadsheet.Sheet
  ) {
        this.sheet = sheet;
    }

  /**
   * Store the PullRequestSummary data to the Google Spreadsheet
   * @param summaries
   */
  store(summaries: PullRequestSummary[]): void {
    utils.appendDataToSpreadsheet(this.sheet, this.toRecords(summaries));
  }

    /**
     * Convert PullRequestSummary data to the Google Spreadsheet record format
     * @param summaries
     * @returns
     */
  private toRecords(summaries: PullRequestSummary[]) {
    return summaries.map((summary) => {
      return summary.toRecord();
    });
  }
}
