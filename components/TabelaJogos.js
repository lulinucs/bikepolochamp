import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, TextInput, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TabelaClassificacaoComponent from './TabelaClassificacaoComponent';

const GerarTabelaComponent = () => {
  const [tabelaJogos, setTabelaJogos] = useState([]);
  const [equipes, setEquipes] = useState([]);
  const [tabelaCarregada, setTabelaCarregada] = useState(false);
  const [renderizarTabela, setRenderizarTabela] = useState(false);
  

  useEffect(() => {
    const fetchEquipes = async () => {
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

  useEffect(() => {
    
    const fetchEquipes = async () => {
      try {
        const equipesData = await AsyncStorage.getItem('equipes');
        if (equipesData) {
          const equipes = JSON.parse(equipesData);
          // Reinicie as estatísticas de todas as equipes ao carregar os dados
          const equipesAtualizadas = equipes.map((equipe) => ({
            ...equipe,
            jogos: 0,
            vitorias: 0,
            derrotas: 0,
            empates: 0,
            golsFeitos: 0,
            golsSofridos: 0,
            pontos: 0,
          }));
          setEquipes(equipesAtualizadas);
          await AsyncStorage.setItem('equipes', JSON.stringify(equipesAtualizadas));
        }
      } catch (error) {
        console.error('Erro ao buscar equipes:', error);
      }
    };
  
    fetchEquipes();
  }, []);

  useEffect(() => {
    const fetchTabela = async () => {
      try {
        const tabelaData = await AsyncStorage.getItem('tabelaJogos');
        if (tabelaData) {
          const tabela = JSON.parse(tabelaData);
          if (tabela && tabela.length > 0) {
            setTabelaJogos(tabela);
            setTabelaCarregada(true);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar tabela de jogos:', error);
      }
    };

    fetchTabela();
  }, []);

  const atualizarEstatisticas = (equipe, golsFeitos, golsSofridos, resultado) => {
    equipe.jogos++;
    equipe.golsFeitos += golsFeitos;
    equipe.golsSofridos += golsSofridos;

    if (resultado === 'vitoria') {
      equipe.vitorias++;
    } else if (resultado === 'derrota') {
      equipe.derrotas++;
    } else {
      equipe.empates++;
    }
  };

  const gerarTabela = () => {
    if (equipes.length < 2) {
      alert('É necessário ter pelo menos 2 equipes cadastradas para gerar a tabela.');
      return;
    }

    // Adicione um alerta de confirmação ao clicar em "Gerar Tabela"
    Alert.alert(
      'Confirmação',
      'Tem certeza de que deseja gerar a tabela de jogos?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Gerar',
          onPress: () => {
            const numEquipes = equipes.length;
            const rodadas = [];

            for (let rodada = 1; rodada < numEquipes; rodada++) {
              const jogosRodada = [];

              for (let i = 0; i < numEquipes / 2; i++) {
                const equipe1 = equipes[i];
                const equipe2 = equipes[numEquipes - 1 - i];

                if (equipe1 !== equipe2) {
                  jogosRodada.push({ jogo: `${equipe1.nomeEquipe} x ${equipe2.nomeEquipe}`, golsEquipe1: '', golsEquipe2: '' });
                } else {
                  jogosRodada.push({ jogo: `${equipe1.nomeEquipe} folga nesta rodada` });
                }
              }

              rodadas.push({
                rodada,
                jogos: jogosRodada,
              });

              // Rotaciona as equipes
              equipes.splice(1, 0, equipes.pop());
            }

            setTabelaJogos(rodadas);

            // Salvar a tabela no AsyncStorage
            AsyncStorage.setItem('tabelaJogos', JSON.stringify(rodadas));
          },
        },
      ]
    );
  };

  const reiniciarEstatisticas = async () => {
    // Reiniciar as estatísticas de todas as equipes
    const equipesAtualizadas = equipes.map((equipe) => ({
      ...equipe,
      jogos: 0,
      vitorias: 0,
      derrotas: 0,
      empates: 0,
      golsFeitos: 0,
      golsSofridos: 0,
      pontos: 0,
    }));
  
    setEquipes(equipesAtualizadas); // Atualize o estado de equipes aqui
    await AsyncStorage.setItem('equipes', JSON.stringify(equipesAtualizadas));
  };

  const compararJogos = (tabela) => {
    // Limpar todas as estatísticas antes de comparar
    reiniciarEstatisticas().then(() => {
      tabela.forEach((rodada, rodadaIndex) => {
        rodada.jogos.forEach((jogo, jogoIndex) => {
          const golsEquipe1 = parseInt(jogo.golsEquipe1);
          const golsEquipe2 = parseInt(jogo.golsEquipe2);
  
          if (!isNaN(golsEquipe1) && !isNaN(golsEquipe2)) {
            // Determinar qual equipe está jogando neste jogo
            const equipe1Nome = jogo.jogo.split(' x ')[0];
            const equipe2Nome = jogo.jogo.split(' x ')[1];
  
            const equipe1 = equipes.find((equipe) => equipe.nomeEquipe === equipe1Nome);
            const equipe2 = equipes.find((equipe) => equipe.nomeEquipe === equipe2Nome);
  
            if (equipe1 && equipe2) {
              if (golsEquipe1 > golsEquipe2) {
                // Adicione 3 pontos para a equipe 1 por vitória
                equipe1.pontos += 3;
                atualizarEstatisticas(equipe1, golsEquipe1, golsEquipe2, 'vitoria');
                atualizarEstatisticas(equipe2, golsEquipe2, golsEquipe1, 'derrota');
              } else if (golsEquipe1 < golsEquipe2) {
                // Adicione 3 pontos para a equipe 2 por vitória
                equipe2.pontos += 3;
                atualizarEstatisticas(equipe1, golsEquipe1, golsEquipe2, 'derrota');
                atualizarEstatisticas(equipe2, golsEquipe2, golsEquipe1, 'vitoria');
              } else {
                // Adicione 1 ponto para cada equipe em caso de empate
                equipe1.pontos += 1;
                equipe2.pontos += 1;
                atualizarEstatisticas(equipe1, golsEquipe1, golsEquipe2, 'empate');
                atualizarEstatisticas(equipe2, golsEquipe2, golsEquipe1, 'empate');
              }
            }
          }
        });
      });
  
      // Atualizar a tabela no AsyncStorage com os resultados comparados
      AsyncStorage.setItem('tabelaJogos', JSON.stringify(tabela));
      AsyncStorage.setItem('equipes', JSON.stringify(equipes));
  
      // Imprimir estatísticas no console
      equipes.forEach((equipe) => {
        console.log(`Estatísticas de ${equipe.nomeEquipe}:`);
        console.log(`Jogos: ${equipe.jogos}`);
        console.log(`Vitórias: ${equipe.vitorias}`);
        console.log(`Derrotas: ${equipe.derrotas}`);
        console.log(`Empates: ${equipe.empates}`);
        console.log(`Gols Feitos: ${equipe.golsFeitos}`);
        console.log(`Gols Sofridos: ${equipe.golsSofridos}`);
        console.log(`Pontos: ${equipe.pontos}`);
        console.log('---');
      });

      setRenderizarTabela(true);
    }).catch((error) => {
      console.error('Erro ao reiniciar estatísticas:', error);
    });
  };
  

  const handleInputChange = (rodadaIndex, jogoIndex, equipeIndex, value) => {
    const newTabelaJogos = [...tabelaJogos];
    newTabelaJogos[rodadaIndex].jogos[jogoIndex][equipeIndex === 0 ? 'golsEquipe1' : 'golsEquipe2'] = value;
    setTabelaJogos(newTabelaJogos);

    // Salvar a tabela atualizada no AsyncStorage
    AsyncStorage.setItem('tabelaJogos', JSON.stringify(newTabelaJogos));
  };  

  const renderTabelaClassificacao = () => {
    if (renderizarTabela) {
      return <TabelaClassificacaoComponent />;
    }
    return null;
  };

  
  

  return (
    <ScrollView>
      <Button title="Gerar Tabela" onPress={gerarTabela} />
      {!tabelaCarregada ? (
        <Text>Clique no botão "Gerar Tabela" para criar a tabela de jogos.</Text>
      ) : (
        <>
          {tabelaJogos.map((rodada, rodadaIndex) => (
            <View key={rodadaIndex} style={styles.card}>
              <Text style={styles.cardTitle}>Rodada {rodada.rodada}</Text>
              {rodada.jogos &&
                rodada.jogos.map((jogo, jogoIndex) => (
                  <View key={jogoIndex}>
                    <Text style={styles.cardText}>{jogo.jogo}</Text>
                    {jogo.golsEquipe1 !== undefined && jogo.golsEquipe2 !== undefined ? (
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.input}
                          placeholder="Gols Equipe 1"
                          keyboardType="numeric"
                          value={jogo.golsEquipe1}
                          onChangeText={(value) =>
                            handleInputChange(rodadaIndex, jogoIndex, 0, value)
                          }
                        />
                        <Text style={styles.text}>x</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Gols Equipe 2"
                          keyboardType="numeric"
                          value={jogo.golsEquipe2}
                          onChangeText={(value) =>
                            handleInputChange(rodadaIndex, jogoIndex, 1, value)
                          }
                        />
                      </View>
                    ) : (
                      <Text style={styles.cardText}></Text>
                    )}
                  </View>
                ))}
            </View>
          ))}
        </>
      )}
      <Button
  title="Atualizar Classificação"
  onPress={() => {
    compararJogos(tabelaJogos);
    setRenderizarTabela(false);
  }}
/>
{renderizarTabela && <TabelaClassificacaoComponent />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardText: {
    fontSize: 14,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  input: {
    width: '40%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 5,
  },
  text: {
    alignSelf: 'center',
    fontSize: 16,
  },
});

export default GerarTabelaComponent;
