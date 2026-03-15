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

export default function Card({
  id,
  title,
  subtitle,
  color,
  email,
  signupDate,
  appointmentCount,
  bookingNote,
  onDelete,
  onUpdateTitle,
  onUpdateColor,
}) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const inputRef = useRef(null);
  const menuRef = useRef(null);

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
    if (!isMenuOpen) return;
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, [isMenuOpen]);

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
      className={`relative rounded-lg bg-gray-700 px-3 py-2 shadow-sm cursor-grab active:cursor-grabbing hover:bg-gray-600 transition-colors ${
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
        <div className="pr-6">
          <span className="text-sm text-gray-100 break-words">{title}</span>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-0.5 break-words">{subtitle}</p>
          )}
        </div>
      )}

      {/* Client info fields */}
      {(email || signupDate || appointmentCount != null || bookingNote) && (
        <div className="mt-1 space-y-0.5">
          {email && (
            <p className="text-xs text-gray-400 break-words">✉ {email}</p>
          )}
          {signupDate && (
            <p className="text-xs text-gray-400">Joined: {signupDate}</p>
          )}
          {appointmentCount != null && (
            <p className="text-xs text-gray-400">
              {appointmentCount} {appointmentCount === 1 ? "appt" : "appts"}
            </p>
          )}
          {bookingNote && (
            <p className="text-xs text-gray-400 italic break-words">{bookingNote}</p>
          )}
        </div>
      )}

      {/* ⋯ menu button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsMenuOpen((prev) => !prev);
        }}
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute top-1 right-1 min-w-[32px] min-h-[32px] flex items-center justify-center text-gray-500 hover:text-gray-300 transition-colors text-base leading-none rounded"
      >
        ⋯
      </button>

      {/* Menu popover */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute top-8 right-1 z-50 bg-gray-700 border border-gray-600 rounded-lg shadow-lg p-3 min-w-[200px]"
        >
          {/* Color picker */}
          <div className="flex items-center gap-1.5 mb-3">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c.name}
                onClick={() => onUpdateColor(id, c.name)}
                onPointerDown={(e) => e.stopPropagation()}
                className={`w-5 h-5 rounded-full ${COLOR_DOT[c.name]} hover:scale-125 transition-transform ${
                  color === c.name ? "ring-2 ring-white ring-offset-1 ring-offset-gray-700" : ""
                }`}
                title={c.name}
              />
            ))}
            <button
              onClick={() => onUpdateColor(id, null)}
              onPointerDown={(e) => e.stopPropagation()}
              className="w-5 h-5 rounded-full border border-gray-500 hover:border-gray-300 transition-colors flex items-center justify-center text-gray-500 hover:text-gray-300"
              title="Clear color"
            >
              <span className="text-[9px] leading-none">✕</span>
            </button>
          </div>

          {/* Delete */}
          <button
            onClick={() => {
              onDelete(id);
              setIsMenuOpen(false);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-full text-left text-sm text-red-400 hover:text-red-300 hover:bg-gray-600 rounded px-2 py-1.5 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
