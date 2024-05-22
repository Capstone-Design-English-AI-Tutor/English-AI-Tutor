import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TextInput,
  StyleSheet,
} from "react-native";
import { Audio } from "expo-av";
import base64 from "react-native-base64";

const VoiceChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(
      "ws://34.22.72.154:12300/api/conversation/websocket/110ec58a-a0f2-4ac4-8393-c866d813b8d1?conversation_id=1"
    );

    ws.current.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.current.onmessage = (event) => {
      const audioFileUri = event.data;
      handleMessage(audioFileUri);
    };

    ws.current.onerror = (error) => {
      console.log("WebSocket error:", error);
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const handleMessage = async (audioFileUri) => {
    const sound = new Audio.Sound();
    try {
      await sound.loadAsync({ uri: audioFileUri.file, shouldPlay: true });
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "received", content: "Received audio message" },
    ]);
  };

  const sendMessage = () => {
    if (inputText) {
      const binaryMessage = base64.encode(inputText);
      ws.current.send(binaryMessage);

      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "sent", content: inputText },
      ]);
      setInputText("");
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View
            syle={[
              styles.message,
              item.type === "sent" ? styles.sent : styles.received,
            ]}
          >
            <Text>{item.content}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <TextInput
        value={inputText}
        onChangeText={setInputText}
        placeholder="Enter your message"
        style={styles.input}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};

export default VoiceChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  message: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 5,
  },
  sent: {
    backgroundColor: "lightblue",
    alignSelf: "flex-end",
  },
  received: {
    backgroundColor: "lightgreen",
    alignSelf: "flex-start",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginVertical: 10,
  },
});
