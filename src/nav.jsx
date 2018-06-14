import React, {Component} from 'react';

class Nav extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const total = this.props.total;
    const totalUserMSG = (total > 1) ? `${ total } users online` : `${ total } user online`;
    return (
      <nav className="navbar">
        <a href="/" className="navbar-brand">Chatty</a><span className="total">{totalUserMSG}</span>
      </nav>
    );
  }
}

export default Nav;