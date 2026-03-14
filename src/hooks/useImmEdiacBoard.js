import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "immediac-kanban";

const defaultCards = {
  "card-1":  { id: "card-1",  title: "ERP + Scheduler" },
  "card-2":  { id: "card-2",  title: "AI Brand" },
  "card-3":  { id: "card-3",  title: "Content Strategy \u2014 The Culture" },
  "card-4":  { id: "card-4",  title: "SRED Application" },
  "card-5":  { id: "card-5",  title: "MBI" },
  "card-6":  { id: "card-6",  title: "BCP" },
  "card-7":  { id: "card-7",  title: "Enterprise Architecture (EA)" },
  "card-8":  { id: "card-8",  title: "Dist \u2014 GTM Channel" },
  "card-9":  { id: "card-9",  title: "Top Client Outreach" },
  "card-10": { id: "card-10", title: "immediac \u2014 Sales Funnel" },
  "card-11": { id: "card-11", title: "iGnight Game Day (12/4)" },
  "card-12": { id: "card-12", title: "TFP$ \u2014 S/E & O/W/P" },
};

const defaultColumns = [
  { id: "col-1", title: "Companies", cardIds: ["card-4", "card-5", "card-6", "card-7", "card-12"] },
  { id: "col-2", title: "In Progress", cardIds: ["card-1", "card-2", "card-8"] },
  { id: "col-3", title: "Review", cardIds: ["card-9", "card-10", "card-3"] },
  { id: "col-4", title: "Done", cardIds: ["card-11"] },
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
