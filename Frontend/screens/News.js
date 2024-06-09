import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

function News() {
  const navigation = useNavigation();

  const [newsSentenceList, setNewsSentenceList] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const handleLevelPress = (level) => {
    setSelectedLevel(level);
  };

  const handleNavigate = async () => {
    await fetchSentence();
  };

  useEffect(() => {
    if (selectedLevel) {
      fetchArticles();
    }
  }, [selectedLevel]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://34.22.72.154:12300/api/writing/news/level/${selectedLevel}`
      );
      const data = await response.json();
      console.log(data);
      setArticles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSentence = async () => {
    try {
      const response = await fetch(
        `http://34.22.72.154:12300/api/writing/news/${selectedId}`
      );
      const data = await response.json();
      setNewsSentenceList(data);
      navigation.navigate("WritingNews", {
        newsSentenceList: data,
        articleTitle: selectedArticle.title,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const renderArticleItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.item, selectedArticle === item && styles.selectedItem]}
      onPress={() => {
        setSelectedArticle(item);
        setSelectedId(item.id);
      }}
    >
      <Image source={{ uri: item.s3Url }} style={styles.image} />
      <View style={styles.news}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <View style={styles.optionContainer}>
        <Text style={styles.text}>난이도를 선택해주세요</Text>
        <ScrollView horizontal={true} contentContainerStyle={styles.container}>
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.option,
                selectedLevel === level && { backgroundColor: "#717BBC" },
              ]}
              activeOpacity={0.7}
              onPress={() => handleLevelPress(level)}
            >
              <Text style={styles.buttonText}>Level {level}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="0000ff" />
      ) : (
        <View>
          <View style={styles.newsContainer} horizontal={false}>
            <Text style={styles.text}>기사를 선택해주세요</Text>
            <FlatList
              data={articles}
              renderItem={renderArticleItem}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
          {selectedArticle && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleNavigate()}
            >
              <Text style={styles.buttonText}>테스트 시작</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

export default News;

const styles = StyleSheet.create({
  optionContainer: {
    marginTop: 8,
    borderColor: "#D9D9D9",
  },
  container: {
    flexDirection: "row",
    marginLeft: 10,
    paddingRight: 20,
    backgroundColor: "white",
  },
  option: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 6,
    backgroundColor: "#D9D9D9",
    borderRadius: 5,
  },
  text: {
    marginLeft: 15,
    marginVertical: 7,
  },
  newsContainer: {
    marginTop: 12,
    borderColor: "#D9D9D9",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 8,
    marginVertical: 7,
  },
  selectedItem: {
    borderColor: "#999999", // 선택된 기사의 테두리 색상
    borderWidth: 2, // 선택된 기사의 테두리 두께
  },
  news: {
    flex: 1,
    flexDirection: "column",
  },
  image: {
    width: 100,
    height: 60,
    marginRight: 10,
  },
  title: {
    flex: 1,
  },
  categoryContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#EBE9FE",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
  },
  button: {
    width: 380,
    backgroundColor: "#4E5BA6",
    alignSelf: "center",
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 100,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});
