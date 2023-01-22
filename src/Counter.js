/** @jsxRuntime classic */
import Didact from "./didact";

/** @jsx Didact.createElement */
function Counter() {
  const [counter, setCounter] = Didact.useState(0);

  return (
    <div>
      <p>{counter}</p>
      <button onClick={() => setCounter((prev) => prev + 1)}>increase</button>
    </div>
  );
}

export default Counter;
