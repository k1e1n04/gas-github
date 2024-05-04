/**
 * Fetch pull requests list params
 */
type PullRequestListParams = {
  /**
   * Pull request state
   */
  state?: "open" | "closed" | "all";
  /**
   * Base branch name
   */
  base?: string;
  /**
   * Sort field
   */
  sort?: "created" | "updated" | "popularity" | "long-running";
  /**
   * Sort direction
   */
  direction?: "asc" | "desc";
  /**
   * Number of items per page
   */
  per_page?: number;
  /**
   * Page number
   */
  page?: number;
};
