import { PullRequestClient } from "@/clients/GithubClient";
import { PullRequestSummaryHistory } from "@/models/pulls/PullRequestSummaryHistory";
import { PullRequestSummary } from "@/models/pulls/PullRequestSummary";
import { Repo } from "@/types/params/GetDailyPullRequestsParam";
import dayjs from "dayjs";
import { PullRequestSummaryHistoryRepository } from "@/repositories/PullRequestSummaryHistoryRepository";
import { PullRequestSummaryFetchService } from "@/services/PullRequestSummaryFetchService";
import { PullRequestReviewFetchService } from "@/services/PullRequestReviewFetchService";

/**
 * This class is responsible for fetching the daily pull request summary.
 */
export class DailyPullRequestSummaryFetchService {
  /**
   * Constructor
   * @param prClients - Pull request clients
   * @param pullRequestSummaryHistoryRepository - Pull request summary history repository
   */
  constructor(
    private prClients: PullRequestClient[],
    private pullRequestSummaryHistoryRepository: PullRequestSummaryHistoryRepository,
  ) {}

  /**
   * Fetch daily pull requests
   * @param repos - Repositories
   * @param estimatedDailyPullRequests - Estimated daily pull requests
   * @returns Daily pull request summaries
   */
  fetchDailyPullRequests(repos: Repo[], estimatedDailyPullRequests: number) {
    const lastPrSummaryHistory =
      this.pullRequestSummaryHistoryRepository.getLatest();
    const prSummaries = this.prClients
      .map((client) =>
        new PullRequestSummaryFetchService(
          client,
          repos,
          estimatedDailyPullRequests,
        ).fetch(),
      )
      .flat();
    const filteredSummaries = this.filterPullRequestSummaries(
      prSummaries,
      lastPrSummaryHistory,
    );
    const newPrSummaryHistory = PullRequestSummaryHistory.new(
      filteredSummaries,
      lastPrSummaryHistory,
    );
    const sortedSummaries = filteredSummaries.sort((a, b) =>
      a.updatedAt.localeCompare(b.updatedAt),
    );
    const prReviewSummaries = sortedSummaries
      .map((summary) =>
        new PullRequestReviewFetchService(
          this.prClients.find((client) => client.repo === summary.repository)!,
        ).fetch(summary.pullNumber),
      )
      .flat();
    return {
      prSummaries: sortedSummaries,
      reviewSummaries: prReviewSummaries,
      prSummaryHistory: newPrSummaryHistory,
    };
  }

  /**
   * Filter pull request summaries by the last pull request summary history
   * NOTE:
   *   1. Exclude pull requests that are updated before the last pull request updated
   *   2. Exclude pull requests that are updated after closed
   * @param summaries - Pull request summaries
   * @param lastPrSummaryHistory - Last pull request summary history
   * @returns Filtered pull request summaries
   * @private
   */
  private filterPullRequestSummaries(
    summaries: PullRequestSummary[],
    lastPrSummaryHistory?: PullRequestSummaryHistory,
  ): PullRequestSummary[] {
    if (!lastPrSummaryHistory) {
      return summaries;
    }
    return summaries.filter((summary) => {
      const updated_date = dayjs(summary.updatedAt).format("YYYY-MM-DD");
      const closed_date = dayjs(summary.closedAt).format("YYYY-MM-DD");
      return (
        summary.updatedAt > lastPrSummaryHistory.lastPrUpdatedAt &&
        updated_date === closed_date
      );
    });
  }
}
