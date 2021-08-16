import "./css/output.css";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const rootId = "root";
const rootElement = document.getElementById(rootId);

if (!rootElement) {
  throw new Error(`Unable to find element with id '${rootId}'`);
}

ReactDOM.render(<App />, rootElement);
