import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import HomePage from './HomePage';
import EquipesPage from './EquipesPage';
import PrimeiraFasePage from './PrimeiraFasePage';
import DoubleEliminationPage from './DoubleEliminationPage';
import JogosPage from './JogosPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('Home');

  const navigateToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Meu Aplicativo</Text>
      </View>

      <View style={styles.content}>
        {/* Renderizar a página com base na seleção do usuário */}
        {currentPage === 'Home' && <HomePage />}
        {currentPage === 'Equipes' && <EquipesPage />}
        {currentPage === 'PrimeiraFase' && <PrimeiraFasePage />}
        {currentPage === 'DoubleElimination' && <DoubleEliminationPage />}
        {currentPage === 'Jogos' && <JogosPage />}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigateToPage('Home')}
        >
          <Ionicons name="home-outline" size={24} color="black" />
          <Text>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigateToPage('Equipes')}
        >
          <Ionicons name="people-outline" size={24} color="black" />
          <Text>Equipes </Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigateToPage('Jogos')}
      >
        <Ionicons name="game-controller-outline" size={24} color="black" />
        <Text>Eliminatórias </Text>
      </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigateToPage('DoubleElimination')}
        >
          <Ionicons name="trophy-outline" size={24} color="black" />
          <Text>Finais </Text>
        </TouchableOpacity>

      
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1, // Adicione flex: 1 para que o conteúdo ocupe toda a extremidade da tela
    justifyContent: 'center',

  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    padding: 10,
  },
  footerItem: {
    alignItems: 'center',
  },
});
