import React, { Component } from 'react';
import { Container } from 'reactstrap';
import env from '../../config';

import './Style.css';

export default class Card_Info extends Component
{
  constructor(props){
    super(props);
    this.state = { card: props.card };
  }

  // async componentWillMount(){
  //   if(env.CACHE[]"cards")){
  //     let carta = env.CACHE.get("cards").filter(c => c.name === this.props.name);
  //
  //     if(!carta || !carta.length){
  //       let [c,] = await this.getCarta();
  //       let aux = env.CACHE.get("cards");
  //       this.setState({ card: aux.push(c) });
  //       env.CACHE.put("cards", aux, 8 * 60 * 60 * 1000);
  //     }
  //     else
  //       this.setState({ card: carta });
  //   }
  //   else{
  //     let [c,] = await this.getCarta();
  //     this.setState({ card: env.CACHE.put("cards", c, 10 * 60 * 60 * 1000) });
  //   }
  //   console.log(env.CACHE.get("cards"));
  // }



  render(){
    let card = this.props.card;

    if(!card)
      return(<div></div>);
    return (
      <Container fluid className="cardInfo row my-2 no-gutters">
        <div className="col-3">
          <img src={card.image_path} width="200px" alt="Imagem"/>
        </div>
        <div className="col-2"></div>
        <Container className="col row my-3">
          <span className="col-5">Nome:     {card.name    || "Não informado"}</span>
          <span className="col-5">Ataque:   {card.attack  || "Não informado"}</span>
          <span className="col-5">Número:   {card.number  || "Não informado"}</span>
          <span className="col-5">Defesa:   {card.defense || "Não informado"}</span>
          <span className="col-5">Tipo:     {card.type    || "Não informado"}</span>
          <span className="col-5">Estrelas: {card.stars   || "Não informado"}</span>
        </Container>
        <span className="linkCarta"><a href="#">Ir para carta -></a></span>
      </Container>
    );
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
