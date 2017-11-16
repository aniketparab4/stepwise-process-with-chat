import React, { Component } from 'react';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.2.5
import Toast, {DURATION} from 'react-native-easy-toast';
import Backend from './Backend';

console.ignoredYellowBox = ['Setting a timer'];

class Example extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      u_key: this.props.u_key,
      name: '',
    }
  }
 
  state = {
    messages: [],
  };
  
  componentDidMount() {
   Backend.loadMessages((message) => {
      this.setState((previousState) => {
        return {
          messages: GiftedChat.append(previousState.messages, message),
        };
      });
    });
  }
  
  componentWillUnmount() {
    Backend.closeChat();
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={(message) => {
            //send message to firebase 
            Backend.sendMessage(message);
            
        }}
        user={{
            _id: Backend.getUid(),
            name: 'John',
        }}
      />         
    );
  }
}

Example.defaultProps = {
    name : 'John',
};

Example.propTypes = {
    name : React.PropTypes.string,
};

export default Example;