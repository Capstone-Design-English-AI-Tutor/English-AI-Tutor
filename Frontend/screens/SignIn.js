import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

export default function SignIn() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.homeText}>로그인 화면</Text>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("KakaoLogin", { screen: "KakaoLogin" })
        }
        style={styles.nextBottom}
      >
        <Text style={styles.bottomText}>카카오 화면으로</Text>
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
    backgroundColor: "white",
  },
  homeText: {
    fontSize: 24,
    marginBottom: 20,
  },
  nextBottom: {
    backgroundColor: "#FFEB3B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  bottomText: {
    fontSize: 18,
    color: "black",
  },
});
