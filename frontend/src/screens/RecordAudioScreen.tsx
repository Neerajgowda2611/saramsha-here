import React, { useState } from 'react';
import { View, Button, Text, Alert, PermissionsAndroid, Platform } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import styles from '../styles/styles';

const audioRecorderPlayer = new AudioRecorderPlayer();

const RecordAudioScreen = ({ navigation }: { navigation: any }) => {
  const [recording, setRecording] = useState(false);
  const [audioPath, setAudioPath] = useState('');

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'App needs access to your storage to save audio files',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (error) {
        console.warn('Storage permission error:', error);
        return false;
      }
    }
    return true;
  };

  const startRecording = async () => {
    if (recording) {
      Alert.alert('Error', 'Recording is already in progress.');
      return;
    }

    // Check and request storage permission
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Cannot save the recording without permission.');
      return;
    }

    try {
      await audioRecorderPlayer.stopRecorder();
      // Save the recording to the Music folder
      const path = `${RNFS.ExternalStorageDirectoryPath}/Music/audio_${Date.now()}.mp3`;
      setAudioPath(path);
      await audioRecorderPlayer.startRecorder(path);
      setRecording(true);
      Alert.alert('Recording started', `File will be saved to: ${path}`);
    } catch (error) {
      setRecording(false);
      console.error('Failed to start recording:', error);
      Alert.alert('Error', `Failed to start recording: ${error}`);
    }
  };

  const stopRecording = async () => {
    if (!recording) {
      Alert.alert('Error', 'No recording is in progress.');
      return;
    }

    try {
      await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removePlayBackListener();
      setRecording(false);
      Alert.alert('Recording stopped', `File saved at: ${audioPath}`);
      
      // Navigate to PlayAudioScreen with the audio path
      navigation.navigate('PlayAudio', { audioPath });
    } catch (error) {
      setRecording(false);
      console.error('Failed to stop recording:', error);
      Alert.alert('Error', `Failed to stop recording: ${error}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Record Audio</Text>

      <Button title="Start Recording" onPress={startRecording} disabled={recording} />
      <View style={styles.buttonGap} />

      <Button title="Stop Recording" onPress={stopRecording} disabled={!recording} />
      <View style={styles.buttonGap} />

      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default RecordAudioScreen;

