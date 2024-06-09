import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

import SignIn from "./screens/SignIn";
import KakaoLogin from "./screens/KakaoLogin";
import Scan from "./screens/Scan";
import Voca from "./screens/Voca";
import News from "./screens/News";
import Chatting from "./screens/Chatting";
import Camera from "./screens/Camera";
import Test from "./screens/Test";
import TestKorean from "./screens/TestKorean";
import TestSentence from "./screens/TestSentence";
import WritingNews from "./screens/WritingNews";

import VoiceChat from "./screens/VoiceChat";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const ChatStack = createStackNavigator();
const ScanStack = createStackNavigator();
const WritingStack = createStackNavigator();

function ChatStackScreen() {
  return (
    <ChatStack.Navigator>
      <ChatStack.Screen
        name="Chatting"
        component={Chatting}
        options={{ headerShown: false }}
      />
      <ChatStack.Screen
        name="VoiceChat"
        component={VoiceChat}
        options={{ title: "회화 챗봇" }}
      />
    </ChatStack.Navigator>
  );
}

function ScanStackScreen() {
  return (
    <ScanStack.Navigator>
      <ScanStack.Screen
        name="Scan"
        component={Scan}
        options={{ headerShown: false }}
      />
      <ScanStack.Screen
        name="Camera"
        component={Camera}
        options={{
          title: "사진 찍기",
          tabBarStyle: { display: "none" },
        }}
      />
      <ScanStack.Screen
        name="Test"
        component={Test}
        options={{ headerShown: false }}
      />
      <ScanStack.Screen
        name="TestKorean"
        component={TestKorean}
        options={{ headerShown: false }}
      />
      <ScanStack.Screen
        name="TestSentence"
        component={TestSentence}
        options={{ headerShown: false }}
      />
    </ScanStack.Navigator>
  );
}

function WritingStackScreen() {
  return (
    < WritingStack.Navigator>
      < WritingStack.Screen
        name="Writing"
        component={News}
        options={{ headerShown: false }}
      />
      < WritingStack.Screen
        name="WritingNews"
        component={WritingNews}
        options={{ headerShown: "영어 작문" }}
      />
    </ WritingStack.Navigator>
  );
}


function BottomTabNavigation() {
  return (
    <Tab.Navigator
      initialRouteName="Scan"
      screenOptions={({ route }) => ({
        tabBarVisible: getTabBarVisibility(route),
        tabBarActiveTintColor: "#3E1C96",
        tabBarInactiveTintColor: "#C8B9EF",
      })}
    >
      <Tab.Screen
        name="Scan"
        component={ScanStackScreen}
        options={{
          title: "단어 테스트",
          tabBarLabel: "단어 테스트",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="scan" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Voca"
        component={Voca}
        options={{
          title: "저장한 단어",
          tabBarLabel: "저장한 단어",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmark" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="News"
        component={WritingStackScreen}
        options={{
          title: "영어 작문하기",
          tabBarLabel: "영어 작문",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Chatting"
        component={ChatStackScreen}
        options={{
          title: "챗봇과 대화하기",
          tabBarLabel: "회화 챗봇",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function getTabBarVisibility(route) {
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : route.params?.screen || "Scan";

  if (routeName === "Test" || routeName === "Camera" || routeName === "TestSentence") {
    return false;
  }

  return true;
}
function AppNavigator() {
  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: "white",
        },
      }}
    >
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="KakaoLogin"
          component={KakaoLogin}
          options={{ title: "카카오 로그인" }}
        />
        <Stack.Screen
          name="Main"
          component={BottomTabNavigation}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
