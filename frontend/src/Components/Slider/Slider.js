import React, { Component } from 'react';
import Carousel from 'react-slick';

export default class Slider extends Component
{
  constructor(props){
    super(props);
    this.slider_settings = {
      dots: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
    }
  }

  render(){
    return (
      <Carousel {...this.slider_settings}>
        <div>
          <img src="https://avatars1.githubusercontent.com/u/6656555" />
          <p>Leo</p>
        </div>
        <div>
          <img src="https://avatars0.githubusercontent.com/u/31394736" />
          <p>Leo</p>
        </div>
      </Carousel>
    );
  }
}
