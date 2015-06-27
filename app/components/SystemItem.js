import React, {Component} from "react";


class SystemItem extends Component {
  render() {
    return (
      <p>
        This is a {this.props.type} curretly at level {this.props.level}
      </p>
    );
  }
}

export default SystemItem;

