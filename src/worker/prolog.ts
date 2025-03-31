import SWIPL, { type Module, Prolog } from "swipl-wasm";

let module: Module | null = null;
let prolog: Prolog | null = null;
let buffer: Array<[string, string]> = [];

export const initProlog = async (args: Parameters<typeof SWIPL>[0]) => {
  const combinedArgs = {
    ...args,
    on_output: (text: string, output: "stdout" | "stderr") => {
      if (args?.on_output) {
        args.on_output(text, output);
      }
      buffer.push([text, output]);
    },
  };
  if (!module) {
    module = await SWIPL(combinedArgs);
    prolog = module.prolog;
    buffer = [];
  }
  if (!prolog) {
    throw new Error("SWI-Prolog instance is not initialized");
  }
  return { module, prolog };
};

const assertReady = () => {
  if (!module) {
    throw new Error("SWI-Prolog module is not initialized");
  }
  if (!prolog) {
    throw new Error("SWI-Prolog instance is not initialized");
  }
};

const getInstance = () => {
  assertReady();
  return { module, prolog } as { module: Module; prolog: Prolog };
};

export async function evalProlog(
  solution: string,
  test: string
): Promise<{ result: string }> {
  const { prolog, module } = getInstance();
  await prolog.load_string(solution, "solution");
  await prolog.load_string(test, "test");
  const result = (await prolog.query("run_tests")).once();
  const oldBuffer = buffer;
  buffer = [];
  console.info({ buffer: oldBuffer, result, prolog, module });

  return Promise.resolve({ result: "ok" }); // Placeholder for actual Prolog evaluation
}
