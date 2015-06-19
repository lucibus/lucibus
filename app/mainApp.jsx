import React from "react";
import {root} from "baobab-react/decorators";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap-theme.css";

import Tree from "./tree";
import LiveList from "./components/LiveList";


@root(Tree)
class Application extends React.Component {
  render() {
    return (
      <div className="container">
        <LiveList></LiveList>
      </div>
    );
  }
}

React.render(
    <Application />,
    document.getElementById("content")
);
