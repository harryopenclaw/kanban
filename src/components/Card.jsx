import { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const COLOR_OPTIONS = [
  { name: "red", bg: "bg-red-900/40", border: "border-red-500" },
  { name: "orange", bg: "bg-orange-900/40", border: "border-orange-500" },
  { name: "yellow", bg: "bg-yellow-900/40", border: "border-yellow-500" },
  { name: "green", bg: "bg-green-900/40", border: "border-green-500" },
  { name: "blue", bg: "bg-blue-900/40", border: "border-blue-500" },
  { name: "purple", bg: "bg-purple-900/40", border: "border-purple-500" },
  { name: "pink", bg: "bg-pink-900/40", border: "border-pink-500" },
];

const COLOR_DOT = {
  red: "bg-red-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-500",
  green: "bg-green-500",
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
};

function getColorClasses(color) {
  if (!color) return { bg: "", border: "" };
  const opt = COLOR_OPTIONS.find((c) => c.name === color);
  return opt || { bg: "", border: "" };
}

function getDueDateStatus(dueDate) {
  if (!dueDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + "T00:00:00");
  if (due < today) return "overdue";
  if (due.getTime() === today.getTime()) return "today";
  return "future";
}

function formatDate(dueDate) {
  const d = new Date(dueDate + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function Card({
  id,
  title,
  color,
  dueDate,
  onDelete,
  onUpdateTitle,
  onUpdateColor,
  onUpdateDueDate,
}) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const [showDateInput, setShowDateInput] = useState(false);
  const inputRef = useRef(null);
  const dateInputRef = useRef(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  useEffect(() => {
    if (showDateInput && dateInputRef.current) {
      dateInputRef.current.focus();
    }
  }, [showDateInput]);

  function commitEdit() {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== title) {
      onUpdateTitle(id, trimmed);
    } else {
      setEditValue(title);
    }
    setEditing(false);
  }

  const colorClasses = getColorClasses(color);
  const dueDateStatus = getDueDateStatus(dueDate);

  const dueDateColorClass =
    dueDateStatus === "overdue"
      ? "text-red-400"
      : dueDateStatus === "today"
      ? "text-amber-400"
      : "text-gray-400";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onDoubleClick={() => {
        setEditing(true);
        setEditValue(title);
      }}
      className={`group relative rounded-lg bg-gray-700 px-3 py-2 shadow-sm cursor-grab active:cursor-grabbing hover:bg-gray-600 transition-colors ${
        isDragging ? "z-50 shadow-lg" : ""
      } ${color ? `border-l-[3px] ${colorClasses.border} ${colorClasses.bg}` : ""}`}
    >
      {/* Title */}
      {editing ? (
        <input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitEdit();
            if (e.key === "Escape") {
              setEditValue(title);
              setEditing(false);
            }
          }}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="w-full bg-gray-600 text-gray-100 text-sm rounded px-1 py-0.5 outline-none ring-1 ring-blue-500"
        />
      ) : (
        <span className="text-sm text-gray-100 break-words pr-5">{title}</span>
      )}

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(id);
        }}
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-opacity text-xs leading-none p-0.5"
      >
        ✕
      </button>

      {/* Color picker row (visible on hover) */}
      <div className="flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity h-0 group-hover:h-auto overflow-hidden">
        {COLOR_OPTIONS.map((c) => (
          <button
            key={c.name}
            onClick={(e) => {
              e.stopPropagation();
              onUpdateColor(id, c.name);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className={`w-4 h-4 rounded-full ${COLOR_DOT[c.name]} hover:scale-125 transition-transform ${
              color === c.name ? "ring-2 ring-white ring-offset-1 ring-offset-gray-700" : ""
            }`}
            title={c.name}
          />
        ))}
        {color && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpdateColor(id, null);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-4 h-4 rounded-full border border-gray-500 hover:border-gray-300 transition-colors flex items-center justify-center text-gray-500 hover:text-gray-300"
            title="Clear color"
          >
            <span className="text-[8px] leading-none">✕</span>
          </button>
        )}
      </div>

      {/* Due date section */}
      {(dueDate || showDateInput) && (
        <div className="flex items-center gap-1 mt-1.5">
          {showDateInput ? (
            <div
              className="flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <input
                ref={dateInputRef}
                type="date"
                value={dueDate || ""}
                onChange={(e) => {
                  onUpdateDueDate(id, e.target.value || null);
                  setShowDateInput(false);
                }}
                onBlur={() => setShowDateInput(false)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setShowDateInput(false);
                }}
                className="bg-gray-600 text-gray-200 text-xs rounded px-1.5 py-0.5 outline-none ring-1 ring-gray-500 focus:ring-blue-500 [color-scheme:dark]"
              />
            </div>
          ) : (
            dueDate && (
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDateInput(true);
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className={`flex items-center gap-1 text-xs ${dueDateColorClass} hover:opacity-80 transition-opacity`}
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  {formatDate(dueDate)}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateDueDate(id, null);
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className={`text-[10px] ${dueDateColorClass} hover:text-red-400 transition-colors leading-none`}
                >
                  ✕
                </button>
              </div>
            )
          )}
        </div>
      )}

      {/* Add due date trigger (shown on hover when no date) */}
      {!dueDate && !showDateInput && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDateInput(true);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-300 transition-colors"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            Add date
          </button>
        </div>
      )}
    </div>
  );
}
