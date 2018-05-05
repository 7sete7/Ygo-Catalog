import React, { Component } from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import 'font-awesome/css/font-awesome.min.css'
import nav from './NavItens';

import SidebarHeader from '../SidebarHeader';

export default class Sidebar extends Component
{
  constructor(props){
    super(props);

    this.toggle = this.toggle.bind(this);
    this.isCurrent = this.isCurrent.bind(this);
    this.state = { navOpen: true };
  }

  toggle(){
    this.setState({navOpen: !this.state.navOpen});
  }

  render(){
    return (
      <div id="wrapper">
        <nav className="sidebar-nav">
          <SidebarHeader />
          <Nav>
            {this.item(nav.itens)}
          </Nav>
        </nav>
      </div>
    );
  }

  item(itens){
    return itens.map((item, key) => {
      return (
        <div key={key} className="itens">
          <NavItem>
            <Link to={item.url} className={this.isCurrent(item)}>
              <span className={item.icon}></span>&nbsp;
              {item.name}
            </Link>
          </NavItem>
        </div>
      );
    });
  }

  isCurrent({url}){
    return window.location.hash.substring(1) == url ? "active" : "";
  }
}
