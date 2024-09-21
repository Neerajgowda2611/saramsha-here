import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
// import { fetchTranscriptionAndSummary } from '../api'; // 

const ResultsScreen = ({ route, navigation }: { route: any, navigation: any }) => {
  const { audioPath } = route.params;
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getResults = async () => {
      try {
        // const { transcript, summary } = await fetchTranscriptionAndSummary(audioPath);
        setTranscript(transcript);
        setSummary(summary);
      } catch (error) {
        console.error('Failed to fetch results:', error);
      } finally {
        setLoading(false);
      }
    };

    getResults();
  }, [audioPath]);

  return (
    <View style={{ padding: 20 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Transcript:</Text>
          <Text>{transcript}</Text>
          <View style={{ marginVertical: 10 }} />
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Summarization:</Text>
          <Text>{summary}</Text>
          <View style={{ marginVertical: 20 }} />
          <Button title="Back" onPress={() => navigation.goBack()} />
        </>
      )}
    </View>
  );
};

export default ResultsScreen;
