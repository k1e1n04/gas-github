import { Repo } from "@/types/params/GetDailyPullRequestsParam";
import { PullRequestClient } from "@/clients/GithubClient";
import { PullRequestSummary } from "@/models/pulls/PullRequestSummary";

/**
 * This class is responsible for fetching the pull request summary.
 */
export class PullRequestSummaryFetchService {
  constructor(
    private client: PullRequestClient,
    private repos: Repo[],
    private estimatedMonthlyPullRequests: number,
  ) {}

  /**
   * Fetch pull request summaries
   */
  fetch(): PullRequestSummary[] {
    const pageNumbers = this.getPageNumber();
    const defaultBase = "master";
    return Array.from({ length: pageNumbers }, (_, i) => {
      const prs = this.client.list({
        state: "closed",
        base:
          this.repos.find((repo) => repo.name === this.client.repo)?.base ||
          defaultBase,
        sort: "updated",
        direction: "desc",
        per_page: 100,
        page: i + 1,
      });
      if (!prs) {
        return [];
      }
      return prs.map((pr) => {
        const prDetail = this.client.get(pr.number);
        return PullRequestSummary.new({
          reviews: this.client.listReviews(prDetail.number, 1, 1),
          pr: prDetail,
          repository: this.client.repo,
        });
      });
    }).flat();
  }

  /**
   * Fetch pull request review summaries
   * @returns -  page number
   * @private
   */
  private getPageNumber(): number {
    return Math.ceil(this.estimatedMonthlyPullRequests / 100);
  }
}
