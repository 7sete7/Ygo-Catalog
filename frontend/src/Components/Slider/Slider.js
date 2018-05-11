import React, { Component } from 'react';
import Carousel from 'react-slick';
import './css.css';

export default class Slider extends Component
{
  constructor(props){
    super(props);
    this.slider_settings = {
      dots: true,
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1,
	  adaptiveHeight: false,
	  focusOnSelect: true,
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
          <p>Du</p>
        </div>
		<div>
          <img src="https://avatars1.githubusercontent.com/u/6656555" />
          <p>Leo</p>
        </div>
        <div>
          <img src="https://avatars0.githubusercontent.com/u/31394736" />
          <p>Du</p>
        </div>
      </Carousel>
    );
  }
}
