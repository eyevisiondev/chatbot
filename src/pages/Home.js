import React, { Component } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  KeyboardAvoidingView,
  StatusBar,
  AsyncStorage
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { Video, Audio } from "expo-av";

import { NavigationEvents } from "react-navigation";

import { badWords } from "./../services/badwords";

export default class Home extends Component {
  static navigationOptions = {
    title: null,
    header: null
  };

  constructor(props) {
    super(props);

    let audio = this.props.navigation.getParam("soundObject");

    if (audio == null) audio = new Audio.Sound();
    this.state = {
      soundObject: audio
    };
  }

  async playSound() {
    try {
      await this.state.soundObject.unloadAsync();
      await this.state.soundObject.loadAsync(
        require("./../../assets/audio/stop.mp3")
      );
      await this.state.soundObject.playAsync();
    } catch (error) {}
  }

  componentDidMount() {
    this.state.soundObject.unloadAsync();
  }

  chat = async () => {
    this.props.navigation.navigate("Chat", {
      soundObject: this.state.soundObject
    });
  };

  logout = async () => {
    AsyncStorage.clear();

    this.props.navigation.navigate("Login");
  };

  render() {
    return (
      <View style={styles.container} onPress>
        <StatusBar hidden={true} />
        <NavigationEvents onDidFocus={this.playSound()} />
        <Video
          style={styles.backgroundVideo}
          source={require("./../../assets/home.mp4")}
          isMuted={true}
          resizeMode="cover"
          shouldPlay
          isLooping
        />

        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <View style={styles.loginContainer}>
            <TouchableOpacity onPress={this.chat}>
              <Text
                style={{
                  textAlign: "right",
                  paddingRight: "5%",
                  paddingTop: "20%",
                  fontWeight: "bold",
                  color: "blue",
                  fontSize: 20
                }}
              >
                INICIAR <Text style={{ fontSize: 22 }}>></Text>
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={{ padding: "2%", width: "15%" }}>
            <Ionicons
              onPress={this.logout}
              name="md-arrow-round-back"
              size={30}
              color="gray"
            />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loginContainer: {
    flexGrow: 1,
    justifyContent: "center"
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
});
