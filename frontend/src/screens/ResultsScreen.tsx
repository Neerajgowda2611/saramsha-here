import React from 'react';
import { View, Text, Button, ScrollView } from 'react-native';

const ResultsScreen = ({ route, navigation }: { route: any, navigation: any }) => {
  const { transcription, summary } = route.params || {
      transcription: "No transcription available",
      summary: "No summary available"
  };

  return (
      <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Transcript:</Text>
          <Text>{transcription}</Text>
          <View style={{ marginVertical: 10 }} />
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Summarization:</Text>
          <Text>{summary}</Text>
          <View style={{ marginVertical: 20 }} />
          <Button title="Back" onPress={() => navigation.goBack()} />
      </ScrollView>
  );
};

export default ResultsScreen;
