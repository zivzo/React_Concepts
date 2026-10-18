# React Concepts: Learn by Building

A hands-on path for learning the React concepts you will use most often. React is a JavaScript library for building user interfaces, so this guide assumes you can write basic JavaScript (functions, arrays, objects, imports, and `map`).

## Get started

Create a local React project with Vite:

```bash
npm create vite@latest react-practice -- --template react
cd react-practice
npm install
npm run dev
```

Open the local URL printed in the terminal. Work through the sections below in order, using the project to try each idea. Change the starter app freely; the goal is to build things yourself, not just read examples.

## Learning path

For each topic, first explain the idea in your own words, then complete the practice task without copying a finished solution.

### 1. Components and JSX

Components are JavaScript functions that return UI. JSX lets you describe that UI with markup-like syntax.

```jsx
function Welcome() {
  return <h1>Welcome to my app</h1>;
}
```

**Practice:** Replace the starter screen with a page made from `Header`, `ProfileCard`, and `Footer` components. Put each component in its own file and import it where needed. Try a JavaScript expression in JSX, such as `{2 + 2}`, and remember to use `className` for CSS classes.

### 2. Props and reusable components

Props are read-only values a parent passes to a child. Use them to make one component display different data.

```jsx
function ProfileCard({ name, role }) {
  return <article><h2>{name}</h2><p>{role}</p></article>;
}
```

**Practice:** Render three profile cards from the same component, each with different `name` and `role` props. Give a prop a sensible default and try passing an array or object as a prop.

### 3. State and events

State is data that can change over time and affect what is rendered. The `useState` Hook gives a component state and a setter; call it at the top level of the component. Update state with the setter rather than changing the existing value directly.

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

**Practice:** Build a counter with increment, decrement, and reset buttons. Use a functional state update for the counter, such as `setCount(current => current + 1)`. Then make a show/hide button for a paragraph. Notice that event handlers are passed as functions, such as `onClick={handleClick}`, rather than called during render.

### 4. Lists and keys

Use JavaScript to transform data into UI. Give each rendered item a stable, unique `key` so React can keep track of it when the list changes.

**Practice:** Store a few tasks in an array and render them with `map`. Give each task a stable ID for its key; avoid using the array index when items can be added or removed. Add buttons to complete and remove tasks by creating new arrays with methods such as `map` and `filter`, rather than mutating the state array.

### 5. Forms and controlled inputs

A controlled input gets its value from state and updates that state in `onChange`. This keeps the displayed value and React state in sync.

**Practice:** Make a task-entry form. Store the input value in state, prevent the browser's default form submission, add non-empty submissions to the task list, and clear the input after adding a task. Show a helpful message when the list is empty.

### 6. Sharing and deriving state

Keep each piece of state in the closest common parent that needs to read or change it, then pass data and event handlers down through props. Avoid storing values that can be calculated from existing props or state.

**Practice:** Add “all”, “active”, and “completed” filters to the task list. Keep the tasks and selected filter as state, and calculate the visible tasks during render. Move state up if both the form and list need to use it.

### 7. Effects and external systems

`useEffect` synchronizes a component with something outside React, such as a browser API or network connection. It is not needed for values that can be calculated while rendering. Effects that subscribe or start a resource should clean it up when they are no longer needed.

**Practice:** Initialize your task state from `localStorage` (using a lazy `useState` initializer), then save it in an effect whenever it changes. This prevents the initial empty state from overwriting saved tasks before they are restored. Try editing tasks and refreshing the page. Pay attention to the effect's dependencies and avoid putting derived display values in state.

### 8. Context, reducers, and custom Hooks

Reach for these tools when they solve a real problem: context can share a value across a component tree, a reducer can centralize complex state transitions, and a custom Hook can reuse stateful logic. They are not required for every component.

**Practice:** Add a light/dark theme. First pass it through props; then, if the tree makes that awkward, provide it with context. As a separate experiment, move task updates into a reducer and extract reusable task logic into a custom Hook.

## Capstone: Task tracker

Combine the sections into a small task-tracking app. It should let someone:

- Add a task, mark it complete, and remove it
- Filter tasks by status and see a useful empty state
- Keep tasks after refreshing the page
- Switch between light and dark themes

Build one feature at a time. After each feature, try the normal path and edge cases: empty input, no tasks, removing the last task, changing filters, and refreshing. Keep components small and give each piece of state a clear owner.

## Check your understanding

You are ready to move on when you can build the capstone without following a tutorial and explain:

- Why a UI section should be a component, and how props differ from state
- Why state should be updated with its setter and how events trigger updates
- Why list items need stable keys
- How a controlled input works and where shared state belongs
- When an effect is appropriate, and when a value should be derived instead
- What problem context, reducers, and custom Hooks solve

If something goes wrong, read the full browser-console and terminal error, check the component and prop names, and reduce the problem to the smallest example you can reproduce.

## Further learning

- [React Learn](https://react.dev/learn) — the official, interactive React tutorial and concept guides
- [Thinking in React](https://react.dev/learn/thinking-in-react) — a step-by-step approach to breaking a UI into components and state
- [React reference](https://react.dev/reference/react) — API details for components and Hooks
