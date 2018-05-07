import React, { Component } from 'react';
import { Container } from 'reactstrap';

import Slider from '../../Components/Slider';

export default class Home extends Component
{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <Container>
        <Slider />
      </Container>
    );
  }
}
