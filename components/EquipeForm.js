import React, { Component } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class EquipeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nomeEquipe: '',
      jogador1: '',
      jogador2: '',
      jogador3: '',
    };
  }

  handleNomeEquipeChange = (text) => {
    this.setState({ nomeEquipe: text });
  }

  handleJogador1Change = (text) => {
    this.setState({ jogador1: text });
  }

  handleJogador2Change = (text) => {
    this.setState({ jogador2: text });
  }

  handleJogador3Change = (text) => {
    this.setState({ jogador3: text });
  }

  handleSubmit = async () => {
    const { nomeEquipe, jogador1, jogador2, jogador3 } = this.state;

    // Criar objeto de equipe
    const equipe = {
      nomeEquipe,
      jogador1,
      jogador2,
      jogador3,
    };

    // Obter equipes existentes do AsyncStorage
    let equipes = await AsyncStorage.getItem('equipes');
    equipes = equipes ? JSON.parse(equipes) : [];

    // Adicionar a nova equipe à lista
    equipes.push(equipe);

    // Salvar a lista atualizada no AsyncStorage
    await AsyncStorage.setItem('equipes', JSON.stringify(equipes));

    await AsyncStorage.removeItem('tabelaJogos');

    // Chame a função onEquipeCadastrada para atualizar o ListaEquipes
    this.props.onEquipeCadastrada();

    // Resetar os campos após o envio (opcional)
    this.setState({
      nomeEquipe: '',
      jogador1: '',
      jogador2: '',
      jogador3: '',
    });
  }

  render() {
    return (
      <View style={styles.card}>
        <Text>Nome da Equipe:</Text>
        <TextInput
          style={styles.input}
          onChangeText={this.handleNomeEquipeChange}
          value={this.state.nomeEquipe}
        />

        <Text>Jogador 1:</Text>
        <TextInput
          style={styles.input}
          onChangeText={this.handleJogador1Change}
          value={this.state.jogador1}
        />

        <Text>Jogador 2:</Text>
        <TextInput
          style={styles.input}
          onChangeText={this.handleJogador2Change}
          value={this.state.jogador2}
        />

        <Text>Jogador 3:</Text>
        <TextInput
          style={styles.input}
          onChangeText={this.handleJogador3Change}
          value={this.state.jogador3}
        />

        <Button
          title="Cadastrar Equipe"
          onPress={this.handleSubmit}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    height: 40,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
  },
});

export default EquipeForm;
