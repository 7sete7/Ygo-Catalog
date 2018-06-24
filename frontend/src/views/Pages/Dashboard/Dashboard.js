import React, { Component } from 'react';
import { Container } from 'reactstrap';

import Slider from '../../../Components/Slider';
import CardInfo from '../../../Components/CardInfo';

export default class Home extends Component
{
  constructor(props){
    super(props);
    this.state = { cardInfoCard: null, initialCard: null };

    this.onImageClick = this.onImageClick.bind(this);
    this.initial = this.initial.bind(this);
  }

  render(){
    return (
      <Container fluid className="p-0">
        <CardInfo card={this.state.cardInfoCard} initialCard={this.state.initialCard}/>
        <Slider onImageClick={this.onImageClick} whenLoaded={this.initial}/>
      </Container>
    );
  }

  onImageClick(e, data){
    this.setState({ cardInfoCard: data });
  }

  initial(data){
    this.setState({ initialCard: data });
  }
}
