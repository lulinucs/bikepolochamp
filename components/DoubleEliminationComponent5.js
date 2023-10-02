import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function DoubleEliminationComponent5() {
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

          // Verifique se já existem resultados para o Jogo 7
          const resultadoJogo7 = resultados.find((resultado) => resultado.partida === 'Jogo 7');

          // Se houver resultado para o Jogo 7, defina-o na tabela de jogos
          if (resultadoJogo7) {
            setTabelaJogos([resultadoJogo7]);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar resultados do AsyncStorage:', error);
      }
    };

    // Chame a função para carregar resultados quando o componente for montado
    loadResultados();
  }, []);

  const gerarTabelaJogos5 = () => {
    // Verifique se há resultados para os jogos anteriores
    if (resultados.length < 6) {
      console.error('Não há resultados suficientes para gerar a tabela de jogos.');
      return;
    }

    // Calcule o vencedor do Jogo 5 e Jogo 6
    const vencedorJogo5 = resultados[4].golsTime1 > resultados[4].golsTime2 ? resultados[4].time1 : resultados[4].time2;
    const vencedorJogo6 = resultados[5].golsTime1 > resultados[5].golsTime2 ? resultados[5].time1 : resultados[5].time2;
    const perdedorJogo6 = resultados[5].golsTime1 > resultados[5].golsTime2 ? resultados[5].time2 : resultados[5].time1;

    if (vencedorJogo5 === vencedorJogo6) {
      // Caso o vencedor do Jogo 5 vença também o Jogo 6
      // Crie o Jogo 7: Vencedor Jogo 6 x Perdedor Jogo 6
      const jogo7 = {
        partida: 'Jogo 7',
        time1: vencedorJogo6,
        time2: perdedorJogo6,
        golsTime1: '',
        golsTime2: '',
      };

      // Atualize a tabela de jogos com o Jogo 7
      setTabelaJogos([jogo7]);

      // Exiba um aviso
      Alert.alert(
        'Aviso',
        `${perdedorJogo6} perdeu a final 1-2 e jogará a grande final contra o ${vencedorJogo6}.`,
        [{ text: 'OK' }]
      );
    } else {
      // Caso o vencedor do Jogo 5 perca o Jogo 6
      // Vencedor do Jogo 6 é o campeão
      Alert.alert(
        'Aviso',
        `${vencedorJogo6} é o campeão!`,
        [{ text: 'OK' }]
      );
    }
  };

  const salvarResultados5 = async () => {
    // Verifique se todos os resultados do Jogo 7 foram preenchidos
    if (tabelaJogos[0]?.golsTime1 === '' || tabelaJogos[0]?.golsTime2 === '') {
      console.error('Preencha todos os resultados do Jogo 7 antes de salvar.');
      return;
    }    

    try {
            
      // Combine os resultados do Jogo 7 com os resultados anteriores
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
      <Button title="Gerar Campeão" onPress={gerarTabelaJogos5} />
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
      <Button title="Salvar Resultados 5" onPress={salvarResultados5} />
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

export default DoubleEliminationComponent5;
