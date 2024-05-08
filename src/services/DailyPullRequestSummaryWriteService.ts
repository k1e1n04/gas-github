import { Repo } from "@/types/params/GetDailyPullRequestsParam";
import { PullRequestClient } from "@/clients/GithubClient";
import { PullRequestSummary } from "@/models/pulls/PullRequestSummary";
import { PullRequestSummaryHistoryRepository } from "@/repositories/PullRequestSummaryHistoryRepository";
import { PullRequestSummaryRepository } from "@/repositories/PullRequestSummaryRepository";
import { PullRequestSummaryHistory } from "@/models/pulls/PullRequestSummaryHistory";
import dayjs from "dayjs";

/**
 * This class is responsible for writing the daily pull request summary.
 */
export class DailyPullRequestSummaryWriteService {
  /**
   * Pull request clients
   * @private
   */
  private readonly prClients: PullRequestClient[];

  /**
   * Pull request summary history repository
   * @private
   */
  private readonly pullRequestSummaryHistoryRepository: PullRequestSummaryHistoryRepository;

  /**
   * Pull request summary repository
   * @private
   */
  private readonly pullRequestSummaryRepository: PullRequestSummaryRepository;

  /**
   * Pull request state
   * @private
   */
  private readonly state = "closed";

  /**
   * Number of items per page
   * @private
   */
  private readonly per_page: number = 100;

  /**
   * Sort of pull requests
   * @private
   */
  private readonly sort = "updated";

  /**
   * Sort direction of pull requests
   * @private
   */
  private readonly sortDirection = "desc";

  constructor(
    prClients: PullRequestClient[],
    pullRequestSummaryHistoryRepository: PullRequestSummaryHistoryRepository,
    pullRequestSummaryRepository: PullRequestSummaryRepository,
  ) {
    this.prClients = prClients;
    this.pullRequestSummaryHistoryRepository =
      pullRequestSummaryHistoryRepository;
    this.pullRequestSummaryRepository = pullRequestSummaryRepository;
  }

  /**
   * Write daily pull request summary
   * @param repos - Repositories
   * @param estimatedDailyPullRequests - Estimated daily pull requests
   */
  writeDailyPullRequests(
    repos: Repo[],
    estimatedDailyPullRequests: number,
  ): void {
    const lastPrSummaryHistory =
      this.pullRequestSummaryHistoryRepository.getLatest();
    const summaries = this.prClients
      .map((client) => {
        return this.fetchPullRequests(
          client,
          repos,
          estimatedDailyPullRequests,
        );
      })
      .flat();
    const filteredSummaries = this.filterPullRequestSummaries(
      summaries,
      lastPrSummaryHistory,
    );
    const newPrSummaryHistory = PullRequestSummaryHistory.new(
      filteredSummaries,
      lastPrSummaryHistory,
    );
    // Sort summaries by updated_at in ascending order
    const sortedSummaries = filteredSummaries.sort((a, b) => {
      return a.updatedAt.localeCompare(b.updatedAt);
    });
    this.pullRequestSummaryRepository.store(sortedSummaries);
    this.pullRequestSummaryHistoryRepository.store(newPrSummaryHistory);
  }

  /**
   * Filter pull request summaries by the last pull request summary history
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

  /**
   * Get the page number from the estimated daily pull requests
   * @param estimatedDailyPullRequests - Estimated daily pull requests
   * @returns Page number
   * @private
   */
  private getPageNumber(estimatedDailyPullRequests: number): number {
    return Math.ceil(estimatedDailyPullRequests / this.per_page);
  }

  /**
   * Fetch pull requests
   * @param client - Pull request client
   * @param repos - Repositories
   * @param estimatedMonthlyPullRequests - Estimated monthly pull requests
   * @returns Pull request summaries
   * @private
   */
  private fetchPullRequests(
    client: PullRequestClient,
    repos: Repo[],
    estimatedMonthlyPullRequests: number,
  ): PullRequestSummary[] {
    const pageNumbers = this.getPageNumber(estimatedMonthlyPullRequests);
    const defaultBase = "master";
    return Array.from({ length: pageNumbers }, (_, i) => {
      const prs = client.list({
        state: this.state,
        base:
          repos.find((repo) => repo.name === client.repo)?.base || defaultBase,
        sort: this.sort,
        direction: this.sortDirection,
        per_page: this.per_page,
        page: i + 1,
      });
      if (!prs) {
        return [];
      }
      return prs.map((pr) => {
        const prDetail = client.get(pr.number);
        return PullRequestSummary.new({
          reviews: client.listReviews(pr.number, 1, 1),
          pr: prDetail,
          repository: client.repo,
        });
      });
    }).flat();
  }
}
