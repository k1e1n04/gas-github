/**
 * Label response type
 */
export type Label = {
  readonly id: number;
  readonly node_id: string;
  readonly url: string;
  readonly name: string;
  readonly description: string;
  readonly color: string;
  readonly default: boolean;
};
