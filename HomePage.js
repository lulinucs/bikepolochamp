import React from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const clearAsyncStorage = async () => {
  try {
    // Recupere a variável 'equipes' do AsyncStorage antes de limpar tudo
    const equipesData = await AsyncStorage.getItem('equipes');
    
    // Limpe o AsyncStorage
    await AsyncStorage.clear();

    // Restaure a variável 'equipes' no AsyncStorage
    if (equipesData) {
      await AsyncStorage.setItem('equipes', equipesData);
    }

    console.log('Dados do AsyncStorage foram limpos com exceção da variável "equipes".');
  } catch (error) {
    console.error('Erro ao limpar o AsyncStorage:', error);
  }
};

export default function HomePage() {
  return (
    <View>
      <Text>Página Inicial</Text>
      <Button title="Novo Campeonato" onPress={clearAsyncStorage} />
    </View>
  );
}
