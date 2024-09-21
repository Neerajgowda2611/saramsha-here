import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import styles from '../styles/styles';

const UploadAudioScreen = ({ navigation }: { navigation: any }) => {
  const [audioUri, setAudioUri] = useState<string>('');
  const [fileName, setFileName] = useState<string>(''); // State to hold file name

  // Function to pick audio file
  const pickAudio = async () => {
    try {
      const result = await DocumentPicker.pick({ type: ['audio/*'] });
      if (result.length > 0) {
        const selectedFile = result[0];
        setAudioUri(selectedFile.uri); // Save the URI
        setFileName(selectedFile.name || 'Unknown file'); // Set the file name or a default value
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        Alert.alert('User canceled the picker');
      } else {
        Alert.alert('Unknown error occurred: ' + error);
      }
    }
  };

  // Function to play audio
  const playAudio = () => {
    if (!audioUri) {
      Alert.alert('No audio file selected');
      return;
    }
    navigation.navigate('PlayAudio', { audioPath: audioUri });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Audio</Text>
      <Button title="Upload Audio File" onPress={pickAudio} />
      {fileName ? <Text style={styles.fileName}>Selected File: {fileName}</Text> : null}
      <View style={styles.buttonGap} />
      <Button title="Next" onPress={playAudio} disabled={!audioUri} />
      <View style={styles.buttonGap} />
      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default UploadAudioScreen;
