/**
 * Copyright 2022, Yoshi Jaeger at DigiCorp Labs
 */

import React from "react";
import { render } from "react-dom";
import { Main } from "./page/Main";

const App = () => {
  return <Main />;
};

render(<App />, document.getElementById("app-options"));
