import React, { Component } from 'react';
import { Container } from 'reactstrap';

import Slider from '../../Components/Slider';
import CardInfo from '../../Components/CardInfo';

export default class Home extends Component
{
  constructor(props){
    super(props);
    this.state = { cardInfoCard: null };
    this.onImageClick = this.onImageClick.bind(this);
  }

  render(){
    return (
      <Container fluid className="p-0">
        <CardInfo card={this.state.cardInfoCard}/>
        <Slider onImageClick={this.onImageClick}/>
      </Container>
    );
  }

  onImageClick(e, data){
    this.setState({ cardInfoCard: data });
  }
}
