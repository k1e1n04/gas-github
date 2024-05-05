/**
 * Team type response
 */
export type Team = {
  readonly id: number;
  readonly node_id: string;
  readonly url: string;
  readonly html_url: string;
  readonly name: string;
  readonly slug: string;
  readonly description?: string;
  readonly privacy: string;
  readonly permission: string;
  readonly notification_setting: string;
  readonly members_url: string;
  readonly repositories_url: string;
  readonly parent: string | null;
};
