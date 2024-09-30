import React from 'react';
import { View, Text, Button, ScrollView, useColorScheme } from 'react-native';

const ResultsScreen = ({ route, navigation }: { route: any, navigation: any }) => {
  const { transcription, summary } = route.params || {
      transcription: "No transcription available",
      summary: "No summary available"
  };

  // Detect the current color scheme (light or dark)
  const colorScheme = useColorScheme();

  // Define text colors based on the color scheme
  const textColor = colorScheme === 'dark' ? '#E0E0E0' : '#222222'; // Light text for dark mode, dark text for light mode
  const backgroundColor = colorScheme === 'dark' ? '#121212' : '#FFFFFF'; // Dark background for dark mode, light for light mode

  return (
      <ScrollView contentContainerStyle={{ padding: 20, backgroundColor }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: textColor }}>Transcript:</Text>
          <Text style={{ color: textColor }}>{transcription}</Text>
          <View style={{ marginVertical: 10 }} />
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: textColor }}>Summarization:</Text>
          <Text style={{ color: textColor }}>{summary}</Text>
          <View style={{ marginVertical: 20 }} />
          <Button title="Back" onPress={() => navigation.goBack()} />
      </ScrollView>
  );
};

export default ResultsScreen;
