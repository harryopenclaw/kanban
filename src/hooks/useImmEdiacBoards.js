import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "immediac-boards";

const KNOWN_SLUGS = { "board-1": "immediac", "board-2": "worksheet" };

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function ensureSlugs(boards) {
  const usedSlugs = new Set();
  return boards.map((b) => {
    if (b.slug) { usedSlugs.add(b.slug); return b; }
    let slug = KNOWN_SLUGS[b.id] || generateSlug(b.name);
    while (usedSlugs.has(slug)) slug += "-1";
    usedSlugs.add(slug);
    return { ...b, slug };
  });
}

function boardIdFromHash(boards) {
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return null;
  const match = boards.find((b) => b.slug === hash);
  return match ? match.id : null;
}

// ── Board 1: immediac CEO Massive Action Plan ──
const defaultBoard1Cards = {
  "card-1":  { id: "card-1",  title: "ERP + Scheduler" },
  "card-2":  { id: "card-2",  title: "AI Brand" },
  "card-3":  { id: "card-3",  title: "Content Strategy — The Culture" },
  "card-4":  { id: "card-4",  title: "SRED Application" },
  "card-5":  { id: "card-5",  title: "MBI" },
  "card-6":  { id: "card-6",  title: "BCP" },
  "card-7":  { id: "card-7",  title: "Enterprise Architecture (EA)" },
  "card-8":  { id: "card-8",  title: "Dist — GTM Channel" },
  "card-9":  { id: "card-9",  title: "Top Client Outreach" },
  "card-10": { id: "card-10", title: "immediac — Sales Funnel" },
  "card-11": { id: "card-11", title: "iGnight Game Day (12/4)" },
  "card-12": { id: "card-12", title: "TFP$ — S/E & O/W/P" },
  "tool-1":  { id: "tool-1",  title: "Claude Code", subtitle: "AI coding agent · v2.1.76" },
  "tool-2":  { id: "tool-2",  title: "apple-notes", subtitle: "Manage Apple Notes via memo CLI" },
  "tool-3":  { id: "tool-3",  title: "apple-reminders", subtitle: "Manage Apple Reminders via remindctl" },
  "tool-4":  { id: "tool-4",  title: "blogwatcher", subtitle: "Monitor blogs and RSS/Atom feeds" },
  "tool-5":  { id: "tool-5",  title: "clawhub", subtitle: "Search & install skills from clawhub.com" },
  "tool-6":  { id: "tool-6",  title: "coding-agent", subtitle: "Delegate coding tasks to Claude Code / Codex" },
  "tool-7":  { id: "tool-7",  title: "gemini", subtitle: "Gemini CLI for Q&A, summaries, generation" },
  "tool-8":  { id: "tool-8",  title: "gh-issues", subtitle: "Fetch GitHub issues, spawn agents, open PRs" },
  "tool-9":  { id: "tool-9",  title: "github", subtitle: "GitHub operations via gh CLI" },
  "tool-10": { id: "tool-10", title: "gog", subtitle: "Google Workspace — Gmail, Calendar, Drive, Docs" },
  "tool-11": { id: "tool-11", title: "healthcheck", subtitle: "Host security hardening & risk audits" },
  "tool-12": { id: "tool-12", title: "himalaya", subtitle: "CLI email via IMAP/SMTP" },
  "tool-13": { id: "tool-13", title: "imsg", subtitle: "iMessage/SMS CLI" },
  "tool-14": { id: "tool-14", title: "model-usage", subtitle: "Per-model cost/usage from CodexBar" },
  "tool-15": { id: "tool-15", title: "node-connect", subtitle: "Diagnose OpenClaw node pairing failures" },
  "tool-16": { id: "tool-16", title: "openai-whisper", subtitle: "Local speech-to-text (no API key)" },
  "tool-17": { id: "tool-17", title: "peekaboo", subtitle: "Capture & automate macOS UI" },
  "tool-18": { id: "tool-18", title: "skill-creator", subtitle: "Create, edit, audit AgentSkills" },
  "tool-19": { id: "tool-19", title: "video-frames", subtitle: "Extract frames/clips from videos via ffmpeg" },
  "tool-20": { id: "tool-20", title: "weather", subtitle: "Current weather & forecasts via wttr.in" },
  "tool-21": { id: "tool-21", title: "social-media-marketing", subtitle: "Custom · Social media strategy advisor" },
  "tool-22": { id: "tool-22", title: "content-creator", subtitle: "Custom · Content creation workflows" },
};

const defaultBoard1Columns = [
  { id: "col-1", title: "Companies",   cardIds: ["card-4", "card-5", "card-6", "card-7", "card-12"] },
  { id: "col-2", title: "In Progress", cardIds: ["card-1", "card-2", "card-8"] },
  { id: "col-3", title: "Review",      cardIds: ["card-9", "card-10", "card-3"] },
  { id: "col-4", title: "Done",        cardIds: ["card-11"] },
  {
    id: "col-5", title: "Harold's Tools",
    cardIds: [
      "tool-1",
      "tool-2","tool-3","tool-4","tool-5","tool-6","tool-7","tool-8","tool-9","tool-10",
      "tool-11","tool-12","tool-13","tool-14","tool-15","tool-16","tool-17","tool-18","tool-19","tool-20",
      "tool-21","tool-22",
    ]
  },
];

// ── Board 2: Harry & John Worksheet ──
const defaultBoard2Cards = {
  // Claude Skills
  "ws-1":  { id: "ws-1",  title: "apple-notes", subtitle: "Manage Apple Notes via memo CLI" },
  "ws-2":  { id: "ws-2",  title: "apple-reminders", subtitle: "Manage Apple Reminders via remindctl" },
  "ws-3":  { id: "ws-3",  title: "blogwatcher", subtitle: "Monitor blogs and RSS/Atom feeds" },
  "ws-4":  { id: "ws-4",  title: "clawhub", subtitle: "Search & install skills from clawhub.com" },
  "ws-5":  { id: "ws-5",  title: "coding-agent", subtitle: "Delegate coding tasks to Claude Code" },
  "ws-6":  { id: "ws-6",  title: "gemini", subtitle: "Gemini CLI for Q&A and summaries" },
  "ws-7":  { id: "ws-7",  title: "gh-issues", subtitle: "Fetch GitHub issues, spawn agents, open PRs" },
  "ws-8":  { id: "ws-8",  title: "github", subtitle: "GitHub operations via gh CLI" },
  "ws-9":  { id: "ws-9",  title: "gog", subtitle: "Google Workspace — Gmail, Calendar, Drive" },
  "ws-10": { id: "ws-10", title: "healthcheck", subtitle: "Host security hardening & risk audits" },
  "ws-11": { id: "ws-11", title: "himalaya", subtitle: "CLI email via IMAP/SMTP" },
  "ws-12": { id: "ws-12", title: "imsg", subtitle: "iMessage/SMS CLI" },
  "ws-13": { id: "ws-13", title: "model-usage", subtitle: "Per-model cost/usage reporting" },
  "ws-14": { id: "ws-14", title: "node-connect", subtitle: "Diagnose OpenClaw node pairing" },
  "ws-15": { id: "ws-15", title: "openai-whisper", subtitle: "Local speech-to-text" },
  "ws-16": { id: "ws-16", title: "peekaboo", subtitle: "Capture & automate macOS UI" },
  "ws-17": { id: "ws-17", title: "skill-creator", subtitle: "Create and audit AgentSkills" },
  "ws-18": { id: "ws-18", title: "video-frames", subtitle: "Extract frames/clips from videos" },
  "ws-19": { id: "ws-19", title: "weather", subtitle: "Weather forecasts via wttr.in" },
  "ws-20": { id: "ws-20", title: "Claude Code", subtitle: "AI coding agent · v2.1.76" },
  // Harold's Custom Skills
  "ws-21": { id: "ws-21", title: "social-media-marketing", subtitle: "Social media strategy advisor" },
  "ws-22": { id: "ws-22", title: "content-creator", subtitle: "Content creation workflows" },
  // Active Projects
  "ws-23": { id: "ws-23", title: "Kanban App", subtitle: "harryopenclaw.github.io/kanban — React + dnd-kit" },
  "ws-24": { id: "ws-24", title: "ProperBarber GTM Board", subtitle: "Client engagement tracking" },
  // Integrations & APIs
  "ws-25": { id: "ws-25", title: "GitHub", subtitle: "harryopenclaw · gh CLI configured" },
  "ws-26": { id: "ws-26", title: "Anthropic / Claude", subtitle: "Primary AI model" },
  "ws-27": { id: "ws-27", title: "iMessage", subtitle: "Channel configured + attachments enabled" },
  "ws-28": { id: "ws-28", title: "Stripe", subtitle: "ProperBarber payments" },
  "ws-29": { id: "ws-29", title: ".NET / SQL", subtitle: "Future backend for Kanban" },
  "ws-30": { id: "ws-30", title: "Azure Static Web Apps", subtitle: "Future hosting upgrade" },
  // Project Backlog
  "ws-backlog-1": { id: "ws-backlog-1", title: "Rock The Rankings", subtitle: "SEO / content strategy initiative" },
  "ws-backlog-2": { id: "ws-backlog-2", title: "Stop The Scroll", subtitle: "Social media hook / content initiative" },

  // Decisions & Notes
  "ws-31": { id: "ws-31", title: "One repo, two pages", subtitle: "kanban repo: /immediac/ and /proper/ as MPA pages" },
  "ws-32": { id: "ws-32", title: "dnd-kit over SortableJS", subtitle: "Chosen for React compatibility and shadcn future migration" },
  "ws-33": { id: "ws-33", title: "localStorage first", subtitle: "Persist to localStorage, migrate to .NET/SQL later" },
  "ws-34": { id: "ws-34", title: "GitHub Pages", subtitle: "Static hosting via harryopenclaw account, auto-deploy on push" },
};

const defaultBoard2Columns = [
  {
    id: "ws-col-1", title: "Claude Skills",
    cardIds: [
      "ws-1","ws-2","ws-3","ws-4","ws-5","ws-6","ws-7","ws-8","ws-9","ws-10",
      "ws-11","ws-12","ws-13","ws-14","ws-15","ws-16","ws-17","ws-18","ws-19","ws-20",
    ],
  },
  { id: "ws-col-2", title: "Harold's Custom Skills", cardIds: ["ws-21","ws-22"] },
  { id: "ws-col-3", title: "Active Projects", cardIds: ["ws-23","ws-24"] },
  { id: "ws-col-4", title: "Project Backlog", cardIds: ["ws-backlog-1", "ws-backlog-2"] },
  { id: "ws-col-5", title: "Integrations & APIs", cardIds: ["ws-25","ws-26","ws-27","ws-28","ws-29","ws-30"] },
  { id: "ws-col-6", title: "Decisions & Notes", cardIds: ["ws-31","ws-32","ws-33","ws-34"] },
];

function buildDefaultState() {
  const boards = [
    { id: "board-1", name: "immediac CEO Massive Action Plan", slug: "immediac" },
    { id: "board-2", name: "Harry & John Worksheet", slug: "worksheet" },
  ];
  const activeBoardId = boardIdFromHash(boards) || "board-1";
  return {
    boards,
    activeBoardId,
    data: {
      "board-1": { columns: defaultBoard1Columns, cards: defaultBoard1Cards },
      "board-2": { columns: defaultBoard2Columns, cards: defaultBoard2Cards },
    },
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.boards && parsed.data) {
        parsed.boards = ensureSlugs(parsed.boards);
        const hashId = boardIdFromHash(parsed.boards);
        if (hashId) parsed.activeBoardId = hashId;
        return parsed;
      }
    }
  } catch {}

  return buildDefaultState();
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let nextId = Date.now();
function genId(prefix) {
  return `${prefix}-${nextId++}`;
}

export function useImmEdiacBoards() {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  // Set initial hash if empty
  useEffect(() => {
    if (!window.location.hash) {
      const board = state.boards.find((b) => b.id === state.activeBoardId);
      if (board) window.location.hash = board.slug;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for browser back/forward
  useEffect(() => {
    const onHashChange = () => {
      setState((prev) => {
        const id = boardIdFromHash(prev.boards);
        if (id && id !== prev.activeBoardId) return { ...prev, activeBoardId: id };
        return prev;
      });
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const boards = state.boards;
  const activeBoardId = state.activeBoardId;
  const activeData = state.data[activeBoardId] || { columns: [], cards: {} };
  const columns = activeData.columns;
  const cards = activeData.cards;

  const updateActiveData = useCallback((updater) => {
    setState((prev) => {
      const currentData = prev.data[prev.activeBoardId];
      const newData = updater(currentData);
      return {
        ...prev,
        data: { ...prev.data, [prev.activeBoardId]: newData },
      };
    });
  }, []);

  // Board operations
  const switchBoard = useCallback((id) => {
    setState((prev) => {
      const board = prev.boards.find((b) => b.id === id);
      if (board) window.location.hash = board.slug;
      return { ...prev, activeBoardId: id };
    });
  }, []);

  const createBoard = useCallback((name) => {
    const id = genId("board");
    const slug = generateSlug(name);
    window.location.hash = slug;
    setState((prev) => ({
      ...prev,
      boards: [...prev.boards, { id, name, slug }],
      activeBoardId: id,
      data: {
        ...prev.data,
        [id]: {
          columns: [
            { id: genId("col"), title: "To Do", cardIds: [] },
            { id: genId("col"), title: "In Progress", cardIds: [] },
            { id: genId("col"), title: "Review", cardIds: [] },
            { id: genId("col"), title: "Done", cardIds: [] },
          ],
          cards: {},
        },
      },
    }));
  }, []);

  const renameBoard = useCallback((id, name) => {
    const slug = KNOWN_SLUGS[id] || generateSlug(name);
    setState((prev) => {
      const newBoards = prev.boards.map((b) => (b.id === id ? { ...b, name, slug } : b));
      if (prev.activeBoardId === id) window.location.hash = slug;
      return { ...prev, boards: newBoards };
    });
  }, []);

  const deleteBoard = useCallback((id) => {
    setState((prev) => {
      if (prev.boards.length <= 1) return prev;
      const newBoards = prev.boards.filter((b) => b.id !== id);
      const newData = { ...prev.data };
      delete newData[id];
      const newActiveId = prev.activeBoardId === id ? newBoards[0].id : prev.activeBoardId;
      const activeBoard = newBoards.find((b) => b.id === newActiveId);
      if (activeBoard) window.location.hash = activeBoard.slug;
      return { ...prev, boards: newBoards, activeBoardId: newActiveId, data: newData };
    });
  }, []);

  // Card operations
  const addCard = useCallback((columnId, title) => {
    const id = genId("card");
    updateActiveData((d) => ({
      columns: d.columns.map((col) =>
        col.id === columnId ? { ...col, cardIds: [...col.cardIds, id] } : col
      ),
      cards: { ...d.cards, [id]: { id, title, color: null, dueDate: null } },
    }));
  }, [updateActiveData]);

  const deleteCard = useCallback((cardId) => {
    updateActiveData((d) => {
      const newCards = { ...d.cards };
      delete newCards[cardId];
      return {
        columns: d.columns.map((col) => ({
          ...col,
          cardIds: col.cardIds.filter((id) => id !== cardId),
        })),
        cards: newCards,
      };
    });
  }, [updateActiveData]);

  const updateCardTitle = useCallback((cardId, title) => {
    updateActiveData((d) => ({
      ...d,
      cards: { ...d.cards, [cardId]: { ...d.cards[cardId], title } },
    }));
  }, [updateActiveData]);

  const updateCardColor = useCallback((cardId, color) => {
    updateActiveData((d) => ({
      ...d,
      cards: { ...d.cards, [cardId]: { ...d.cards[cardId], color } },
    }));
  }, [updateActiveData]);

  const updateCardDueDate = useCallback((cardId, dueDate) => {
    updateActiveData((d) => ({
      ...d,
      cards: { ...d.cards, [cardId]: { ...d.cards[cardId], dueDate } },
    }));
  }, [updateActiveData]);

  const addColumn = useCallback((title) => {
    const id = genId("col");
    updateActiveData((d) => ({
      ...d,
      columns: [...d.columns, { id, title, cardIds: [] }],
    }));
  }, [updateActiveData]);

  const deleteColumn = useCallback((columnId) => {
    updateActiveData((d) => ({
      ...d,
      columns: d.columns.filter((col) => col.id !== columnId),
    }));
  }, [updateActiveData]);

  const updateColumnTitle = useCallback((columnId, title) => {
    updateActiveData((d) => ({
      ...d,
      columns: d.columns.map((col) => (col.id === columnId ? { ...col, title } : col)),
    }));
  }, [updateActiveData]);

  const moveCard = useCallback((activeId, overId, activeCol, overCol, overIndex) => {
    updateActiveData((d) => {
      const next = d.columns.map((col) => ({ ...col, cardIds: [...col.cardIds] }));
      const srcCol = next.find((c) => c.id === activeCol);
      const dstCol = next.find((c) => c.id === overCol);
      if (!srcCol || !dstCol) return d;

      const srcIdx = srcCol.cardIds.indexOf(activeId);
      if (srcIdx === -1) return d;

      srcCol.cardIds.splice(srcIdx, 1);
      const insertIdx = overIndex !== undefined ? overIndex : dstCol.cardIds.length;
      dstCol.cardIds.splice(insertIdx, 0, activeId);

      return { ...d, columns: next };
    });
  }, [updateActiveData]);

  return {
    boards,
    activeBoardId,
    columns,
    cards,
    switchBoard,
    createBoard,
    renameBoard,
    deleteBoard,
    addCard,
    deleteCard,
    updateCardTitle,
    updateCardColor,
    updateCardDueDate,
    addColumn,
    deleteColumn,
    updateColumnTitle,
    moveCard,
  };
}
