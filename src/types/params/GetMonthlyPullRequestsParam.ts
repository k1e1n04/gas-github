/**
 * GetMonthlyPullRequestsParam type.
 */
export type GetMonthlyPullRequestsParam = {
  /**
   * GitHub API token
   */
  githubToken: string;
  /**
   * GitHub repository owner
   */
  owner: string;
  /**
   * GitHub repositories
   */
  repos: Repo[];
  /**
   * Estimated monthly pull requests
   */
  estimatedMonthlyPullRequests: number;
};

/**
 * Repo type.
 */
type Repo = {
  /**
   * GitHub repository name
   */
  repo: string;
  /**
   * Base branch name
   */
  base: string;
};
