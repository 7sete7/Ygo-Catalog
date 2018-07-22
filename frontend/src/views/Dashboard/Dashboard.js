import React, { Component } from 'react';
import { Container } from 'reactstrap';

import Slider from '../../Components/Slider';
import CardInfo from '../../Components/CardInfo';

import { AuthService } from '../../Components/AuthService';
const Auth = new AuthService();

export default class Home extends Component
{
  constructor(props){
    super(props);
    this.state = { cardInfoCard: null, initialCard: null };

    this.onImageClick = this.onImageClick.bind(this);
    this.initial = this.initial.bind(this);

    this.state.name = "KARALHO";
    this.data();
  }

  render(){
    return (
      <div>OI {this.state.name}</div>
    );
  }

  async data(){
    let data = await Auth.getUserData();
    this.setState({name: data.auth.nome});
  }

  onImageClick(e, data){
    this.setState({ cardInfoCard: data });
  }

  initial(data){
    this.setState({ initialCard: data });
  }
}
