import { Commit } from "../Commit";
import { User } from "../User";

/**
 * Commit response type
 */
export type CommitResponse = {
  readonly url: string;
  readonly sha: string;
  readonly node_id: string;
  readonly html_url: string;
  readonly comments_url: string;
  readonly commit: Commit;
  readonly author: User;
  readonly committer: User;
  readonly parents: {
    url: string;
    sha: string;
  }[];
};
