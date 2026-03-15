import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "immediac-kanban";

const defaultCards = {
  // --- Strategic initiatives ---
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

  // --- Harold's Tools: Coding Agent ---
  "tool-1":  { id: "tool-1",  title: "Claude Code", subtitle: "AI coding agent · v2.1.76" },

  // --- Harold's Tools: OpenClaw Built-in Skills ---
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

  // --- Harold's Tools: Custom Skills ---
  "tool-21": { id: "tool-21", title: "social-media-marketing", subtitle: "Custom · Social media strategy advisor" },
  "tool-22": { id: "tool-22", title: "content-creator", subtitle: "Custom · Content creation workflows" },
};

const defaultColumns = [
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

function buildDefault() {
  return { columns: defaultColumns, cards: defaultCards };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.columns && parsed.cards) return parsed;
    }
  } catch {}
  return buildDefault();
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let nextId = Date.now();
function genId(prefix) {
  return `${prefix}-${nextId++}`;
}

export function useImmEdiacBoard() {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const { columns, cards } = state;

  const update = useCallback((updater) => {
    setState((prev) => updater(prev));
  }, []);

  const addCard = useCallback((columnId, title) => {
    const id = genId("card");
    update((d) => ({
      columns: d.columns.map((col) =>
        col.id === columnId ? { ...col, cardIds: [...col.cardIds, id] } : col
      ),
      cards: { ...d.cards, [id]: { id, title, color: null, dueDate: null } },
    }));
  }, [update]);

  const deleteCard = useCallback((cardId) => {
    update((d) => {
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
  }, [update]);

  const updateCardTitle = useCallback((cardId, title) => {
    update((d) => ({
      ...d,
      cards: { ...d.cards, [cardId]: { ...d.cards[cardId], title } },
    }));
  }, [update]);

  const updateCardColor = useCallback((cardId, color) => {
    update((d) => ({
      ...d,
      cards: { ...d.cards, [cardId]: { ...d.cards[cardId], color } },
    }));
  }, [update]);

  const updateCardDueDate = useCallback((cardId, dueDate) => {
    update((d) => ({
      ...d,
      cards: { ...d.cards, [cardId]: { ...d.cards[cardId], dueDate } },
    }));
  }, [update]);

  const addColumn = useCallback((title) => {
    const id = genId("col");
    update((d) => ({
      ...d,
      columns: [...d.columns, { id, title, cardIds: [] }],
    }));
  }, [update]);

  const deleteColumn = useCallback((columnId) => {
    update((d) => ({
      ...d,
      columns: d.columns.filter((col) => col.id !== columnId),
    }));
  }, [update]);

  const updateColumnTitle = useCallback((columnId, title) => {
    update((d) => ({
      ...d,
      columns: d.columns.map((col) => (col.id === columnId ? { ...col, title } : col)),
    }));
  }, [update]);

  const moveCard = useCallback((activeId, overId, activeCol, overCol, overIndex) => {
    update((d) => {
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
  }, [update]);

  return {
    columns,
    cards,
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
