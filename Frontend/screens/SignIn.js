import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

export default function SignIn() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.homeText}>English AI Tutor</Text>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("KakaoLogin", { screen: "KakaoLogin" })
        }
        style={styles.nextBottom}
      >
        <Text style={styles.bottomText}>카카오 로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Main")}>
        <Text style={styles.bottomText}>메인</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#8B93C7",
  },
  homeText: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 80,
    color: "white",
  },
  nextBottom: {
    backgroundColor: "#FFEB3B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
  },
  bottomText: {
    fontSize: 17,
    color: "black",
  },
});
