import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Todo } from "../queries/types";
import { SortableTodoItem } from "./SortableTodoItem";

interface DraggableTodoListProps {
  todos: Todo[];
  onToggleDone?: (id: number, done: boolean) => void;
  onReorder?: (newOrder: number[]) => void;
  isUpdating?: boolean;
}

export function DraggableTodoList({
  todos,
  onToggleDone,
  onReorder,
  isUpdating = false,
}: DraggableTodoListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = todos.findIndex((todo) => todo.id === active.id);
      const newIndex = todos.findIndex((todo) => todo.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newTodos = arrayMove(todos, oldIndex, newIndex);
        const newOrder = newTodos.map((todo) => todo.id);
        onReorder?.(newOrder);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-center text-gray-800 mb-6 text-2xl font-bold">
        My Todo List{isUpdating ? "..." : ""}
      </h1>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={todos.map((todo) => todo.id)}
          strategy={verticalListSortingStrategy}
        >
          {todos.map((todo) => (
            <SortableTodoItem
              key={todo.id}
              todo={todo}
              onToggleDone={onToggleDone}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

