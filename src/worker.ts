import SWIPL from "swipl-wasm";
import { Temporal } from "temporal-polyfill";

type WorkerEvent = {
  data: {
    type: string;
  };
};

function assertIsWorkerEvent(event: unknown): asserts event is WorkerEvent {
  if (typeof event !== "object" || event === null) {
    throw new Error("Event is not an object");
  }
  if (!("data" in event)) {
    throw new Error("Event does not have a data property");
  }
  if (typeof (event as WorkerEvent).data !== "object") {
    throw new Error("Event data is not an object");
  }
  if (!("type" in (event as WorkerEvent).data)) {
    throw new Error("Event data does not have a type property");
  }
  if (typeof (event as WorkerEvent).data.type !== "string") {
    throw new Error("Event data type is not a string");
  }
}

function heartbeat() {
  return `${Temporal.Now.instant().toString()} - Worker is alive`;
}

self.onmessage = function (event: any) {
  assertIsWorkerEvent(event);

  const { data } = event;
  if (data.type === "heartbeat") {
    self.postMessage({
      type: "heartbeat",
      message: heartbeat(),
    });
  } else {
    self.reportError(new Error("Unhandled message type: " + data.type));
  }
};

self.onerror = function (error) {
  console.error("Worker error:", error);
};
