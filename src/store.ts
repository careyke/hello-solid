import { createStore, produce } from "solid-js/store";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface State {
  list: Todo[];
  count: number;
}

let globalIndex = 1;

export const [state, setState] = createStore<State>({
  list: [],
  count: 0,
});

export const addTodo = (text: string) => {
  const todo: Todo = {
    id: globalIndex++,
    text,
    completed: false,
  };
  setState("list", (list) => [...list, todo]);
  setState("count", (c) => c + 1);
};

export const deleteTodo = (id: number) => {
  setState("list", (list) => list.filter((item) => item.id !== id));
  setState("count", (c) => c - 1);
};

export const completeTodo = (id: number) => {
  setState(
    "list",
    (todo) => todo.id === id,
    "completed",
    (c) => !c
  );
};

export const completeAllTodos = (completed: boolean) => {
  setState("list", {}, "completed", (c) => completed);
};

export const clearCompletedTodos = () => {
  setState("list", (list) => list.filter((todo) => !todo.completed));
};
