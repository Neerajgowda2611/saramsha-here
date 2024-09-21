import React from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
import styles from '../styles/styles';

const HomeScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SARAMSHAAA</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RecordAudio')}>
        <Text style={styles.buttonText}>Record Audio</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UploadAudio')}>
        <Text style={styles.buttonText}>Upload Audio</Text>
      </TouchableOpacity>
    </View>
  );
};

// Add styles here...

export default HomeScreen;
