import { Client, getHandlers } from "@llamaindex/workflows-client";
import { proxy } from "valtio";
import { Handler } from "./handler";

export class Handlers {
  handlers: Record<string, Handler>;

  constructor(public readonly client: Client) {
    this.handlers = {};
  }

  fetch = async () => {
    const resp = await getHandlers({
      client: this.client,
    });
    const allHandlers = resp.data?.handlers ?? [];

    const handlers = allHandlers.map((handler) =>
      proxy(new Handler(handler, this.client))
    );
    this.handlers = Object.fromEntries(handlers.map((h) => [h.handlerId, h]));
    return this.handlers;
  };

  _addHandler = (handler: Handler) => {
    this.handlers[handler.handlerId] = handler;
  };
}
