function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createDom(fiber) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  const isProperty = (key) => key !== "children";
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((name) => (dom[name] = fiber.props[name]));
  console.log("CREATE DOM", dom);
  return dom;
}

function commitRoot() {
  commitWork(wipRoot.child);
  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  const domParent = fiber.parent.dom;
  domParent.appendChild(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
  };

  nextUnitOfWork = wipRoot;
}

let nextUnitOfWork = null;
let wipRoot = null;

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function performUnitOfWork(fiber) {
  // add dom node
  const entry = { ...fiber };
  console.log("ENTRY", entry);
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  /*
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }
  */
  // create new fibers
  const elements = fiber.props.children;
  console.log("ELEMENTS", elements);
  let index = 0;
  let prevSibling = null;

  while (index < elements.length) {
    const element = elements[index];

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };
    console.log("FOOFOO", prevSibling);
    if (index === 0) {
      fiber.child = newFiber;
      console.log("INDEX 0", fiber);
    } else {
      prevSibling.sibling = newFiber;
      console.log("PREV SIBLING", { ...prevSibling }, fiber);
    }

    prevSibling = newFiber;
    index++;
  }
  // return next unit of work
  if (fiber.child) {
    const fibChil = { ...fiber.child };
    console.log("HAS CHILD", fibChil);
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      console.log("HAS SIBLING", nextFiber);
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
  console.log("FINAL", fiber);
}

const Didact = {
  createElement,
  render,
};

export default Didact;
