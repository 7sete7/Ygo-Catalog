import React, { Component } from 'react';
import Carousel from 'react-slick';
import { Container } from 'reactstrap';
import env from '../../config';
import './css.css';

export default class Slider extends Component
{
  constructor(props){
    super(props);
    this.slider_settings = {
      dots: false,
      infinite: true,
      slidesToShow: 8,
      slidesToScroll: 3,
  	  adaptiveHeight: false,
  	  focusOnSelect: true,
      centerMode: true,
      autoplaySpeed: 2500,
      autoplay: true,
      speed: 2500,
      pauseOnFocus: true,
    }
    this.state = {cards: null};
  }

  componentDidMount(){
    if(env.CACHE.keys().indexOf("slider_cards") < 0){
      fetch(`${env.API_URL}/cards?orderBy=price_high&limit=30`)
      .then(res => res.json())
      .then(json => this.setState({cards: env.CACHE.put("slider_cards", json, 10 * 60 * 60 * 1000)}))
      .catch(e => console.log(e));
    }
    else
      this.setState({cards: env.CACHE.get("slider_cards")});
  }

  render(){
    if(!this.state.cards){
      return(
        <Carousel {...this.slider_settings}>
          <div className="text-center">Carregando!</div>
        </Carousel>
    )}
    else{
      return(
        <Carousel {...this.slider_settings} className="slider">
          {this.thumbs()}
        </Carousel>
      )
    }
  }

  thumbs(){
    return this.state.cards.map((card, key) => {
      return (
        <div key={key}>
          <img src={card.image_path} alt="Imagem" width="110px"/>
        </div>
      )
    });
  }
}
