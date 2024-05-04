import {
  CommitClient,
  IssueClient,
  PullRequestClient,
} from "./clients/GithubClient";

(global as any).PullRequestClient = PullRequestClient;
(global as any).IssueClient = IssueClient;
(global as any).CommitClient = CommitClient;
