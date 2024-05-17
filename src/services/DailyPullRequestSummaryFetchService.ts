import { PullRequestClient } from "@/clients/GithubClient";
import { PullRequestSummaryHistory } from "@/models/pulls/PullRequestSummaryHistory";
import { PullRequestSummary } from "@/models/pulls/PullRequestSummary";
import { PullRequestReviewSummary } from "@/models/pulls/PullRequestReviewSummary";
import { Repo } from "@/types/params/GetDailyPullRequestsParam";
import dayjs from "dayjs";
import { PullRequestSummaryHistoryRepository } from "@/repositories/PullRequestSummaryHistoryRepository";

/**
 * This class is responsible for fetching the daily pull request summary.
 */
export class DailyPullRequestSummaryFetchService {
  /**
   * Pull request summary history repository
   * @private
   */
  private readonly pullRequestSummaryHistoryRepository: PullRequestSummaryHistoryRepository;
  /**
   * Pull request clients
   * @private
   */
  private readonly prClients: PullRequestClient[];

  /**
   * Pull request state
   * @private
   */
  private readonly state = "closed";

  /**
   * Number of items per page for creating summaries
   * @private
   */
  private readonly per_page: number = 100;

  /**
   * First page number
   */
  private readonly first_page: number = 1;

  /**
   * Number of items per page for fetching the oldest review
   * @private
   */
  private readonly per_page_for_oldest_review: number = 1;

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
  ) {
    this.prClients = prClients;
    this.pullRequestSummaryHistoryRepository =
      pullRequestSummaryHistoryRepository;
  }

  /**
   * Fetch daily pull requests
   * @param repos - Repositories
   * @param estimatedDailyPullRequests - Estimated daily pull requests
   * @returns Daily pull request summaries
   */
  fetchDailyPullRequests(repos: Repo[], estimatedDailyPullRequests: number) {
    const lastPrSummaryHistory =
      this.pullRequestSummaryHistoryRepository.getLatest();
    const prSummaries = this.fetchPullRequestSummaries(
      estimatedDailyPullRequests,
      repos,
    );
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
    const prReviewSummaries = sortedSummaries
      .map((summary) => {
        return this.fetchPullRequestReviewSummaries(
          this.prClients.find((client) => client.repo === summary.repository)!,
          summary.pullNumber,
        );
      })
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
   * Fetch pull request summaries
   * @param estimatedMonthlyPullRequests - Estimated monthly pull requests
   * @param repos - Repositories
   * @private
   */
  private fetchPullRequestSummaries(
    estimatedMonthlyPullRequests: number,
    repos: Repo[],
  ): PullRequestSummary[] {
    return this.prClients
      .map((client) => {
        const pageNumbers = this.getPageNumber(estimatedMonthlyPullRequests);
        const defaultBase = "master";
        return Array.from({ length: pageNumbers }, (_, i) => {
          const prs = client.list({
            state: this.state,
            base:
              repos.find((repo) => repo.name === client.repo)?.base ||
              defaultBase,
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
              reviews: client.listReviews(
                prDetail.number,
                this.per_page_for_oldest_review,
                this.first_page,
              ),
              pr: prDetail,
              repository: client.repo,
            });
          });
        }).flat();
      })
      .flat();
  }

  /**
   * Fetch pull request review summaries
   * @param client - Pull request client
   * @param prNumber - Pull request number
   * @private
   */
  private fetchPullRequestReviewSummaries(
    client: PullRequestClient,
    prNumber: number,
  ): PullRequestReviewSummary[] {
    const reviews = client.listReviews(
      prNumber,
      this.per_page,
      this.first_page,
    );
    return reviews.map((review) => {
      return PullRequestReviewSummary.new({
        pullNumber: prNumber,
        repository: client.repo,
        review: review,
      });
    });
  }
}
