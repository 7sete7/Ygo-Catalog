import React, { Component } from 'react';
import env from '../../config';

export default class Card_Info extends Component
{
  constructor(props){
    super(props);
    this.state = { card: null };
  }

  async componentWillMount(){
    if(env.CACHE.get("cards")){
      let carta = env.CACHE.get("cards").filter(c => c.name === this.props.name);

      if(!carta || !carta.length){
        let [c,] = await this.getCarta();
        let aux = env.CACHE.get("cards");
        this.setState({ card: aux.push(c) });
        env.CACHE.put("cards", aux, 8 * 60 * 60 * 1000);
      }
      else
        this.setState({ card: carta });
    }
    else{
      let [c,] = await this.getCarta();
      this.setState({ card: env.CACHE.put("cards", c, 10 * 60 * 60 * 1000) });
    }
    console.log(env.CACHE.get("cards"));
  }

  render(){
    return (<div></div>);
  }

  async getCarta(){
    try{
      let response = await fetch(`${env.API_URL}/cards/name/${this.props.name}`);
      if(!response) throw new URIError(`Carta ${this.props.name} não encontrada!`);

      let card = await response.json();
      if(!card || !card.length) throw new URIError(`Carta ${this.props.name} não encontrada!`);

      return [card,];
    }
    catch(e){
      console.error(`Erro pegando carta: `, e.message);
    }
  }
}
