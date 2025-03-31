declare module "swipl-wasm" {
  export class Query {
    next: () => { done: boolean; value: Record<string, any> };
    once: () => Record<string, any> &
      ({ success?: false } | { error: true; message: string });
    close: () => void;
  }

  export class Prolog {
    /**
     * Load a Prolog file.
     * Pretend to be a file loaded from a file with the given id.
     *
     * @param {string} file - The path to the Prolog file.
     * @param {string} id - The identifier for the Prolog file.
     */
    load_string: (string: string, id: string) => Promise<void>;

    /**
     * Load all scripts that have the type `text/prolog`.
     * This is used to load Prolog scripts from HTML files.
     *
     * The file reference for the loaded script is `/script/Id` where Id is derived from
     * the id of the script element.
     *
     * @returns {Promise<string[]>} - A promise that resolves to an array of loaded script ids.
     */
    load_scripts(): () => Promise<string[]>;

    /**
     * Consult a Prolog source.
     * This is used to load Prolog files or a URL.
     *
     * The last argument may be an object representing the options for the consult.
     * The options object may contain a `module` property, which is a string representing which
     * module non-module resources should be loaded into.
     */
    consult: (...arguments: string | { module?: string }) => Promise<number>;

    /**
     * Processes a Prolog goal represented as a String and returns true or false.
     * This simple calling pattern is intended for trivial goals such as setting a Prolog flag.
     * For example, the call below limits the Prolog stacks to 10Mb.
     */
    call: (goal: string) => Promise<true>;

    /**
     * Create a Prolog query from a String, optionally binding Prolog variables embedded in Goal from
     * properties of the Object Input. The returned object is an instance of class Query.
     * This instance can be used as a JavaScript iterator. The value returned in each iteration is an
     * Object with properties for each variable in Goal that is not in Input and does not start with
     * an underscore. For example, we can iterate over the members of a list like below. Further
     * details on class Query are provided in section 13.2.1. The translation of data between Prolog
     * and JavaScript is described in section 13.2.3.
     *
     * engine: Boolean
     * If true, run the query in a temporary engine. Note that JavaScript can only interact with the
     * innermost query of an engine. By using a new engine we can interact with multiple queries,
     * using them as coroutines. Prolog.Engine() for details.
     */
    query: (goal: string) => Promise<Query>;
    query: (goal: string, input: Record<string, unknown>) => Promise<Query>;
    query: (
      goal: string,
      input: Record<string, unknown>,
      options: { engine?: boolean }
    ) => Promise<Query>;

    forEach: (goal: string) => Promise<void>;
    forEach: (goal: string, input: Record<string, any>) => Promise<void>;
    forEach: (
      goal: string,
      input: Record<string, any>,
      on_answer: (result: Record<string, any>) => void
    ) => Promise<void>;
    forEach: (
      goal: string,
      input: Record<string, any>,
      on_answer: (result: Record<string, any>) => void,
      options: { engine?: boolean; heartbeat?: number }
    ) => Promise<void>;
  }

  export class Module {
    prolog: Prolog;
  }

  export default function SWIPL(options?: {
    arguments?: string[];
    locateFile?: (filename: string) => string;
    on_output?: (text: string, output: "stdout" | "stderr") => void;
  }): Promise<Module>;
}
