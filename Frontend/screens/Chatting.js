import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import friend from "../assets/friend.png";
import burger from "../assets/burger.png";
import shopping from "../assets/shopping.png";
import car from "../assets/car.png";

const DATA = [
  { id: "1", title: "일상 대화", image: friend },
  { id: "2", title: "면접 상황", image: burger },
  { id: "3", title: "토론 상황", image: shopping },
  { id: "4", title: "여행 상황", image: car },
];

function Chatting() {
  const navigation = useNavigation();
  const [list, setList] = useState([]);

  const fetchSentence = async () => {
    try {
      const response = await fetch(
        `http://34.22.72.154:12300/api/conversation/list`
      );
      const data = await response.json();
      console.log(data);
      setList(data);
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate("VoiceChat", { id: item.id })}
    >
      <Image source={item.image} style={styles.image} />
      <View style={styles.text_container}>
        <Text style={styles.text}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
      />
      <TouchableOpacity onPress={() => fetchSentence()}>
        <Text>가져오기</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Chatting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  item: {
    flex: 1,
    margin: 10,
    backgroundColor: "F8F9FC",
    borderRadius: 20,
    borderWidth: 0.7,
    borderColor: "D5D9EB",
    justifyContent: "center",
    paddingVertical: 15,
    position: "relative",
  },
  text_container: {
    position: "absolute",
    bottom: 7,
    alignSelf: "center",
  },
  image: {
    marginBottom: 10,
    alignSelf: "center",
  },
  text: {
    textAlign: "center",
    fontWeight: "bold",
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
});
