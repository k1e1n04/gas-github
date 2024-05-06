export interface GetDailyPullRequestsParam {
  /**
   * GitHub token
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
}

export interface Repo {
  /**
   * GitHub repository name
   */
  name: string;
  /**
   * Base branch name
   */
  base: string;
}
