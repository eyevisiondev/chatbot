import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  TextInput,
  AsyncStorage
} from "react-native";

import Spinner from "react-native-loading-spinner-overlay";
import { TextInputLayout } from "rn-textinputlayout";
import { create } from "apisauce";

export default class Login extends React.Component {
  constructor() {
    super();
    this.state = { email: "", password: "", loading: false, devide_id: null };
  }

  static navigationOptions = {
    title: null,
    header: null
  };

  componentDidMount() {
    this.setState({ device_id: Expo.Constants.deviceId });
    AsyncStorage.getItem("api_token").then(value => {
      this.checkToken(value);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <View style={styles.topView}>
          <Image
            source={require("./../../assets/splash.png")}
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "cover" // or 'stretch',
            }}
          ></Image>
        </View>
        <View
          style={{
            width: "100%",
            alignItems: "center",
            position: "absolute",
            top: "45%",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <TextInputLayout
            style={styles.inputLayout}
            focusColor="black"
            //checkValid={t => CPF_REGEX.test(t)}
          >
            <TextInput
              style={styles.textInput}
              placeholder={"Digite o seu E-mail"}
              value={this.state.email}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={text => {
                this.setState({
                  email: text
                });
              }}
            />
          </TextInputLayout>
          <TextInputLayout style={styles.inputLayout} focusColor="black">
            <TextInput
              style={styles.textInput}
              placeholder={"Digite a sua SENHA"}
              secureTextEntry={true}
              value={this.state.password}
              onChangeText={text => {
                this.setState({
                  password: text
                });
              }}
            />
          </TextInputLayout>
          <TouchableOpacity
            onPress={() => this.login()}
            style={{ width: "75%", marginTop: "3%" }}
          >
            <View style={{ backgroundColor: "#d52b58" }}>
              <Text style={styles.textButtons}>ENTRAR</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.password()}
            style={{ width: "80%", padding: 10 }}
          >
            <View>
              <Text style={styles.textButtonsPassword}>Recuperar Senha</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Spinner
          color="red"
          //visibility of Overlay Loading Spinner
          visible={this.state.loading}
          //Text with the Spinner
          textContent={""}
          //Text style of the Spinner Text
          textStyle={styles.spinnerTextStyle}
        />
      </View>
    );
  }

  async password(token) {
    this.setState({
      email: "",
      password: ""
    });
    this.props.navigation.navigate("Password");
  }

  async checkToken(token) {
    const eye = create({});

    this.setState({
      loading: true
    });

    const response = await eye.post("http://35.198.45.253/api/checkToken", {
      api_token: token,
      device_id: this.state.device_id
    });

    this.setState({
      loading: false
    });

    if (response.data == "true") {
      this.props.navigation.navigate("Home");
    }
  }

  async login() {
    const eye = create({});

    this.setState({
      loading: true
    });

    const response = await eye.post("http://35.198.45.253/api/loginAPI", {
      email: this.state.email,
      password: this.state.password,
      mobile: "true",
      device_id: this.state.device_id
    });

    this.setState({
      loading: false
    });

    if (
      response.data != "false" &&
      response.data != "unique" &&
      response.data != "permission"
    ) {
      await AsyncStorage.setItem("api_token", response.data);
      this.setState({
        email: "",
        password: ""
      });
      this.props.navigation.navigate("Home");
    } else {
      if (response.data == "unique")
        alert("É possível realizar o login em apenas um dispositivo!");
      else if (response.data == "permission")
        alert("Usuário sem permissão para acessar o sistema!");
      else if (response.data == "false")
        alert("As informações de login não foram encontradas.");
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"

    // backgroundColor: "black"
  },
  bottomView: {
    width: "100%",
    height: "100%",

    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0
  },
  topView: {
    width: "100%",
    height: "30%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "20%"
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "stretch", // or 'stretch',
    justifyContent: "center",
    width: "100%",
    alignItems: "center"
  },
  buttons: {
    width: "100%",
    justifyContent: "center"
  },
  box: {
    width: 150,
    height: 150,
    backgroundColor: "rgba(255, 255, 255, 0.3);",
    //  borderColor: "black",
    // borderWidth: 5,
    margin: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  textButtons: {
    width: "100%",
    color: "white",
    marginTop: 6,
    fontWeight: "bold",
    justifyContent: "center",
    textAlign: "center",
    fontSize: 15,
    height: 30
  },
  textButtonsPassword: {
    width: "100%",
    color: "black",
    marginTop: 6,
    fontWeight: "bold",
    justifyContent: "center",
    textAlign: "center",
    fontSize: 15,
    height: 30
  },

  textInput: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
    height: 30
  },
  inputLayout: {
    width: "75%",
    marginTop: 5,
    marginHorizontal: 10
  },

  spinnerTextStyle: {
    color: "red"
  }
});
