import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

import Scan from "./screens/Scan";
import Voca from "./screens/Voca";
import News from "./screens/News";
import Chatting from "./screens/Chatting";
import Chat from "./screens/Chat";

const Tab = createBottomTabNavigator();

function BottomTabNavigation() {
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
          component={Scan}
          options={{
            title: "단어/발음 테스트",
            tabBarLabel: "단어/발음 테스트",
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
          component={News}
          options={{
            title: "영어 작문하기",
            tabBarLabel: "영어 작문",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="newspaper-outline" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Chat"
          component={Chat}
          options={{
            title: "챗봇과 대화하기",
            tabBarLabel: "회화 챗봇",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubbles" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function getTabBarVisibility(route) {
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : route.params?.screen || "Scan";

  if (routeName === "Scan" || routeName === "Voca") {
    return true;
  }

  return false;
}

export default BottomTabNavigation;
