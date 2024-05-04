/**
 * GithubClientProps
 *
 * @description
 * Props for the GithubClient component
 */
export type GithubClientProps = {
  /**
   * GitHub API token
   */
  token: string;
  /**
   * GitHub repository owner
   */
  owner: string;
  /**
   * GitHub repository name
   */
  repo: string;
};
