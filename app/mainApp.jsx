import React from "react";
import {root} from "baobab-react/decorators";

import Tree from "./tree";
import StateList from "./components/StateList";

@root(Tree)
class Application extends React.Component {
  render() {
    return (
      <div>
        <StateList></StateList>
      </div>
    );
  }
}

React.render(
    <Application />,
    document.getElementById("content")
);
