import { Owner } from "./Owner";

/**
 * Repo response type
 */
export type Repo = {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  owner: Owner;
};
