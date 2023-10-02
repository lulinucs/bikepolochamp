import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DoubleEliminationComponent4 from './DoubleEliminationComponent4';

function DoubleEliminationComponent3() {
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

          // Verifique se já existem resultados para o Jogo 5
          const resultadoJogo5 = resultados.find((resultado) => resultado.partida === 'Jogo 5');

          // Se houver resultado para o Jogo 5, defina-o na tabela de jogos
          if (resultadoJogo5) {
            setTabelaJogos([resultadoJogo5]);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar resultados do AsyncStorage:', error);
      }
    };

    // Chame a função para carregar resultados quando o componente for montado
    loadResultados();
  }, []);

  const gerarTabelaJogos3 = () => {
    // Verifique se há resultados para os jogos anteriores
    if (resultados.length < 4) {
      console.error('Não há resultados suficientes para gerar a tabela de jogos.');
      return;
    }

    // Calcule o vencedor do Jogo 3 e Jogo 4
    const vencedorJogo3 = resultados[2].golsTime1 > resultados[2].golsTime2 ? resultados[2].time1 : resultados[2].time2;
    const vencedorJogo4 = resultados[3].golsTime1 > resultados[3].golsTime2 ? resultados[3].time1 : resultados[3].time2;
    const perdedorJogo3 = resultados[2].golsTime1 > resultados[2].golsTime2 ? resultados[2].time2 : resultados[2].time1;
    const perdedorJogo4 = resultados[3].golsTime1 > resultados[3].golsTime2 ? resultados[3].time2 : resultados[3].time1;
    
    // Crie o Jogo 5
    const jogo5 = {
      partida: 'Jogo 5',
      time1: perdedorJogo3,
      time2: vencedorJogo4,
      golsTime1: '',
      golsTime2: '',
    };

    // Atualize a tabela de jogos com o Jogo 5
    setTabelaJogos([jogo5]);

    // Exiba um aviso
    Alert.alert(
      'Aviso',
      `${perdedorJogo4} foi eliminado.`,
      [{ text: 'OK' }]
    );
  };

  const salvarResultados3 = async () => {
    // Verifique se todos os resultados do Jogo 5 foram preenchidos
    if (tabelaJogos[0]?.golsTime1 === '' || tabelaJogos[0]?.golsTime2 === '') {
      console.error('Preencha todos os resultados do Jogo 5 antes de salvar.');
      return;
    }

    try {
      // Combine os resultados do Jogo 5 com os resultados anteriores
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
      <Button title="Avançar Fase" onPress={gerarTabelaJogos3} />
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
      <Button title="Salvar Resultados 3" onPress={salvarResultados3} />
      <DoubleEliminationComponent4 />
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

export default DoubleEliminationComponent3;
