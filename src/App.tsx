import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Worker from "./worker?worker";
import "./App.css";
import { Button } from "@/components/ui/button";

function App() {
  const [count, setCount] = useState(0);
  const swiplWorkerRef = useRef<Worker | null>(null);

  useEffect(() => {
    swiplWorkerRef.current = new Worker();

    swiplWorkerRef.current.onmessage = (event) => {
      const { data } = event;
      if (data.type === "heartbeat") {
        console.log("Worker heartbeat:", data.message);
      } else if (data.type === "prolog") {
        if (data.success) {
          console.log("Prolog result:", data.payload.result);
        } else {
          console.error("Prolog error:", data.payload.error);
        }
      } else {
        console.error("Unhandled message type:", data.type);
      }
    };

    swiplWorkerRef.current.onerror = (error) => {
      console.error("Main thread: Worker error:", error);
    };

    return () => {
      if (swiplWorkerRef.current) {
        swiplWorkerRef.current.terminate();
        swiplWorkerRef.current = null;
      }
    };
  }, []);

  const callForProofOfLife = () => {
    if (swiplWorkerRef.current) {
      swiplWorkerRef.current.postMessage({
        type: "heartbeat",
      });
    } else {
      console.error("Worker is not initialized");
    }
  };

  const callProlog = () => {
    if (swiplWorkerRef.current) {
      swiplWorkerRef.current.postMessage({
        type: "prolog",
        payload: {
          solution: `
          % Facts: Defining parent relationships
parent(john, mary).   % John is a parent of Mary.
parent(john, bob).    % John is a parent of Bob.
parent(anne, mary).   % Anne is a parent of Mary.
parent(anne, bob).    % Anne is a parent of Bob.
parent(mary, lisa).   % Mary is a parent of Lisa.
parent(bob, tom).    % Bob is a parent of Tom.

% Rule: Defining grandparent relationship
grandparent(GP, GC) :-  % GP is a grandparent of GC if:
parent(GP, P),     % GP is a parent of someone (let's call them P), AND
parent(P, GC).     % that someone (P) is a parent of GC.`,
          test: `
:- use_module(library(plunit)).
:- begin_tests(lists).

test(parent) :-
        parent(john, mary).

:- end_tests(lists).
        `,
        },
      });
    } else {
      console.error("Worker is not initialized");
    }
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <Button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
        <Button onClick={callForProofOfLife}>Call for proof of life</Button>
        <Button onClick={callProlog}>Call Prolog</Button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
