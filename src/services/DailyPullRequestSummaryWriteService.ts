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
   * Constructor
   * @param pullRequestSummaryHistoryRepository - Pull request summary history repository
   * @param pullRequestSummaryRepository - Pull request summary repository
   * @param pullRequestReviewSummaryRepository - Pull request review summary repository
   * @param dailyPullRequestSummaryFetchService - Daily pull request summary fetch service
   */
  constructor(
    private pullRequestSummaryHistoryRepository: PullRequestSummaryHistoryRepository,
    private pullRequestSummaryRepository: PullRequestSummaryRepository,
    private pullRequestReviewSummaryRepository: PullRequestReviewSummaryRepository,
    private dailyPullRequestSummaryFetchService: DailyPullRequestSummaryFetchService,
  ) {}

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
