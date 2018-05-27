import React, { Component } from 'react';
import { Container } from 'reactstrap';
import conf from '../../config.js';

import './Style.css';

export default class Card_Info extends Component
{

  render(){
    let card = this.props.card;

    if(!card)
      return(<div></div>);

    return (
      <Container fluid className="cardInfo row my-2 m-0">
        <div className="col-3 ml-5">
          <img src={card.image_path} width="200px" alt="Imagem"/>
        </div>
        <Container className="col my-3 info">
          <div className="row mt-3">
            <span className="col-4">Nome:     <p className="value">{card.name    || "Não informado"}</p></span>
            <span className="col-4">Ataque:   <p className="value">{card.attack  || "Não informado"}</p></span>
            <span className="col-4">Número:   <p className="value">{card.number  || "Não informado"}</p></span>
          </div>
          <div className="h-25"></div>
          <div className="row mt-3">
            <span className="col-4">Defesa:   <p className="value">{card.defense || "Não informado"}</p></span>
            <span className="col-4">Tipo:     <p className="value">{card.type    || "Não informado"}</p></span>
            <span className="col-4">Estrelas: <p className="value">{card.stars   || "Não informado"}</p></span>
          </div>
          <span className="linkCarta hidden-sm-down">
            <a className="mr-3 text-primary" href="javascript:;">Ir para carta</a>
          </span>
        </Container>
      </Container>
    );
  }

}
