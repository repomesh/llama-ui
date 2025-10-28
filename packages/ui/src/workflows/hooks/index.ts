import { useWorkflowsClient } from "@/src/lib/api-provider";
import { Workflow } from "../store/workflow";
import { Handler } from "../store/handler";
import { Handlers } from "../store/handlers";
import { Workflows } from "../store/workflows";
import { getOrCreate } from "@/src/shared/store";

export function useHandlers(): Handlers {
  const client = useWorkflowsClient();
  return getOrCreate<Handlers>("handlers", () => new Handlers(client));
}

export function useWorkflows(): Workflows {
  const client = useWorkflowsClient();
  const handlers = useHandlers();
  return getOrCreate<Workflows>(
    "workflows",
    () => new Workflows(client, handlers)
  );
}

export function useWorkflow(name: string): Workflow {
  const client = useWorkflowsClient();
  const handlers = useHandlers();
  return getOrCreate<Workflow>(
    "workflow:" + name,
    () => new Workflow(client, name, handlers)
  );
}

export function useHandler(handlerId: string): Handler {
  const handlers = useHandlers();
  const handler = handlers.handlers[handlerId];
  if (!handler) {
    throw new Error(
      `Handler ${handlerId} not found, make sure to call useHandlers() first`
    );
  }
  return handler;
}
