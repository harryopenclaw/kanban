import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "kanban-board";

const defaultCards = {
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
};

const defaultColumns = [
  {
    id: "col-1",
    title: "Companies",
    cardIds: ["card-4", "card-5", "card-6", "card-7", "card-12"],
  },
  {
    id: "col-2",
    title: "In Progress",
    cardIds: ["card-1", "card-2", "card-8"],
  },
  {
    id: "col-3",
    title: "Review",
    cardIds: ["card-9", "card-10", "card-3"],
  },
  {
    id: "col-4",
    title: "Done",
    cardIds: ["card-11"],
  },
];

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.columns && parsed.cards) return parsed;
    }
  } catch {}
  return { columns: defaultColumns, cards: defaultCards };
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let nextId = Date.now();
function genId(prefix) {
  return `${prefix}-${nextId++}`;
}

export function useKanban() {
  const [columns, setColumns] = useState(() => loadState().columns);
  const [cards, setCards] = useState(() => loadState().cards);

  useEffect(() => {
    saveState({ columns, cards });
  }, [columns, cards]);

  const addCard = useCallback((columnId, title) => {
    const id = genId("card");
    setCards((prev) => ({ ...prev, [id]: { id, title, color: null, dueDate: null } }));
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? { ...col, cardIds: [...col.cardIds, id] }
          : col
      )
    );
  }, []);

  const deleteCard = useCallback((cardId) => {
    setCards((prev) => {
      const next = { ...prev };
      delete next[cardId];
      return next;
    });
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        cardIds: col.cardIds.filter((id) => id !== cardId),
      }))
    );
  }, []);

  const updateCardTitle = useCallback((cardId, title) => {
    setCards((prev) => ({
      ...prev,
      [cardId]: { ...prev[cardId], title },
    }));
  }, []);

  const addColumn = useCallback((title) => {
    const id = genId("col");
    setColumns((prev) => [...prev, { id, title, cardIds: [] }]);
  }, []);

  const deleteColumn = useCallback((columnId) => {
    setColumns((prev) => prev.filter((col) => col.id !== columnId));
  }, []);

  const updateColumnTitle = useCallback((columnId, title) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === columnId ? { ...col, title } : col))
    );
  }, []);

  const updateCardColor = useCallback((cardId, color) => {
    setCards((prev) => ({
      ...prev,
      [cardId]: { ...prev[cardId], color },
    }));
  }, []);

  const updateCardDueDate = useCallback((cardId, dueDate) => {
    setCards((prev) => ({
      ...prev,
      [cardId]: { ...prev[cardId], dueDate },
    }));
  }, []);

  const moveCard = useCallback((activeId, overId, activeCol, overCol, overIndex) => {
    setColumns((prev) => {
      const next = prev.map((col) => ({ ...col, cardIds: [...col.cardIds] }));
      const srcCol = next.find((c) => c.id === activeCol);
      const dstCol = next.find((c) => c.id === overCol);
      if (!srcCol || !dstCol) return prev;

      const srcIdx = srcCol.cardIds.indexOf(activeId);
      if (srcIdx === -1) return prev;

      srcCol.cardIds.splice(srcIdx, 1);

      if (overId && overCol === activeCol && activeCol === overCol) {
        // Reorder within same column
        const insertIdx = overIndex !== undefined ? overIndex : dstCol.cardIds.length;
        dstCol.cardIds.splice(insertIdx, 0, activeId);
      } else {
        // Move between columns
        const insertIdx = overIndex !== undefined ? overIndex : dstCol.cardIds.length;
        dstCol.cardIds.splice(insertIdx, 0, activeId);
      }

      return next;
    });
  }, []);

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
