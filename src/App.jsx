import { lazy, Suspense, useEffect, useRef, useState } from "react";
import AdSlot from "./components/AdSlot";
import TaskTracker from "./components/TaskTracker";
import { adsConfig, SIDE_RAIL_MEDIA_QUERY } from "./config/ads";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { lessons } from "./data/lessons";
import { useMediaQuery } from "./hooks/useMediaQuery";
import "./App.css";

const CodePlayground = lazy(() => import("./components/CodePlayground"));

function readProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem("react-concepts-progress") || "[]");
    return Array.isArray(saved)
      ? [...new Set(saved.filter((id) => lessons.some((lesson) => lesson.id === id)))]
      : [];
  } catch {
    return [];
  }
}

function LessonNavigation({ activeId, completedIds, onSelect }) {
  let lastGroup = "";

  return (
    <nav aria-label="React lesson path" className="lesson-navigation">
      {lessons.map((lesson) => {
        const showGroup = lesson.group !== lastGroup;
        lastGroup = lesson.group;

        return (
          <div key={lesson.id}>
            {showGroup && <p className="nav-group-label">{lesson.group}</p>}
            <button
              aria-current={activeId === lesson.id ? "step" : undefined}
              className={`lesson-nav-item${activeId === lesson.id ? " is-current" : ""}`}
              onClick={() => onSelect(lesson.id)}
              type="button"
            >
              <span className={`lesson-number${completedIds.includes(lesson.id) ? " is-complete" : ""}`}>
                {completedIds.includes(lesson.id) ? "✓" : lesson.number}
              </span>
              <span className="lesson-nav-copy">
                <strong>{lesson.title}</strong>
                <small>{lesson.summary}</small>
              </span>
              <span className="nav-chevron" aria-hidden="true">›</span>
            </button>
          </div>
        );
      })}
    </nav>
  );
}

function LessonDetail({ lesson, isComplete, onToggleComplete, onPrevious, onNext, onOpenPlayground, isFirst, isLast, cardRef }) {
  return (
    <article className="lesson-card" ref={cardRef} aria-labelledby="lesson-title">
      <div className="lesson-card-top">
        <span className="lesson-index">LESSON {lesson.number} <span aria-hidden="true">/</span> 08</span>
        {isComplete && <span className="complete-tag"><span aria-hidden="true">✓</span> Learned</span>}
      </div>
      <h2 id="lesson-title">{lesson.title}</h2>
      <p className="lesson-intro">{lesson.explanation}</p>

      <div className="concept-callout">
        <span className="callout-icon" aria-hidden="true">✳</span>
        <div>
          <span className="callout-label">THE KEY IDEA</span>
          <p>{lesson.takeaway}</p>
        </div>
      </div>

      <div className="code-example">
        <div className="code-heading">
          <span><i aria-hidden="true" /> TRY IT IN CODE</span>
          <span>JSX</span>
        </div>
        <pre><code>{lesson.code}</code></pre>
      </div>

      <div className="challenge-card">
        <div className="challenge-icon" aria-hidden="true">↗</div>
        <div>
          <span className="callout-label">YOUR MINI CHALLENGE</span>
          <p>{lesson.challenge}</p>
        </div>
      </div>

      <div className="lesson-actions">
        <button
          className={`button ${isComplete ? "button-secondary" : "button-primary"}`}
          onClick={onToggleComplete}
          type="button"
        >
          {isComplete ? "✓  Completed" : "Mark as learned"}
        </button>
        <button className="button button-secondary" onClick={onOpenPlayground} type="button">
          <span aria-hidden="true">▶</span> Try it live
        </button>
        <div className="lesson-pager">
          <button className="pager-button" disabled={isFirst} onClick={onPrevious} type="button">
            <span aria-hidden="true">←</span> Previous
          </button>
          <button className="pager-button pager-button-next" onClick={onNext} type="button">
            {isLast ? "Start building" : "Next concept"} <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </article>
  );
}

function LearningApp() {
  const { theme, toggleTheme } = useTheme();
  const [activeView, setActiveView] = useState("learn");
  const [activeLessonId, setActiveLessonId] = useState(lessons[0].id);
  const [completedIds, setCompletedIds] = useState(readProgress);
  const activeLesson = lessons.find((lesson) => lesson.id === activeLessonId) ?? lessons[0];
  const activeIndex = lessons.indexOf(activeLesson);
  const progress = Math.round((completedIds.length / lessons.length) * 100);
  const showSideAds = useMediaQuery(SIDE_RAIL_MEDIA_QUERY) && adsConfig.hasSideRails;
  const lessonCardRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem("react-concepts-progress", JSON.stringify(completedIds));
    } catch {
      // Lesson progress still works for this session when storage is unavailable.
    }
  }, [completedIds]);

  function toggleLessonComplete() {
    setCompletedIds((current) =>
      current.includes(activeLessonId)
        ? current.filter((id) => id !== activeLessonId)
        : [...current, activeLessonId],
    );
  }

  function selectLesson(id) {
    setActiveLessonId(id);

    const card = lessonCardRef.current;
    if (card && card.getBoundingClientRect().top < 0) {
      card.scrollIntoView({ block: "start" });
    }
  }

  function goToPreviousLesson() {
    if (activeIndex > 0) selectLesson(lessons[activeIndex - 1].id);
  }

  function goToNextLesson() {
    if (activeIndex === lessons.length - 1) {
      setActiveView("practice");
      return;
    }
    selectLesson(lessons[activeIndex + 1].id);
  }

  return (
    <div className={`page-frame${showSideAds ? " has-side-ads" : ""}`}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      {showSideAds && <AdSlot side="left" slot={adsConfig.slots.left} />}
      <div className="page-content">
        <header className="topbar">
          <a className="brand" href="#main-content" onClick={() => setActiveView("learn")}>
            <span className="brand-mark" aria-hidden="true">r.</span>
            <span className="brand-copy">
              <strong>React Fieldnotes</strong>
              <small>learn by building</small>
            </span>
          </a>
          <div className="topbar-right">
            <span className="course-label"><span /> YOUR REACT STARTER KIT</span>
            <button
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
              className="theme-toggle"
              onClick={toggleTheme}
              type="button"
            >
              <span aria-hidden="true">{theme === "light" ? "☾" : "☼"}</span>
              <span className="theme-label">{theme === "light" ? "Dark mode" : "Light mode"}</span>
            </button>
          </div>
        </header>

        <main id="main-content" tabIndex={-1}>
          <section className="welcome-section">
            <div>
              <p className="eyebrow"><span className="eyebrow-line" /> A FRIENDLY GUIDE TO REACT</p>
              <h1>Learn React.<br /><span>Make it yours.</span></h1>
              <p className="welcome-copy">
                The essentials, made practical. Explore one idea at a time, then put it to work in a tiny app.
              </p>
            </div>
            <div className="welcome-aside">
              <div className="progress-orbit" aria-label={`${progress}% course progress`}>
                <strong>{String(completedIds.length).padStart(2, "0")}<small>/08</small></strong>
              </div>
              <div>
                <span className="aside-caption">YOUR PROGRESS</span>
                <strong className="aside-title">{completedIds.length === 0 ? "A fresh start" : `${progress}% explored`}</strong>
                <div className="progress-track" role="progressbar" aria-label="Learning path progress" aria-valuemax="100" aria-valuemin="0" aria-valuenow={progress}>
                  <span style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
          </section>

          <div className="view-switcher" role="group" aria-label="Learning app views">
            <button
              aria-pressed={activeView === "learn"}
              className={`view-tab${activeView === "learn" ? " is-selected" : ""}`}
              onClick={() => setActiveView("learn")}
              type="button"
            >
              <span className="tab-icon" aria-hidden="true">✳</span> Learn the concepts
              <span className="tab-count">08</span>
            </button>
            <button
              aria-pressed={activeView === "practice"}
              className={`view-tab${activeView === "practice" ? " is-selected" : ""}`}
              onClick={() => setActiveView("practice")}
              type="button"
            >
              <span className="tab-icon" aria-hidden="true">↗</span> Build the app
              <span className="tab-label">HANDS-ON</span>
            </button>
            <button
              aria-pressed={activeView === "playground"}
              className={`view-tab${activeView === "playground" ? " is-selected" : ""}`}
              onClick={() => setActiveView("playground")}
              type="button"
            >
              <span className="tab-icon" aria-hidden="true">▶</span> Code playground
              <span className="tab-label">LIVE</span>
            </button>
          </div>

          {activeView === "learn" ? (
            <div className="learning-layout">
              <aside className="learning-sidebar">
                <div className="sidebar-heading">
                  <span>THE LEARNING PATH</span>
                  <span>{String(completedIds.length).padStart(2, "0")} / 08</span>
                </div>
                <LessonNavigation
                  activeId={activeLessonId}
                  completedIds={completedIds}
                  onSelect={selectLesson}
                />
                <div className="sidebar-note">
                  <span className="sidebar-note-mark" aria-hidden="true">✦</span>
                  <p>Small steps add up.<br /><strong>Try each idea yourself.</strong></p>
                </div>
              </aside>
              <div className="lesson-main">
                <LessonDetail
                  cardRef={lessonCardRef}
                  isComplete={completedIds.includes(activeLessonId)}
                  isFirst={activeIndex === 0}
                  isLast={activeIndex === lessons.length - 1}
                  lesson={activeLesson}
                  onNext={goToNextLesson}
                  onOpenPlayground={() => setActiveView("playground")}
                  onPrevious={goToPreviousLesson}
                  onToggleComplete={toggleLessonComplete}
                />
                <p className="lesson-footnote">
                  <span aria-hidden="true">◎</span> Learning sticks when you build. Edit the example, break it, and try again.
                </p>
              </div>
            </div>
          ) : activeView === "playground" ? (
            <div className="practice-view">
              <div className="practice-intro">
                <div>
                  <p className="eyebrow"><span className="eyebrow-line" /> WRITE IT YOURSELF</p>
                  <h2>Your code, <span>live.</span></h2>
                  <p>Start from any lesson's example, change it, and watch your React component render instantly.</p>
                </div>
                <div className="practice-stamp"><span>EDIT</span><strong>break it,<br />fix it</strong><i>▶</i></div>
              </div>
              <Suspense fallback={<p className="playground-loading">Loading the playground…</p>}>
                <CodePlayground key={activeLessonId} lessonId={activeLessonId} onSelectLesson={setActiveLessonId} />
              </Suspense>
            </div>
          ) : (
            <div className="practice-view">
              <div className="practice-intro">
                <div>
                  <p className="eyebrow"><span className="eyebrow-line" /> PUT THE PIECES TOGETHER</p>
                  <h2>A small app, <span>real React.</span></h2>
                  <p>Build a task tracker while practicing state, events, forms, lists, effects, and context.</p>
                </div>
                <div className="practice-stamp"><span>MADE FOR</span><strong>learning<br />by doing</strong><i>✳</i></div>
              </div>
              <TaskTracker />
              <div className="practice-hint">
                <span aria-hidden="true">✦</span>
                Your tasks and theme are saved in this browser, so your practice will be here when you return.
              </div>
            </div>
          )}
        </main>

        <footer className="site-footer">
          <span><span className="footer-mark">r.</span> Keep curious. Keep building.</span>
          <span>Made for your first steps with React <span aria-hidden="true">✳</span></span>
        </footer>
      </div>
      {showSideAds && <AdSlot side="right" slot={adsConfig.slots.right} />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LearningApp />
    </ThemeProvider>
  );
}
