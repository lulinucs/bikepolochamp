import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DoubleEliminationComponent2 from './DoubleEliminationComponent2';

function DoubleEliminationComponent() {
  const [tabelaJogos, setTabelaJogos] = useState([]);
  const [classificacao, setClassificacao] = useState([]);

  useEffect(() => {
    const fetchClassificacao = async () => {
      try {
        const classificacaoData = await AsyncStorage.getItem('classificacao');
        if (classificacaoData) {
          const classificacao = JSON.parse(classificacaoData);
          setClassificacao(classificacao);
        }
      } catch (error) {
        console.error('Erro ao buscar classificação:', error);
      }
    };

    fetchClassificacao();
  }, []);

  useEffect(() => {
    const loadResultados = async () => {
      try {
        // Carregue os resultados salvos do AsyncStorage
        const resultadosData = await AsyncStorage.getItem('resultados');
        if (resultadosData) {
          const resultados = JSON.parse(resultadosData);
          setTabelaJogos(resultados);
        }
      } catch (error) {
        console.error('Erro ao carregar resultados do AsyncStorage:', error);
      }
    };

    // Chame a função para carregar resultados quando o componente for montado
    loadResultados();
  }, []);

  const gerarTabelaJogos = () => {
    // Verifique se a classificação tem pelo menos 4 equipes
    if (classificacao.length < 4) {
      console.error('Não há equipes suficientes para gerar a tabela de jogos.');
      return;
    }

    // Adicione um Alert para avisar que os resultados serão zerados
    Alert.alert(
      'Aviso',
      'Ao gerar a tabela, os resultados atuais serão zerados. Deseja continuar?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Continuar',
          onPress: () => {
            // Gere a tabela de jogos com os times 1º colocado x 4º colocado e 2º colocado x 3º colocado
            const jogos = [
              {
                partida: 'Jogo 1',
                time1: classificacao[0].nomeEquipe,
                time2: classificacao[3].nomeEquipe,
                golsTime1: '',
                golsTime2: '',
              },
              {
                partida: 'Jogo 2',
                time1: classificacao[1].nomeEquipe,
                time2: classificacao[2].nomeEquipe,
                golsTime1: '',
                golsTime2: '',
              },
            ];

            setTabelaJogos(jogos);
          },
        },
      ]
    );
  };

  const salvarResultados = async () => {
    // Verifique se todos os resultados foram preenchidos
    for (const jogo of tabelaJogos) {
      if (jogo.golsTime1 === '' || jogo.golsTime2 === '') {
        console.error('Preencha todos os resultados antes de salvar.');
        return;
      }
    }

    try {
      // Converta a tabela de jogos para uma string JSON
      const resultadosJSON = JSON.stringify(tabelaJogos);

      // Salve a string JSON no AsyncStorage com uma chave
      await AsyncStorage.setItem('resultados', resultadosJSON);

      console.log('Resultados salvos no AsyncStorage:', tabelaJogos);
    } catch (error) {
      console.error('Erro ao salvar resultados no AsyncStorage:', error);
    }
  };

  return (
    <View>
      <Button title="Gerar Tabela" onPress={gerarTabelaJogos} />
      {tabelaJogos.slice(0,2).map((jogo, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.cell}>{jogo.partida}</Text>
          <Text style={styles.cell}>{jogo.time1}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Gols"
            value={jogo.golsTime1}
            onChangeText={(text) => {
              const updatedJogos = [...tabelaJogos];
              updatedJogos[index].golsTime1 = text;
              setTabelaJogos(updatedJogos);
            }}
          />
          <Text style={styles.cell}>x</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Gols"
            value={jogo.golsTime2}
            onChangeText={(text) => {
              const updatedJogos = [...tabelaJogos];
              updatedJogos[index].golsTime2 = text;
              setTabelaJogos(updatedJogos);
            }}
          />
          <Text style={styles.cell}>{jogo.time2}</Text>
        </View>
      ))}
      <Button title="Salvar Resultados" onPress={salvarResultados} />
      <DoubleEliminationComponent2 />
    </View>
  );
}

const styles = StyleSheet.create({
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
  input: {
    flex: 1,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default DoubleEliminationComponent;
