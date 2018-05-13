import React, { Component } from 'react';
import env from '../../config';

export default class Card_Info extends Component
{
  constructor(props){
    super(props);
    this.state = { card: null };
  }

  componentWillMount(){
    if(env.CACHE.keys()["cards"]){
      let carta = env.CACHE.cards.filter(c => c.name === this.props.name);
      if(card && card.length)
        this.setState({ card: carta });
      else{

      }
    }
  }

  async getCarta(){
    let card = await fetch(`${env.API_URL}/card/name/${this.props.name}`);
  }
}
