/**
 * Links response type
 */
export type Links = {
  readonly self: {
    readonly href: string;
  };
  readonly html: {
    readonly href: string;
  };
  readonly issue: {
    readonly href: string;
  };
  readonly comments: {
    readonly href: string;
  };
  readonly review_comments: {
    readonly href: string;
  };
  readonly review_comment: {
    readonly href: string;
  };
  readonly commits: {
    readonly href: string;
  };
  readonly statuses: {
    readonly href: string;
  };
};
