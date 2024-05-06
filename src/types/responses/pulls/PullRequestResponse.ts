import { Base } from "../Base";
import { Head } from "../Head";
import { Label } from "../Label";
import { Milestone } from "../Milestone";
import { State } from "../State";
import { User } from "../User";
import { Team } from "../Team";
import { Links } from "@/types/responses/Links";

/**
 * Pull request response type
 */
export type PullRequestResponse = {
  readonly url: string;
  readonly id: number;
  readonly node_id: string;
  readonly html_url: string;
  readonly diff_url: string;
  readonly patch_url: string;
  readonly issue_url: string;
  readonly commits_url: string;
  readonly review_comments_url: string;
  readonly review_comment_url: string;
  readonly comments_url: string;
  readonly statuses_url: string;
  readonly number: number;
  readonly state: State;
  readonly locked: boolean;
  readonly title: string;
  readonly user: User;
  readonly body: string;
  readonly labels: Label[];
  readonly milestone?: Milestone | null;
  readonly active_lock_reason?: string | null;
  readonly created_at: string;
  readonly updated_at: string;
  readonly closed_at?: string | null;
  readonly merged_at?: string | null;
  readonly merge_commit_sha?: string | null;
  readonly assignee?: User | null;
  readonly assignees?: User[] | null;
  readonly requested_reviewers?: User[];
  readonly requested_teams?: Team[];
  readonly head: Head;
  readonly base: Base;
  readonly _links: Links;
  readonly author_association: string;
  readonly auto_merge: string | null;
  readonly draft?: boolean;
};
