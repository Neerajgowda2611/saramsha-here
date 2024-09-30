import React, { useState, useEffect } from 'react';
import { View, Button, Text, Alert, PermissionsAndroid, Platform } from 'react-native';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import styles from '../styles/styles';

const audioRecorderPlayer = new AudioRecorderPlayer();

const RecordAudioScreen = ({ navigation }: { navigation: any }) => {
  const [recording, setRecording] = useState(false);
  const [audioPath, setAudioPath] = useState('');

  useEffect(() => {
    return () => {
      if (recording) {
        audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
      }
    };
  }, [recording]);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const isAndroid13OrAbove = Platform.Version >= 33; // API Level 33 for Android 13

      if (isAndroid13OrAbove) {
        // On Android 13 and above, WRITE_EXTERNAL_STORAGE is granted by default
        return true;
      } else {
        try {
          const grants = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          ]);

          const allGranted = Object.values(grants).every(
            (status) => status === PermissionsAndroid.RESULTS.GRANTED
          );

          if (!allGranted) {
            Alert.alert('Permissions required', 'Please grant all permissions to use this feature.');
            return false;
          }
          return true;
        } catch (err) {
          console.warn(err);
          return false;
        }
      }
    }
    return true;
  };

  const getAudioFilePath = () => {
    const fileName = `audio_${Date.now()}.mp3`;
    if (Platform.OS === 'android') {
      return `${RNFS.ExternalStorageDirectoryPath}/Music/${fileName}`;
    } else {
      return `${RNFS.DocumentDirectoryPath}/${fileName}`;
    }
  };

  const startRecording = async () => {
    if (recording) {
      Alert.alert('Error', 'Recording is already in progress.');
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      return;
    }

    const path = getAudioFilePath();
    setAudioPath(path);

    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };

    try {
      const result = await audioRecorderPlayer.startRecorder(path, audioSet);
      audioRecorderPlayer.addRecordBackListener((e) => {
        console.log('Recording . . . ', e.currentPosition);
      });
      console.log('Recording started', result);
      setRecording(true);
      Alert.alert('Recording started', `File will be saved to: ${path}`);
    } catch (error) {
      console.error('Error starting recording:', error);
      Alert.alert('Error', `Failed to start recording: ${error}`);
    }
  };

  const stopRecording = async () => {
    if (!recording) {
      Alert.alert('Error', 'No recording is in progress.');
      return;
    }

    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setRecording(false);
      Alert.alert('Recording stopped', `File saved at: ${result}`);
      navigation.navigate('PlayAudio', { audioPath: result });
    } catch (error) {
      console.error('Error stopping recording:', error);
      Alert.alert('Error', `Failed to stop recording: ${error}`);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Start Recording" onPress={startRecording} disabled={recording} />
      <View style={styles.buttonGap} />
      <Button title="Stop Recording" onPress={stopRecording} disabled={!recording} />
      <View style={styles.buttonGap} />
      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default RecordAudioScreen;
