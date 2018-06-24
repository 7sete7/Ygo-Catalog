import React, { Component } from 'react';
import { Container, Alert, Card, CardBody, CardFooter, CardHeader, CardImg, Fade } from 'reactstrap';
import conf from '../../config.js';

import './Style.css';

export default class Card_Info extends Component
{

  render(){
    let card = this.props.card;


    if(!card)
      return(<Alert color="danger">Algo de errado não está certo...</Alert>);

    return (

        <Card className="animated fadeIn card-accent-success">
          <CardHeader>
            { card.name }
          </CardHeader>
          <CardBody className="row">
            <img src={card.image_path} alt="Imagem da carta" className="col cardImg"/>
            <Container className="col-8 row">

              <span className="col-md-4 col-sm-12">
                <i className="icons icon-sword"></i>
                <span className="value">{card.attack  || "Não informado"}</span>
              </span>

              <span className="col-md-4 col-sm-12">
                <i className="icons icon-shield"></i>
                <span className="value">{card.defense || "Não informado"}</span>
              </span>

            </Container>
          </CardBody>


        </Card>
                 /*
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
               */

    );
  }

}
