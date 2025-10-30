import { useWorkflowsClient } from "@/src/lib/api-provider";
import { Workflow } from "../store/workflow";
import { Handler } from "../store/handler";
import { Handlers } from "../store/handlers";
import { Workflows } from "../store/workflows";
import { getOrCreate } from "@/src/shared/store";
import { proxy, useSnapshot } from "valtio";

export function useHandlers(): Handlers {
  const client = useWorkflowsClient();
  const store = getOrCreate<Handlers>("handlers", () =>
    proxy<Handlers>(new Handlers(client))
  );
  return useSnapshot(store);
}

export function useWorkflows(): Workflows {
  const client = useWorkflowsClient();
  const handlers = useHandlers();
  const store = getOrCreate<Workflows>("workflows", () =>
    proxy<Workflows>(new Workflows(client, handlers))
  );
  return useSnapshot(store);
}

export function useWorkflow(name: string): Workflow {
  const client = useWorkflowsClient();
  const handlers = useHandlers();
  const store = getOrCreate<Workflow>("workflow:" + name, () =>
    proxy<Workflow>(new Workflow(client, name, handlers))
  );
  return useSnapshot(store);
}

export function useHandler(handlerId: string): Handler {
  const handlers = useHandlers();
  const handler = handlers.handlers[handlerId];
  if (!handler) {
    throw new Error(
      `Handler ${handlerId} not found, make sure to call useHandlers() first`
    );
  }
  return useSnapshot(handler);
}
