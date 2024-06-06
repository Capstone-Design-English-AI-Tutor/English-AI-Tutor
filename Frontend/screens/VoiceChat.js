import React, { useEffect, useState, useRef } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

const VoiceChatting = () => {
  const [log, setLog] = useState('');
  const [messages, setMessages] = useState([]);
  const [recording, setRecording] = useState(null);
  const [recordingUri, setRecordingUri] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [receivedMsg, setReceivedMsg] = useState([]);
  const [audio, setAudio] = useState(null); // 웹소켓 응답
  const ws = useRef(null);
  const soundRef = useRef(new Audio.Sound());

  useEffect(() => {
    ws.current = new WebSocket(
      "ws://34.22.72.154:12300/api/conversation/websocket/110ec58a-a0f2-4ac4-8393-c866d813b8d1?conversation_id=1"
    );

    ws.current.onopen = () => {
      setLog('Connected to WebSocket server');
      console.log("WebSocket connected");
    };

    ws.current.onmessage = async (event) => {
      console.log("응답", event.data);
      if (event.data instanceof ArrayBuffer) {
        // ArrayBuffer로부터 오디오 데이터를 읽고 base64로 변환
        const uint8Array = new Uint8Array(event.data);
        console.log("Uint8Array:", uint8Array);

        const base64Audio = arrayBufferToBase64(event.data);
        const uri = await saveBase64AsAudioFile(base64Audio);
        setAudio(uri);
        await playAudio(uri);
        setReceivedMsg((prevMsg) => [
          ...prevMsg,
          { type: "received", content: "Received", uri: uri },
        ]);
      } else {
        console.log("Receive message of unknown type:", event.data);
      }
    };

    ws.current.onerror = (error) => {
      console.log("WebSocket error:", error);
      setLog(`WebSocket error: ${error.message}`);
    };

    ws.current.onclose = (event) => {
      setLog(`Disconnected from WebSocket server: ${event.reason}`);
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
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    console.log("received and save data", fileUri);
    console.log("응답사이즈", fileInfo.size)
    return fileUri;
  };

  const playAudio = async (uri) => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      await soundRef.current.unloadAsync();
      await soundRef.current.loadAsync({ uri });
      await soundRef.current.playAsync();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  // 사용자 음성 녹음
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

    setRecordingUri(uri); // 저장된 URI를 state에 저장
    await playAudio(uri);

    // mp3로 저장할 경로 생성
    const mp3Uri = `${FileSystem.cacheDirectory}recorded_audio.mp3`;
    await FileSystem.copyAsync({
      from: uri,
      to: mp3Uri,
    });
    console.log("mp3변환", mp3Uri);
    const fileInfo = await FileSystem.getInfoAsync(mp3Uri);
    console.log("recording data", mp3Uri);
    console.log("사이즈", fileInfo.size)

    try {
      const file = await fetch(mp3Uri);
      const fileBlob = await file.blob();

      const reader = new FileReader();
      reader.onloadend = () => {
        const arrayBuffer = reader.result;

        // ArrayBuffer를 WebSocket을 통해 전송
        ws.current.send(arrayBuffer);
        const base64 = arrayBufferToBase64(arrayBuffer);
        //ws.current.send(base64);
        //console.log("base64", base64);

        setMessages((prevMessages) => [
          ...prevMessages,
          { type: "sent", content: "Sent audio message", uri: mp3Uri },
        ]);
      };
      reader.readAsArrayBuffer(fileBlob);
    } catch (error) {
      console.error("Failed to read audio data", error);
    }
  };

  const base64ToArrayBuffer = (base64) => {
    let binaryString = "";
    binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  const playRecording = async (uri) => {
    if (uri) {
      const { sound } = await Audio.Sound.createAsync({ uri });
      await sound.playAsync();
      console.log("리코딩", recordingUri);
    } else {
      console.log("No recording to play");
    }
  };

  return (
    <View style={styles.container}>
      <Text>{log}</Text>
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
      <FlatList
        data={receivedMsg}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.type === "received" ? styles.received : styles.sent,
            ]}
          >
            <Text>{item.content}</Text>
            {audio && <Button title="Play" onPress={() => playAudio(audio)} />}
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
      />
  
    </View>
  );
};

export default VoiceChatting;

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