/**
 * Fetch pull requests list params
 */
type PullRequestListParams = {
    state?: "open" | "closed" | "all",
    base?: string,
    sort?: "created" | "updated" | "popularity" | "long-running",
    direction?: "asc" | "desc",
    per_page?: number,
    page?: number,
};
