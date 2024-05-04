import { GithubClientProps } from "../types/props/GIthubClientProps";
import { PullRequestResponse } from "../types/responses/pulls/PullRequestResponse";
import { GithubApiHeaders } from "../types/requests/GithubApiHeaders";
import { PullRequestDetailResponse } from "../types/responses/pulls/PullRequestDetailResponse";
import {CommitResponse} from "../types/responses/commits/CommitResponse";

/**
 * Base Class for the GitHub API clients
 */
class GithubClient {
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
   * @private
   */
  private readonly repo: string;
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
   */
  protected fetch(
    path: string,
    options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions,
  ) {
    const url = `${this.baseUrl}/${this.owner}/${this.repo}/${path}`;
    return UrlFetchApp.fetch(url, options);
  }
}

/**
 * PullRequestClient
 *
 * @description
 * GitHub API client for pull requests
 */
export class PullRequestClient extends GithubClient {
  /**
   * Resource name for the GitHub API
   * @private
   */
  readonly resource: string = "pulls";
  constructor(props: GithubClientProps) {
    super(props);
  }

  /**
   * Fetch list pull requests
   *
   * @param state - state of the pull requests
   * @param base - base branch
   * @param sort - sort order
   * @param direction - sort direction
   * @param per_page - number of items per page
   * @param page - page number
   * @returns - pull requests
   */
  list(
    state?: "open" | "closed" | "all",
    base?: string,
    sort?: "created" | "updated" | "popularity" | "long-running",
    direction?: "asc" | "desc",
    per_page?: number,
    page?: number,
  ): PullRequestResponse[] {
    if (per_page && (per_page < 1 || per_page > 100)) {
      throw new Error("per_page must be between 1 and 100");
    }
    const queryParams = new URLSearchParams({
      state: state || "open",
      base: base || "master",
      sort: sort || "created",
      direction: direction || "asc",
      per_page: per_page?.toString() || "30",
      page: page?.toString() || "1",
    });
    const res = this.fetch(`${this.resource}?${queryParams.toString()}`, {
      headers: this.headers,
    });
    if (res.getResponseCode() < 200 || res.getResponseCode() >= 300) {
      throw new Error(`Failed to fetch pull requests: ${res.getContentText()}`);
    }
    return JSON.parse(res.getContentText());
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
    if (res.getResponseCode() < 200 || res.getResponseCode() >= 300) {
      throw new Error(`Failed to fetch pull request: ${res.getContentText()}`);
    }
    return JSON.parse(res.getContentText());
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
        const queryParams = new URLSearchParams({
            per_page: per_page?.toString() || "30",
            page: page?.toString() || "1",
        });
        const res = this.fetch(`${this.resource}/${pull_number}/commits?${queryParams.toString()}`, {
            headers: this.headers,
        });
        if (res.getResponseCode() < 200 || res.getResponseCode() >= 300) {
            throw new Error(`Failed to fetch commits: ${res.getContentText()}`);
        }
        return JSON.parse(res.getContentText());
    }
}

/**
 * IssueClient
 *
 * @description
 * GitHub API client for issues
 */
export class IssueClient extends GithubClient {
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
export class CommitClient extends GithubClient {
  /**
   * Resource name for the GitHub API
   * @private
   */
  // readonly resource: string = "commits";
  constructor(props: GithubClientProps) {
    super(props);
  }
}
