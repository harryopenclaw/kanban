import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "kanban-boards";
const OLD_STORAGE_KEY = "kanban-board";

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
    "title": "Michael Mailman",
    "subtitle": "mmailman@allumiqs.com"
  },
  "pb-201": {
    "id": "pb-201",
    "title": "Michael Mailman",
    "subtitle": "m.mailman@bluecharm.io"
  },
  "pb-202": {
    "id": "pb-202",
    "title": "Filippe Garcia Heringer",
    "subtitle": "fgheringer@gmail.com"
  },
  "pb-203": {
    "id": "pb-203",
    "title": "Ashoke Mohanraj",
    "subtitle": "ashokemohanraj@hotmail.com"
  },
  "pb-204": {
    "id": "pb-204",
    "title": "Jennifer",
    "subtitle": "jenn.backman@gmail.com"
  },
  "pb-205": {
    "id": "pb-205",
    "title": "Mike Coldwell",
    "subtitle": "michael.coldwell@dal.ca"
  },
  "pb-206": {
    "id": "pb-206",
    "title": "Aaron Trask",
    "subtitle": "aaronstrask1973@gmail.com"
  },
  "pb-207": {
    "id": "pb-207",
    "title": "Travis McDonough",
    "subtitle": "travis.mcdonough@wellnify.ai"
  },
  "pb-208": {
    "id": "pb-208",
    "title": "Paul Ryan",
    "subtitle": "pryan2112@gmail.com"
  },
  "pb-209": {
    "id": "pb-209",
    "title": "David Regan",
    "subtitle": "david.regan@insead.edu"
  },
  "pb-210": {
    "id": "pb-210",
    "title": "Manny",
    "subtitle": "mankeert.dhillon@gmail.com"
  },
  "pb-211": {
    "id": "pb-211",
    "title": "Peter zablocki",
    "subtitle": "peterzablocki@hotmail.com"
  },
  "pb-212": {
    "id": "pb-212",
    "title": "Andrew Foote",
    "subtitle": "andrewfoote10@hotmail.com"
  },
  "pb-213": {
    "id": "pb-213",
    "title": "Hamed Hanafi",
    "subtitle": "hamed.hanafi@gmail.com"
  },
  "pb-214": {
    "id": "pb-214",
    "title": "Lane Braidwood",
    "subtitle": "lanebraidwood15@gmail.com"
  },
  "pb-215": {
    "id": "pb-215",
    "title": "Kabi Thana",
    "subtitle": "kabithana@gmail.com"
  },
  "pb-216": {
    "id": "pb-216",
    "title": "Mike Evans",
    "subtitle": "mikeevans98@hotmail.com"
  },
  "pb-217": {
    "id": "pb-217",
    "title": "Derek Gentile",
    "subtitle": "gentilederek11@hotmail.com"
  },
  "pb-218": {
    "id": "pb-218",
    "title": "Derek  Martin",
    "subtitle": "derek.martin@hfxwanderersfc.ca"
  },
  "pb-219": {
    "id": "pb-219",
    "title": "Fred Wien",
    "subtitle": "frederic.wien@dal.ca"
  },
  "pb-220": {
    "id": "pb-220",
    "title": "Paul Banks",
    "subtitle": "pbanks2101@gmail.com"
  },
  "pb-221": {
    "id": "pb-221",
    "title": "Mark Hewitt",
    "subtitle": "mhewitt@dal.ca"
  },
  "pb-222": {
    "id": "pb-222",
    "title": "Dan Weir",
    "subtitle": "danhgweir@gmail.com"
  },
  "pb-223": {
    "id": "pb-223",
    "title": "Evan",
    "subtitle": "evanrose12@gmail.com"
  },
  "pb-224": {
    "id": "pb-224",
    "title": "Shawn Hirtle",
    "subtitle": "hirtleshawn@gmail.com"
  },
  "pb-225": {
    "id": "pb-225",
    "title": "Peter Hickey",
    "subtitle": "peterghickey@gmail.com"
  },
  "pb-226": {
    "id": "pb-226",
    "title": "Tim Gillis",
    "subtitle": "tcgillis@yahoo.ca"
  },
  "pb-227": {
    "id": "pb-227",
    "title": "Dr. Neil  Smith",
    "subtitle": "neilsmithmd@gmail.com"
  },
  "pb-228": {
    "id": "pb-228",
    "title": "Neil Smith",
    "subtitle": "neilsmithdr@gmail.com"
  },
  "pb-229": {
    "id": "pb-229",
    "title": "Shahin",
    "subtitle": "shahin@tabrizi.com"
  },
  "pb-230": {
    "id": "pb-230",
    "title": "Bruce G Keys",
    "subtitle": "bkeys@eastlink.ca"
  },
  "pb-231": {
    "id": "pb-231",
    "title": "Derek Gentile",
    "subtitle": "gentilederek11@hotmail.com"
  },
  "pb-232": {
    "id": "pb-232",
    "title": "sid",
    "subtitle": "siddharthbalachander@gmail.com"
  },
  "pb-233": {
    "id": "pb-233",
    "title": "Jed",
    "subtitle": "jdouglas@currentstudios.ca"
  },
  "pb-234": {
    "id": "pb-234",
    "title": "Karan",
    "subtitle": "karanwariach45@gmail.com"
  },
  "pb-235": {
    "id": "pb-235",
    "title": "Peter Wong",
    "subtitle": "pm@wongs.net.au"
  },
  "pb-236": {
    "id": "pb-236",
    "title": "Tommy",
    "subtitle": "Tommysmail@gmx.com"
  },
  "pb-237": {
    "id": "pb-237",
    "title": "Bruce Lusby",
    "subtitle": "bruce.lusby@premieremortgage.ca"
  },
  "pb-238": {
    "id": "pb-238",
    "title": "Alwaleed  Alshahir",
    "subtitle": "alshahiralwaleed@gmail.com"
  },
  "pb-239": {
    "id": "pb-239",
    "title": "Brittany R Hall",
    "subtitle": "brittrachelhall@gmail.com"
  },
  "pb-240": {
    "id": "pb-240",
    "title": "Mark B",
    "subtitle": "mark4.barry4@gmail.com"
  },
  "pb-241": {
    "id": "pb-241",
    "title": "Evan",
    "subtitle": "ehalliday87@gmail.com"
  },
  "pb-242": {
    "id": "pb-242",
    "title": "Jennifer",
    "subtitle": "jennifer@properbarber.club"
  },
  "pb-243": {
    "id": "pb-243",
    "title": "Rick Balys",
    "subtitle": "rbalys@gmail.com"
  },
  "pb-244": {
    "id": "pb-244",
    "title": "Saadat",
    "subtitle": "saadat.qadri@gmail.com"
  },
  "pb-245": {
    "id": "pb-245",
    "title": "Colin Dillon",
    "subtitle": "colin@dillonre.ca"
  },
  "pb-246": {
    "id": "pb-246",
    "title": "Dr. Greg Patey",
    "subtitle": "glpatey@gmail.com"
  },
  "pb-247": {
    "id": "pb-247",
    "title": "Jason Doucet",
    "subtitle": "jdoucet1383@gmail.com"
  },
  "pb-248": {
    "id": "pb-248",
    "title": "Caleb",
    "subtitle": "cl679294@dal.ca"
  },
  "pb-249": {
    "id": "pb-249",
    "title": "James Farquhar",
    "subtitle": "farquhar.james001@icloud.com"
  },
  "pb-250": {
    "id": "pb-250",
    "title": "Jacob LeBlanc",
    "subtitle": "jacob.leblanc@dal.ca"
  },
  "pb-251": {
    "id": "pb-251",
    "title": "Gregory Dunn",
    "subtitle": "gdunn.cgd@gmail.com"
  },
  "pb-252": {
    "id": "pb-252",
    "title": "Noah Dow",
    "subtitle": "Noahdow1234@gmail.com"
  },
  "pb-253": {
    "id": "pb-253",
    "title": "James",
    "subtitle": "mckeejw13@gmail.com"
  },
  "pb-254": {
    "id": "pb-254",
    "title": "Patrick Kervin",
    "subtitle": "pkervin@currentstudios.ca"
  },
  "pb-255": {
    "id": "pb-255",
    "title": "Adam",
    "subtitle": "adamrostis@gmail.com"
  },
  "pb-256": {
    "id": "pb-256",
    "title": "Mike Roberts",
    "subtitle": "mroberts1705@gmail.com"
  },
  "pb-257": {
    "id": "pb-257",
    "title": "Nathan Kroll",
    "subtitle": "nkroll@currentstudios.ca"
  },
  "pb-258": {
    "id": "pb-258",
    "title": "Alper",
    "subtitle": "alperyuce98@gmail.com"
  },
  "pb-259": {
    "id": "pb-259",
    "title": "Brian Brewer",
    "subtitle": "bjbrewer@gmail.com"
  },
  "pb-260": {
    "id": "pb-260",
    "title": "Nadeem Jan",
    "subtitle": "abbas_nad@hotmail.com"
  },
  "pb-261": {
    "id": "pb-261",
    "title": "Michael D. Mailman",
    "subtitle": "mdm@michaeldmailman.com"
  },
  "pb-262": {
    "id": "pb-262",
    "title": "Mark Gascoigne",
    "subtitle": "mark@trampolinebranding.com"
  },
  "pb-263": {
    "id": "pb-263",
    "title": "Baljeet Singh",
    "subtitle": "baljeet808singh@gmail.com"
  }
};

const defaultBoard2Columns = [
  {
    "id": "col-b2-1",
    "title": "Did Not Finish Sign Up",
    "cardIds": [
      "pb-210",
      "pb-217",
      "pb-232",
      "pb-234",
      "pb-239",
      "pb-242",
      "pb-252",
      "pb-253",
      "pb-260"
    ]
  },
  {
    "id": "col-b2-2",
    "title": "Signed Up · No Appointment",
    "cardIds": [
      "pb-200",
      "pb-201",
      "pb-202",
      "pb-203",
      "pb-204",
      "pb-205",
      "pb-206",
      "pb-207",
      "pb-208",
      "pb-209",
      "pb-211",
      "pb-212",
      "pb-213",
      "pb-214",
      "pb-215",
      "pb-216",
      "pb-218",
      "pb-219"
    ]
  },
  {
    "id": "col-b2-3",
    "title": "First Appointment Completed",
    "cardIds": [
      "pb-220",
      "pb-221",
      "pb-222",
      "pb-223",
      "pb-224",
      "pb-225",
      "pb-226",
      "pb-227",
      "pb-228",
      "pb-229",
      "pb-230",
      "pb-231",
      "pb-233",
      "pb-235",
      "pb-236",
      "pb-237",
      "pb-238",
      "pb-240",
      "pb-241",
      "pb-243",
      "pb-244"
    ]
  },
  {
    "id": "col-b2-4",
    "title": "Member for a Month",
    "cardIds": [
      "pb-245",
      "pb-246",
      "pb-247",
      "pb-248",
      "pb-249",
      "pb-250",
      "pb-251",
      "pb-254",
      "pb-255",
      "pb-256",
      "pb-257",
      "pb-258",
      "pb-259",
      "pb-261",
      "pb-262",
      "pb-263"
    ]
  }
];

function buildDefaultState() {
  return {
    boards: [
      { id: "board-1", name: "immediac CEO Massive Action Plan" },
      { id: "board-2", name: "ProperBarber GTM Client Engagement" },
    ],
    activeBoardId: "board-1",
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
      if (parsed.boards && parsed.data) return parsed;
    }
  } catch {}

  // Migration: check for old single-board data
  try {
    const oldRaw = localStorage.getItem(OLD_STORAGE_KEY);
    if (oldRaw) {
      const oldData = JSON.parse(oldRaw);
      if (oldData.columns && oldData.cards) {
        const state = {
          boards: [
            { id: "board-1", name: "immediac CEO Massive Action Plan" },
            { id: "board-2", name: "ProperBarber GTM Client Engagement" },
          ],
          activeBoardId: "board-1",
          data: {
            "board-1": { columns: oldData.columns, cards: oldData.cards },
            "board-2": { columns: defaultBoard2Columns, cards: {} },
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
    setState((prev) => ({ ...prev, activeBoardId: id }));
  }, []);

  const createBoard = useCallback((name) => {
    const id = genId("board");
    setState((prev) => ({
      ...prev,
      boards: [...prev.boards, { id, name }],
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
    setState((prev) => ({
      ...prev,
      boards: prev.boards.map((b) => (b.id === id ? { ...b, name } : b)),
    }));
  }, []);

  const deleteBoard = useCallback((id) => {
    setState((prev) => {
      if (prev.boards.length <= 1) return prev;
      const newBoards = prev.boards.filter((b) => b.id !== id);
      const newData = { ...prev.data };
      delete newData[id];
      const newActiveId = prev.activeBoardId === id ? newBoards[0].id : prev.activeBoardId;
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
