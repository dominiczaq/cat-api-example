import React from "react";
import { Route, Redirect } from "react-router-dom";
import Random from "./Random";
import Gallery from "./Gallery";

export default function Content() {
  return (
    <div className="content">
      <Route path="/" exact render={() => <Redirect to="/random" />} />
      <Route path="/random/" component={Random} />
      <Route path="/gallery/" component={Gallery} />
    </div>
  );
}
