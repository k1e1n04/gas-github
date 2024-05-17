import { Repo } from "@/types/params/GetDailyPullRequestsParam";
import { PullRequestSummaryHistoryRepository } from "@/repositories/PullRequestSummaryHistoryRepository";
import { PullRequestSummaryRepository } from "@/repositories/PullRequestSummaryRepository";
import { PullRequestReviewSummaryRepository } from "@/repositories/PullRequestReviewSummaryRepository";
import { DailyPullRequestSummaryFetchService } from "@/services/DailyPullRequestSummaryFetchService";

/**
 * This class is responsible for writing the daily pull request summary.
 */
export class DailyPullRequestSummaryWriteService {
  /**
   * Pull request summary history repository
   * @private
   */
  private readonly pullRequestSummaryHistoryRepository: PullRequestSummaryHistoryRepository;

  /**
   * Pull request clients
   * @private
   */
  private readonly dailyPullRequestSummaryFetchService: DailyPullRequestSummaryFetchService;

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

  constructor(
    pullRequestSummaryHistoryRepository: PullRequestSummaryHistoryRepository,
    pullRequestSummaryRepository: PullRequestSummaryRepository,
    pullRequestReviewSummaryRepository: PullRequestReviewSummaryRepository,
    pullRequestSummaryFetchService: DailyPullRequestSummaryFetchService,
  ) {
    this.pullRequestSummaryHistoryRepository =
      pullRequestSummaryHistoryRepository;
    this.pullRequestSummaryRepository = pullRequestSummaryRepository;
    this.pullRequestReviewSummaryRepository =
      pullRequestReviewSummaryRepository;
    this.dailyPullRequestSummaryFetchService = pullRequestSummaryFetchService;
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
    const summaries =
      this.dailyPullRequestSummaryFetchService.fetchDailyPullRequests(
        repos,
        estimatedDailyPullRequests,
      );
    this.pullRequestSummaryRepository.store(summaries.prSummaries);
    this.pullRequestSummaryHistoryRepository.store(summaries.prSummaryHistory);
    this.pullRequestReviewSummaryRepository.store(summaries.reviewSummaries);
  }
}
