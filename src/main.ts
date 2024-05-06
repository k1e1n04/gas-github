import { PullRequestClient } from "./clients/GithubClient";
import { fetchDailyPullRequestSummary } from "@/managers/fetchDailyPullRequestSummary";

(global as any).gasGitHub = {
  PullRequestClient,
  fetchDailyPullRequestSummary,
};
