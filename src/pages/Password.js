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

export default class Password extends React.Component {
  constructor() {
    super();
    this.state = { email: "", loading: false };
  }

  static navigationOptions = {
    title: "Recuperar senha"
  };

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
              resizeMode: "cover"
            }}
          ></Image>
        </View>
        <View
          style={{
            width: "100%",
            marginTop: 5,
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
              value={this.state.cpf}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={text => {
                this.setState({
                  email: text
                });
              }}
            />
          </TextInputLayout>

          <TouchableOpacity
            onPress={() => this.login()}
            style={{ width: "75%", marginTop: "3%" }}
          >
            <View style={{ backgroundColor: "#d52b58" }}>
              <Text style={styles.textButtons}>ALTERAR SENHA</Text>
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

  async login() {
    const eye = create({});

    this.setState({
      loading: true
    });

    const response = await eye.post("http://35.198.45.253/api/reset/password", {
      email: this.state.email
    });

    this.setState({
      loading: false
    });

    if (response.data != "false") {
      alert("O link para redefinição de senha foi enviado para o seu e-mail!");
      this.props.navigation.navigate("Login");
    } else {
      alert("Não encontramos nenhum usuário com esse endereço de e-mail.");
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
