import React from "react";
import {root} from "baobab-react/decorators";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap-theme.css";

import tree from "./tree";
import Storage from "./Storage";
import LiveList from "./components/LiveList";
import LiveLevel from "./components/LiveLevel";
import styles from "./mainApp.css";

tree.on("update", function(e) {
  var newData = e.data.data;
  Storage.store(newData);
});

Storage.onUpdate(function(data) {
  tree.set(data);
});



@root(tree)
class Application extends React.Component {
  render() {
    return (
      <div>
        <LiveList></LiveList>
        <LiveLevel></LiveLevel>
      </div>
    );
  }
}

React.render(
    <Application />,
    document.getElementById("content")
);
