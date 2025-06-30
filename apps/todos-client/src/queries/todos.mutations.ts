import axios, { AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "./client";

import { UPDATE_TODOS_ORDER_URL, UPDATE_TODO_URL, LIST_TODOS_URL } from "./constants"
import { UpdateTodosOrderResponse, TodosOrder, Todo, TodosResponse } from "./types";

const latestActions = new Map<number, { done: boolean; timestamp: number }>();

export const applyOptimisticTodoUpdate = (
  currentData: { data: { todos: Todo[]; order: number[] } },
  todoId: number,
  done: boolean
): { data: { todos: Todo[]; order: number[] } } => {
  return {
    data: {
      todos: currentData.data.todos.map((t) => t.id === todoId ? { ...t, done } : t),
      order: currentData.data.order,
    }
  };
};

export const useUpdateTodosOrder = () => {
  return useMutation({
    mutationKey: [UPDATE_TODOS_ORDER_URL],
    mutationFn: ({ order }: { order: TodosOrder }) => axios.put<UpdateTodosOrderResponse>(UPDATE_TODOS_ORDER_URL, { order}),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onMutate: async ({ order }) => {
      await queryClient.cancelQueries({ queryKey: [LIST_TODOS_URL] });

      const previousTodos = queryClient.getQueryData([LIST_TODOS_URL]);

      queryClient.setQueryData([LIST_TODOS_URL], ({ data: { todos } }: AxiosResponse<TodosResponse>) => {
        return {
          data: {
            todos,
            order,
          }
        };
      });

      return { previousTodos, currentOrder: order };
    },
    onError: (_err, _variables, context) => {
      // Rollback optimistic update on error
      if (context?.previousTodos) {
        queryClient.setQueryData([LIST_TODOS_URL], context.previousTodos);
      }
    },
    onSuccess: ({ data: { order } }: AxiosResponse<UpdateTodosOrderResponse>, _variables, context) => {
      // Apply the server response if it matches our current optimistic state
      if (context?.currentOrder && JSON.stringify(context.currentOrder) === JSON.stringify(order)) {
        queryClient.setQueryData([LIST_TODOS_URL], ({ data: { todos } }: AxiosResponse<TodosResponse>) => {
          return {
            data: {
              todos,
              order,
            }
          };
        });
      }
    },
  });
};

export const useUpdateTodoDone = () => {
    return useMutation({
      mutationKey: [UPDATE_TODO_URL],
      mutationFn: ({ done, id }: { done: boolean, id: number }) => axios.put<Todo>(UPDATE_TODO_URL.replace(":id", `${id}`), { done}),
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      onMutate: async ({ done, id }) => {
        await queryClient.cancelQueries({ queryKey: [LIST_TODOS_URL] });

        const timestamp = Date.now();
        latestActions.set(id, { done, timestamp });

        const previousTodos = queryClient.getQueryData([LIST_TODOS_URL]);

        queryClient.setQueryData([LIST_TODOS_URL], ({ data: { order, todos } }: AxiosResponse<TodosResponse>) => {
          return applyOptimisticTodoUpdate({ data: { todos, order } }, id, done);
        });

        return { previousTodos, timestamp };
      },
      onError: (_err, _variables, context) => {
        // Rollback optimistic update on error
        if (context?.previousTodos) {
          queryClient.setQueryData([LIST_TODOS_URL], context.previousTodos);
        }
      },
      onSuccess: ({ data: todo }: AxiosResponse<Todo>, _variables, context) => {
        const latestAction = latestActions.get(todo.id);
        if (latestAction && context?.timestamp === latestAction.timestamp) {
          queryClient.setQueryData([LIST_TODOS_URL], ({ data: { order, todos } }: AxiosResponse<TodosResponse>) => {
            return {
              data: {
                todos: todos.map((t) => t.id === todo.id ? todo : t),
                order,
              }
            };
          });
        }
      },
    });
  }; 