// VocaFolders.js
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const folders = [
  { id: '1', name: '기본 단어장' },
  { id: '2', name: '중급 단어장' },
  { id: '3', name: '고급 단어장' },
];

function VocaFolders({ navigation }) {
  const handleFolderPress = (folderId) => {
    navigation.navigate('Voca', { folderId });
  };

  const renderFolder = ({ item }) => (
    <TouchableOpacity onPress={() => handleFolderPress(item.id)}>
      <View style={styles.folderContainer}>
        <Text style={styles.folderName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={folders}
      renderItem={renderFolder}
      keyExtractor={(item) => item.id}
      style={styles.flatList}
    />
  );
}

export default VocaFolders;

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    paddingHorizontal: 25,
    paddingVertical: 30,
  },
  folderContainer: {
    backgroundColor: '#F8F9FC',
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#EAECF5',
    marginVertical: 8,
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  folderName: {
    fontSize: 17,
    fontWeight: 'bold',
  },
});
