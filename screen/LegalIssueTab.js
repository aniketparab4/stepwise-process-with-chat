import React, {Component} from 'react';
import { AppRegistry, StyleSheet, Image, Text, View, ScrollView, KeyboardAvoidingView } from 'react-native';
import { WebBrowser } from 'expo';
import { Ionicons } from '../node_modules/@expo/vector-icons';
import Touchable from 'react-native-platform-touchable';
import { StackNavigator } from 'react-navigation';
import ViewPager from 'react-native-viewpager';
import StepIndicator from 'react-native-step-indicator';

import GiftedChat from './src/GiftedChat';
import Example from './src/Example';
import LegalIssueDetail from './LegalIssueDetail';

class LegalIssue extends React.Component {


  constructor() {
    super();
    this.state = {
      issue_list: [],
    }
  }

  componentWillMount() {
    this.getLegalIssueList();
  };

  getLegalIssueList = () => {
    fetch(api) // your api url to get the list
    .then((response) => response.json())
    .then((responseJson) => { 

      console.log(JSON.stringify(responseJson));
      this.setState({issue_list: responseJson});
    })
  };

  WholeNews() {
    const { navigate } = this.props.navigation;

  return this.state.issue_list.map(function(news, i){


    return(

      
        <Touchable key={i}
          style={styles.option}
          background={Touchable.Ripple('#ccc', false)}
          onPress={() => navigate('LegalIssueDetail', {u_key: news.u_key, name: news.user_name})}>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.optionIconContainer}>
              <Image
                source={require('../node_modules/@expo/samples/assets/images/expo-icon.png')}
                resizeMode="contain"
                fadeDuration={0}
                style={{ width: 20, height: 20, marginTop: 1 }}
              />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>
                 {news.user_name}
              </Text>
              <Text style={styles.optionText}>
                 {news.description}
              </Text>
            </View>
          </View>
        </Touchable>

      
    );
  }); 
}



  render() {

    return (
      
        <ScrollView>
          {this.WholeNews()}
        </ScrollView>
    );
  }
  
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
  optionsTitleText: {
    fontSize: 16,
    marginLeft: 15,
    marginTop: 9,
    marginBottom: 12,
  },
  optionIconContainer: {
    marginRight: 9,
  },
  option: {
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EDEDED',
  },
  optionText: {
    fontSize: 15,
    marginTop: 1,
  },
  stepIndicator: {
    borderWidth: 2, 
  },
  page: {
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  }
}); 



const SimpleApp = StackNavigator(
{
  LegalIssue: { 
    screen: LegalIssue,
    navigationOptions: ({navigation}) => ({
      title: 'Legal Issue',
    }),
   },
  LegalIssueDetail: {
    screen: LegalIssueDetail, 
    navigationOptions: { tabBarVisible: false },    
  },
},
{ headerMode: 'none' }
);
 
AppRegistry.registerComponent('SimpleApp', () => SimpleApp);

export default SimpleApp;