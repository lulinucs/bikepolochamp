import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DoubleEliminationComponent3 from './DoubleEliminationComponent3';

function DoubleEliminationComponent2() {
  const [tabelaJogos, setTabelaJogos] = useState([]);
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    const loadResultados = async () => {
      try {
        const resultadosData = await AsyncStorage.getItem('resultados');
        if (resultadosData) {
          const resultados = JSON.parse(resultadosData);
          setResultados(resultados);

          // Verifique se há resultados para os jogos 3 e 4
          if (resultados.length >= 4) {
            // Carregue os resultados dos jogos 3 e 4 a partir do estado resultados
            const jogos3e4 = resultados.slice(2, 4);
            setTabelaJogos(jogos3e4);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar resultados do AsyncStorage:', error);
      }
    };

    loadResultados();
  }, []);

  const gerarTabelaJogos2 = () => {
    // Verifique se há resultados para os jogos anteriores
    if (resultados.length < 2) {
      console.error('Não há resultados suficientes para gerar a tabela de jogos.');
      return;
    }

    // Calcule os vencedores e perdedores dos jogos anteriores
    const vencedorJogo1 = resultados[0].golsTime1 > resultados[0].golsTime2 ? resultados[0].time1 : resultados[0].time2;
    const vencedorJogo2 = resultados[1].golsTime1 > resultados[1].golsTime2 ? resultados[1].time1 : resultados[1].time2;
    const perdedorJogo1 = resultados[0].golsTime1 > resultados[0].golsTime2 ? resultados[0].time2 : resultados[0].time1;
    const perdedorJogo2 = resultados[1].golsTime1 > resultados[1].golsTime2 ? resultados[1].time2 : resultados[1].time1;

    

    // Crie os jogos 3 e 4
    const jogos = [
      {
        partida: 'Jogo 3',
        time1: vencedorJogo1,
        time2: vencedorJogo2,
        golsTime1: '',
        golsTime2: '',
      },
      {
        partida: 'Jogo 4',
        time1: perdedorJogo1,
        time2: perdedorJogo2,
        golsTime1: '',
        golsTime2: '',
      },
    ];

    setTabelaJogos(jogos);
  };

  const salvarResultados2 = async () => {
    // Verifique se todos os resultados dos jogos 3 e 4 foram preenchidos
    if (
      tabelaJogos[0]?.golsTime1 === '' ||
      tabelaJogos[0]?.golsTime2 === '' ||
      tabelaJogos[1]?.golsTime1 === '' ||
      tabelaJogos[1]?.golsTime2 === ''
    ) {
      console.error('Preencha todos os resultados dos jogos 3 e 4 antes de salvar.');
      return;
    }

    try {
      // Combine os resultados dos jogos 3 e 4 com os resultados anteriores
      const novosResultados = resultados.concat(tabelaJogos);

      // Converta a tabela de jogos para uma string JSON
      const resultadosJSON = JSON.stringify(novosResultados);

      // Salve a string JSON no AsyncStorage com a mesma chave 'resultados'
      await AsyncStorage.setItem('resultados', resultadosJSON);

      console.log('Resultados atualizados no AsyncStorage:', novosResultados);
    } catch (error) {
      console.error('Erro ao salvar resultados no AsyncStorage:', error);
    }
  };

  return (
    <View>
      <Button title="Avançar Fase" onPress={gerarTabelaJogos2} />
      {tabelaJogos.map((jogo, index) => (
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
      <Button title="Salvar Resultados 2" onPress={salvarResultados2} />
      <DoubleEliminationComponent3 />
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

export default DoubleEliminationComponent2;