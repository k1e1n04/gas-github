import { Repo } from "@/types/params/GetDailyPullRequestsParam";
import { PullRequestClient } from "@/clients/GithubClient";
import { PullRequestSummary } from "@/models/pulls/PullRequestSummary";
import { PullRequestSummaryHistoryRepository } from "@/repositories/PullRequestSummaryHistoryRepository";
import { PullRequestSummaryRepository } from "@/repositories/PullRequestSummaryRepository";
import { PullRequestSummaryHistory } from "@/models/pulls/PullRequestSummaryHistory";
import dayjs from "dayjs";
import { PullRequestReviewSummaryRepository } from "@/repositories/PullRequestReviewSummaryRepository";
import { PullRequestReviewSummary } from "@/models/pulls/PullRequestReviewSummary";
import { PullRequestDetailResponse } from "@/types/responses/pulls/PullRequestDetailResponse";

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
   * Pull request review summary repository
   * @private
   */
  private readonly pullRequestReviewSummaryRepository: PullRequestReviewSummaryRepository;

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
    pullRequestReviewSummaryRepository: PullRequestReviewSummaryRepository,
  ) {
    this.prClients = prClients;
    this.pullRequestSummaryHistoryRepository =
      pullRequestSummaryHistoryRepository;
    this.pullRequestSummaryRepository = pullRequestSummaryRepository;
    this.pullRequestReviewSummaryRepository =
      pullRequestReviewSummaryRepository;
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
    const prSummaries = this.mapPrClientsAndFetchData(
      repos,
      estimatedDailyPullRequests,
      this.fetchPullRequestSummaries,
    );
    const prReviewSummaries = this.mapPrClientsAndFetchData(
      repos,
      estimatedDailyPullRequests,
      this.fetchPullRequestReviewSummaries,
    ).flat();
    const filteredSummaries = this.filterPullRequestSummaries(
      prSummaries,
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
    this.pullRequestReviewSummaryRepository.store(prReviewSummaries);
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
   * Fetch data from pull requests
   * @param client - Pull request client
   * @param repos - Repositories
   * @param estimatedMonthlyPullRequests - Estimated monthly pull requests
   * @param callback - Callback function
   * @returns Fetched data
   * @private
   */
  private fetchDataFromPullRequests(
    client: PullRequestClient,
    repos: Repo[],
    estimatedMonthlyPullRequests: number,
    callback: (client: PullRequestClient, pr: PullRequestDetailResponse) => any,
  ) {
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
        return callback(client, prDetail);
      });
    }).flat();
  }

  /**
   * Fetch pull request summaries
   * @param client - Pull request client
   * @param prDetail - Pull request detail
   * @returns Pull request summary
   * @private
   */
  private fetchPullRequestSummaries(
    client: PullRequestClient,
    prDetail: PullRequestDetailResponse,
  ): PullRequestSummary {
    return PullRequestSummary.new({
      reviews: client.listReviews(prDetail.number, 1, 1),
      pr: prDetail,
      repository: client.repo,
    });
  }

  /**
   * Fetch pull request review summaries
   * @param client - Pull request client
   * @param prDetail - Pull request detail
   * @private
   */
  private fetchPullRequestReviewSummaries(
    client: PullRequestClient,
    prDetail: PullRequestDetailResponse,
  ): PullRequestReviewSummary[] {
    const reviews = client.listReviews(prDetail.number, 100, 1);
    return reviews.map((review) => {
      return PullRequestReviewSummary.new({
        pullNumber: prDetail.number,
        repository: client.repo,
        review: review,
      });
    });
  }

  /**
   * Map pull request clients and fetch data
   * @param repos - Repositories
   * @param estimatedDailyPullRequests - Estimated daily pull requests
   * @param callback - Callback function
   * @returns Mapped pull request clients and fetched data
   * @private
   */
  private mapPrClientsAndFetchData(
    repos: Repo[],
    estimatedDailyPullRequests: number,
    callback: (
      client: PullRequestClient,
      prDetail: PullRequestDetailResponse,
    ) => any,
  ): any[] {
    return this.prClients
      .map((client) => {
        return this.fetchDataFromPullRequests(
          client,
          repos,
          estimatedDailyPullRequests,
          callback,
        );
      })
      .flat();
  }
}
