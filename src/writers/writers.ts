import { GetMonthlyPullRequestsParam } from "@/types/params/GetMonthlyPullRequestsParam";
import { PullRequestClient } from "@/clients/GithubClient";

export const writers = {
  monthlyPullRequests: async (param: GetMonthlyPullRequestsParam) => {
    const prClients = param.repos.map((repo) => {
      return new PullRequestClient({
        token: param.githubToken,
        owner: param.owner,
        repo: repo.repo,
      });
    });
    const prs = prClients
      .map((client) => {
        return fetchPullRequests(client, param.estimatedMonthlyPullRequests);
      })
      .flat();
  },
};

/**
 * Get the page number for the GitHub API from the estimated monthly pull requests
 * @param estimatedMonthlyPullRequests
 * @returns page number
 */
const getPageNumber = (estimatedMonthlyPullRequests: number) => {
  return Math.ceil(estimatedMonthlyPullRequests / 100);
};

/**
 * Fetch pull requests
 * @param client - PullRequestClient
 * @param estimatedMonthlyPullRequests - estimated monthly pull requests
 * @returns - pull requests
 */
const fetchPullRequests = async (
  client: PullRequestClient,
  estimatedMonthlyPullRequests: number,
) => {
  const pageNumbers = getPageNumber(estimatedMonthlyPullRequests);
  const defaultBase = "master";
  return Array.from({ length: pageNumbers }, (_, i) => {
    return client.list({
      state: "all",
      base: defaultBase,
      sort: "updated",
      direction: "desc",
      per_page: 100,
      page: i + 1,
    });
  }).flat();
};
