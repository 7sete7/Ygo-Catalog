import React, { Component } from 'react';
import { Container } from 'reactstrap';

import Slider from '../../Components/Slider';

export default class Home extends Component
{

  render(){
    return (
      <Container fluid className="p-0">
        <Slider />
      </Container>
    );
  }
}
