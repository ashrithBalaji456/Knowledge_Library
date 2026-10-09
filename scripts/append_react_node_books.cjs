const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/pythonMlResources.ts');
let content = fs.readFileSync(filePath, 'utf8');

const newBooks = [
  {
    id: "res-nodejs-handwritten-notes",
    title: "Node.js Handwritten Notes",
    author: "Full-Stack JavaScript Collective",
    pages: 54,
    fileName: "Nodejs_Handwritten_Notes.pdf",
    category: "sec-handbooks",
    subCategory: "React & Node.js Full-Stack Notes",
    resourceType: "STUDY_NOTES",
    difficulty: "INTERMEDIATE",
    priority: "IMPORTANT",
    status: "NOT_STARTED",
    readingStatus: "NOT_STARTED",
    progress: 0,
    currentPage: 0,
    totalPages: 54,
    source: "uploaded_pdf",
    sourceUrl: "/books/Nodejs_Handwritten_Notes.pdf",
    fileDataUrl: "/books/Nodejs_Handwritten_Notes.pdf",
    whatIsThisBookFor: "Mastering backend JavaScript architecture, non-blocking I/O, the Event Loop, and Express.js REST API engineering through clear handwritten notes.",
    summary: "A comprehensive 54-page handwritten guide to backend JavaScript with Node.js. Covers Node.js architecture, V8 engine integration, libuv, the Event Loop phases, non-blocking asynchronous I/O, CommonJS vs ES Modules, core modules (fs, path, http, os, events), Express.js framework routing, middleware architectures, RESTful API construction, error handling patterns, and production deployment best practices.",
    keyTakeaways: [
      "Node.js Architecture: Understanding single-threaded event-driven architecture powered by Google V8 and libuv thread pool",
      "Event Loop Phases: Timers, pending callbacks, idle/prepare, poll, check (setImmediate), and close callbacks",
      "Process & Microtasks: Execution priority of process.nextTick() versus Promise microtasks and macrotasks",
      "Core Modules: Hands-on mastery of fs (file system streams), path resolution, events (EventEmitter), and http/https server creation",
      "Buffers & Streams: Efficient memory manipulation using Readable, Writable, Transform streams, and backpressure management",
      "Express.js Architecture: Middleware lifecycle, application vs router-level middleware, error-handling middleware, and REST route design",
      "Asynchronous Flow: Evolution from callback patterns to Promises, async/await, and error boundary handling",
      "REST API Engineering: Request validation, status codes, JWT authentication integration, and security headers with helmet",
      "Package Ecosystem: npm scripts, semantic versioning (semver), package-lock.json dependencies, and modular exports",
      "Production Readiness: Environment variable management with dotenv, clustering, process managers (PM2), and logging"
    ],
    prerequisites: [
      "Core JavaScript syntax (ES6+)",
      "Basic HTTP & client-server concepts"
    ],
    recommendedNext: [
      "res-react-js-comprehensive-guide",
      "res-react-js-handwritten-notes"
    ],
    topics: [
      "NodeJS",
      "JavaScript",
      "Express",
      "EventLoop",
      "RESTAPIs",
      "Backend",
      "FullStack"
    ],
    tags: [
      "Node.js",
      "JavaScript",
      "Backend",
      "Express",
      "Notes",
      "Handwritten",
      "REST",
      "FullStack"
    ],
    dateAdded: "2026-10-09",
    lastOpened: "2026-10-09"
  },
  {
    id: "res-react-js-comprehensive-guide",
    title: "React.js Comprehensive Guide",
    author: "Modern Frontend Engineering Group",
    pages: 71,
    fileName: "React_js_Comprehensive_Guide.pdf",
    category: "sec-handbooks",
    subCategory: "React & Node.js Full-Stack Notes",
    resourceType: "BOOK",
    difficulty: "INTERMEDIATE",
    priority: "MUST_LEARN",
    status: "NOT_STARTED",
    readingStatus: "NOT_STARTED",
    progress: 0,
    currentPage: 0,
    totalPages: 71,
    source: "uploaded_pdf",
    sourceUrl: "/books/React_js_Comprehensive_Guide.pdf",
    fileDataUrl: "/books/React_js_Comprehensive_Guide.pdf",
    whatIsThisBookFor: "Building high-performance, scalable single-page web applications using modern React component architecture, Hooks, Context, and React Router.",
    summary: "A thorough 71-page architectural guide to building scalable single-page web applications with modern React.js. Delves into Virtual DOM diffing reconciliation, component architecture (functional vs class), JSX compilation, props and state immutability, comprehensive Hooks deep dive (useState, useEffect, useContext, useReducer, useMemo, useCallback, useRef), custom hook design, Context API global state, React Router v6 navigation, error boundaries, and performance optimization.",
    keyTakeaways: [
      "React Fundamentals: Virtual DOM reconciliation, fiber architecture, unidirectional data flow, and JSX transpilation",
      "Component Hierarchy: Smart vs dumb components, props immutability, default props, and children composition patterns",
      "State & Lifecycle: Managing component state, batched state updates, and functional hook lifecycles versus legacy class lifecycles",
      "Essential Hooks: Deep dive into useState (state setting), useEffect (side-effects & cleanup), and useRef (persistent mutable references)",
      "Performance Hooks: Preventing redundant computations and re-renders using useMemo, useCallback, and React.memo",
      "Advanced Hooks: State machines with useReducer, imperative handles with useImperativeHandle, and creating reusable Custom Hooks",
      "Context API & Prop Drilling: Solving prop drilling with createContext, useContext, and modular Provider wrappers",
      "Routing & Navigation: React Router v6 setup, nested routes, dynamic URL parameters, programmatic navigation, and protected routes",
      "Forms & User Input: Controlled components vs uncontrolled components, synthetic event system, and form validation",
      "Optimization & Profiling: Code splitting with React.lazy and Suspense, key prop significance in lists, and React DevTools profiling"
    ],
    prerequisites: [
      "Modern JavaScript (ES6+ arrow functions, destructuring, spread, modules)",
      "HTML5 & CSS3 foundations"
    ],
    recommendedNext: [
      "res-react-js-handwritten-notes",
      "res-nodejs-handwritten-notes"
    ],
    topics: [
      "React",
      "JavaScript",
      "Frontend",
      "Hooks",
      "VirtualDOM",
      "StateManagement",
      "WebDev"
    ],
    tags: [
      "React.js",
      "Frontend",
      "Hooks",
      "JavaScript",
      "WebDev",
      "Guide",
      "UI"
    ],
    dateAdded: "2026-10-09",
    lastOpened: "2026-10-09"
  },
  {
    id: "res-react-js-handwritten-notes",
    title: "React.js Handwritten Notes & Visual Mental Models",
    author: "Frontend Engineering Collective",
    pages: 116,
    fileName: "React_js_Handwritten_Notes.pdf",
    category: "sec-handbooks",
    subCategory: "React & Node.js Full-Stack Notes",
    resourceType: "STUDY_NOTES",
    difficulty: "INTERMEDIATE",
    priority: "MUST_LEARN",
    status: "NOT_STARTED",
    readingStatus: "NOT_STARTED",
    progress: 0,
    currentPage: 0,
    totalPages: 116,
    source: "uploaded_pdf",
    sourceUrl: "/books/React_js_Handwritten_Notes.pdf",
    fileDataUrl: "/books/React_js_Handwritten_Notes.pdf",
    whatIsThisBookFor: "Mastering React concepts and acing frontend interviews through annotated handwritten diagrams, visual mental models, and Redux data flows.",
    summary: "A massive 116-page illustrated handwritten notebook dedicated to visual mental models of React.js. Features clear diagrams and step-by-step illustrations covering React internals, component lifecycle trees, hooks mental models, Redux Toolkit state flow, Context API, asynchronous side effects, custom hooks recipes, DOM event handling, performance tuning, and technical interview scenarios.",
    keyTakeaways: [
      "Visual Mental Models: Illustrated breakdown of how React builds, diffs, and commits Virtual DOM trees to real browser DOM",
      "Component Communication: Upward, downward, and sibling data passing patterns through callbacks and state hoisting",
      "Hook Dependency Mental Model: Visualizing useEffect dependency arrays, stale closure traps, and cleanup function timing",
      "Custom Hook Engineering: Extracting reusable business logic into custom hooks (useFetch, useDebounce, useLocalStorage, useWindowSize)",
      "Global State Architecture: Redux Toolkit (RTK) architecture — stores, slices, reducers, dispatch, selectors, and asyncThunk",
      "Context API vs Redux: Decision trees on when to use Context versus external state managers like Redux or Zustand",
      "Rendering Optimization: Visual explanations of why components re-render and how to isolate renders using memoization and component splitting",
      "Form Handling & Validation: Illustrated patterns for real-time form validation, submission states, and error handling",
      "API Integration Patterns: Handling loading, error, and data states with Axios/Fetch and clean effect cancellation via AbortController",
      "Interview Flashcards: High-frequency React interview questions, tricky edge cases, and code walkthroughs with annotated diagrams"
    ],
    prerequisites: [
      "JavaScript ES6+ fundamentals",
      "Basic React component concepts"
    ],
    recommendedNext: [
      "res-nodejs-handwritten-notes",
      "res-interview-theory-question-bank-350-qa"
    ],
    topics: [
      "React",
      "HandwrittenNotes",
      "Redux",
      "Hooks",
      "Frontend",
      "MentalModels",
      "Interviews"
    ],
    tags: [
      "React.js",
      "Handwritten",
      "Notes",
      "Visual",
      "Frontend",
      "Redux",
      "Hooks",
      "Interviews"
    ],
    dateAdded: "2026-10-09",
    lastOpened: "2026-10-09"
  }
];

if (content.includes("res-nodejs-handwritten-notes")) {
  console.log("Books already present in pythonMlResources.ts");
  process.exit(0);
}

const lastBracketIndex = content.lastIndexOf('];');
if (lastBracketIndex === -1) {
  console.error("Could not find closing bracket in pythonMlResources.ts");
  process.exit(1);
}

const formattedEntries = newBooks.map(b => '  ' + JSON.stringify(b, null, 2).replace(/\n/g, '\n  ')).join(',\n');
const updatedContent = content.slice(0, lastBracketIndex) + ',\n' + formattedEntries + '\n' + content.slice(lastBracketIndex);

fs.writeFileSync(filePath, updatedContent, 'utf8');
console.log("Successfully appended Node.js and React books to pythonMlResources.ts!");
