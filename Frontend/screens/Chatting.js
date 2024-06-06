import React from "react";
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
  { id: "1", title: "새학기 친구 사귀기", image: friend },
  { id: "2", title: "식당에서 음식 주문하기", image: burger },
  { id: "3", title: "옷가게에서", image: shopping },
  { id: "4", title: "친구와 여행", image: car },
];

function Chatting() {
  const navigation = useNavigation();
  
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate("VoiceChat")}
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
