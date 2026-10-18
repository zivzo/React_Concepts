import { useEffect, useReducer } from "react";

const STORAGE_KEY = "react-concepts-tasks";

function readTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(savedTasks)
      ? savedTasks.filter(
          (task) =>
            typeof task.id === "string" &&
            typeof task.title === "string" &&
            typeof task.done === "boolean",
        )
      : [];
  } catch {
    return [];
  }
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case "added":
      return [action.task, ...tasks];
    case "toggled":
      return tasks.map((task) =>
        task.id === action.id ? { ...task, done: !task.done } : task,
      );
    case "removed":
      return tasks.filter((task) => task.id !== action.id);
    case "cleared-completed":
      return tasks.filter((task) => !task.done);
    default:
      return tasks;
  }
}

export function useTasks() {
  const [tasks, dispatch] = useReducer(tasksReducer, undefined, readTasks);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // Keep the in-memory task list usable when storage is unavailable.
    }
  }, [tasks]);

  const addTask = (title) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    dispatch({
      type: "added",
      task: {
        id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
        title: trimmedTitle,
        done: false,
      },
    });
  };

  return { tasks, dispatch, addTask };
}
