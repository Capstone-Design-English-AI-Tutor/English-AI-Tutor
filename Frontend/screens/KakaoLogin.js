import React, { useState } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const REST_API_KEY = "a06411c55dacfcfc075606f7c2ed0490";
const REDIRECT_URI = "http://34.22.72.154:12300/api/auth/login/kakao";
const INJECTED_JAVASCRIPT = `window.ReactNativeWebView.postMessage('message from webView')`;

const KakaoLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleKakaoLogin = async (authorizationCode) => {
    setLoading(true);

    try {
      const response = await fetch(
        `http://34.22.72.154:12300/api/auth/login/kakao?authorizationCode=${authorizationCode}&oauthProvider=KAKAO`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("Success:", data);

      // 토큰을 AsyncStorage에 저장
      //await AsyncStorage.setItem("userToken", data.token);

      // 메인 스크린으로 이동
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      navigation.navigate("Main");
    }
  };

  const KakaoLoginWebView = (data) => {
    const exp = "code=";
    let condition = data.indexOf(exp);
    if (condition != -1) {
      const authorizationCode = data.substring(condition + exp.length);
      handleKakaoLogin(authorizationCode);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <WebView
          style={{ flex: 1 }}
          originWhitelist={["*"]}
          scalesPageToFit={false}
          source={{
            uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`,
          }}
          injectedJavaScript={INJECTED_JAVASCRIPT}
          javaScriptEnabled
          onMessage={(event) => {
            KakaoLoginWebView(event.nativeEvent.data);
          }}
        />
      )}
    </View>
  );
};

export default KakaoLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
    backgroundColor: "#fff",
  },
});
