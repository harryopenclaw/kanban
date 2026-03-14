import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import Column from "./components/Column";
import { useImmEdiacBoard } from "./hooks/useImmEdiacBoard";

const DRAG_COLOR_CLASSES = {
  red: "border-l-[3px] border-red-500 bg-red-900/40",
  orange: "border-l-[3px] border-orange-500 bg-orange-900/40",
  yellow: "border-l-[3px] border-yellow-500 bg-yellow-900/40",
  green: "border-l-[3px] border-green-500 bg-green-900/40",
  blue: "border-l-[3px] border-blue-500 bg-blue-900/40",
  purple: "border-l-[3px] border-purple-500 bg-purple-900/40",
  pink: "border-l-[3px] border-pink-500 bg-pink-900/40",
};

export default function ImmEdiacApp() {
  const {
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
  } = useImmEdiacBoard();

  const [activeId, setActiveId] = useState(null);
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function findColumnByCardId(cardId) {
    return columns.find((col) => col.cardIds.includes(cardId));
  }

  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragOver = useCallback(
    (event) => {
      const { active, over } = event;
      if (!over) return;

      const activeCol = findColumnByCardId(active.id);
      if (!activeCol) return;

      let overCol = findColumnByCardId(over.id);
      let overIndex;

      if (overCol) {
        overIndex = overCol.cardIds.indexOf(over.id);
      } else {
        overCol = columns.find((col) => col.id === over.id);
        if (!overCol) return;
        overIndex = overCol.cardIds.length;
      }

      if (activeCol.id === overCol.id) return;

      moveCard(active.id, over.id, activeCol.id, overCol.id, overIndex);
    },
    [columns, moveCard]
  );

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      setActiveId(null);
      if (!over || active.id === over.id) return;

      const activeCol = findColumnByCardId(active.id);
      if (!activeCol) return;

      let overCol = findColumnByCardId(over.id);
      let overIndex;

      if (overCol) {
        overIndex = overCol.cardIds.indexOf(over.id);
      } else {
        overCol = columns.find((col) => col.id === over.id);
        if (!overCol) return;
        overIndex = overCol.cardIds.length;
      }

      if (activeCol.id !== overCol.id) {
        moveCard(active.id, over.id, activeCol.id, overCol.id, overIndex);
      } else {
        const activeIndex = activeCol.cardIds.indexOf(active.id);
        if (activeIndex !== overIndex) {
          moveCard(active.id, over.id, activeCol.id, overCol.id, overIndex);
        }
      }
    },
    [columns, moveCard]
  );

  function handleAddColumn() {
    const trimmed = newColumnTitle.trim();
    if (trimmed) {
      addColumn(trimmed);
      setNewColumnTitle("");
    }
    setAddingColumn(false);
  }

  const activeCard = activeId ? cards[activeId] : null;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="px-6 py-4 border-b border-gray-800">
        <h1 className="text-lg font-bold text-gray-100 tracking-tight">
          immediac CEO Massive Action Plan
        </h1>
      </header>

      <div className="flex-1 overflow-x-auto p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 items-start h-full">
            {columns.map((col) => (
              <Column
                key={col.id}
                column={col}
                cards={cards}
                onAddCard={addCard}
                onDeleteCard={deleteCard}
                onUpdateCardTitle={updateCardTitle}
                onUpdateCardColor={updateCardColor}
                onUpdateCardDueDate={updateCardDueDate}
                onDeleteColumn={deleteColumn}
                onUpdateColumnTitle={updateColumnTitle}
              />
            ))}

            {addingColumn ? (
              <div className="w-72 min-w-72 bg-gray-800 rounded-xl p-3 shadow-lg">
                <input
                  autoFocus
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddColumn();
                    if (e.key === "Escape") {
                      setNewColumnTitle("");
                      setAddingColumn(false);
                    }
                  }}
                  placeholder="Column title..."
                  className="w-full bg-gray-700 text-gray-100 text-sm rounded-lg px-3 py-1.5 outline-none ring-1 ring-gray-600 focus:ring-blue-500 placeholder-gray-500"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleAddColumn}
                    className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-md transition-colors"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setNewColumnTitle("");
                      setAddingColumn(false);
                    }}
                    className="text-xs text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAddingColumn(true)}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-200 bg-gray-800/50 hover:bg-gray-800 rounded-xl px-4 py-2.5 transition-colors whitespace-nowrap min-w-fit"
              >
                <span className="text-lg leading-none">+</span> Add Column
              </button>
            )}
          </div>

          <DragOverlay>
            {activeCard ? (
              <div className={`rounded-lg bg-gray-700 px-3 py-2 shadow-xl ring-2 ring-blue-500/50 cursor-grabbing w-68 ${
                activeCard.color ? DRAG_COLOR_CLASSES[activeCard.color] || "" : ""
              }`}>
                <span className="text-sm text-gray-100">{activeCard.title}</span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
