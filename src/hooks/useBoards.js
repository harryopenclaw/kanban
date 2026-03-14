import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "kanban-boards";
const OLD_STORAGE_KEY = "kanban-board";

const KNOWN_SLUGS = { "board-1": "immediac", "board-2": "properbarber" };

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
};

const defaultBoard1Columns = [
  { id: "col-1", title: "Companies", cardIds: ["card-4", "card-5", "card-6", "card-7", "card-12"] },
  { id: "col-2", title: "In Progress", cardIds: ["card-1", "card-2", "card-8"] },
  { id: "col-3", title: "Review", cardIds: ["card-9", "card-10", "card-3"] },
  { id: "col-4", title: "Done", cardIds: ["card-11"] },
];

const defaultBoard2Cards = {
  "pb-200": {
    "id": "pb-200",
    "title": "Kabi Thana",
    "subtitle": "Appt: Mar 6 · Booked same day"
  },
  "pb-201": {
    "id": "pb-201",
    "title": "Mark B",
    "subtitle": "Appt: Jan 31 · Booked same day"
  },
  "pb-202": {
    "id": "pb-202",
    "title": "Shawn Hirtle",
    "subtitle": "Appt: Feb 17 · Booked same day"
  },
  "pb-203": {
    "id": "pb-203",
    "title": "Mike Roberts",
    "subtitle": "Appt: Jan 20 · Booked same day"
  },
  "pb-204": {
    "id": "pb-204",
    "title": "Rick Balys",
    "subtitle": "Appt: Jan 29 · Booked same day"
  },
  "pb-205": {
    "id": "pb-205",
    "title": "Jason Doucet",
    "subtitle": "Appt: Jan 24 · Booked same day"
  },
  "pb-206": {
    "id": "pb-206",
    "title": "Evan",
    "subtitle": "Appt: Feb 19 · Booked same day"
  },
  "pb-207": {
    "id": "pb-207",
    "title": "Alper",
    "subtitle": "Appt: Jan 20 · Booked same day"
  },
  "pb-208": {
    "id": "pb-208",
    "title": "Dr. Neil  Smith",
    "subtitle": "Appt: Feb 13 · Booked same day"
  },
  "pb-209": {
    "id": "pb-209",
    "title": "Dan Weir",
    "subtitle": "Appt: Feb 19 · Booked same day"
  },
  "pb-210": {
    "id": "pb-210",
    "title": "Michael D. Mailman",
    "subtitle": "Appt: Jan 16 · Booked same day"
  },
  "pb-211": {
    "id": "pb-211",
    "title": "Mark Hewitt",
    "subtitle": "Appt: Feb 21 · Booked 1d after signup"
  },
  "pb-212": {
    "id": "pb-212",
    "title": "Andrew Foote",
    "subtitle": "Appt: Mar 7 · Booked 1d after signup"
  },
  "pb-213": {
    "id": "pb-213",
    "title": "Mark Gascoigne",
    "subtitle": "Appt: Jan 16 · Booked 1d after signup"
  },
  "pb-214": {
    "id": "pb-214",
    "title": "John Leahy",
    "subtitle": "Appt: Jan 15 · Booked 1d after signup"
  },
  "pb-215": {
    "id": "pb-215",
    "title": "Evan",
    "subtitle": "Appt: Jan 31 · Booked 1d after signup"
  },
  "pb-216": {
    "id": "pb-216",
    "title": "Mike Evans",
    "subtitle": "Appt: Mar 5 · Booked 1d after signup"
  },
  "pb-217": {
    "id": "pb-217",
    "title": "Filippe Garcia Heringer",
    "subtitle": "Appt: Mar 13 · Booked 1d after signup"
  },
  "pb-218": {
    "id": "pb-218",
    "title": "Mike Coldwell",
    "subtitle": "Appt: Mar 20 · Booked 10d after signup"
  },
  "pb-219": {
    "id": "pb-219",
    "title": "Ashoke Mohanraj",
    "subtitle": "Appt: Mar 24 · Booked 12d after signup"
  },
  "pb-220": {
    "id": "pb-220",
    "title": "Aaron Trask",
    "subtitle": "Appt: Mar 28 · Booked 19d after signup"
  },
  "pb-221": {
    "id": "pb-221",
    "title": "Alwaleed  Alshahir",
    "subtitle": "Appt: Feb 7 · Booked 2d after signup"
  },
  "pb-222": {
    "id": "pb-222",
    "title": "Caleb",
    "subtitle": "Appt: Jan 24 · Booked 2d after signup"
  },
  "pb-223": {
    "id": "pb-223",
    "title": "Jed",
    "subtitle": "Appt: Feb 12 · Booked 2d after signup"
  },
  "pb-224": {
    "id": "pb-224",
    "title": "Derek Gentile",
    "subtitle": "Appt: Mar 3 · Booked 20d after signup"
  },
  "pb-225": {
    "id": "pb-225",
    "title": "Tim Gillis",
    "subtitle": "Appt: Mar 5 · Booked 20d after signup"
  },
  "pb-226": {
    "id": "pb-226",
    "title": "Saadat",
    "subtitle": "Appt: Feb 20 · Booked 22d after signup"
  },
  "pb-227": {
    "id": "pb-227",
    "title": "Dr. Greg Patey",
    "subtitle": "Appt: Feb 19 · Booked 24d after signup"
  },
  "pb-228": {
    "id": "pb-228",
    "title": "Paul Banks",
    "subtitle": "Appt: Mar 17 · Booked 24d after signup"
  },
  "pb-229": {
    "id": "pb-229",
    "title": "Paul Ryan",
    "subtitle": "Appt: Apr 2 · Booked 24d after signup"
  },
  "pb-230": {
    "id": "pb-230",
    "title": "Tommy",
    "subtitle": "Appt: Mar 6 · Booked 28d after signup"
  },
  "pb-231": {
    "id": "pb-231",
    "title": "Peter Hickey",
    "subtitle": "Appt: Feb 17 · Booked 3d after signup"
  },
  "pb-232": {
    "id": "pb-232",
    "title": "Nathan Kroll",
    "subtitle": "Appt: Jan 23 · Booked 3d after signup"
  },
  "pb-233": {
    "id": "pb-233",
    "title": "Derek  Martin",
    "subtitle": "Appt: Mar 3 · Booked 3d after signup"
  },
  "pb-234": {
    "id": "pb-234",
    "title": "Patrick Kervin",
    "subtitle": "Appt: Jan 23 · Booked 3d after signup"
  },
  "pb-235": {
    "id": "pb-235",
    "title": "Hamed Hanafi",
    "subtitle": "Appt: Mar 10 · Booked 4d after signup"
  },
  "pb-236": {
    "id": "pb-236",
    "title": "Lane Braidwood",
    "subtitle": "Appt: Mar 10 · Booked 4d after signup"
  },
  "pb-237": {
    "id": "pb-237",
    "title": "David Regan",
    "subtitle": "Appt: Mar 13 · Booked 4d after signup"
  },
  "pb-238": {
    "id": "pb-238",
    "title": "Brian Brewer",
    "subtitle": "Appt: Jan 24 · Booked 5d after signup"
  },
  "pb-239": {
    "id": "pb-239",
    "title": "Bruce Lusby",
    "subtitle": "Appt: Feb 11 · Booked 5d after signup"
  },
  "pb-240": {
    "id": "pb-240",
    "title": "Peter Wong",
    "subtitle": "Appt: Feb 12 · Booked 6d after signup"
  },
  "pb-241": {
    "id": "pb-241",
    "title": "Shahin",
    "subtitle": "Appt: Feb 19 · Booked 7d after signup"
  },
  "pb-242": {
    "id": "pb-242",
    "title": "Jacob LeBlanc",
    "subtitle": "Appt: Jan 28 · Booked 7d after signup"
  },
  "pb-243": {
    "id": "pb-243",
    "title": "Gregory Dunn",
    "subtitle": "Appt: Jan 29 · Booked 8d after signup"
  },
  "pb-244": {
    "id": "pb-244",
    "title": "James Farquhar",
    "subtitle": "Appt: Jan 30 · Booked 8d after signup"
  },
  "pb-245": {
    "id": "pb-245",
    "title": "Colin Dillon",
    "subtitle": "Appt: Feb 3 · Booked 8d after signup"
  },
  "pb-246": {
    "id": "pb-246",
    "title": "Neil Smith",
    "subtitle": "No appointment yet"
  },
  "pb-247": {
    "id": "pb-247",
    "title": "Michael Mailman",
    "subtitle": "No appointment yet"
  },
  "pb-248": {
    "id": "pb-248",
    "title": "Noah Dow",
    "subtitle": "No appointment yet"
  },
  "pb-249": {
    "id": "pb-249",
    "title": "Manny",
    "subtitle": "No appointment yet"
  },
  "pb-250": {
    "id": "pb-250",
    "title": "Adam",
    "subtitle": "No appointment yet"
  },
  "pb-251": {
    "id": "pb-251",
    "title": "sid",
    "subtitle": "No appointment yet"
  },
  "pb-252": {
    "id": "pb-252",
    "title": "Jennifer",
    "subtitle": "No appointment yet"
  },
  "pb-253": {
    "id": "pb-253",
    "title": "Brittany R Hall",
    "subtitle": "No appointment yet"
  },
  "pb-254": {
    "id": "pb-254",
    "title": "James",
    "subtitle": "No appointment yet"
  },
  "pb-255": {
    "id": "pb-255",
    "title": "Nadeem Jan",
    "subtitle": "No appointment yet"
  },
  "pb-256": {
    "id": "pb-256",
    "title": "Derek Gentile",
    "subtitle": "No appointment yet"
  },
  "pb-257": {
    "id": "pb-257",
    "title": "Karan",
    "subtitle": "No appointment yet"
  },
  "pb-258": {
    "id": "pb-258",
    "title": "Peter zablocki",
    "subtitle": "No appointment yet"
  },
  "pb-259": {
    "id": "pb-259",
    "title": "Michael Mailman",
    "subtitle": "No appointment yet"
  },
  "pb-260": {
    "id": "pb-260",
    "title": "Jennifer",
    "subtitle": "No appointment yet"
  },
  "pb-261": {
    "id": "pb-261",
    "title": "Fred Wien",
    "subtitle": "No appointment yet"
  },
  "pb-262": {
    "id": "pb-262",
    "title": "Baljeet Singh",
    "subtitle": "No appointment yet"
  },
  "pb-263": {
    "id": "pb-263",
    "title": "Bruce G Keys",
    "subtitle": "No appointment yet"
  },
  "pb-264": {
    "id": "pb-264",
    "title": "Travis McDonough",
    "subtitle": "No appointment yet"
  }
};

const defaultBoard2Columns = [
  {
    "id": "col-b2-1",
    "title": "Did Not Finish Sign Up",
    "cardIds": [
      "pb-248",
      "pb-249",
      "pb-250",
      "pb-251",
      "pb-252",
      "pb-253",
      "pb-254",
      "pb-255",
      "pb-256",
      "pb-257"
    ]
  },
  {
    "id": "col-b2-2",
    "title": "Signed Up · No Appointment",
    "cardIds": [
      "pb-246",
      "pb-247",
      "pb-258",
      "pb-259",
      "pb-260",
      "pb-261",
      "pb-262",
      "pb-263",
      "pb-264"
    ]
  },
  {
    "id": "col-b2-3",
    "title": "First Appointment Completed",
    "cardIds": [
      "pb-200",
      "pb-201",
      "pb-202",
      "pb-204",
      "pb-206",
      "pb-208",
      "pb-209",
      "pb-211",
      "pb-212",
      "pb-215",
      "pb-216",
      "pb-217",
      "pb-218",
      "pb-219",
      "pb-220",
      "pb-221",
      "pb-223",
      "pb-224",
      "pb-225",
      "pb-226",
      "pb-228",
      "pb-229",
      "pb-230",
      "pb-231",
      "pb-233",
      "pb-235",
      "pb-236",
      "pb-237",
      "pb-239",
      "pb-240",
      "pb-241"
    ]
  },
  {
    "id": "col-b2-4",
    "title": "Member for a Month",
    "cardIds": [
      "pb-203",
      "pb-205",
      "pb-207",
      "pb-210",
      "pb-213",
      "pb-214",
      "pb-222",
      "pb-227",
      "pb-232",
      "pb-234",
      "pb-238",
      "pb-242",
      "pb-243",
      "pb-244",
      "pb-245"
    ]
  }
];

function buildDefaultState() {
  const boards = [
    { id: "board-1", name: "immediac CEO Massive Action Plan", slug: "immediac" },
    { id: "board-2", name: "ProperBarber GTM Client Engagement", slug: "properbarber" },
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

  // Migration: check for old single-board data
  try {
    const oldRaw = localStorage.getItem(OLD_STORAGE_KEY);
    if (oldRaw) {
      const oldData = JSON.parse(oldRaw);
      if (oldData.columns && oldData.cards) {
        const migBoards = [
          { id: "board-1", name: "immediac CEO Massive Action Plan", slug: "immediac" },
          { id: "board-2", name: "ProperBarber GTM Client Engagement", slug: "properbarber" },
        ];
        const state = {
          boards: migBoards,
          activeBoardId: boardIdFromHash(migBoards) || "board-1",
          data: {
            "board-1": { columns: oldData.columns, cards: oldData.cards },
            "board-2": { columns: defaultBoard2Columns, cards: defaultBoard2Cards },
          },
        };
        localStorage.removeItem(OLD_STORAGE_KEY);
        return state;
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

export function useBoards() {
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

  // Helper to update active board data
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

  // Card operations (on active board)
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
