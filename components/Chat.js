import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import io from "socket.io-client";

import ServerHandler from '../ServerHandler';
import * as Consts from '../Consts';

// var serverSocket = new ServerHandler(Consts.DEFAULT_SERVER_URL);
// serverSocket.on(Consts.SOCKET_REC_SINGLE_MSG, gotMsg);

class Chat extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'HazAdapt',
          headerStyle: {
            backgroundColor: '#e75025',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: Platform.OS === 'android'
              ? 'normal'
              : 'Helvetica Neue',
            fontSize: 28,
            fontWeight: '300',
          },
          headerBackTitleVisible: false,
  });

  // serverthing = ServerHandler();
  // handler.on(Consts.SOCKET_REC_ALL_MSGS, );

  // socket = io('http://192.168.4.1:3000');
  serverSocket = new ServerHandler(Consts.DEFAULT_SERVER_URL);

  state = {
    messages: [],
  };

  componentDidMount() {
    // serverSocket needs the type of message it is going to be watching for,
    //  the message handler function, and the current context
    this.serverSocket.on(Consts.SOCKET_REC_SINGLE_MSG, this.onRec, this);

    // TEMP: this shit sets up an all-rec listener and then sends the message to initiate that
    // this.serverSocket.on(Consts.SOCKET_REC_ALL_MSGS, this.onRec, this);
    // this.serverSocket.socket.emit(Consts.SOCKET_FIRST_CONNECTION, 'username', 'here is my first connection');


    // TODO: Add logic where messages are stored client side as they're recieved so
    // they don't clear out (and the server doesn't have to send so many things)

    // This will involve some timestamp wizardry with the server and with this app
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            // avatar: "https://placeimg.com/140/140/any",
          },
        },
      ],
    });
  }

  onSend(messages = []) {
    console.log('the default onsend sends:', messages);

    // Add formatting specific to Hazadapt:
    messages.forEach(msgObj => {
      msgObj.type = 'currently_selected_type';
    });

    console.log('Now we are sending these objects:', messages);

    // Set state so GiftedChat has everything:
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
    this.serverSocket.send(messages)
  }

  onRec(messages = [], chatCtx = this) {
    console.warn('stuff rec\'d in messages', messages);

    // FIXME: currently shoving some stuff in it
    messages.forEach(msgObj => {
      msgObj._id = Math.random(1000);
    });

    chatCtx.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <GiftedChat
          // messages={this.serverSocket.messageStore}
          // onSend={() => {console.warn('hoho?'); this.serverSocket.send('msg')}}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
            name: 'username1'
          }}
        />
        {Platform.OS === 'android' ? <KeyboardSpacer /> : null }
      </View>
    );
  }
}

// TODO: trying to get the dang thing to show on gifted chat but it aint?
// CHAT does currently show stuff once you reload but that's based on the default handler in the init function in serverhandler
function gotMsg(msg) {
  // GiftedChat.append(serverSocket.messageStore, JSON.stringify(msg));
}

const styles = StyleSheet.create({});

export default Chat;
