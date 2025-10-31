// ===== Core Types =====

export type JSONValue =
  | null
  | string
  | number
  | boolean
  | { [key: string]: JSONValue }
  | Array<JSONValue>;

export type RunStatus = "running" | "completed" | "failed" | "cancelled" | "not_started";

export interface WorkflowProgressState {
  current: number;
  total: number;
  status: RunStatus;
}
