// Runnable starter code for the code playground, one per lesson.
// Each starter must `export default` the component to render in the preview.
export const playgroundStarters = {
  components: `function Header() {
  return <h2>My profile</h2>;
}

function ProfileCard() {
  return <p>Hi! I'm learning React one component at a time.</p>;
}

// Challenge: add a Footer component and render it below the card.

export default function App() {
  return (
    <main>
      <Header />
      <ProfileCard />
    </main>
  );
}
`,
  props: `function ProfileCard({ name, role }) {
  return (
    <p>
      <strong>{name}</strong> · {role}
    </p>
  );
}

// Challenge: render a third card, then add an "emoji" prop.

export default function App() {
  return (
    <section>
      <ProfileCard name="Maya" role="Designer" />
      <ProfileCard name="Leo" role="Developer" />
    </section>
  );
}
`,
  state: `import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  // Challenge: add "−1" and "Reset" buttons.
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((current) => current + 1)}>
        +1
      </button>
    </div>
  );
}
`,
  lists: `import { useState } from "react";

const initialTasks = [
  { id: 1, title: "Read about props" },
  { id: 2, title: "Build a counter" },
  { id: 3, title: "Render a list" },
];

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);

  function removeTask(id) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  // Challenge: show a message when every task has been removed.
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          {task.title}{" "}
          <button onClick={() => removeTask(task.id)}>Remove</button>
        </li>
      ))}
    </ul>
  );
}
`,
  forms: `import { useState } from "react";

export default function App() {
  const [name, setName] = useState("");
  const [names, setNames] = useState([]);

  function handleSubmit(event) {
    event.preventDefault();
    // Challenge: ignore empty input and clear the field after submit.
    setNames((current) => [...current, name]);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Add a name"
      />
      <button type="submit">Add</button>
      <ul>
        {names.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </form>
  );
}
`,
  "derived-state": `import { useState } from "react";

const tasks = [
  { id: 1, title: "Learn JSX", done: true },
  { id: 2, title: "Practice state", done: false },
  { id: 3, title: "Try a filter", done: false },
];

export default function App() {
  const [filter, setFilter] = useState("all");

  // Derived from existing data — no extra state needed.
  const visibleTasks = tasks.filter(
    (task) => filter === "all" || (filter === "done") === task.done,
  );

  // Challenge: add an "Active" filter button.
  return (
    <div>
      <button onClick={() => setFilter("all")}>All</button>
      <button onClick={() => setFilter("done")}>Done</button>
      <p>Showing: {filter}</p>
      <ul>
        {visibleTasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
}
`,
  effects: `import { useEffect, useState } from "react";

export default function App() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
      setSeconds((current) => current + 1);
    }, 1000);

    // Cleanup stops the timer when "running" changes or the component unmounts.
    return () => clearInterval(id);
  }, [running]);

  // Challenge: update document.title with the seconds in another effect.
  return (
    <div>
      <p>Timer: {seconds}s</p>
      <button onClick={() => setRunning((current) => !current)}>
        {running ? "Pause" : "Resume"}
      </button>
    </div>
  );
}
`,
  "reusable-logic": `import { createContext, useContext, useReducer } from "react";

const ThemeContext = createContext("light");

function counterReducer(count, action) {
  switch (action.type) {
    case "increment":
      return count + 1;
    case "reset":
      return 0;
    default:
      throw new Error("Unknown action: " + action.type);
  }
}

function useCounter() {
  const [count, dispatch] = useReducer(counterReducer, 0);
  return {
    count,
    increment: () => dispatch({ type: "increment" }),
    reset: () => dispatch({ type: "reset" }),
  };
}

function Counter() {
  const theme = useContext(ThemeContext);
  const { count, increment, reset } = useCounter();

  return (
    <p>
      [{theme} theme] Count: {count}{" "}
      <button onClick={increment}>+1</button>{" "}
      <button onClick={reset}>Reset</button>
    </p>
  );
}

// Challenge: add a "decrement" action, then switch the theme to "dark".
export default function App() {
  return (
    <ThemeContext.Provider value="light">
      <Counter />
    </ThemeContext.Provider>
  );
}
`,
};
