import React, { useState, useEffect } from 'react';
import { View, Button, Alert, Text, ActivityIndicator } from 'react-native';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';     
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/styles';

const PlayAudioScreen = ({ route, navigation }: { route: any, navigation: any }) => {
  const audioPath = route.params?.audioPath || ''; // Get audio path from params or empty string
  const [playerState, setPlayerState] = useState('stopped');
  const [sound, setSound] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [localPath, setLocalPath] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // State for loading
  const [loadingMessage, setLoadingMessage] = useState('Preparing audio...'); // State for dynamic loading message
  const [messageColor, setMessageColor] = useState('#000'); // Color for text
  const [spinnerColor, setSpinnerColor] = useState('#0000ff'); // Color for spinner

  useEffect(() => {
    if (!audioPath) {
      Alert.alert('Error', 'No audio file provided.');
      return;
    }

    const prepareSound = async () => {
      let path = audioPath;

      // Handle content:// or file:// URIs using RNFS
      if (audioPath.startsWith('content://') || audioPath.startsWith('file://')) {
        try {
          const destPath = `${RNFS.DocumentDirectoryPath}/temp_audio_${Date.now()}.mp3`;
          await RNFS.copyFile(audioPath, destPath);
          path = destPath;
          setLocalPath(destPath);
          console.log('File copied to:', destPath);
        } catch (error) {
          Alert.alert('Error', 'Failed to copy the audio file to a local directory.');
          console.error('Failed to copy audio file', error);
          setIsLoading(false);
          return;
        }
      } else {
        setLocalPath(audioPath);
      }

      const soundInstance = new Sound(path, '', (error) => {
        if (error) {
          Alert.alert('Error', 'Failed to load the audio file.');
          console.error('Sound loading error', error);
          setIsLoading(false);
        } else {
          setSound(soundInstance);
          setIsLoading(false);
        }
      });
    };

    prepareSound();

    return () => {
      if (sound) {
        sound.release();
      }
    };
  }, [audioPath]);

  useEffect(() => {
    if (loading) {
      const messages = [
        'It takes more than 10 seconds to generate results',
        'Processing your audio...',
        'Hang tight, summarizing your content!',
        'Just a few more moments...',
        'Still working on it!',
        'Almost there, stay with us!',
        'Patience is a virtue!',
        'Thanks for waiting...',
        'Hold on, results are coming!',
        'Analyzing your audio...',
        'Preparing transcription for you...'
      ];

      let index = 0;

      // Set the colors to green, violet, blue, and yellow
      const colors = ['#00FF00', '#EE82EE', '#0000FF'];

      const intervalId = setInterval(() => {
        setLoadingMessage(messages[index]);
        setMessageColor(colors[index % colors.length]); // Set the message text color
        setSpinnerColor(colors[(index + 1) % colors.length]); // Set the spinner color
        index = (index + 1) % messages.length;
      }, 1000); // Update every 1 second

      return () => clearInterval(intervalId); // Clean up the interval
    }
  }, [loading]);

  const startPlaying = () => {
    if (sound) {
      sound.play((success) => {
        if (success) {
          setPlayerState('stopped');
          setIsPlaying(false);
        } else {
          Alert.alert('Error', 'Failed to play the audio.');
        }
      });
      setPlayerState('playing');
      setIsPlaying(true);
    } else {
      Alert.alert('Error', 'Audio file is not loaded yet.');
    }
  };

  const stopPlaying = () => {
    if (sound) {
      sound.stop(() => {
        setPlayerState('stopped');
        setIsPlaying(false);
      });
    }
  };

  const generate = async () => {
    if (!localPath) {
      Alert.alert('Error', 'No audio file available.');
      console.error('Local path is not set:', localPath);
      return;
    }

    setLoading(true); // Start loading

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: localPath.startsWith('file://') ? localPath : `file://${localPath}`,
        name: `audio_${Date.now()}.mp3`, // Make sure this matches the file type
        type: 'audio/mpeg', // Confirm this type is correct
      });

      const response = await fetch('https://saramshabk.cialabs.org/upload-audio', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data', // Generally, let fetch handle this
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Response error:', responseData);
        throw new Error(`Failed to process the audio: ${responseData.detail || responseData.message}`);
      }

      const { transcription, summary } = responseData;

      const historyItem = {
        audioPath: localPath,
        transcription,
        summary,
        timestamp: Date.now(),
      };

      const storedHistory = await AsyncStorage.getItem('history');
      const history = storedHistory ? JSON.parse(storedHistory) : [];
      const updatedHistory = [historyItem, ...history].slice(0, 10);

      await AsyncStorage.setItem('history', JSON.stringify(updatedHistory));

      navigation.navigate('ResultsScreen', { transcription, summary });
    } catch (error) {
      Alert.alert('Error', 'An error occurred while processing the audio.');
      console.error('Audio processing error:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
        {/* <title>It may take more thn 10 seconds to generate results </title> */}
          <Button title="Play" onPress={startPlaying} disabled={isPlaying} />
          <View style={styles.buttonGap} />

          <Button title="Stop" onPress={stopPlaying} disabled={!isPlaying} />
          <View style={styles.buttonGap} />

          {loading ? (
            <View>
              {/* Display the dynamic loading message with color */}
              <Text style={{ color: messageColor }}>{loadingMessage}</Text> 
              <ActivityIndicator size="large" color={spinnerColor} />
            </View>
          ) : (
            <Button title="Generate" onPress={generate} disabled={isPlaying} />
          )}
          <View style={styles.buttonGap} />

          <Button title="Back" onPress={() => { stopPlaying(); navigation.goBack(); }} />
        </>
      )}
    </View>
  );
};

export default PlayAudioScreen;
