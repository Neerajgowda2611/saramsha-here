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

    try {
        const formData = new FormData();
        formData.append('file', {
            uri: localPath.startsWith('file://') ? localPath : `file://${localPath}`,
            name: `audio_${Date.now()}.mp3`, // Make sure this matches the file type
            type: 'audio/mpeg', // Confirm this type is correct
        });

        const response = await fetch('http://22.0.0.117:8000/upload-audio', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data', // Generally, let fetch handle this
            },
        });

        const responseData = await response.json();
        // console.log('Response Data:', responseData);

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
    }
};

  
  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text>Audio Playback</Text>

          <Button title="Play" onPress={startPlaying} disabled={isPlaying} />
          <View style={styles.buttonGap} />

          <Button title="Stop" onPress={stopPlaying} disabled={!isPlaying} />
          <View style={styles.buttonGap} />

          <Button title="Generate" onPress={generate} disabled={isPlaying} />
          <View style={styles.buttonGap} />

          <Button title="Back" onPress={() => { stopPlaying(); navigation.goBack(); }} />
        </>
      )}
    </View>
  );
};

export default PlayAudioScreen;
