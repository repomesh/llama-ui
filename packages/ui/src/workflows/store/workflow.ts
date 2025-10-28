import {
  Client,
  postWorkflowsByNameRunNowait,
} from "@llamaindex/workflows-client";
import { proxy } from "valtio";
import { Handler } from "./handler";
import { JSONValue } from "../types";
import type { Handlers } from "./handlers";

export class Workflow {
  // TODO: add graph data
  graph: unknown | null = null;

  constructor(
    public readonly client: Client,
    public readonly name: string,
    private readonly handlersStore: Handlers
  ) {}

  get handlers(): Record<string, Handler> {
    const allHandlers = this.handlersStore.handlers;
    return Object.fromEntries(
      Object.entries(allHandlers).filter(
        ([_, handler]) => handler.workflowName === this.name
      )
    );
  }

  createHandler = async (workflowName: string, input: JSONValue) => {
    const data = await postWorkflowsByNameRunNowait({
      client: this.client,
      path: { name: workflowName },
      body: {
        start_event: input as { [key: string]: unknown } | undefined,
      },
    });

    if (!data.data) {
      throw new Error("Handler creation failed");
    }

    const handler = proxy(new Handler(data.data, this.client));

    // Store in global handlers collection
    this.handlersStore._addHandler(handler);
    return handler;
  };
}
