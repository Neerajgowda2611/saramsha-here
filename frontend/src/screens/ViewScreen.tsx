import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme } from 'react-native'; // Import useColorScheme
import { RouteProp } from '@react-navigation/native';

type ViewScreenRouteProp = RouteProp<{ params: { transcript: string; summary: string } }, 'params'>;

const ViewScreen = ({ route }: { route: ViewScreenRouteProp }) => {
  const { transcript, summary } = route.params;

  // Get the current color scheme
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <ScrollView 
      contentContainerStyle={styles.contentContainer} 
      style={[styles.container, { backgroundColor: isDarkMode ? '#333333' : '#FFFFFF' }]} // Set background color based on theme
    >
      {/* <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>TRANSCRIPT</Text> */}
      <Text style={[styles.title, { color: 'green' }]}>TRANSCRIPT</Text>
      <Text style={[styles.content, { color: isDarkMode ? '#BBBBBB' : '#555555' }]}>{transcript}</Text>

      <Text style={[styles.title, { color: 'green' }]}>SUMMARY</Text>
      <Text style={[styles.content, { color: isDarkMode ? '#BBBBBB' : '#555555' }]}>{summary}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  contentContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingBottom: 20,
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

