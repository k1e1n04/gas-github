import {
  GetDailyPullRequestsParam,
  Repo,
} from "@/types/params/GetDailyPullRequestsParam";
import { PullRequestClient } from "@/clients/GithubClient";
import { PullRequestSummary } from "@/models/pulls/PullRequestSummary";
import { PullRequestSummaryHistoryRepository } from "@/repositories/PullRequestSummaryHistoryRepository";
import { PullRequestSummaryRepository } from "@/repositories/PullRequestSummaryRepository";
import { PullRequestSummaryHistory } from "@/models/pulls/PullRequestSummaryHistory";

/**
 * This class is responsible for writing the daily pull request summary.
 */
export class DailyPullRequestSummaryWriter {
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

  constructor(param: GetDailyPullRequestsParam) {
    this.prClients = param.repos.map((repo) => {
      return new PullRequestClient({
        token: param.githubToken,
        owner: param.owner,
        repo: repo.repo,
      });
    });
    this.pullRequestSummaryHistoryRepository =
      new PullRequestSummaryHistoryRepository();
    this.pullRequestSummaryRepository = new PullRequestSummaryRepository();
  }

  /**
   * Write daily pull request summary
   * @param param
   */
  writeDailyPullRequests(param: GetDailyPullRequestsParam) {
    const lastPrSummaryHistory =
      this.pullRequestSummaryHistoryRepository.getLatest();
    const summaries = this.prClients
      .map((client) => {
        return this.fetchPullRequests(
          client,
          param.repos,
          param.estimatedDailyPullRequests,
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
    this.pullRequestSummaryRepository.store(
      filteredSummaries
    );
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
  ) {
    if (!lastPrSummaryHistory) {
      return summaries;
    }
    return summaries.filter((summary) => {
      return summary.updated_at > lastPrSummaryHistory.lastPrUpdatedAt;
    });
  }

  /**
   * Get the page number from the estimated daily pull requests
   * @param estimatedDailyPullRequests - Estimated daily pull requests
   * @returns Page number
   * @private
   */
  private getPageNumber(estimatedDailyPullRequests: number) {
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
  ) {
    const pageNumbers = this.getPageNumber(estimatedMonthlyPullRequests);
    const defaultBase = "master";
    return Array.from({ length: pageNumbers }, (_, i) => {
      const prs = client.list({
        state: this.state,
        base:
          repos.find((repo) => repo.repo === client.repo)?.base || defaultBase,
        sort: this.sort,
        direction: this.sortDirection,
        per_page: this.per_page,
        page: i + 1,
      });
      return prs.map((pr) => {
        return new PullRequestSummary({
          reviews: client.listReviews(pr.number, 1, 1),
          pr: client.get(pr.number),
          repository: client.repo,
        });
      });
    }).flat();
  }
}
