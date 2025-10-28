import { Client, getWorkflows } from "@llamaindex/workflows-client";
import { Workflow } from "./workflow";
import { proxy } from "valtio";
import { Handlers } from "./handlers";

export class Workflows {
  workflows: Record<string, Workflow>;

  constructor(
    public readonly client: Client,
    public readonly handlers: Handlers
  ) {
    this.workflows = {};
  }

  fetch = async () => {
    const resp = await getWorkflows({
      client: this.client,
    });
    const allWorkflows = resp.data?.workflows ?? [];

    this.workflows = Object.fromEntries(
      allWorkflows.map((name) => [
        name,
        proxy(new Workflow(this.client, name, this.handlers)),
      ])
    );
    return this.workflows;
  };
}
