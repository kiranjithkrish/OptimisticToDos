import axios from "axios";
import { useSuspenseQuery } from "@tanstack/react-query";

import { LIST_TODOS_URL } from "./constants"
import { TodosResponse } from "./types";

export const useTodos = () => {
  return useSuspenseQuery({
    queryKey: [LIST_TODOS_URL],
    queryFn: () => axios.get<TodosResponse>(LIST_TODOS_URL),
    select: ({ data }) => data,
  });
};
