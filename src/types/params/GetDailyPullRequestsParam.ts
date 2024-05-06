/**
 * Get daily pull requests param type.
 */
export type GetDailyPullRequestsParam = {
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
   * Estimated daily pull requests
   */
  estimatedDailyPullRequests: number;
};

/**
 * Repo type.
 */
export type Repo = {
  /**
   * GitHub repository name
   */
  repo: string;
  /**
   * Base branch name
   */
  base: string;
};
