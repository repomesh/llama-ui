import {
  Client,
  postWorkflowsByNameRunNowait,
  getWorkflowsByNameRepresentation,
} from "@llamaindex/workflows-client";
import { proxy } from "valtio";
import { createState as createHandlerState } from "./handler";
import { JSONValue } from "../types";

export interface WorkflowState {
  name: string;
  // TODO: add graph type
  graph: unknown | null;
}

export function createState(name: string): WorkflowState {
  return proxy({
    name,
    graph: null,
  });
}

export function createActions(state: WorkflowState, client: Client) {
  return {
    async sync() {
      const data = await getWorkflowsByNameRepresentation({
        client: client,
        path: { name: state.name },
      });
      state.graph = data.data?.graph ?? null;
    },

    async createHandler(input: JSONValue, handlerId?: string) {
      const data = await postWorkflowsByNameRunNowait({
        client: client,
        path: { name: state.name },
        body: {
          start_event: input as { [key: string]: unknown } | undefined,
          handler_id: handlerId,
        },
      });
  
      if (!data.data) {
        throw new Error("Handler creation failed");
      }
  
      return createHandlerState(data.data);
    }
  }
}
