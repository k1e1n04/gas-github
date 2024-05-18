import { PullRequestClient } from "./clients/GitHubClient";
import { fetchDailyPullRequestSummary } from "@/managers/fetchDailyPullRequestSummary";
import { GitHubApp } from "@/clients/GitHubApp";

(global as any).gasGitHub = {
  GitHubApp,
  PullRequestClient,
  fetchDailyPullRequestSummary,
};
