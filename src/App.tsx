import type { Component, JSX } from 'solid-js';
import { createSignal, For, createMemo } from 'solid-js'

import styles from './App.module.css';
import { state, addTodo, deleteTodo, completeTodo, completeAllTodos, clearCompletedTodos } from './store';

const groups = [
  { id: 'group1', label: 'All', value: 0 },
  { id: 'group2', label: 'Active', value: 1 },
  { id: 'group3', label: 'Completed', value: 2 }
]

const App: Component = () => {
  let domRef: HTMLInputElement | undefined = undefined;
  const computed = createMemo(() => {
    const todoCount = state.list.reduce((prev, todo) => {
      if (todo.completed) return prev;
      return prev + 1;
    }, 0)
    return {
      todoCount,
      allCompleted: state.list.length > 0 && todoCount === 0
    }
  });
  const [getGroupValue, setGroupValue] = createSignal(0);
  const groupedList = createMemo(() => {
    const groupValue = getGroupValue()
    if (groupValue === 0) {
      return state.list;
    } else if (groupValue === 1) {
      return state.list.filter(todo => !todo.completed)
    } {
      return state.list.filter(todo => todo.completed)
    }
  })

  const handleEnter: JSX.EventHandlerUnion<HTMLInputElement, KeyboardEvent> = (e) => {
    if (e.key === 'Enter') {
      const value = (e.target as any).value;
      value && addTodo(value);
      if (domRef) {
        domRef.value = '';
      }
    }
  }

  const handleDelete = (id: number) => {
    deleteTodo(id)
  }

  const handleCheck = (id: number) => {
    completeTodo(id)
  }

  const handleCompletedAllTodos: JSX.DOMAttributes<HTMLInputElement>['onChange'] = (e) => {
    completeAllTodos((e.target as any).checked);
  }

  const handleGroupChange = (value: number) => {
    setGroupValue(value);
  }

  const handleClearClick = () => {
    clearCompletedTodos()
  }

  return (
    <div class={styles.app}>
      <div class={styles.container}>
        <div class={styles.header}>
          <input type='checkbox' checked={computed().allCompleted} onChange={handleCompletedAllTodos} />
          <input ref={domRef} type='text' onKeyUp={handleEnter} />
        </div>
        <div class={styles.content}>
          <For each={groupedList()}>
            {(todo) => (<div classList={{ [styles.item]: true, [styles.completedItem]: todo.completed }}>
              <input type='checkbox' checked={todo.completed} onChange={[handleCheck, todo.id]} />
              <span>{todo.text}</span>
              <button onClick={[handleDelete, todo.id]}>del</button>
            </div>)}
          </For>
        </div>
        <div class={styles.footer}>
          <span class={styles.left}>{computed().todoCount} items left</span>
          <div class={styles.group}>
            <For each={groups}>
              {(group) => (<span>
                <input
                  type='radio'
                  name='group'
                  id={group.id} checked={getGroupValue() === group.value}
                  onChange={[handleGroupChange, group.value]}
                />
                <label for={group.id}>{group.label}</label>
              </span>)}
            </For>
          </div>
          <button class={styles.right} onClick={handleClearClick}>Clear completed</button>
        </div>
      </div>
    </div >
  );
};

export default App;
