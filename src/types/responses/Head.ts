import {User} from "./User";

/**
 * Head response Type
 */
export type Head = {
  readonly label: string;
  readonly ref: string;
  readonly sha: string;
  readonly user: User;
};
