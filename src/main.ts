import {
  CommitClient,
  IssueClient,
  PullRequestClient,
} from "./clients/GithubClient";

(global as any).GasGitHub = {
  PullRequestClient,
  IssueClient,
  CommitClient,
};
