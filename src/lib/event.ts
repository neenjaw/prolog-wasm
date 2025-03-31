import * as v from "valibot";

const WorkerEventSchema = v.object({
  data: v.object({
    type: v.string(),
  }),
});

type WorkerEventData = v.InferOutput<typeof WorkerEventSchema>;

export function assertIsWorkerEvent(
  event: unknown
): asserts event is WorkerEventData {
  v.parse(WorkerEventSchema, event);
}

const WorkerPrologEventSchema = v.object({
  data: v.object({
    type: v.literal("prolog"),
    payload: v.object({
      solution: v.string(),
      test: v.string(),
    }),
  }),
});

type WorkerPrologEventData = v.InferOutput<typeof WorkerPrologEventSchema>;

export function assertIsWorkerPrologEvent(
  event: unknown
): asserts event is WorkerPrologEventData {
  v.parse(WorkerPrologEventSchema, event);
}
