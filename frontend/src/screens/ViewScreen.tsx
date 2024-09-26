import React from 'react';
import { View, Text, StyleSheet } from 'react-native'; // Ensure to import StyleSheet
import { RouteProp } from '@react-navigation/native';
import { ScrollView } from 'react-native';

type ViewScreenRouteProp = RouteProp<{ params: { transcript: string; summary: string } }, 'params'>;

const ViewScreen = ({ route }: { route: ViewScreenRouteProp }) => {
  const { transcript, summary } = route.params;

  return (
    <ScrollView 
      contentContainerStyle={styles.contentContainer} // Use contentContainerStyle
      style={styles.container}
    >
      <Text style={styles.title}>Transcript</Text>
      <Text style={styles.content}>{transcript}</Text>

      <Text style={styles.title}>Summary</Text>
      <Text style={styles.content}>{summary}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16, // Add padding for the ScrollView container
  },
  contentContainer: {
    alignItems: 'flex-start', // Use alignItems and justifyContent here
    justifyContent: 'flex-start',
    paddingBottom: 20, // Optional: Padding at the bottom for scrolling
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
});

export default ViewScreen;
