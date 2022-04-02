import type { Component } from 'solid-js';
import { createSignal, Show } from 'solid-js'

import styles from './App.module.css';

const App: Component = () => {
  const [showGetter, setShow] = createSignal(false)

  const handleClick = () => {
    setShow((prev) => !prev)
  }

  return (
    <div class={styles.App}>
      <button onClick={handleClick}>switch</button>
      <Show when={showGetter()}>
        show
      </Show>
    </div>
  );
};

export default App;
