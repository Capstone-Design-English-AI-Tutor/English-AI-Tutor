import React, { useEffect, useState, useRef } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";

const VoiceChat = () => {
  const [messages, setMessages] = useState([]);
  const [recording, setRecording] = useState(null);
  const [recordingUri, setRecordingUri] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [audio, setAudio] = useState(null);
  const ws = useRef(null);
  const soundRef = useRef(new Audio.Sound());

  useEffect(() => {
    ws.current = new WebSocket(
      "ws://34.22.72.154:12300/api/conversation/websocket/110ec58a-a0f2-4ac4-8393-c866d813b8d1?conversation_id=1"
    );

    ws.current.onopen = () => {
      setIsConnected(true);
      console.log("WebSocket connected");
    };

    ws.current.onmessage = async (event) => {
      // 데이터가 string인지 확인
      if (typeof event.data === "string") {
        console.log("Receive text message:", event.data);
      } else if (event.data instanceof Blob) {
        // 데이터가 Blob인지 확인
        console.log("Receive Blob message:", event.data);
      } else if (event.data instanceof ArrayBuffer) {
        // ArrayBuffer로부터 오디오 데이터를 읽고 처리
        console.log("Received ArrayBuffer message:", event.data);

        // ArrayBuffer를 확인하는 코드
        const uint8Array = new Uint8Array(event.data);
        console.log("Uint8Array:", uint8Array);

        // ArrayBuffer를 base64로 변환
        const base64Audio = arrayBufferToBase64(event.data);
        const uri = await saveBase64AsAudioFile(base64Audio);
        setAudio(uri);
        await playAudio(uri);
      } else {
        // 다른 유형의 데이터
        console.log("Receive message of unknown type:", event.data);
      }
    };

    ws.current.onerror = (error) => {
      console.log("WebSocket error:", error);
    };

    ws.current.onclose = () => {
      setIsConnected(false);
      console.log("WebSocket connection closed");
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const saveBase64AsAudioFile = async (base64) => {
    const fileUri = `${FileSystem.cacheDirectory}audio.mp3`;
    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return fileUri;
  };

  const playAudio = async (uri) => {
    try {
      await soundRef.current.unloadAsync();
      await soundRef.current.loadAsync({ uri });
      await soundRef.current.playAsync();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  /*
  const saveAudio = async (base64Data) => {
    const uri = FileSystem.documentDirectory + "audio.mp3";
    await FileSystem.writeAsStringAsync(uri, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return uri;
  };

  const handleMessage = async (audioBase64) => {
    try {
      const uri = FileSystem.documentDirectory + "tempRecording.mp3";
      await FileSystem.writeAsStringAsync(uri, audioBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log("파일 저장", uri);

      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "sent", content: "Hello", uri: audioBase64 },
      ]);

      await playRecording(audioBase64);
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };
*/
  const startRecording = async () => {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log("Starting recording..");
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      setRecording(recording);
      setRecordingUri(null); // 녹음 시작할 때 URI 초기화
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecordingUri(uri);
    console.log("Recording stopped and stored at", uri);

    const audioBase64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    ws.current.send(audioBase64);
    console.log("Recording sent", audioBase64);

    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "sent", content: "Sent audio message", uri },
    ]);
  };

  const playRecording = async (uri) => {
    if (uri) {
      const { sound } = await Audio.Sound.createAsync({ uri });
      await sound.playAsync();
    } else {
      console.log("No recording to play");
    }
  };

  const sendMessage = async () => {
    if (recordingUri) {
      try {
        const audioBase64 = await FileSystem.readAsStringAsync(recordingUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        ws.current.send(audioBase64);

        setMessages((prevMessages) => [
          ...prevMessages,
          { type: "sent", content: "Hello", uri: recordingUri },
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Play" onPress={() => playAudio(audio)} />
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.type === "sent" ? styles.sent : styles.received,
            ]}
          >
            <Text>{item.content}</Text>
            {item.uri && (
              <Button title="Play" onPress={() => playRecording(item.uri)} />
            )}
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <Button title="Send Text" onPress={sendMessage} />
      <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
      />
      {/*녹음된 소리 재생 */}
      {recordingUri && (
        <Button title="Play recording" onPress={playRecording(recordingUri)} />
      )}
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
