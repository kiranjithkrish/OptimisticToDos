import {
  useUpdateTodoDone,
  useUpdateTodosOrder,
} from "./queries/todos.mutations";
import { useTodos } from "./queries/todos.queries";
import { DraggableTodoList } from "./components/DraggableTodoList";
import { Todo } from "./queries/types";
import { useCallback } from "react";

function App() {
  const { data: todos, error } = useTodos();
  const { mutate: updateTodosOrder, isPending: isReordering } =
    useUpdateTodosOrder();
  const { mutate: updateTodoDone, isPending: isToggling } = useUpdateTodoDone();

  const handleToggleDone = useCallback(
    (id: number, done: boolean) => {
      updateTodoDone({ id, done });
    },
    [updateTodoDone]
  );

  const handleReorder = useCallback(
    (newOrder: number[]) => {
      updateTodosOrder({ order: newOrder });
    },
    [updateTodosOrder]
  );

  // Handle loading and error states
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <p className="text-red-600">Failed to load todos. Please try again.</p>
      </div>
    );
  }

  if (!todos?.todos || !todos?.order) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <p className="text-gray-600">No todos available.</p>
      </div>
    );
  }

  if (!Array.isArray(todos.todos) || !Array.isArray(todos.order)) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <p className="text-red-600">Invalid data format.</p>
      </div>
    );
  }

  const todosMap = new Map(todos.todos.map((todo) => [todo.id, todo]));

  const orderedTodos: Todo[] = todos.order
    .map((id) => todosMap.get(id))
    .filter((todo): todo is Todo => todo !== undefined);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <DraggableTodoList
        todos={orderedTodos}
        onToggleDone={handleToggleDone}
        onReorder={handleReorder}
        isUpdating={isReordering || isToggling}
      />
    </div>
  );
}

export default App;
