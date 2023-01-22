/** @jsxRuntime classic */
import App from "./App";
import Counter from "./Counter";
import Didact from "./didact";

/** @jsx Didact.createElement */
const element = (
  <div id="foo">
    <span>bar</span>
    <b />
    <App name={"MARK"} />
    <Counter />
  </div>
);

const container = document.getElementById("root");

Didact.render(element, container);
