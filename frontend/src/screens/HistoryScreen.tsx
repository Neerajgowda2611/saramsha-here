// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Sound from 'react-native-sound';
// import RNFS from 'react-native-fs';
// import styles from '../styles/styles';

// type HistoryItem = {
//   audioPath: string;
//   timestamp: number;
//   transcription: string;
//   summary: string;
// };

// const HistoryScreen = ({ navigation }: { navigation: any }) => {
//   const [history, setHistory] = useState<HistoryItem[]>([]);
//   const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
//   const [soundInstance, setSoundInstance] = useState<Sound | null>(null);
//   const [isPlaying, setIsPlaying] = useState(false);

//   useEffect(() => {
//     const loadHistory = async () => {
//       const storedHistory = await AsyncStorage.getItem('history');
//       if (storedHistory) {
//         setHistory(JSON.parse(storedHistory));
//       }
//     };
//     loadHistory();
//   }, []);

//   const playAudio = async (path: string) => {
//     if (soundInstance) {
//       soundInstance.release(); // Release any previous instance of Sound
//     }

//     let localPath = path;

//     if (path.startsWith('content://') || path.startsWith('file://')) {
//       try {
//         const destPath = `${RNFS.DocumentDirectoryPath}/temp_audio_${Date.now()}.mp3`;
//         await RNFS.copyFile(path, destPath);
//         localPath = destPath;
//         console.log('File copied to:', destPath);
//       } catch (error) {
//         Alert.alert('Error', 'Failed to copy the audio file to a local directory.');
//         console.error('Failed to copy audio file', error);
//         return;
//       }
//     }

//     const sound = new Sound(localPath, '', (error) => {
//       if (error) {
//         Alert.alert('Error', 'Failed to load the audio file.');
//         console.error('Failed to load sound', error);
//         return;
//       }
//       sound.play((success) => {
//         if (success) {
//           setIsPlaying(false);
//         } else {
//           Alert.alert('Error', 'Failed to play the audio.');
//           setIsPlaying(false);
//         }
//       });
//     });

//     setSoundInstance(sound);
//     setIsPlaying(true);
//   };

//   const stopAudio = () => {
//     if (soundInstance) {
//       soundInstance.stop(() => setIsPlaying(false));
//     }
//   };

//   const renderHistoryItem = ({ item }: { item: HistoryItem }) => {
//     const fileName = item.audioPath.split('/').pop(); // Extract the file name from the path

//     return (
//       <TouchableOpacity
//         onPress={() => setSelectedItem(item)}
//         style={styles.historyItem}
//       >
//         {/* Wrap each text inside a <Text> component */}
//         <Text>{fileName}</Text>
//         <Text>{new Date(item.timestamp).toLocaleString()}</Text>
//       </TouchableOpacity>
//     );
//   };

//   const renderAudioControls = () => (
//     <View style={styles.audioControls}>
//       <Button
//         title="Play"
//         onPress={() => selectedItem && playAudio(selectedItem.audioPath)}
//         disabled={isPlaying}
//       />
//       <Button
//         title="Stop"
//         onPress={stopAudio}
//         disabled={!isPlaying}
//       />
//       <Button
//         title="View"
//         onPress={() => selectedItem && navigation.navigate('ViewScreen', {
//           transcript: selectedItem.transcription,
//           summary: selectedItem.summary,
//         })}
//       />
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>History</Text>

//       <FlatList
//         data={history}
//         renderItem={renderHistoryItem}
//         keyExtractor={(item, index) => index.toString()}
//       />

//       {selectedItem && selectedItem.audioPath && (
//         <View style={styles.selectedItemContainer}>
//           {/* Ensure that the text is properly wrapped */}
//           <Text style={styles.selectedItemText}>
//             Selected File: {selectedItem.audioPath.split('/').pop()}
//           </Text>
//           {renderAudioControls()}
//         </View>
//       )}
//     </View>
//   );
// };

// export default HistoryScreen;


////////////////////////////////////////////////////////////////////////////////////////////////

// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, FlatList, TouchableOpacity, Alert, TouchableWithoutFeedback } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Sound from 'react-native-sound';
// import RNFS from 'react-native-fs';
// import styles from '../styles/styles';

// type HistoryItem = {
//   audioPath: string;
//   timestamp: number;
//   transcription: string;
//   summary: string;
// };

// const HistoryScreen = ({ navigation }: { navigation: any }) => {
//   const [history, setHistory] = useState<HistoryItem[]>([]);
//   const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
//   const [soundInstance, setSoundInstance] = useState<Sound | null>(null);
//   const [isPlaying, setIsPlaying] = useState(false);

//   useEffect(() => {
//     const loadHistory = async () => {
//       const storedHistory = await AsyncStorage.getItem('history');
//       if (storedHistory) {
//         setHistory(JSON.parse(storedHistory));
//       }
//     };
//     loadHistory();
//   }, []);

//   const playAudio = async (path: string) => {
//     if (soundInstance) {
//       soundInstance.release(); // Release any previous instance of Sound
//     }

//     let localPath = path;
//     console.log('Trying to play audio from path:', localPath);

//     try {
//       // Check if file exists
//       const fileExists = await RNFS.exists(localPath);
//       if (!fileExists) {
//         Alert.alert('Error', 'Audio file does not exist.');
//         console.error('Audio file does not exist:', localPath);
//         return;
//       }

//       // Load and play the audio
//       const sound = new Sound(localPath, '', (error) => {
//         if (error) {
//           Alert.alert('Error', 'Failed to load the audio file.');
//           console.error('Failed to load sound', error);
//           return;
//         }
//         sound.play((success) => {
//           if (success) {
//             setIsPlaying(false);
//           } else {
//             Alert.alert('Error', 'Failed to play the audio.');
//             console.error('Failed to play the audio.');
//             setIsPlaying(false);
//           }
//         });
//       });

//       setSoundInstance(sound);
//       setIsPlaying(true);
//     } catch (error) {
//       Alert.alert('Error', 'An error occurred while trying to play the audio.');
//       console.error('Error playing audio:', error);
//     }
//   };

//   const stopAudio = () => {
//     if (soundInstance) {
//       soundInstance.stop(() => setIsPlaying(false));
//     }
//   };

//   const deleteFile = async (item: HistoryItem) => {
//     try {
//       // Remove the file from the file system
//       await RNFS.unlink(item.audioPath);

//       // Update the history in AsyncStorage by removing the deleted item
//       const updatedHistory = history.filter(historyItem => historyItem !== item);
//       await AsyncStorage.setItem('history', JSON.stringify(updatedHistory));
//       setHistory(updatedHistory);

//       Alert.alert('Success', 'Audio file deleted successfully.');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to delete the audio file.');
//       console.error('Failed to delete audio file', error);
//     }
//   };

//   const renderHistoryItem = ({ item }: { item: HistoryItem }) => {
//     const fileName = item.audioPath.split('/').pop(); // Extract the file name from the path

//     return (
//       <TouchableWithoutFeedback
//         onLongPress={() => {
//           Alert.alert(
//             'Delete File',
//             'Are you sure you want to delete this file?',
//             [
//               { text: 'Cancel', style: 'cancel' },
//               {
//                 text: 'Delete',
//                 onPress: () => deleteFile(item),
//                 style: 'destructive',
//               },
//             ],
//             { cancelable: true }
//           );
//         }}
//         onPress={() => setSelectedItem(item)}
//       >
//         <View style={styles.historyItem}>
//           <Text>{fileName}</Text>
//           <Text>{new Date(item.timestamp).toLocaleString()}</Text>
//         </View>
//       </TouchableWithoutFeedback>
//     );
//   };

//   const renderAudioControls = () => (
//     <View style={styles.audioControls}>
//       <Button
//         title="Play"
//         onPress={() => selectedItem && playAudio(selectedItem.audioPath)}
//         disabled={isPlaying}
//       />
//       <Button
//         title="Stop"
//         onPress={stopAudio}
//         disabled={!isPlaying}
//       />
//       <Button
//         title="View"
//         onPress={() => selectedItem && navigation.navigate('ViewScreen', {
//           transcript: selectedItem.transcription,
//           summary: selectedItem.summary,
//         })}
//       />
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>History</Text>

//       <FlatList
//         data={history}
//         renderItem={renderHistoryItem}
//         keyExtractor={(item, index) => index.toString()}
//       />

//       {selectedItem && selectedItem.audioPath && (
//         <View style={styles.selectedItemContainer}>
//           <Text style={styles.selectedItemText}>
//             Selected File: {selectedItem.audioPath.split('/').pop()}
//           </Text>
//           {renderAudioControls()}
//         </View>
//       )}
//     </View>
//   );
// };

// export default HistoryScreen;



/////////////////////////////////////////////////////////////////////////////////////

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  useColorScheme, // Import to detect system theme
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';
import styles from '../styles/styles';

type HistoryItem = {
  audioPath: string;
  timestamp: number;
  transcription: string;
  summary: string;
};

const HistoryScreen = ({ navigation }: { navigation: any }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [soundInstance, setSoundInstance] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const colorScheme = useColorScheme(); // Detect system's color scheme

  const isDarkMode = colorScheme === 'dark';

  useEffect(() => {
    const loadHistory = async () => {
      const storedHistory = await AsyncStorage.getItem('history');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    };
    loadHistory();
  }, []);

  const playAudio = async (path: string) => {
    if (soundInstance) {
      soundInstance.release(); // Release any previous instance of Sound
    }

    let localPath = path;
    console.log('Trying to play audio from path:', localPath);

    try {
      const fileExists = await RNFS.exists(localPath);
      if (!fileExists) {
        Alert.alert('Error', 'Audio file does not exist.');
        console.error('Audio file does not exist:', localPath);
        return;
      }

      const sound = new Sound(localPath, '', (error) => {
        if (error) {
          Alert.alert('Error', 'Failed to load the audio file.');
          console.error('Failed to load sound', error);
          return;
        }
        sound.play((success) => {
          if (success) {
            setIsPlaying(false);
          } else {
            Alert.alert('Error', 'Failed to play the audio.');
            console.error('Failed to play the audio.');
            setIsPlaying(false);
          }
        });
      });

      setSoundInstance(sound);
      setIsPlaying(true);
    } catch (error) {
      Alert.alert('Error', 'An error occurred while trying to play the audio.');
      console.error('Error playing audio:', error);
    }
  };

  const stopAudio = () => {
    if (soundInstance) {
      soundInstance.stop(() => setIsPlaying(false));
    }
  };

  const deleteFile = async (item: HistoryItem) => {
    try {
      await RNFS.unlink(item.audioPath);

      const updatedHistory = history.filter(historyItem => historyItem !== item);
      await AsyncStorage.setItem('history', JSON.stringify(updatedHistory));
      setHistory(updatedHistory);

      Alert.alert('Success', 'Audio file deleted successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete the audio file.');
      console.error('Failed to delete audio file', error);
    }
  };

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => {
    const fileName = item.audioPath.split('/').pop();

    return (
      <TouchableWithoutFeedback
        onLongPress={() => {
          Alert.alert(
            'Delete File',
            'Are you sure you want to delete this file?',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete',
                onPress: () => deleteFile(item),
                style: 'destructive',
              },
            ],
            { cancelable: true }
          );
        }}
        onPress={() => setSelectedItem(item)}
      >
        <View style={styles.historyItem}>
          <Text style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>{fileName}</Text>
          <Text style={{ color: isDarkMode ? '#BBBBBB' : '#555555' }}>
            {new Date(item.timestamp).toLocaleString()}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderAudioControls = () => (
    <View style={styles.audioControls}>
      <Button
        title="Play"
        onPress={() => selectedItem && playAudio(selectedItem.audioPath)}
        disabled={isPlaying}
      />
      <Button
        title="Stop"
        onPress={stopAudio}
        disabled={!isPlaying}
      />
      <Button
        title="View"
        onPress={() => selectedItem && navigation.navigate('ViewScreen', {
          transcript: selectedItem.transcription,
          summary: selectedItem.summary,
        })}
      />
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#333333' : '#FFFFFF' } // Adjust background based on theme
      ]}
    >
      <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
        History
      </Text>

      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={(item, index) => index.toString()}
      />

      {selectedItem && selectedItem.audioPath && (
        <View style={styles.selectedItemContainer}>
          <Text style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}>
            Selected File: {selectedItem.audioPath.split('/').pop()}
          </Text>
          {renderAudioControls()}
        </View>
      )}
    </View>
  );
};

export default HistoryScreen;
