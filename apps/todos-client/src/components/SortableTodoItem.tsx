import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Todo } from "../queries/types";

interface SortableTodoItemProps {
  todo: Todo;
  onToggleDone?: (id: number, done: boolean) => void;
}

export function SortableTodoItem({
  todo,
  onToggleDone,
}: SortableTodoItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm
        flex justify-between items-start cursor-grab
        hover:shadow-md
        ${todo.done ? "opacity-70 bg-gray-50" : ""}
        ${isDragging ? "shadow-lg z-50" : ""}
      `}
      {...attributes}
      {...listeners}
    >
      <div className="flex-1">
        <h3
          className={`text-lg font-semibold mb-2 ${
            todo.done ? "line-through text-gray-500" : "text-gray-800"
          }`}
        >
          {todo.title}
        </h3>
        <p
          className={`mb-3 ${
            todo.done ? "line-through text-gray-500" : "text-gray-600"
          }`}
        >
          {todo.body}
        </p>
        {todo.imageUrl && (
          <img
            src={todo.imageUrl}
            alt={todo.title}
            className="max-w-[200px] max-h-[150px] rounded mt-2"
          />
        )}
      </div>
      <div className="ml-4">
        <button
          className={`
            px-4 py-2 rounded-full text-sm font-medium
            hover:scale-105 transition-transform
            ${
              todo.done
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            }
          `}
          aria-label={`Mark todo "${todo.title}" as ${
            todo.done ? "pending" : "done"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleDone?.(todo.id, !todo.done);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
        >
          {todo.done ? "✅ Done" : "⏳ Pending"}
        </button>
      </div>
    </div>
  );
}
