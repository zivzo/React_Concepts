import { useState } from "react";
import { useTasks } from "../hooks/useTasks";

const filters = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "done", label: "Done" },
];

export default function TaskTracker() {
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const { tasks, dispatch, addTask } = useTasks();
  const completeCount = tasks.filter((task) => task.done).length;
  const activeCount = tasks.length - completeCount;
  const visibleTasks = tasks.filter((task) => {
    if (filter === "active") return !task.done;
    if (filter === "done") return task.done;
    return true;
  });

  function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim()) return;

    addTask(title);
    setTitle("");
  }

  return (
    <section className="tracker-card" aria-labelledby="tracker-heading">
      <div className="tracker-heading">
        <div>
          <p className="eyebrow">YOUR FIRST REACT PROJECT</p>
          <h2 id="tracker-heading">The task tracker</h2>
          <p className="muted-copy">A little practice, one task at a time.</p>
        </div>
        <span className="tracker-icon" aria-hidden="true">✓</span>
      </div>

      <form className="task-form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="new-task">Add a task</label>
        <input
          id="new-task"
          autoComplete="off"
          maxLength={120}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What would you like to practice?"
          value={title}
        />
        <button className="button button-primary add-button" disabled={!title.trim()} type="submit">
          <span aria-hidden="true">+</span> Add task
        </button>
      </form>

      <div className="task-toolbar">
        <div className="filter-tabs" aria-label="Filter tasks" role="group">
          {filters.map((option) => (
            <button
              aria-pressed={filter === option.id}
              className={`filter-button${filter === option.id ? " is-active" : ""}`}
              key={option.id}
              onClick={() => setFilter(option.id)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
        <span className="task-count">
          {activeCount} left
        </span>
      </div>

      <ul className="task-list">
        {visibleTasks.map((task) => (
          <li className={`task-item${task.done ? " is-done" : ""}`} key={task.id}>
            <label className="task-label">
              <input
                checked={task.done}
                onChange={() => dispatch({ type: "toggled", id: task.id })}
                type="checkbox"
              />
              <span className="task-title">{task.title}</span>
            </label>
            <button
              aria-label={`Remove ${task.title}`}
              className="remove-task"
              onClick={() => dispatch({ type: "removed", id: task.id })}
              type="button"
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      {visibleTasks.length === 0 && (
        <div className="empty-state">
          <span aria-hidden="true">{tasks.length === 0 ? "✳" : "↗"}</span>
          <p>
            {tasks.length === 0
              ? "Your list is a blank canvas. Add a task to begin."
              : `No ${filter === "active" ? "active" : "completed"} tasks right now.`}
          </p>
        </div>
      )}

      <div className="tracker-footer">
        <span>{completeCount} of {tasks.length} tasks completed</span>
        {completeCount > 0 && (
          <button
            className="text-button"
            onClick={() => dispatch({ type: "cleared-completed" })}
            type="button"
          >
            Clear completed
          </button>
        )}
      </div>
    </section>
  );
}
