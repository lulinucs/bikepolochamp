import React from 'react';
import { View, Text } from 'react-native';
import EquipeForm from './components/EquipeForm';
import ListaEquipes from './components/ListaEquipes';

export default function EquipesPage() {
  return (
    <View>
      <ListaEquipes />
    </View>
  );
}