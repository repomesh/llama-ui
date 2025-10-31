import { Client, getWorkflows } from "@llamaindex/workflows-client";
import { proxy } from "valtio";
import { WorkflowState } from "./workflow";

export interface WorkflowsState {
  workflows: Record<string, Omit<WorkflowState, "graph">>;
}

export function createState(): WorkflowsState {
  return proxy({ workflows: {} });
}

export function createActions(state: WorkflowsState, client: Client) {
  return {
    async sync() {
      const resp = await getWorkflows({
        client: client,
      });
      const allWorkflows = resp.data?.workflows ?? [];
      allWorkflows.forEach((name) => {
        state.workflows[name] = { name };
      });
    },
    setWorkflow(workflow: Omit<WorkflowState, "graph">) {
      state.workflows[workflow.name] = workflow;
    },
  }
}
