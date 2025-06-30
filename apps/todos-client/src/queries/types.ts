export type Todo = {
    id: number;
    title: string;
    body: string;
    done: boolean;
    imageUrl: string;
}

export type TodosOrder = Array<number>;

export type TodosResponse = {
    todos: Array<Todo>;
    order: TodosOrder;
}

export type UpdateTodosOrderResponse = {
    order: TodosOrder;
}
