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
  	  focusOnSelect: false,
      centerMode: true,
      autoplaySpeed: 2500,
      autoplay: true,
      speed: 2500,
      pauseOnFocus: true,
    }
    this.state = {cards: null};
  }

  componentDidMount(){
    if(!env.CACHE.get("cards")){
      fetch(`${env.API_URL}/cards?orderBy=price_high&limit=10`)
        .then(res => res.json())
        .then(json => {
          let cardsCache = env.CACHE.add({key: "cards", value: json, time: 10 * 60 * 60 * 1000});
          this.setState({cards: cardsCache});
        })
        .catch(e => console.log(e));
    }
    else
      this.setState({cards: env.CACHE.deepGet("cards", null, cartas => {
        return cartas
        .concat()
        .sort((a, b) => a.price_high - b.price_high)
        .slice(0, 20);
      })});
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
          <img src={card.image_path} alt="Imagem" width="110px" onClick={(e) => this.props.onImageClick(e, card)}/>
        </div>
      )
    });
  }
}
