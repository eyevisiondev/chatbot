import React, { Component } from "react";
import {
  Text,
  Image,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Keyboard,
  KeyboardAvoidingView,
  AsyncStorage
} from "react-native";

import { create } from "apisauce";

import { Ionicons } from "@expo/vector-icons";

import { NavigationEvents } from "react-navigation";

import fluxo1 from "./../services/msg.json";
import fluxo2 from "./../services/msg2.json";
import fluxo3 from "./../services/msg3.json";

import { TextInputMask, TextInputMaskMethods } from "react-native-masked-text";
import { throwIfAudioIsDisabled } from "expo-av/build/Audio/AudioAvailability";

var chat;
import { badWords } from "./../services/badwords";

export default class Chat extends Component {
  constructor(props) {
    super(props);

    var messages = [];

    chat = fluxo1;

    this.state = {
      messages: messages,
      inputBarText: "",
      msgNumber: 0,
      typing: false,
      soundObject: this.props.navigation.getParam("soundObject"),
      inputEnable: false,
      inputType: "numeric",
      name: "",
      gender: "",
      cpf: "",
      email: "",
      mailing: false,
      phone: "",
      lastBuy: "",
      errorMsg: "",
      fluxo: "fluxo1",
      hideBtns: true
    };

    /*this.state.messages.push({
      direction: "right",
      text: "teste@gmail.com",
      msgNumber: this.state.msgNumber
    });

    this.setState({
      errorMsg: "",
      messages: this.state.messages,
      inputBarText: ""
    });*/
  }

  static navigationOptions = {
    title: null,
    header: null
  };

  sendMsgChatBot() {
    this.playSound();
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this.keyboardDidShow.bind(this)
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this.keyboardDidHide.bind(this)
    );
  }

  keyboardDidShow() {
    this.scrollView.scrollToEnd();
  }

  keyboardDidHide() {
    this.scrollView.scrollToEnd();
  }

  btnNot = () => {
    if (
      this.state.fluxo == "fluxo2" &&
      chat[this.state.msgNumber].audio == "gostaria_de_cadastrar.mp3"
    ) {
      chat = fluxo3;
      this.setState(
        {
          msgNumber: 0,
          hideBtns: true,
          fluxo: "fluxo3"
        },
        this.playSound
      );
    }

    if (
      this.state.fluxo == "fluxo2" &&
      chat[this.state.msgNumber].audio == "gostaria_de_deixar_seu_email.mp3"
    ) {
      AsyncStorage.getItem("api_token").then(value => {
        this.storeClient(value);
      });
      this.setState(
        {
          msgNumber: this.state.msgNumber + 2,
          hideBtns: true,
          mailing: false
        },
        this.playSound
      );
    }

    if (
      this.state.fluxo == "fluxo1" &&
      chat[this.state.msgNumber].audio == "gostaria_de_deixar_seu_email.mp3"
    ) {
      AsyncStorage.getItem("api_token").then(value => {
        this.storeClient(value);
      });
      this.setState(
        {
          msgNumber: this.state.msgNumber + 1,
          hideBtns: true,
          mailing: false
        },
        this.playSound
      );
    }

    if (
      this.state.fluxo == "fluxo3" &&
      chat[this.state.msgNumber].audio == "gostaria_de_deixar_seu_email.mp3"
    ) {
      this.setState(
        {
          msgNumber: this.state.msgNumber + 3,
          hideBtns: true
        },
        this.playSound
      );
    }
  };

  btnYes = () => {
    if (
      this.state.fluxo == "fluxo2" &&
      chat[this.state.msgNumber].audio == "gostaria_de_cadastrar.mp3"
    ) {
      this.setState(
        {
          msgNumber: this.state.msgNumber + 1,
          hideBtns: true
        },
        this.playSound
      );
    }

    if (
      (this.state.fluxo == "fluxo1" || this.state.fluxo == "fluxo2") &&
      chat[this.state.msgNumber].audio == "gostaria_de_deixar_seu_email.mp3"
    ) {
      AsyncStorage.getItem("api_token").then(value => {
        this.storeClient(value);
      });
      this.setState(
        {
          msgNumber: this.state.msgNumber + 1,
          hideBtns: true,
          mailing: true
        },
        this.playSound
      );
    }

    if (
      this.state.fluxo == "fluxo3" &&
      chat[this.state.msgNumber].audio == "gostaria_de_deixar_seu_email.mp3"
    ) {
      this.setState(
        {
          msgNumber: this.state.msgNumber + 1,
          hideBtns: true
        },
        this.playSound
      );
    }
  };

  _onPlaybackStatusUpdate = playbackStatus => {
    if (this.state.msgNumber == -1 || this.state.fluxo == "end") {
      return;
    }
    if (playbackStatus.didJustFinish) {
      if (
        chat[this.state.msgNumber].action == "watson" &&
        this.state.msgNumber == 1
      ) {
        this.setState({
          typing: false,
          inputEnable: false,
          msgNumber: this.state.lastBuy
            ? this.state.msgNumber + 2
            : this.state.msgNumber + 1
        });
        this.sendMsgChatBot();
        return;
      }

      if (chat[this.state.msgNumber].audio == "como_faz_um_tempinho.mp3") {
        this.setState({
          typing: false,
          inputEnable: false,
          msgNumber: this.state.msgNumber + 2
        });
        this.sendMsgChatBot();
        return;
      }

      if (chat[this.state.msgNumber].action == "pause") {
        this.setMovie(1);
        this.setState({
          typing: false,
          inputEnable: true
        });

        this.openKeyboard();
        return;
      }

      if (chat[this.state.msgNumber].action == "buttons") {
        this.setMovie(1);
        this.setState({
          typing: false,
          hideBtns: false
        });
        return;
      }

      if (
        chat[this.state.msgNumber].action == "watson" &&
        this.state.fluxo == "fluxo1"
      ) {
        this.setState({
          fluxo: "end"
        });
        setTimeout(() => {
          if (this.state.fluxo == "end") this.home();
        }, 5000);

        return;
      }

      if (chat[this.state.msgNumber].action == "end") {
        this.setState({
          fluxo: "end"
        });
        this.setMovie(1);

        setTimeout(() => {
          if (this.state.fluxo == "end") this.home();
        }, 5000);
        return;
      }

      this.setState({
        typing: false,
        inputEnable: false,
        msgNumber: this.state.msgNumber + 1
      });

      if (this.state.msgNumber >= chat.length) return;
      else this.sendMsgChatBot();
    }
  };

  home = async () => {
    this.setMovie(1);

    this.setState({
      fluxo: "end"
    });
    this.props.navigation.navigate("Home", {
      soundObject: this.state.soundObject
    });
  };

  componentDidMount() {
    this.playSound();

    setTimeout(
      function() {
        this.scrollView.scrollToEnd();
      }.bind(this)
    );
  }

  componentDidUpdate() {
    setTimeout(
      function() {
        this.scrollView.scrollToEnd();
      }.bind(this)
    );
  }

  _onChangeInputBarText(text) {
    this.setState({
      inputBarText: text
    });
  }

  async playSound() {
    try {
      Keyboard.dismiss();
      this.state.soundObject.unloadAsync();

      var audio = chat[this.state.msgNumber].audio;

      var msg = chat[this.state.msgNumber].msg;

      switch (audio) {
        case "ola_tudo_bem.mp3":
          await this.state.soundObject.loadAsync(
            require("./../../assets/audio/ola_tudo_bem.mp3")
          );
          this.setMovie(2);
          break;

        case "notamos.mp3":
          await this.state.soundObject.loadAsync(
            require("./../../assets/audio/notamos.mp3")
          );
          this.setMovie(14);
          break;

        case "gostaria_de_cadastrar.mp3":
          await this.state.soundObject.loadAsync(
            require("./../../assets/audio/gostaria_de_cadastrar.mp3")
          );
          this.setMovie(15);
          break;

        case "que_bom_digite_o_seu_email.mp3":
          await this.state.soundObject.loadAsync(
            require("./../../assets/audio/que_bom_digite_o_seu_email.mp3")
          );
          this.setMovie(16);
          break;

        case "agora_digite_o_seu_telefone.mp3":
          await this.state.soundObject.loadAsync(
            require("./../../assets/audio/agora_digite_o_seu_telefone.mp3")
          );
          this.setMovie(16);
          break;

        case "que_pena.mp3":
          await this.state.soundObject.loadAsync(
            require("./../../assets/audio/que_pena.mp3")
          );
          this.setMovie(19);
          break;

        case "mas_mesmo_assim.mp3":
          await this.state.soundObject.loadAsync(
            require("./../../assets/audio/mas_mesmo_assim.mp3")
          );
          this.setMovie(20);
          break;

        case "e_quando_voce_puder.mp3":
          await this.state.soundObject.loadAsync(
            require("./../../assets/audio/e_quando_voce_puder.mp3")
          );
          this.setMovie(22);
          break;

        case "muito_bem_voce_recebera.mp3":
          await this.state.soundObject.loadAsync(
            require("./../../assets/audio/muito_bem_voce_recebera.mp3")
          );
          this.setMovie(17);
          break;

        case "agora_eu_gostaria.mp3":
          await this.state.soundObject.loadAsync(
            require("./../../assets/audio/agora_eu_gostaria.mp3")
          );
          this.setMovie(18);
          break;

        case "ate_mais.mp3":
          await this.state.soundObject.loadAsync(
            require("./../../assets/audio/ate_mais.mp3")
          );
          this.setMovie(13);
          break;

        case "gostaria_de_deixar_seu_email.mp3":
          await this.state.soundObject.loadAsync(
            require("./../../assets/audio/gostaria_de_deixar_seu_email.mp3")
          );
          this.setMovie(8);
          break;

        case "como_faz_um_tempinho.mp3":
          await this.state.soundObject.loadAsync(
            require("./../../assets/audio/como_faz_um_tempinho.mp3")
          );
          this.setMovie(4);
          break;

        case "que_bom_ver_voce_aqui_novamente.mp3":
          await this.state.soundObject.loadAsync(
            require("./../../assets/audio/que_bom_ver_voce_aqui_novamente.mp3")
          );
          this.setMovie(4);
          break;

        case "produto.mp3":
          await this.state.soundObject.loadAsync(
            require("./../../assets/audio/produto.mp3")
          );
          this.setMovie(5);
          break;

        case "entao_aproveite_e_leve.mp3":
          await this.state.soundObject.loadAsync(
            require("./../../assets/audio/entao_aproveite_e_leve.mp3")
          );
          this.setMovie(7);
          break;

        case "muito_obrigada_e_um_prazer.mp3":
          await this.state.soundObject.loadAsync(
            require("./../../assets/audio/muito_obrigada_e_um_prazer.mp3")
          );
          this.setMovie(9);
          break;

        case "e_nao_esqueca_de_digitar.mp3":
          await this.state.soundObject.loadAsync(
            require("./../../assets/audio/e_nao_esqueca_de_digitar.mp3")
          );
          this.setMovie(10);
          break;

        case "digite_o_seu_nome.mp3":
          await this.state.soundObject.loadAsync(
            require("./../../assets/audio/digite_o_seu_nome.mp3")
          );
          this.setMovie(16);
          break;

        case "ah_tambem_da_para_baixar.mp3":
          await this.state.soundObject.loadAsync(
            require("./../../assets/audio/ah_tambem_da_para_baixar.mp3")
          );
          this.setMovie(11);
          break;

        case "muito_obrigada_pela_sua_atencao.mp3":
          await this.state.soundObject.loadAsync(
            require("./../../assets/audio/muito_obrigada_pela_sua_atencao.mp3")
          );
          this.setMovie(12);
          break;

        case "uma_alimentacao_saudavel.mp3":
          await this.state.soundObject.loadAsync(
            require("./../../assets/audio/uma_alimentacao_saudavel.mp3")
          );
          this.setMovie(6);
          break;

        case "watson":
          var firstName = this.state.name.split(" ");

          var name = firstName[0].toString().toLowerCase();
          name = this.capitalize(name);

          msg = msg
            .replace("NAME", name)
            .replace("GENERO", this.state.gender == 0 ? "o" : "a");

          var speak = encodeURI(msg);

          //37954973883

          this.setMovie(1);
          await this.state.soundObject.loadAsync({
            uri:
              "https://text-to-speech-demo.ng.bluemix.net/api/v1/synthesize?text=" +
              speak +
              "&voice=pt-BR_IsabelaVoice&download=true&accept=audio%2Fmp3"
          });

          if (this.state.msgNumber == 1 && this.state.fluxo == "fluxo1") {
            this.setMovie(3);
          } else {
            if (this.state.fluxo == "fluxo1") {
              this.setMovie(13);
            }
          }

          break;
        default:
          alert(audio + " não encontrado");
          break;
      }

      //alert(chat[this.state.msgNumber].msg);
      this.state.messages.push({
        direction: "left",
        text: msg,
        msgNumber: this.state.msgNumber
      });

      this.setState({
        messages: this.state.messages
      });

      if (audio != null) {
        this.state.soundObject.setOnPlaybackStatusUpdate(
          this._onPlaybackStatusUpdate
        );
        this.setState({
          typing: true
        });
        await this.state.soundObject.playAsync();
      } else {
        this.setState({
          msgNumber: this.state.msgNumber + 1
        });
        this.sendMsgChatBot();
      }
    } catch (error) {
      //alert(error);
    }
  }

  setMovie(movie) {
    AsyncStorage.getItem("api_token").then(value => {
      this.websocket(value, movie);
    });
  }

  async websocket(token, movie) {
    const eye = create({});

    const response = await eye.get("http://35.198.45.253:8000/send", {
      token: token,
      movie: movie
    });
  }

  capitalize(s) {
    return s && s[0].toUpperCase() + s.slice(1);
  }

  render() {
    var messages = [];

    this.state.messages.forEach(function(message, index) {
      messages.push(
        <MessageBubble
          key={index}
          direction={message.direction}
          text={message.text}
          msgNumber={message.msgNumber}
        />
      );
    });

    //

    var inputMaskType = (
      <TextInput
        placeholder={""}
        style={styles.textBox}
        editable={this.state.inputEnable}
        ref={ref => (this.ref = ref)}
        autoCapitalize="none"
      />
    );

    if (
      chat[this.state.msgNumber].action == "pause" &&
      chat[this.state.msgNumber].audio == "que_bom_digite_o_seu_email.mp3"
    ) {
      var inputMaskType = (
        <TextInput
          placeholder={
            this.state.inputEnable &&
            chat[this.state.msgNumber].action == "pause" &&
            chat[this.state.msgNumber].audio == "que_bom_digite_o_seu_email.mp3"
              ? " Digite o seu E-mail"
              : ""
          }
          onChangeText={text => {
            this.setState({
              email: text
            });
          }}
          maxLength={100}
          onSubmitEditing={() => this.send()}
          value={this.state.email}
          style={styles.textBox}
          editable={this.state.inputEnable}
          ref={ref => (this.ref = ref)}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      );
    }

    if (
      chat[this.state.msgNumber].action == "pause" &&
      chat[this.state.msgNumber].audio == "digite_o_seu_nome.mp3"
    ) {
      var inputMaskType = (
        <TextInput
          placeholder={
            this.state.inputEnable &&
            chat[this.state.msgNumber].action == "pause" &&
            chat[this.state.msgNumber].audio == "digite_o_seu_nome.mp3"
              ? " Digite o seu Nome"
              : ""
          }
          onChangeText={text => {
            this.setState({
              name: text
            });
          }}
          maxLength={100}
          value={this.state.name}
          onSubmitEditing={() => this.send()}
          style={styles.textBox}
          editable={this.state.inputEnable}
          ref={ref => (this.ref = ref)}
          autoCapitalize="none"
        />
      );
    }

    if (
      chat[this.state.msgNumber].action == "pause" &&
      chat[this.state.msgNumber].audio == "ola_tudo_bem.mp3"
    ) {
      var inputMaskType = (
        <TextInputMask
          placeholder={this.state.inputEnable ? " Digite o seu CPF" : ""}
          value={this.state.cpf}
          type={"cpf"}
          autoCapitalize="none"
          onChangeText={text => {
            this.setState({
              cpf: text
            });
          }}
          ref="inputMask"
          style={
            this.state.errorMsg == "" ? styles.textBox : styles.textBoxError
          }
          onSubmitEditing={() => this.send()}
          blurOnSubmit={true}
          value={this.state.cpf}
          keyboardType="phone-pad" //"email-address" //phone-pad //numeric
          editable={this.state.inputEnable}
        />
      );
    }

    if (
      chat[this.state.msgNumber].action == "pause" &&
      chat[this.state.msgNumber].audio == "agora_digite_o_seu_telefone.mp3"
    ) {
      var inputMaskType = (
        <TextInputMask
          placeholder={this.state.inputEnable ? " Digite o seu Telefone" : ""}
          value={this.state.phone}
          type={"cel-phone"}
          options={{
            maskType: "BRL",
            withDDD: true,
            dddMask: "(99) "
          }}
          autoCapitalize="none"
          onChangeText={text => {
            this.setState({
              phone: text
            });
          }}
          onSubmitEditing={() => this.send()}
          ref="inputMask"
          style={
            this.state.errorMsg == "" ? styles.textBox : styles.textBoxError
          }
          value={this.state.phone}
          keyboardType="phone-pad" //"email-address" //phone-pad //numeric
          editable={this.state.inputEnable}
        />
      );
    }

    var buttons = null;
    if (
      chat[this.state.msgNumber].action == "buttons" &&
      this.state.hideBtns == false
    ) {
      var buttons = (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            padding: 10,
            resizeMode: "stretch", // or 'stretch',
            justifyContent: "center",
            width: "100%",
            alignItems: "center"
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "green",
              padding: 8,
              borderRadius: 30,
              marginHorizontal: 20
            }}
            onPress={() => this.btnYes()}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 20
              }}
            >
              SIM
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "red",
              padding: 8,
              borderRadius: 30,
              marginHorizontal: 10
            }}
            onPress={() => this.btnNot()}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 20
              }}
            >
              NÃO
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.outer}>
        <StatusBar hidden={true} />

        <View
          style={{
            backgroundColor: "#0e5ba7",
            height: 50,
            flexDirection: "row",
            padding: 10
          }}
        >
          <View style={{ paddingLeft: 5, paddingRight: 10 }}>
            <TouchableOpacity onPress={this.home}>
              <Ionicons name="md-arrow-round-back" size={32} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={{ padding: 5, color: "white" }}>ChatBot</Text>

          {this.state.typing == true ? (
            <Text
              style={{
                position: "absolute",
                top: 32,
                paddingLeft: 52,
                color: "white",
                fontSize: 10
              }}
            >
              Digitanto...
            </Text>
          ) : null}
        </View>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
          <ScrollView
            ref={ref => {
              this.scrollView = ref;
            }}
            style={styles.messages}
          >
            {messages}
            {buttons}
          </ScrollView>

          <View style={styles.inputBar}>
            {inputMaskType}
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => this.send()}
            >
              <Ionicons name="md-send" size={40} color="#0e5ba7" />
            </TouchableOpacity>
          </View>
          <View style={styles.inputBarError}>
            <Text
              style={{
                color: "red",
                position: "absolute",
                top: -22,
                paddingLeft: 35
              }}
            >
              {this.state.errorMsg}
            </Text>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }

  validEmail(email) {
    var word = email.toString().toUpperCase();
    var bad = this.checkBadWord(word);
    if (bad) {
      this.setState({ email: "" });
      return false;
    }

    var test;
    test = /^[\w+.]+@\w+\.\w{2,}(?:\.\w{2})?$/.test(email);

    if (!test) return test;

    return true;
  }

  validName(name) {
    var word = name.toString().toUpperCase();
    var bad = this.checkBadWord(word);
    if (bad) {
      this.setState({ name: "" });
      return false;
    }

    return true;
  }

  checkBadWord(word) {
    var arrayString = badWords.toString();
    var arrayLowerString = arrayString.toUpperCase();
    var arrayUpperCase = arrayLowerString.split(",");
    return arrayUpperCase.some(substring => word.includes(substring));
  }

  openKeyboard() {
    if (this.state.fluxo != "end") {
      setTimeout(() => {
        if (
          chat[this.state.msgNumber].audio ==
            "que_bom_digite_o_seu_email.mp3" ||
          chat[this.state.msgNumber].audio == "digite_o_seu_nome.mp3"
        ) {
          if (this.ref) this.ref.focus();
        } else {
          if (this.refs["inputMask"])
            this.refs["inputMask"].getElement().focus();
        }
        this.scrollView.scrollToEnd();
      }, 200);
    }
  }

  async send() {
    this.scrollView.scrollToEnd();
    if (
      chat[this.state.msgNumber].action == "pause" &&
      chat[this.state.msgNumber].audio == "ola_tudo_bem.mp3"
    ) {
      if (!this.validarCPF(this.state.cpf)) {
        this.setState(
          {
            errorMsg: "CPF inválido, por favor, digite um CPF válido!"
          },
          this.openKeyboard
        );

        return;
      } else {
        this.state.messages.push({
          direction: "right",
          text: this.state.cpf,
          msgNumber: this.state.msgNumber
        });

        this.setState({
          errorMsg: "",
          messages: this.state.messages
        });

        AsyncStorage.getItem("api_token").then(value => {
          this.condorAPI(value);
        });
      }
      return;
    }

    if (
      chat[this.state.msgNumber].action == "pause" &&
      chat[this.state.msgNumber].audio == "digite_o_seu_nome.mp3"
    ) {
      if (!this.validName(this.state.name)) {
        this.setState({
          errorMsg: "Nome inválido, por favor, digite um nome válido!"
        });
        this.openKeyboard();
        return;
      }

      this.setState({
        errorMsg: ""
      });

      this.state.messages.push({
        direction: "right",
        text: this.state.name,
        msgNumber: this.state.msgNumber
      });

      if (this.state.fluxo == "fluxo3") {
        AsyncStorage.getItem("api_token").then(value => {
          this.storeClient(value);
        });
      }

      this.setState(
        {
          msgNumber: this.state.msgNumber + 1,
          inputEnable: false,
          messages: this.state.messages
        },
        this.playSound
      );
    }

    if (
      chat[this.state.msgNumber].audio == "que_bom_digite_o_seu_email.mp3" &&
      chat[this.state.msgNumber].action == "pause"
    ) {
      if (!this.validEmail(this.state.email)) {
        this.setState({
          errorMsg: "E-mail inválido, por favor, digite um e-mail válido!"
        });
        this.openKeyboard();
        return;
      }

      this.setState({
        errorMsg: ""
      });

      this.state.messages.push({
        direction: "right",
        text: this.state.email,
        msgNumber: this.state.msgNumber
      });

      this.setState(
        {
          msgNumber: this.state.msgNumber + 1,
          inputEnable: false,
          messages: this.state.messages
        },
        this.playSound
      );
    }

    if (
      chat[this.state.msgNumber].audio == "agora_digite_o_seu_telefone.mp3" &&
      chat[this.state.msgNumber].action == "pause"
    ) {
      if (this.state.phone.length < 14) {
        this.setState({
          errorMsg: "Telefone inválido, por favor, digite um telefone válido!"
        });

        this.openKeyboard();

        return;
      }

      this.setState({
        errorMsg: ""
      });

      this.state.messages.push({
        direction: "right",
        text: this.state.phone,
        msgNumber: this.state.msgNumber
      });

      this.setState(
        {
          messages: this.state.messages,
          msgNumber: this.state.msgNumber + 1,
          inputEnable: false
        },
        this.playSound
      );
    }

    if (
      this.state.fluxo == "fluxo3" &&
      chat[this.state.msgNumber].audio == "gostaria_de_deixar_seu_email.mp3" &&
      chat[this.state.msgNumber].action == "pause"
    ) {
      if (!this.validEmail(this.state.email)) {
        this.setState({
          errorMsg: "E-mail inválido, por favor, digite um e-mail válido!"
        });

        return;
      }

      this.setState({
        mailing: true
      });

      AsyncStorage.getItem("api_token").then(value => {
        this.storeClient(value);
      });

      this.state.messages.push({
        direction: "right",
        text: this.state.email,
        msgNumber: this.state.msgNumber
      });

      this.setState(
        {
          errorMsg: "",
          msgNumber: this.state.msgNumber + 1,
          inputEnable: false,
          messages: this.state.messages,
          inputBarText: ""
        },
        this.playSound
      );
    }
  }

  async storeClient(token) {
    const eye = create({});

    this.setState({
      loading: true
    });

    //console.warn(this.state.cpf);
    const response = await eye.post("http://35.198.45.253/api/clients/store", {
      cpf: this.state.cpf,
      name: this.state.name.toUpperCase(),
      phone: this.state.phone,
      api_token: token,
      mailing: this.state.mailing ? 1 : 0,
      email: this.state.email.toLowerCase(),
      gender: this.state.gender
    });

    this.setState({
      loading: false
    });
  }

  async condorAPI(token) {
    const eye = create({});

    const response = await eye.post(
      "http://35.198.45.253/api/consultaClienteCondor",
      {
        cpf: this.state.cpf,
        api_token: token
      }
    );

    if (response.data.nome !== undefined) {
      var object = response.data;

      var lastBuy = true;

      if (object.dataUltimaCompra != null) {
        var CurrentDate = new Date();
        CurrentDate.setMonth(CurrentDate.getMonth() - 1);

        lastBuy = new Date(object.dataUltimaCompra);

        if (lastBuy >= CurrentDate) lastBuy = true;
        else lastBuy = false;
      }

      this.setState(
        {
          name: object.nome,
          email: object.email,
          gender: object.genero == "Masculino" ? 0 : 1,
          lastBuy: lastBuy,
          msgNumber: this.state.msgNumber + 1
        },
        this.sendMsgChatBot
      );
    } else {
      chat = fluxo2;

      this.setState(
        {
          msgNumber: 0,
          fluxo: "fluxo2"
        },
        this.sendMsgChatBot
      );
    }
  }

  validarCPF(inputCPF) {
    var soma = 0;
    var resto;
    var i;
    var inputCPF = inputCPF.replace(/[^0-9]/g, "");

    if (inputCPF == "00000000000") return false;
    if (inputCPF == "11111111111") return false;
    if (inputCPF == "22222222222") return false;
    if (inputCPF == "33333333333") return false;
    if (inputCPF == "44444444444") return false;
    if (inputCPF == "55555555555") return false;
    if (inputCPF == "66666666666") return false;
    if (inputCPF == "77777777777") return false;
    if (inputCPF == "88888888888") return false;
    if (inputCPF == "99999999999") return false;

    for (i = 1; i <= 9; i++)
      soma = soma + parseInt(inputCPF.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;

    if (resto == 10 || resto == 11) resto = 0;
    if (resto != parseInt(inputCPF.substring(9, 10))) return false;

    soma = 0;
    for (i = 1; i <= 10; i++)
      soma = soma + parseInt(inputCPF.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;

    if (resto == 10 || resto == 11) resto = 0;
    if (resto != parseInt(inputCPF.substring(10, 11))) return false;
    return true;
  }
}

class MessageBubble extends Component {
  render() {
    var leftSpacer =
      this.props.direction === "left" ? (
        <View style={styles.imgWoman}></View>
      ) : (
        <View style={{ width: 0 }} />
      );
    var rightSpacer =
      this.props.direction === "left" ? <View style={{ width: 0 }} /> : null;

    var bubbleStyles =
      this.props.direction === "left"
        ? [styles.messageBubble, styles.messageBubbleLeft]
        : [styles.messageBubble, styles.messageBubbleRight];

    var bubbleTextStyle =
      this.props.direction === "left"
        ? styles.messageBubbleTextLeft
        : styles.messageBubbleTextRight;

    var productImage =
      this.props.msgNumber &&
      chat[this.props.msgNumber].audio === "produto.mp3" ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image
            source={require("./../../assets/produto.png")}
            style={styles.imgProduct}
          />
        </View>
      ) : (
        <View style={{ width: 0, height: 0 }}></View>
      );

    return (
      <View>
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            bottom: 0
          }}
        >
          {leftSpacer}

          <View style={bubbleStyles}>
            {productImage}
            <Text style={bubbleTextStyle}>{this.props.text}</Text>
          </View>
          {rightSpacer}
        </View>
        {this.props.direction === "left" ? (
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Image
              source={require("./../../assets/woman.png")}
              style={styles.imgWoman}
            />
            <Image
              source={require("./../../assets/ballonLeft.png")}
              style={styles.ballonLeft}
            />
          </View>
        ) : (
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Image
              source={require("./../../assets/ballonRight.png")}
              style={styles.ballonRight}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#e7e7e7"
  },

  messages: {
    flex: 1
  },

  //InputBar

  inputBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 2
  },
  inputBarError: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 2
  },

  textBox: {
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#0e5ba7",
    backgroundColor: "white",
    height: 40,
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10
  },
  textBoxError: {
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "red",
    backgroundColor: "white",
    height: 40,
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10
  },

  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 15,
    marginLeft: 5,
    paddingRight: 15,
    borderRadius: 5
  },

  //MessageBubble

  messageBubble: {
    width: "65%",
    minHeight: "1%",
    borderRadius: 5,
    marginTop: 45,
    marginRight: "5%",
    paddingHorizontal: "5%",
    paddingVertical: 10,
    resizeMode: "stretch",

    justifyContent: "space-between"
  },

  messageBubbleLeft: {
    backgroundColor: "white",
    borderRadius: 30
  },

  ballonLeft: {
    top: "-5%",
    marginLeft: "10%",
    width: 60,
    height: 25,
    resizeMode: "stretch",
    flexDirection: "row"
  },

  ballonRight: {
    top: "-5%",
    marginLeft: "75%",
    width: 50,
    height: 25,
    resizeMode: "stretch",
    flexDirection: "row"
  },

  messageBubbleTextLeft: {
    color: "black",
    borderRadius: 10,
    textAlign: "justify"
  },

  messageBubbleRight: {
    backgroundColor: "white",
    borderRadius: 30
  },

  messageBubbleTextRight: {
    color: "black",
    textAlign: "justify"
  },

  imgWoman: {
    width: 80,
    height: 80,
    marginLeft: "5%",
    resizeMode: "stretch",
    flexDirection: "row"
  },
  imgProduct: {
    width: 230,
    height: 230,
    resizeMode: "cover" // or 'stretch',
  }
});
