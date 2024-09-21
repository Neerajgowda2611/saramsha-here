import React, { useState, useEffect } from 'react';
import { View, Button, Alert, Text, ActivityIndicator } from 'react-native';
import Sound from 'react-native-sound'; // For playing uploaded audio
import RNFS from 'react-native-fs'; // File system access
import styles from '../styles/styles';

const PlayAudioScreen = ({ route, navigation }: { route: any, navigation: any }) => {
  const audioPath = route.params?.audioPath || ''; // Safely get audioPath or set to empty string
  const [playerState, setPlayerState] = useState('stopped');
  const [sound, setSound] = useState<Sound | null>(null); // For Sound instance
  const [isPlaying, setIsPlaying] = useState(false); // Track playing state
  const [isLoading, setIsLoading] = useState(true); // For handling audio file loading
  const [localPath, setLocalPath] = useState<string | null>(null); // Track the copied file path

  useEffect(() => {
    if (!audioPath) {
      Alert.alert('Error', 'No audio file provided.');
      return;
    }

    // Function to handle the file copy process and load the sound
    const prepareSound = async () => {
      let path = audioPath;

      // Convert content:// or file:// URIs to an absolute file path using RNFS
      if (audioPath.startsWith('content://') || audioPath.startsWith('file://')) {
        try {
          // Create a temporary file path in the DocumentDirectory
          const destPath = `${RNFS.DocumentDirectoryPath}/temp_audio_${Date.now()}.mp3`;

          // Copy the file from the URI to the local path
          await RNFS.copyFile(audioPath, destPath);
          path = destPath;
          setLocalPath(destPath); // Set the copied local file path for logging or further usage

          console.log('File copied to:', destPath);
        } catch (error) {
          Alert.alert('Error', 'Failed to copy the audio file to a local directory.');
          console.error('Failed to copy audio file', error);
          setIsLoading(false); // Stop loading
          return;
        }
      }

      // Now load the sound from the copied local path
      const soundInstance = new Sound(path, '', (error) => {
        if (error) {
          Alert.alert('Error', 'Failed to load the audio file.');
          console.error('Sound loading error', error);
        } else {
          setSound(soundInstance);
        }
        setIsLoading(false); // Audio loading finished
      });
    };

    prepareSound();

    return () => {
      // Cleanup the sound instance
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

  // Function to generate the transcript and summary
  const generate = () => {
    if (audioPath) {
      // Navigate to the result screen with the audioPath
      navigation.navigate('ResultsScreen', { audioPath });
    } else {
      Alert.alert('Error', 'No audio file provided.');
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        // Show loading indicator while audio is being loaded
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text>Audio Playback</Text>

          <Button title="Play" onPress={startPlaying} disabled={isPlaying} />
          <View style={styles.buttonGap} />

          <Button title="Stop" onPress={stopPlaying} disabled={!isPlaying} />
          <View style={styles.buttonGap} />

          {/* Generate button for transcript and summary */}
          <Button title="Generate" onPress={generate} disabled={isPlaying} />
          <View style={styles.buttonGap} />

          <Button title="Back" onPress={() => { stopPlaying(); navigation.goBack(); }} />
        </>
      )}
    </View>
  );
};

export default PlayAudioScreen;

