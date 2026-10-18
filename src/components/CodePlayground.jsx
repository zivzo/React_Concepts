import * as React from "react";
import { Component, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { transform } from "sucrase";
import { lessons } from "../data/lessons";
import { playgroundStarters } from "../data/playgroundStarters";

const STORAGE_KEY = "react-concepts-playground";
const RUN_DELAY_MS = 500;
const INDENT = "  ";

function readSavedCode() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
  } catch {
    return {};
  }
}

function saveCode(lessonId, code) {
  try {
    const saved = readSavedCode();
    if (code === playgroundStarters[lessonId]) {
      delete saved[lessonId];
    } else {
      saved[lessonId] = code;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch {
    // The playground still works for this session when storage is unavailable.
  }
}

function requireModule(name) {
  if (name === "react") return React;
  throw new Error(`Cannot import "${name}". The playground only supports imports from "react".`);
}

// Compiles JSX + ES module syntax and returns the default-exported component.
// The code runs in this page, just like code you write in src/.
function compile(source) {
  try {
    const { code } = transform(source, { transforms: ["jsx", "imports"], production: true });
    const module = { exports: {} };
    new Function("React", "require", "module", "exports", code)(
      React,
      requireModule,
      module,
      module.exports,
    );

    if (typeof module.exports.default !== "function") {
      return { error: "Export a component to preview, for example: export default function App() { … }" };
    }
    return { App: module.exports.default };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
}

function PlaygroundError({ title, message }) {
  return (
    <div className="playground-error" role="alert">
      <strong>{title}</strong>
      <pre>{message}</pre>
    </div>
  );
}

class PreviewErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      const { error } = this.state;
      return (
        <PlaygroundError
          message={error instanceof Error ? error.message : String(error)}
          title="Something went wrong while rendering"
        />
      );
    }
    return this.props.children;
  }
}

function CodeEditor({ id, value, onChange, onRunNow }) {
  const textareaRef = useRef(null);
  const pendingCursor = useRef(null);
  const escapePressed = useRef(false);
  const lineCount = value.split("\n").length;

  useLayoutEffect(() => {
    if (pendingCursor.current !== null) {
      textareaRef.current.setSelectionRange(pendingCursor.current, pendingCursor.current);
      pendingCursor.current = null;
    }
  });

  function insertText(textarea, text) {
    // execCommand keeps the browser's undo history; fall back to a manual update.
    if (document.execCommand?.("insertText", false, text)) return;
    const { selectionStart, selectionEnd } = textarea;
    onChange(value.slice(0, selectionStart) + text + value.slice(selectionEnd));
    pendingCursor.current = selectionStart + text.length;
  }

  function handleKeyDown(event) {
    const textarea = event.currentTarget;
    const leaveEditor = escapePressed.current;
    escapePressed.current = event.key === "Escape";

    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      onRunNow();
      return;
    }

    if (event.key === "Tab" && !leaveEditor && !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
      event.preventDefault();
      insertText(textarea, INDENT);
      return;
    }

    if (event.key === "Enter" && !event.shiftKey && !event.altKey) {
      const lineStart = value.lastIndexOf("\n", textarea.selectionStart - 1) + 1;
      const indent = value.slice(lineStart, textarea.selectionStart).match(/^[ \t]*/)[0];
      if (indent) {
        event.preventDefault();
        insertText(textarea, `\n${indent}`);
      }
    }
  }

  return (
    <div className="code-editor">
      <pre aria-hidden="true" className="code-editor-lines">
        {Array.from({ length: lineCount }, (_, index) => index + 1).join("\n")}
      </pre>
      <textarea
        aria-describedby="playground-help"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        id={id}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        ref={textareaRef}
        rows={lineCount}
        spellCheck={false}
        value={value}
        wrap="off"
      />
    </div>
  );
}

export default function CodePlayground({ lessonId, onSelectLesson }) {
  const starter = playgroundStarters[lessonId];
  const [draft, setDraft] = useState(() => {
    const saved = readSavedCode()[lessonId];
    return typeof saved === "string" ? saved : starter;
  });
  const [runSource, setRunSource] = useState(draft);
  const result = useMemo(() => compile(runSource), [runSource]);
  const isWaiting = draft !== runSource;
  const PreviewApp = result.App;

  useEffect(() => {
    if (draft === runSource) return undefined;

    const timeoutId = setTimeout(() => setRunSource(draft), RUN_DELAY_MS);
    return () => clearTimeout(timeoutId);
  }, [draft, runSource]);

  // Saved only after the preview has rendered, so code that freezes the page
  // (like an infinite loop) is not restored on the next visit.
  useEffect(() => {
    saveCode(lessonId, runSource);
  }, [lessonId, runSource]);

  function resetExample() {
    if (draft !== starter && !window.confirm("Replace your code with the original example?")) return;
    setDraft(starter);
    setRunSource(starter);
  }

  let status = "Live";
  if (isWaiting) status = "Updating…";
  else if (result.error) status = "Error";

  return (
    <section className="playground-card" aria-labelledby="playground-heading">
      <div className="playground-toolbar">
        <div>
          <h2 id="playground-heading">Code playground</h2>
          <p className="muted-copy">Edit the code — the preview updates as you type.</p>
        </div>
        <div className="playground-controls">
          <label className="playground-select">
            <span>Example</span>
            <select onChange={(event) => onSelectLesson(event.target.value)} value={lessonId}>
              {lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.number} · {lesson.title}
                </option>
              ))}
            </select>
          </label>
          <button className="button button-secondary" onClick={resetExample} type="button">
            ↺ Reset
          </button>
        </div>
      </div>

      <div className="playground-panes">
        <div className="playground-pane">
          <div className="code-heading">
            <label htmlFor="playground-editor"><i aria-hidden="true" /> APP.JSX</label>
            <span>EDITABLE</span>
          </div>
          <CodeEditor
            id="playground-editor"
            onChange={setDraft}
            onRunNow={() => setRunSource(draft)}
            value={draft}
          />
        </div>

        <div className="playground-pane">
          <div className="code-heading">
            <span><i aria-hidden="true" className="preview-dot" /> PREVIEW</span>
            <span
              aria-live="polite"
              className={`playground-status${result.error && !isWaiting ? " is-error" : ""}`}
            >
              {status}
            </span>
          </div>
          <div className="playground-preview">
            {result.error ? (
              <PlaygroundError message={result.error} title="Your code could not run" />
            ) : (
              <PreviewErrorBoundary key={runSource}>
                <PreviewApp />
              </PreviewErrorBoundary>
            )}
          </div>
        </div>
      </div>

      <p className="playground-help" id="playground-help">
        <kbd>Tab</kbd> indents · <kbd>Esc</kbd> then <kbd>Tab</kbd> leaves the editor · <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>Enter</kbd> runs now.
        Import Hooks from <code>"react"</code> and <code>export default</code> the component to show. Your code is saved in this browser.
      </p>
    </section>
  );
}
