import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import recordingimg from "../assets/recording.png";
import recordingstopimg from "../assets/recordingstop.png";
import { TouchableOpacity } from "react-native-gesture-handler";
import axios from "axios";

const VoiceChatting = ({ route }) => {
  const { id } = route.params;

  const [log, setLog] = useState("");
  const [recording, setRecording] = useState(null);
  const [recordingUri, setRecordingUri] = useState(null);
  const [audio, setAudio] = useState(null); // 웹소켓 응답
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState("");

  const ws = useRef(null);
  const soundRef = useRef(new Audio.Sound());

  useEffect(() => {
    ws.current = new WebSocket(
      `ws://34.22.72.154:12300/api/conversation/websocket/110ec58a-a0f2-4ac4-8393-c866d813b8d1?conversation_id=${id}`
    );

    ws.current.onopen = () => {
      setLog("서버에 접속했습니다.");
      setHint("");
      console.log("WebSocket connected");
    };

    ws.current.onmessage = async (event) => {
      setLoading(false);
      if (event.data instanceof ArrayBuffer) {
        // ArrayBuffer로부터 오디오 데이터를 읽고 base64로 변환
        const base64Audio = arrayBufferToBase64(event.data);
        const uri = await saveBase64AsAudioFile(base64Audio);
        setAudio(uri);
        await playAudio(uri);
      } else {
        console.log("Receive message of unknown type:", event.data);
      }
    };

    ws.current.onerror = (error) => {
      console.log("WebSocket error:", error);
      setLog(`오류가 발생했습니다: ${error.message}`);
      setLoading(false); // 에러가 발생하면 로딩 상태를 false로 설정
    };

    ws.current.onclose = (event) => {
      setLog(`서버 접속을 해제했습니다.`);
      setHint("");
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

    // mp3로 저장할 경로 생성
    const mp3Uri = `${FileSystem.cacheDirectory}recorded_audio.mp3`;
    await FileSystem.copyAsync({
      from: uri,
      to: mp3Uri,
    });

    try {
      const file = await fetch(mp3Uri);
      const fileBlob = await file.blob();

      const reader = new FileReader();
      reader.onloadend = () => {
        const arrayBuffer = reader.result;

        // ArrayBuffer를 WebSocket을 통해 전송
        setLoading(true); // 전송 시작시 로딩 상태를 true로 설정
        ws.current.send(arrayBuffer);
        setHint("");
      };
      reader.readAsArrayBuffer(fileBlob);
    } catch (error) {
      console.error("Failed to read audio data", error);
      setLoading(false); // 실패 시 로딩 상태를 false로 설정
    }
  };

  const handleGetHint = async () => {
    try {
      const channelId = "110ec58a-a0f2-4ac4-8393-c866d813b8d1"; // 필요한 채널 ID를 여기에 입력
      const result = await axios.post(
        `http://34.22.72.154:12300/api/conversation/help?channelId=${channelId}`
      );
      console.log(result.data);
      setHint(result.data);
    } catch (error) {
      console.error(error);
      setHint("Error occurred while fetching help. Please try again.");
    }
  };

  const disconnectWebSocket = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.close();
      setLog("WebSocket disconnected");
    } else {
      setLog("WebSocket is already disconnected");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text>{log}</Text>
      
      <TouchableOpacity style={styles.stopButton} onPress={disconnectWebSocket}>
        <Text>종료하기</Text>
      </TouchableOpacity>
      </View>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      {hint && (
        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>{hint}</Text>
        </View>
      )}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={handleGetHint}>
          <Text>힌트 보기</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
          <Image source={recording ? recordingstopimg : recordingimg} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => playAudio(audio)}
        >
          <Text>다시 듣기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VoiceChatting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  topContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    justifyContent: "space-between"
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
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  bottomContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: 30,
    bottom: 80,
  },
  button: {
    padding: 20,
    backgroundColor: "#d9d9d9",
    borderRadius: 20,
    marginHorizontal: 20,
  },
  stopButton: {
    padding: 12,
    backgroundColor: "#F88600",
    borderRadius: 20,
    marginRight: 20,
    marginLeft: 10,
  },
  hintContainer: {
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    marginTop: 50,
  },
  hintText: {
    fontSize: 17,
    color: "#333",
  },
});
