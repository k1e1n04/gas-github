import { DailyPullRequestSummaryWriteService } from "@/services/DailyPullRequestSummaryWriteService";
import { GetDailyPullRequestsParam } from "@/types/params/GetDailyPullRequestsParam";
import { PullRequestClient } from "@/clients/GithubClient";
import { PullRequestSummaryHistoryRepository } from "@/repositories/PullRequestSummaryHistoryRepository";
import { PullRequestSummaryRepository } from "@/repositories/PullRequestSummaryRepository";
import { DailyPullRequestSummaryFetchService } from "@/services/DailyPullRequestSummaryFetchService";
import { PullRequestReviewSummaryRepository } from "@/repositories/PullRequestReviewSummaryRepository";

/**
 * Fetch daily pull request summary.
 * @param param - GetDailyPullRequestsParam
 */
export const fetchDailyPullRequestSummary = (
  param: GetDailyPullRequestsParam,
): void => {
  const service = new DailyPullRequestSummaryWriteService(
    new PullRequestSummaryHistoryRepository(),
    new PullRequestSummaryRepository(),
    new PullRequestReviewSummaryRepository(),
    new DailyPullRequestSummaryFetchService(
      param.repos.map((repo) => {
        return new PullRequestClient({
          token: param.githubToken,
          owner: param.owner,
          repo: repo.name,
        });
      }),
      new PullRequestSummaryHistoryRepository(),
    ),
  );
  service.writeDailyPullRequests(param.repos, param.estimatedDailyPullRequests);
};
