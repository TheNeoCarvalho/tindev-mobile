import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import io from "socket.io-client";
import api from "../services/api";

import logo from "../assets/logo.png";
import like from "../assets/like.png";
import dislike from "../assets/dislike.png";
import itsamatch from "../assets/itsamatch.png";

export default function Main({ navigation }) {
  const id = navigation.getParam("user");

  const [matchDev, setMatchDev] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadtUsers() {
      const response = await api.get("/devs", {
        headers: {
          user: id
        }
      });
      setUsers(response.data);
    }

    loadtUsers();
  }, [id]);

  useEffect(() => {
    const socket = io("https://tindev-backend-hekxjqtqkt.now.sh", {
      query: { user: id }
    });

    socket.on("match", dev => {
      setMatchDev(dev);
    });
  }, [id]);

  async function handleDislike() {
    const [user, ...rest] = users;

    await api.post(`/devs/${user._id}/dislikes`, null, {
      headers: {
        user: id
      }
    });
    setUsers(rest);
  }

  async function handleLike() {
    const [user, ...rest] = users;

    await api.post(`/devs/${user._id}/likes`, null, {
      headers: {
        user: id
      }
    });
    setUsers(rest);
  }

  async function handleLogout() {
    await AsyncStorage.clear();

    navigation.navigate("Login");
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleLogout}>
        <Image style={styles.logo} source={logo} />
      </TouchableOpacity>
      <View style={styles.cardsContainer}>
        {users.length === 0 ? (
          <Text style={styles.empty}>Acabou ... :(</Text>
        ) : (
          users.map((user, index) => (
            <View
              key={user._id}
              style={[styles.card, { zIndex: users.length - index }]}
            >
              <Image style={styles.avatar} source={{ uri: user.avatar }} />
              <View style={styles.footer}>
                <Text style={styles.name}>{user.name}</Text>
                <Text numberOfLines={3} style={styles.bio}>
                  {user.bio}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      {users.length > 0 && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleDislike}>
            <Text>
              <Image source={dislike} />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLike}>
            <Text>
              <Image source={like} />
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {matchDev && (
        <View style={styles.matchContainer}>
          <Image style={styles.itsamatchImage} source={itsamatch} />
          <Image style={styles.matchAvatar} source={{ uri: matchDev.avatar }} />
          <Text style={styles.matchName}>{matchDev.name}</Text>
          <Text style={styles.matchBio}>{matchDev.bio}</Text>

          <TouchableOpacity onPress={() => setMatchDev(null)}>
            <Text style={styles.matchClose}>Fechar</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "space-between"
  },
  logo: {
    marginTop: 10
  },
  cardsContainer: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "center",
    maxHeight: 500
  },
  card: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    margin: 30,
    overflow: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  avatar: {
    flex: 1,
    height: 300
  },
  footer: {
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333"
  },
  bio: {
    fontSize: 16,
    color: "#999",
    marginTop: 5,
    lineHeight: 18
  },
  buttonsContainer: {
    flexDirection: "row",
    marginBottom: 50
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2
    }
  },
  empty: {
    alignSelf: "center",
    color: "#999",
    fontSize: 28,
    justifyContent: "center",
    alignItems: "center"
  },
  matchContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100
  },
  itsamatchImage: {
    height: 60,
    resizeMode: "contain"
  },
  matchAvatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 5,
    borderColor: "#7159c1",
    marginVertical: 30
  },
  matchName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff"
  },
  matchBio: {
    marginTop: 10,
    margin: 10,
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    fontWeight: "bold"
  },
  matchClose: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: "bold",
    color: "#FFF"
  }
});
