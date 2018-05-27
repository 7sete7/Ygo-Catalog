import React, { Component } from 'react';
import axios from 'axios';

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
    let response = await axios.get(`http://localhost:8080/api/cards/name/${this.props.name}`);
    console.log(response);
    return response.data;
  }
}
