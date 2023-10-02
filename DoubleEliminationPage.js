import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import DoubleEliminationComponent from './components/DoubleEliminationComponent'; 

export default function HomePage() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DoubleEliminationComponent />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});
