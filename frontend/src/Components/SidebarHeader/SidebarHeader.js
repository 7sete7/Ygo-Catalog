import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Style.css';

export default class SidebarHeader extends Component
{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div>
        <div className="sidebar-header text-center">
          <h2>
            <Link to="/">YGO</Link>
          </h2>
        </div>
        <hr className="header-hr"/>
      </div>
    );
  }
}
