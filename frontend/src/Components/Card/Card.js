import React, { Component } from 'react';

export default class Card extends Component
{
  constructor(props){
    super(props);
    this.state = {card: null};
  }

  componentDidMount(){
    this.getCard()
    .then(data => this.setState({card: data[0]}))
    .catch();
  }

  render() {
    if(!this.state.card){
      return (
        <div>Carregando...</div>
      );
    }
    else{
      return(
        <div>
          <img src={{this.state.card.image_path}} alt="Carta" />
        </div>
      )
    }
  }

  async getCard(){
    let response = await fetch(`http://localhost:8080/api/cards/name/${this.props.name}`);
    let card = await response.json();
    console.log(card);
    return card;
  }
}
