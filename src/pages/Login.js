import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  Platform,
  TextInput,
  TouchableHighlight
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

import api from "../services/api";

export default function Login({ navigation }) {
  const [user, setUser] = useState("");

  useEffect(() => {
    AsyncStorage.getItem("user").then(user => {
      if (user) {
        navigation.navigate("Main", { user });
      }
    });
  }, []);

  async function handleLogin() {
    const response = await api.post("/devs", { username: user });

    const { _id } = response.data;

    await AsyncStorage.setItem("user", _id);
    navigation.navigate("Main", { user: _id });
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.container}
      enabled={Platform.OS == "ios"}
    >
      <Text style={styles.logo}>tindev</Text>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
        placeholderTextColor="#999"
        placeholder="Digite seu usuário do github"
        value={user}
        onChangeText={setUser}
      />
      <TouchableHighlight onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableHighlight>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 30
  },
  logo: {
    fontSize: 32,
    color: "#e3611b",
    fontFamily: "roboto",
    fontWeight: "bold"
  },
  input: {
    height: 46,
    alignSelf: "stretch",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginTop: 20
  },
  button: {
    height: 46,
    alignSelf: "stretch",
    backgroundColor: "#e3611b",
    borderRadius: 5,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  }
});
