import React from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ...

const clearAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('Dados do AsyncStorage foram limpos com sucesso.');
  } catch (error) {
    console.error('Erro ao limpar o AsyncStorage:', error);
  }
};

// Chame a função para limpar o AsyncStorage
//clearAsyncStorage();


export default function HomePage() {
  return (
    <View>
      <Text>Página Inicial</Text>
    </View>
  );
}
