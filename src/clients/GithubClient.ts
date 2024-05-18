import { GithubClientProps } from "@/types/props/GIthubClientProps";
import { PullRequestResponse } from "@/types/responses/pulls/PullRequestResponse";
import { GithubApiHeaders } from "@/types/requests/GithubApiHeaders";
import { PullRequestDetailResponse } from "@/types/responses/pulls/PullRequestDetailResponse";
import { CommitResponse } from "@/types/responses/commits/CommitResponse";
import { FetchResponse } from "@/types/responses/FetchResponse";
import { ReviewResponse } from "@/types/responses/reviews/ReviewResponse";
import { apiUtil } from "@/utils/apiUtil";
import { PullRequestListParams } from "@/types/params/PullRequestListParams";

/**
 * Base Class for the GitHub API clients
 */
class GitHubClient {
  /**
   * GitHub API token
   * @private
   */
  private readonly token: string;
  /**
   * GitHub repository owner
   * @private
   */
  private readonly owner: string;
  /**
   * GitHub repository name
   */
  readonly repo: string;
  /**
   * Base URL for the GitHub API
   * @private
   */
  private readonly baseUrl: string = "https://api.github.com/repos";

  /**
   * Constructor for the GithubClient class
   *
   * @param props - properties for the GithubClient
   */
  constructor(props: GithubClientProps) {
    this.token = props.token;
    this.owner = props.owner;
    this.repo = props.repo;
  }

  /**
   * Protected getter for the headers
   *
   * @returns - headers for the fetch request
   */
  protected get headers(): GithubApiHeaders {
    return {
      Authorization: `Bearer ${this.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      Accept: "application/vnd.github+json",
    };
  }

  /**
   * Fetch data from the GitHub API
   *
   * @param path - path to fetch
   * @param options - fetch options
   * @param query - query parameters
   * @returns - response from the fetch request
   * @protected
   */
  protected fetch(
    path: string,
    options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions,
    query?: { [key: string]: string | number },
  ): FetchResponse {
    let url = `${this.baseUrl}/${this.owner}/${this.repo}/${path}`;
    if (query) {
      url += `?${this.generateQueryParams(query)}`;
    }
    return apiUtil.customFetch(url, options);
  }

  /**
   * Generate query parameters for the GitHub API
   * @param params - query parameters
   * @returns - query parameters as a string
   * @protected
   */
  protected generateQueryParams(params: {
    [key: string]: string | number;
  }): string {
    return Object.keys(params)
      .map((key) => {
        const value =
          typeof params[key] === "number"
            ? params[key].toString()
            : params[key];
        return `${key}=${value}`;
      })
      .join("&");
  }
}

/**
 * PullRequestClient
 * NOTE:
 * - This class is responsible for fetching pull requests from the GitHub API.
 * - Please Read More: https://docs.github.com/ja/rest/pulls/pulls?apiVersion=2022-11-28
 *
 * @description
 * GitHub API client for pull requests
 */
export class PullRequestClient extends GitHubClient {
  /**
   * Resource name for the GitHub API
   * @private
   */
  private readonly resource: string = "pulls";
  constructor(props: GithubClientProps) {
    super(props);
  }
  /**
   * Fetch list pull requests
   *
   * @param {PullRequestListParams} params - parameters for listing pull requests
   * @returns - list of pull requests
   */
  list(params?: PullRequestListParams): PullRequestResponse[] {
    params = params || {};
    const queryParams = {
      state: params.state || "open",
      base: params.base || "master",
      sort: params.sort || "created",
      direction: params.direction || "asc",
      per_page: params.per_page?.toString() || "30",
      page: params.page?.toString() || "1",
    };
    const res = this.fetch(
      `${this.resource}`,
      {
        headers: this.headers,
      },
      queryParams,
    );
    if (res.status < 200 || res.status >= 300) {
      throw new Error(`Failed to fetch pull requests: ${res.status}`);
    }
    return JSON.parse(res.body);
  }

  /**
   * Get a pull request
   *
   * @param pull_number - pull request number
   * @returns - pull request
   */
  get(pull_number: number): PullRequestDetailResponse {
    const res = this.fetch(`${this.resource}/${pull_number}`, {
      headers: this.headers,
    });
    if (res.status < 200 || res.status >= 300) {
      throw new Error(`Failed to fetch pull request: ${res.status}`);
    }
    return JSON.parse(res.body);
  }

  /**
   * List commits on a pull request
   *
   * @param pull_number - pull request number
   * @param per_page - number of items per page
   * @param page - page number
   * @returns - commits
   */
  listCommits(
    pull_number: number,
    per_page?: number,
    page?: number,
  ): CommitResponse[] {
    if (per_page && (per_page < 1 || per_page > 100)) {
      throw new Error("per_page must be between 1 and 100");
    }
    const queryParams = {
      per_page: per_page?.toString() || "30",
      page: page?.toString() || "1",
    };
    const res = this.fetch(
      `${this.resource}/${pull_number}/commits`,
      {
        headers: this.headers,
      },
      queryParams,
    );
    if (res.status < 200 || res.status >= 300) {
      throw new Error(`Failed to fetch commits: ${res.status}`);
    }
    return JSON.parse(res.body);
  }

  /**
   * List reviews on a pull request
   *
   * @param pull_number - pull request number
   * @param per_page - number of items per page
   * @param page - page number
   * @returns - reviews
   */
  listReviews(
    pull_number: number,
    per_page?: number,
    page?: number,
  ): ReviewResponse[] {
    if (per_page && (per_page < 1 || per_page > 100)) {
      throw new Error("per_page must be between 1 and 100");
    }
    const queryParams = {
      per_page: per_page?.toString() || "30",
      page: page?.toString() || "1",
    };
    const res = this.fetch(
      `${this.resource}/${pull_number}/reviews`,
      {
        headers: this.headers,
      },
      queryParams,
    );
    if (res.status < 200 || res.status >= 300) {
      throw new Error(`Failed to fetch reviews: ${res.status}`);
    }
    return JSON.parse(res.body);
  }
}

/**
 * IssueClient
 *
 * @description
 * GitHub API client for issues
 */
export class IssueClient extends GitHubClient {
  /**
   * Resource name for the GitHub API
   * @private
   */
  // readonly resource: string = "issues";
  constructor(props: GithubClientProps) {
    super(props);
  }
}

/**
 * CommitClient
 *
 * @description
 * GitHub API client for commits
 */
export class CommitClient extends GitHubClient {
  /**
   * Resource name for the GitHub API
   * @private
   */
  // readonly resource: string = "commits";
  constructor(props: GithubClientProps) {
    super(props);
  }
}
