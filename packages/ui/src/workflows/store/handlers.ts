import {
  Client,
  EventEnvelopeWithMetadata,
  getHandlers,
} from "@llamaindex/workflows-client";
import { HandlerState } from "./handler";
import { proxy } from "valtio";
import { StopEvent } from "./workflow-event";

export interface HandlersState {
  handlers: Record<string, HandlerState>;
}

export const createState = (): HandlersState => {
  return proxy({ handlers: {} });
};

export function createActions(state: HandlersState, client: Client) {
  return {
    async sync() {
      const resp = await getHandlers({
        client: client,
      });
      const allHandlers = resp.data?.handlers ?? [];
      allHandlers.forEach((h) => {
        state.handlers[h.handler_id] = {
          handler_id: h.handler_id,
          workflow_name: h.workflow_name,
          status: h.status,
          started_at: h.started_at,
          updated_at: h.updated_at ? new Date(h.updated_at) : undefined,
          completed_at: h.completed_at ? new Date(h.completed_at) : undefined,
          error: h.error,
          result: h.result
            ? (StopEvent.fromRawEvent(
                h.result as EventEnvelopeWithMetadata
              ) as StopEvent)
            : undefined,
        };
      });
    },
    setHandler(handler: HandlerState) {
      state.handlers[handler.handler_id] = handler;
    },
  };
}
