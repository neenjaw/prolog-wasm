import { Temporal } from "temporal-polyfill";
import { assertIsWorkerEvent, assertIsWorkerPrologEvent } from "@/lib/event";
import { initProlog, evalProlog } from "./worker/prolog";

function heartbeat() {
  return `${Temporal.Now.instant().toString()} - Worker is alive`;
}

self.onmessage = function (event: unknown) {
  assertIsWorkerEvent(event);

  if (event.data.type === "heartbeat") {
    self.postMessage({
      type: "heartbeat",
      message: heartbeat(),
    });
    return;
  } else if (event.data.type === "prolog") {
    assertIsWorkerPrologEvent(event);

    const { solution, test } = event.data.payload;
    initProlog({ arguments: [] }) // ["-q"] })
      .then(() => evalProlog(solution, test))
      .then((result) => {
        self.postMessage({
          type: "prolog",
          success: true,
          payload: {
            result,
          },
        });
      })
      .catch((error: Error) => {
        self.postMessage({
          type: "prolog",
          success: false,
          payload: {
            error: error.message,
          },
        });
      });
    return;
  } else {
    console.log({ event });
    // self.reportError(new Error("Unhandled message type: " + event.data.type));
  }
};

self.onerror = function (error) {
  console.error("Worker error:", error);
};
