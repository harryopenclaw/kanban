import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "properbarber-kanban";

const defaultCards = {
  "pb-200": { "id": "pb-200", "title": "Kabi Thana", "subtitle": "Appt: Mar 6 \u00b7 Booked same day" },
  "pb-201": { "id": "pb-201", "title": "Mark B", "subtitle": "Appt: Jan 31 \u00b7 Booked same day" },
  "pb-202": { "id": "pb-202", "title": "Shawn Hirtle", "subtitle": "Appt: Feb 17 \u00b7 Booked same day" },
  "pb-203": { "id": "pb-203", "title": "Mike Roberts", "subtitle": "Appt: Jan 20 \u00b7 Booked same day" },
  "pb-204": { "id": "pb-204", "title": "Rick Balys", "subtitle": "Appt: Jan 29 \u00b7 Booked same day" },
  "pb-205": { "id": "pb-205", "title": "Jason Doucet", "subtitle": "Appt: Jan 24 \u00b7 Booked same day" },
  "pb-206": { "id": "pb-206", "title": "Evan", "subtitle": "Appt: Feb 19 \u00b7 Booked same day" },
  "pb-207": { "id": "pb-207", "title": "Alper", "subtitle": "Appt: Jan 20 \u00b7 Booked same day" },
  "pb-208": { "id": "pb-208", "title": "Dr. Neil  Smith", "subtitle": "Appt: Feb 13 \u00b7 Booked same day" },
  "pb-209": { "id": "pb-209", "title": "Dan Weir", "subtitle": "Appt: Feb 19 \u00b7 Booked same day" },
  "pb-210": { "id": "pb-210", "title": "Michael D. Mailman", "subtitle": "Appt: Jan 16 \u00b7 Booked same day" },
  "pb-211": { "id": "pb-211", "title": "bruce keys", "subtitle": "Appt: Feb 11 \u00b7 Booked same day" },
  "pb-212": { "id": "pb-212", "title": "Mark Hewitt", "subtitle": "Appt: Feb 21 \u00b7 Booked 1d after signup" },
  "pb-213": { "id": "pb-213", "title": "Andrew Foote", "subtitle": "Appt: Mar 7 \u00b7 Booked 1d after signup" },
  "pb-214": { "id": "pb-214", "title": "Mark Gascoigne", "subtitle": "Appt: Jan 16 \u00b7 Booked 1d after signup" },
  "pb-215": { "id": "pb-215", "title": "John Leahy", "subtitle": "Appt: Jan 15 \u00b7 Booked 1d after signup" },
  "pb-216": { "id": "pb-216", "title": "Evan", "subtitle": "Appt: Jan 31 \u00b7 Booked 1d after signup" },
  "pb-217": { "id": "pb-217", "title": "Mike Evans", "subtitle": "Appt: Mar 5 \u00b7 Booked 1d after signup" },
  "pb-218": { "id": "pb-218", "title": "Filippe Garcia Heringer", "subtitle": "Appt: Mar 13 \u00b7 Booked 1d after signup" },
  "pb-219": { "id": "pb-219", "title": "Mike Coldwell", "subtitle": "Appt: Mar 20 \u00b7 Booked 10d after signup" },
  "pb-220": { "id": "pb-220", "title": "Ashoke Mohanraj", "subtitle": "Appt: Mar 24 \u00b7 Booked 12d after signup" },
  "pb-221": { "id": "pb-221", "title": "Aaron Trask", "subtitle": "Appt: Mar 28 \u00b7 Booked 19d after signup" },
  "pb-222": { "id": "pb-222", "title": "Alwaleed  Alshahir", "subtitle": "Appt: Feb 7 \u00b7 Booked 2d after signup" },
  "pb-223": { "id": "pb-223", "title": "Caleb", "subtitle": "Appt: Jan 24 \u00b7 Booked 2d after signup" },
  "pb-224": { "id": "pb-224", "title": "Jed", "subtitle": "Appt: Feb 12 \u00b7 Booked 2d after signup" },
  "pb-225": { "id": "pb-225", "title": "Derek Gentile", "subtitle": "Appt: Mar 3 \u00b7 Booked 20d after signup" },
  "pb-226": { "id": "pb-226", "title": "Tim Gillis", "subtitle": "Appt: Mar 5 \u00b7 Booked 20d after signup" },
  "pb-227": { "id": "pb-227", "title": "Saadat", "subtitle": "Appt: Feb 20 \u00b7 Booked 22d after signup" },
  "pb-228": { "id": "pb-228", "title": "Dr. Greg Patey", "subtitle": "Appt: Feb 19 \u00b7 Booked 24d after signup" },
  "pb-229": { "id": "pb-229", "title": "Paul Banks", "subtitle": "Appt: Mar 17 \u00b7 Booked 24d after signup" },
  "pb-230": { "id": "pb-230", "title": "Paul Ryan", "subtitle": "Appt: Apr 2 \u00b7 Booked 24d after signup" },
  "pb-231": { "id": "pb-231", "title": "Tommy", "subtitle": "Appt: Mar 6 \u00b7 Booked 28d after signup" },
  "pb-232": { "id": "pb-232", "title": "Peter Hickey", "subtitle": "Appt: Feb 17 \u00b7 Booked 3d after signup" },
  "pb-233": { "id": "pb-233", "title": "Nathan Kroll", "subtitle": "Appt: Jan 23 \u00b7 Booked 3d after signup" },
  "pb-234": { "id": "pb-234", "title": "Derek  Martin", "subtitle": "Appt: Mar 3 \u00b7 Booked 3d after signup" },
  "pb-235": { "id": "pb-235", "title": "Patrick Kervin", "subtitle": "Appt: Jan 23 \u00b7 Booked 3d after signup" },
  "pb-236": { "id": "pb-236", "title": "Hamed Hanafi", "subtitle": "Appt: Mar 10 \u00b7 Booked 4d after signup" },
  "pb-237": { "id": "pb-237", "title": "Lane Braidwood", "subtitle": "Appt: Mar 10 \u00b7 Booked 4d after signup" },
  "pb-238": { "id": "pb-238", "title": "David Regan", "subtitle": "Appt: Mar 13 \u00b7 Booked 4d after signup" },
  "pb-239": { "id": "pb-239", "title": "Brian Brewer", "subtitle": "Appt: Jan 24 \u00b7 Booked 5d after signup" },
  "pb-240": { "id": "pb-240", "title": "Bruce Lusby", "subtitle": "Appt: Feb 11 \u00b7 Booked 5d after signup" },
  "pb-241": { "id": "pb-241", "title": "Peter Wong", "subtitle": "Appt: Feb 12 \u00b7 Booked 6d after signup" },
  "pb-242": { "id": "pb-242", "title": "Shahin", "subtitle": "Appt: Feb 19 \u00b7 Booked 7d after signup" },
  "pb-243": { "id": "pb-243", "title": "Jacob LeBlanc", "subtitle": "Appt: Jan 28 \u00b7 Booked 7d after signup" },
  "pb-244": { "id": "pb-244", "title": "Gregory Dunn", "subtitle": "Appt: Jan 29 \u00b7 Booked 8d after signup" },
  "pb-245": { "id": "pb-245", "title": "James Farquhar", "subtitle": "Appt: Jan 30 \u00b7 Booked 8d after signup" },
  "pb-246": { "id": "pb-246", "title": "Colin Dillon", "subtitle": "Appt: Feb 3 \u00b7 Booked 8d after signup" },
  "pb-247": { "id": "pb-247", "title": "Neil Smith", "subtitle": "No appointment yet" },
  "pb-248": { "id": "pb-248", "title": "Michael Mailman", "subtitle": "No appointment yet" },
  "pb-249": { "id": "pb-249", "title": "Noah Dow", "subtitle": "No appointment yet" },
  "pb-250": { "id": "pb-250", "title": "Manny", "subtitle": "No appointment yet" },
  "pb-251": { "id": "pb-251", "title": "Adam", "subtitle": "No appointment yet" },
  "pb-252": { "id": "pb-252", "title": "sid", "subtitle": "No appointment yet" },
  "pb-253": { "id": "pb-253", "title": "Jennifer", "subtitle": "No appointment yet" },
  "pb-254": { "id": "pb-254", "title": "Brittany R Hall", "subtitle": "No appointment yet" },
  "pb-255": { "id": "pb-255", "title": "James", "subtitle": "No appointment yet" },
  "pb-256": { "id": "pb-256", "title": "Cailean Jan", "subtitle": "No appointment yet" },
  "pb-257": { "id": "pb-257", "title": "Nadeem Jan", "subtitle": "No appointment yet" },
  "pb-258": { "id": "pb-258", "title": "Derek Gentile", "subtitle": "No appointment yet" },
  "pb-259": { "id": "pb-259", "title": "Karan", "subtitle": "No appointment yet" },
  "pb-260": { "id": "pb-260", "title": "\"\"", "subtitle": "No appointment yet" },
  "pb-261": { "id": "pb-261", "title": "Peter zablocki", "subtitle": "No appointment yet" },
  "pb-262": { "id": "pb-262", "title": "Michael Mailman", "subtitle": "No appointment yet" },
  "pb-263": { "id": "pb-263", "title": "Jennifer", "subtitle": "No appointment yet" },
  "pb-264": { "id": "pb-264", "title": "Fred Wien", "subtitle": "No appointment yet" },
  "pb-265": { "id": "pb-265", "title": "Baljeet Singh", "subtitle": "No appointment yet" },
  "pb-266": { "id": "pb-266", "title": "Bruce G Keys", "subtitle": "No appointment yet" },
  "pb-267": { "id": "pb-267", "title": "Travis McDonough", "subtitle": "No appointment yet" },
};

const defaultColumns = [
  { "id": "col-b2-1", "title": "Did Not Finish Sign Up", "cardIds": ["pb-249","pb-250","pb-251","pb-252","pb-253","pb-254","pb-255","pb-256","pb-257","pb-258","pb-259","pb-260"] },
  { "id": "col-b2-2", "title": "Signed Up \u00b7 No Appointment", "cardIds": ["pb-247","pb-248","pb-261","pb-262","pb-263","pb-264","pb-265","pb-266","pb-267"] },
  { "id": "col-b2-3", "title": "First Appointment Completed", "cardIds": ["pb-200","pb-201","pb-202","pb-204","pb-206","pb-208","pb-209","pb-211","pb-212","pb-213","pb-216","pb-217","pb-218","pb-219","pb-220","pb-221","pb-222","pb-224","pb-225","pb-226","pb-227","pb-229","pb-230","pb-231","pb-232","pb-234","pb-236","pb-237","pb-238","pb-240","pb-241","pb-242"] },
  { "id": "col-b2-4", "title": "Member for a Month", "cardIds": ["pb-203","pb-205","pb-207","pb-210","pb-214","pb-215","pb-223","pb-228","pb-233","pb-235","pb-239","pb-243","pb-244","pb-245","pb-246"] },
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

export function useProperBarberBoard() {
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
