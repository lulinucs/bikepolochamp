import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EquipeForm from './EquipeForm';

class ListaEquipes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      equipes: [],
      editingIndex: null, // Para controlar qual equipe está sendo editada
    };

    // Defina a função onEquipeCadastrada dentro do construtor
    this.handleEquipeCadastrada = async () => {
      // Carregar as equipes do AsyncStorage
      const equipes = await AsyncStorage.getItem('equipes');
      if (equipes) {
        this.setState({ equipes: JSON.parse(equipes) });
      }
    };
  }

  async componentDidMount() {
    // Carregar as equipes do AsyncStorage
    const equipes = await AsyncStorage.getItem('equipes');
    if (equipes) {
      this.setState({ equipes: JSON.parse(equipes) });
    }
  }

  handleRemoveEquipe = async (index) => {
    // Remover a equipe da lista
    const equipes = [...this.state.equipes];
    equipes.splice(index, 1);

    // Atualizar o estado e remover do AsyncStorage
    this.setState({ equipes });
    await AsyncStorage.setItem('equipes', JSON.stringify(equipes));

    // Remover a tabela de jogos do AsyncStorage
  await AsyncStorage.removeItem('tabelaJogos');
  }

  handleEditEquipe = (index) => {
    // Iniciar a edição da equipe definindo o índice de edição
    this.setState({ editingIndex: index });
  }

  handleSaveEquipe = async (index) => {
    // Parar a edição da equipe definindo o índice de edição como nulo
    this.setState({ editingIndex: null });

    // Obter a equipe editada
    const editedEquipe = this.state.equipes[index];

    // Salvar a equipe editada no AsyncStorage
    const equipes = [...this.state.equipes];
    equipes[index] = editedEquipe;
    await AsyncStorage.setItem('equipes', JSON.stringify(equipes));
  }

  handleEditChange = (index, fieldName, text) => {
    // Atualizar o nome da equipe ou do jogador editado temporariamente
    const editedEquipe = { ...this.state.equipes[index] };
    editedEquipe[fieldName] = text;

    // Atualizar o estado com a equipe editada
    const equipes = [...this.state.equipes];
    equipes[index] = editedEquipe;
    this.setState({ equipes });
  }

  renderEquipes() {
    return this.state.equipes.map((equipe, index) => (
      <View key={index} style={styles.card}>
        {this.state.editingIndex === index ? (
          <TextInput
            style={styles.input}
            onChangeText={(text) => this.handleEditChange(index, 'nomeEquipe', text)}
            value={equipe.nomeEquipe}
          />
        ) : (
          <Text>Nome da Equipe: {equipe.nomeEquipe}</Text>
        )}

        {Array.from({ length: 3 }).map((_, jogadorIndex) => (
          <View key={jogadorIndex}>
            {this.state.editingIndex === index ? (
              <TextInput
                style={styles.input}
                onChangeText={(text) => this.handleEditChange(index, `jogador${jogadorIndex + 1}`, text)}
                value={equipe[`jogador${jogadorIndex + 1}`]}
              />
            ) : (
              <Text>Jogador {jogadorIndex + 1}: {equipe[`jogador${jogadorIndex + 1}`]}</Text>
            )}
          </View>
        ))}

        <View style={styles.buttonsContainer}>
          {this.state.editingIndex === index ? (
            <TouchableOpacity
              onPress={() => this.handleSaveEquipe(index)}
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>Salvar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => this.handleEditEquipe(index)}
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => this.handleRemoveEquipe(index)}
            style={styles.removeButton}
          >
            <Text style={styles.removeButtonText}>Remover</Text>
          </TouchableOpacity>
        </View>
      </View>
    ));
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <EquipeForm onEquipeCadastrada={this.handleEquipeCadastrada} />
        {this.state.equipes.length > 0 ? (
          this.renderEquipes()
        ) : (
          <Text>Nenhuma equipe cadastrada ainda.</Text>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
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
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: 'blue',
    borderRadius: 5,
    padding: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 8,
    alignItems: 'center',
    flex: 1,
    marginLeft: 5,
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ListaEquipes;
