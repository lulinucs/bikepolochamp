import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DoubleEliminationComponent5 from './DoubleEliminationComponent5';

function DoubleEliminationComponent4() {
  const [tabelaJogos, setTabelaJogos] = useState([]); // Defina um estado inicial vazio
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    const loadResultados = async () => {
      try {
        // Carregue os resultados salvos do AsyncStorage
        const resultadosData = await AsyncStorage.getItem('resultados');
        if (resultadosData) {
          const resultados = JSON.parse(resultadosData);
          setResultados(resultados);

          // Verifique se já existem resultados para o Jogo 6
          const resultadoJogo6 = resultados.find((resultado) => resultado.partida === 'Jogo 6');

          // Se houver resultado para o Jogo 6, defina-o na tabela de jogos
          if (resultadoJogo6) {
            setTabelaJogos([resultadoJogo6]);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar resultados do AsyncStorage:', error);
      }
    };

    // Chame a função para carregar resultados quando o componente for montado
    loadResultados();
  }, []);

  const gerarTabelaJogos4 = () => {
    // Verifique se há resultados para os jogos anteriores
    if (resultados.length < 5) {
      console.error('Não há resultados suficientes para gerar a tabela de jogos.');
      return;
    }

    // Calcule o vencedor do Jogo 3 e Jogo 5
    const vencedorJogo3 = resultados[2].golsTime1 > resultados[2].golsTime2 ? resultados[2].time1 : resultados[2].time2;
    const vencedorJogo5 = resultados[4].golsTime1 > resultados[4].golsTime2 ? resultados[4].time1 : resultados[4].time2;

    // Crie o Jogo 6
    const jogo6 = {
      partida: 'Jogo 6',
      time1: vencedorJogo3,
      time2: vencedorJogo5,
      golsTime1: '',
      golsTime2: '',
    };

    // Atualize a tabela de jogos com o Jogo 6
    setTabelaJogos([jogo6]);

    // Exiba um aviso
    Alert.alert(
      'Aviso',
      `Vencedor do Jogo 5 aguarda resultado do Jogo 6.`,
      [{ text: 'OK' }]
    );
  };

  const salvarResultados4 = async () => {
    // Verifique se todos os resultados do Jogo 6 foram preenchidos
    if (tabelaJogos[0]?.golsTime1 === '' || tabelaJogos[0]?.golsTime2 === '') {
      console.error('Preencha todos os resultados do Jogo 6 antes de salvar.');
      return;
    }

    try {
      // Combine os resultados do Jogo 6 com os resultados anteriores
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
      <Button title="Avançar Fase" onPress={gerarTabelaJogos4} />
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
      <Button title="Salvar Resultados 4" onPress={salvarResultados4} />
      <DoubleEliminationComponent5 />
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

export default DoubleEliminationComponent4;
