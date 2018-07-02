import React, { Component } from 'react';
import Carousel from 'react-slick';
import conf from '../../config';
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
      centerMode: false,
      autoplaySpeed: 2500,
      autoplay: true,
      speed: 2500,
      pauseOnFocus: true,
    }
    this.state = {cards: null};
  }

  componentDidMount(){
    if(!conf.CACHE.get("cards") || (conf.CACHE.get("cards") && conf.CACHE.get("cards").length < 10)){
      fetch(`${conf.API_URL}/cards?orderBy=price_high%20desc&limit=10`)
       .then(response => response.json())
       .then(data => {
          let cardsCache = conf.CACHE.add({key: "cards", value: data, time: 10 * 60 * 60 * 1000});
          this.setState({cards: cardsCache});
        })
        .catch(e => console.log(e));
    }
    else
      this.setState({cards: conf.CACHE.deepGet("cards", null, cartas => {
        return cartas
        .concat()
        .sort((a, b) => b.price_high - a.price_high)
        .slice(0, 20);
      })});
    this.props.whenLoaded(this.state.cards);
  }

  render(){
    if(!this.state.cards)
      return(<div></div>)
    else{
      return(
        <Carousel {...this.slider_settings} className="slider">
          {this.initCards()}
        </Carousel>
      )
    }
  }

  initCards(){
    return this.state.cards.map((card, key) => {
      return (
        <div key={key}>
          <img src={card.image_path} alt="Imagem" width="110px" onClick={(e) => this.props.onImageClick(e, card)}/>
        </div>
      )
    });
  }
}
