import { PullRequestClient } from "./clients/GithubClient";
import { fetchDailyPullRequestSummary } from "@/managers/fetchDailyPullRequestSummary";
import { GitHubApp } from "@/clients/GitHubApp";

(global as any).gasGitHub = {
  GitHubApp,
  PullRequestClient,
  fetchDailyPullRequestSummary,
};
