import React, { Component } from 'react';
import { Container } from 'reactstrap';

import Slider from '../../Components/Slider';
import CardInfo from '../../Components/CardInfo';

export default class Home extends Component
{

  render(){
    return (
      <Container fluid className="p-0">
        <CardInfo name="Metal Fish"/>
        <Slider />
      </Container>
    );
  }
}
