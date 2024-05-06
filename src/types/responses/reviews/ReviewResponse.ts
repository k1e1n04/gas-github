import { User } from "@/types/responses/User";

/**
 * Review response type
 */
export type ReviewResponse = {
  readonly id: number;
  readonly node_id: string;
  readonly user?: User;
  readonly body: string;
  readonly state: string;
  readonly html_url: string;
  readonly pull_request_url: string;
  readonly _links: {
    readonly html: {
      readonly href: string;
    };
    readonly pull_request: {
      readonly href: string;
    };
  };
  readonly submitted_at: string;
  readonly commit_id?: string;
  readonly author_association: string;
};
