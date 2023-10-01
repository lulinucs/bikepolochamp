import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function TabelaClassificacaoComponent() {
  const [equipes, setEquipes] = useState([]);

  useEffect(() => {
    const fetchEquipes   = async () => {
      try {
        const equipesData = await AsyncStorage.getItem('equipes');
        if (equipesData) {
          setEquipes(JSON.parse(equipesData));
        }
      } catch (error) {
        console.error('Erro ao buscar equipes:', error);
      }
    };

    fetchEquipes();
  }, []);

  const ordenarEquipes = (equipes) => {
    // Ordena as equipes por pontos e saldo de gols
    return equipes.sort((a, b) => {
      if (a.pontos !== b.pontos) {
        return b.pontos - a.pontos;
      } else {
        const saldoA = a.golsFeitos - a.golsSofridos;
        const saldoB = b.golsFeitos - b.golsSofridos;
        return saldoB - saldoA;
      }
    });
  };

  // Função para retornar as informações de classificação
  const obterInformacoesDeClassificacao = () => {
    const equipesOrdenadas = ordenarEquipes(equipes);
    const classificacao = [];

    equipesOrdenadas.forEach((equipe, index) => {
      classificacao.push({ colocacao: index + 1, nomeEquipe: equipe.nomeEquipe });
    });

    return classificacao;
  };

  // Salvar as informações de classificação no AsyncStorage
  useEffect(() => {
    const salvarInformacoesNoAsyncStorage = async () => {
      const classificacao = obterInformacoesDeClassificacao();
      try {
        await AsyncStorage.setItem('classificacao', JSON.stringify(classificacao));
      } catch (error) {
        console.error('Erro ao salvar informações de classificação no AsyncStorage:', error);
      }
    };

    salvarInformacoesNoAsyncStorage();
  }, [equipes]);

  return (
    <ScrollView>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Posição</Text>
        <Text style={styles.header}>Time</Text>
        <Text style={styles.header}>Pontos</Text>
        <Text style={styles.header}>Vitórias</Text>
        <Text style={styles.header}>Saldo de Gols</Text>
      </View>
      {ordenarEquipes(equipes).map((equipe, index) => (
        <View key={equipe.nomeEquipe} style={styles.row}>
          <Text style={styles.cell}>{index + 1}</Text>
          <Text style={styles.cell}>{equipe.nomeEquipe}</Text>
          <Text style={styles.cell}>{equipe.pontos}</Text>
          <Text style={styles.cell}>{equipe.vitorias}</Text>
          <Text style={styles.cell}>{equipe.golsFeitos - equipe.golsSofridos}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    borderTopWidth: 1,
    borderTopColor: 'gray',
  },
  header: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default TabelaClassificacaoComponent;
