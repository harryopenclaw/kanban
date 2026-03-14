import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Card from "./Card";

export default function Column({
  column,
  cards,
  onAddCard,
  onDeleteCard,
  onUpdateCardTitle,
  onUpdateCardColor,
  onUpdateCardDueDate,
  onDeleteColumn,
  onUpdateColumnTitle,
}) {
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);
  const [columnTitle, setColumnTitle] = useState(column.title);

  function handleTitleSave() {
    const trimmed = columnTitle.trim();
    if (trimmed && trimmed !== column.title) {
      onUpdateColumnTitle(column.id, trimmed);
    } else {
      setColumnTitle(column.title);
    }
    setEditingTitle(false);
  }

  const { setNodeRef } = useDroppable({ id: column.id });

  function handleAdd() {
    const trimmed = newTitle.trim();
    if (trimmed) {
      onAddCard(column.id, trimmed);
      setNewTitle("");
    }
    setAdding(false);
  }

  const isEmpty = column.cardIds.length === 0;

  return (
    <div className="flex flex-col bg-gray-800 rounded-xl w-72 min-w-72 max-h-full shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-700">
        <div className="flex items-center gap-2">
          {editingTitle ? (
            <input
              autoFocus
              value={columnTitle}
              onChange={(e) => setColumnTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTitleSave();
                if (e.key === "Escape") { setColumnTitle(column.title); setEditingTitle(false); }
              }}
              className="text-sm font-semibold bg-gray-700 text-gray-100 rounded px-1.5 py-0.5 outline-none ring-1 ring-blue-500 w-36"
            />
          ) : (
            <h2
              className="text-sm font-semibold text-gray-200 cursor-pointer hover:text-white"
              onDoubleClick={() => { setColumnTitle(column.title); setEditingTitle(true); }}
              title="Double-click to rename"
            >
              {column.title}
            </h2>
          )}
          <span className="text-xs text-gray-500 bg-gray-700 rounded-full px-1.5 py-0.5 min-w-5 text-center">
            {column.cardIds.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setAdding(true)}
            className="text-gray-400 hover:text-blue-400 transition-colors text-lg leading-none px-1"
            title="Add card"
          >
            +
          </button>
          {isEmpty && (
            <button
              onClick={() => onDeleteColumn(column.id)}
              className="text-gray-500 hover:text-red-400 transition-colors text-xs leading-none px-1"
              title="Delete column"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Cards */}
      <div ref={setNodeRef} className="flex-1 overflow-y-auto p-2 space-y-2 min-h-16">
        <SortableContext
          items={column.cardIds}
          strategy={verticalListSortingStrategy}
        >
          {column.cardIds.map((cardId) => {
            const card = cards[cardId];
            if (!card) return null;
            return (
              <Card
                key={cardId}
                id={cardId}
                title={card.title}
                color={card.color || null}
                dueDate={card.dueDate || null}
                onDelete={onDeleteCard}
                onUpdateTitle={onUpdateCardTitle}
                onUpdateColor={onUpdateCardColor}
                onUpdateDueDate={onUpdateCardDueDate}
              />
            );
          })}
        </SortableContext>
      </div>

      {/* Add card form */}
      {adding ? (
        <div className="p-2 border-t border-gray-700">
          <input
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") {
                setNewTitle("");
                setAdding(false);
              }
            }}
            placeholder="Card title..."
            className="w-full bg-gray-700 text-gray-100 text-sm rounded-lg px-3 py-1.5 outline-none ring-1 ring-gray-600 focus:ring-blue-500 placeholder-gray-500"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleAdd}
              className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-md transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => {
                setNewTitle("");
                setAdding(false);
              }}
              className="text-xs text-gray-400 hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
