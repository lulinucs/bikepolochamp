import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChaveJogosComponent = () => {
  const [classificacao, setClassificacao] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getClassificacao = async () => {
      try {
        const classificacaoData = await AsyncStorage.getItem('classificacao');
        if (classificacaoData !== null) {
          setClassificacao(JSON.parse(classificacaoData));
          setIsLoading(false); // Marcar que os dados foram carregados
        }
      } catch (error) {
        console.error('Erro ao recuperar a classificação:', error);
      }
    };

    getClassificacao();
  }, []);

  const montarChaveJogos = () => {
    if (isLoading) {
      return <Text>Carregando dados...</Text>;
    }

    if (classificacao.length < 4) {
      return <Text>A classificação não está completa.</Text>;
    }

    const jogos = [
      `Jogo1: ${classificacao[0].nome} ${classificacao[0].posicao}º colocado x ${classificacao[3].nome} ${classificacao[3].posicao}º colocado`,
      `Jogo2: ${classificacao[1].nome} ${classificacao[1].posicao}º colocado x ${classificacao[2].nome} ${classificacao[2].posicao}º colocado`,
      `Jogo4: Vencedor Jogo1 x Vencedor Jogo2`,
      `Jogo6: Vencedor Jogo4 x Vencedor Jogo5 (Neste jogo, se o Vencedor do Jogo4 vencer, ele é campeão, se o vencedor do Jogo5 vencer tem que ter um novo jogo, pois é eliminação dupla, precisa de 2 derrotas pra ser eliminado)`,
      `Jogo3: Perdedor Jogo1 x Perdedor Jogo2`,
      `Jogo5: Vencedor Jogo3 x Perdedor Jogo4`,
    ];

    return jogos.map((jogo, index) => (
      <Text key={index}>{jogo}</Text>
    ));
  };

  return (
    <View>
      <Text>CHAVE PRINCIPAL</Text>
      {montarChaveJogos()}
      <Text>CHAVE REPESCAGEM</Text>
    </View>
  );
};

export default ChaveJogosComponent;
