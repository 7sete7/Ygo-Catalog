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
          <div>Card name: {this.state.card.name}</div>
          <div>Card number: {this.state.card.number}</div>
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
