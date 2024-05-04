import { PullRequestResponse } from "./PullRequestResponse";
import { User } from "../User";

/**
 * Pull request detail response type
 */
export type PullRequestDetailResponse = {
  merged: boolean;
  mergeable: boolean;
  rebaseable: boolean;
  mergeable_state: string;
  merged_by: User;
  comments: number;
  review_comments: number;
  maintainer_can_modify: boolean;
  commits: number;
  additions: number;
  deletions: number;
  changed_files: number;
} & PullRequestResponse;
