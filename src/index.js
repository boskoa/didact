/** @jsxRuntime classic */
import Didact from "./didact";

/** @jsx Didact.createElement */
const element = (
  <div id="foo">
    <span>bar</span>
    <b />
  </div>
);

const container = document.getElementById("root");

Didact.render(element, container);
