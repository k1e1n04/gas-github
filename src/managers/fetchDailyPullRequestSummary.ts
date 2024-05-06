import { DailyPullRequestSummaryWriteService } from "@/services/DailyPullRequestSummaryWriteService";
import { GetDailyPullRequestsParam } from "@/types/params/GetDailyPullRequestsParam";
import { PullRequestClient } from "@/clients/GithubClient";
import { PullRequestSummaryHistoryRepository } from "@/repositories/PullRequestSummaryHistoryRepository";
import { PullRequestSummaryRepository } from "@/repositories/PullRequestSummaryRepository";

/**
 * Fetch daily pull request summary.
 * @param param - GetDailyPullRequestsParam
 */
export const fetchDailyPullRequestSummary = (
  param: GetDailyPullRequestsParam,
): void => {
  const service = new DailyPullRequestSummaryWriteService(
    param.repos.map((repo) => {
      return new PullRequestClient({
        token: param.githubToken,
        owner: param.owner,
        repo: repo.name,
      });
    }),
    new PullRequestSummaryHistoryRepository(),
    new PullRequestSummaryRepository(),
  );
  service.writeDailyPullRequests(param.repos, param.estimatedDailyPullRequests);
};
