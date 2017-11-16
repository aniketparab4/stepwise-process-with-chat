import React, {Component} from 'react';
import { AppRegistry, StyleSheet, Image, Text, View, ScrollView, KeyboardAvoidingView, Button, TouchableOpacity, TextInput, ListView} from 'react-native';
import { WebBrowser } from 'expo';
import { Ionicons } from '../node_modules/@expo/vector-icons';
import Touchable from 'react-native-platform-touchable';
import { StackNavigator } from 'react-navigation';
import ViewPager from 'react-native-viewpager';
import StepIndicator from 'react-native-step-indicator';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import PropTypes from 'prop-types';
import LegalIssueTab from './LegalIssueTab';
import DynamicList from './DynamicList';
import Example from './src/Example';

/*step array format
  steps = ["steps1","steps2","steps3","steps4"]
*/

const firstIndicatorStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize:40,
  separatorStrokeWidth: 3,
  currentStepStrokeWidth: 5,
  separatorFinishedColor: '#4aae4f',
  separatorUnFinishedColor: '#a4d4a5',
  stepIndicatorFinishedColor: '#4aae4f',
  stepIndicatorUnFinishedColor: '#a4d4a5',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 15,
  currentStepIndicatorLabelFontSize: 15,
  stepIndicatorLabelCurrentColor: '#000000',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: 'rgba(255,255,255,0.5)',
  labelColor: '#666666',
  labelSize: 12,
  currentStepLabelColor: '#4aae4f'
}

class LegalIssueDetail extends Component {

  static propTypes = {
    count_step: PropTypes.number,
    labels: PropTypes.array,
  };

  static defaultProps = {
    count_step: 1,
    labels: ["REQUEST SUCCESSFULLY SUBMITTED"],
  };


  static navigationOptions = ({navigation}) => {
    const {state, setParams} = navigation;
    return {
            title: `${navigation.state.params.name}`,
            headerRight: <Text
                            style={{marginRight:20, color: '#076ece'}}
                             title="Add Steps"
                             onPress={ () => navigation.navigate('DynamicList', {u_key: state.params.u_key}) } >Add Steps</Text>

        };
  };

  constructor(props) {
    super();
    var dataSource = new ViewPager.DataSource({
      pageHasChanged: (p1, p2) => p1 !== p2,
    });
    this.state = {
      dataSource: dataSource.cloneWithPages(props.labels),
      new_labels: props.labels,
      currentPage:0,
      count_step:1,
      stepArray: [],
      u_key: '',
      name: '',      
    }
  };

  componentWillMount() {
    const {state} = this.props.navigation;
    this.setState({u_key: state.params.u_key});
    this.getstepfromdb(state.params.u_key);
  };
  
  getstepfromdb = (u_key) => {
    var formData = new FormData();
      formData.append('u_key', u_key);
      let data = {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'multipart/form-data',
          },
          body: formData
      }
      fetch('api', data) // api url to get the steps 
        .then((response) => response.json())
        .then((responseJson) => { 
          var finalJSON = [];
          for (var i in responseJson){
            finalJSON.push(responseJson[i]["title"]); 
          }
          var newStep_count = finalJSON.length;
          if( newStep_count == 0){
            this.setState({dataSource: this.state.dataSource.cloneWithPages(this.props.labels)});   
          } else {
            this.setState({dataSource: this.state.dataSource.cloneWithPages(finalJSON)});   
          }
        })
        .catch((error) => { console.error(error); });
  }

  
  render() { 
    return (
      <View style={styles.container}>        
          <View  style={[styles.stepIndicator],{flex:1}}>            
              <StepIndicator  customStyles={firstIndicatorStyles} 
                                currentPosition={this.state.currentPage}  
                                stepCount={this.state.dataSource._cachedPageCount}
                                />            
              <View style={{flex:1}}>
              <ViewPager 
                dataSource={this.state.dataSource}
                renderPage={this.renderViewPagerPage}
                renderPageIndicator={false}
                onChangePage={(page) => {this.setState({currentPage:page})}}
                />
            </View>
          </View>
          <View style={{flex:5, backgroundColor:"#f5f5f5"}}>
            <Example  u_key = {this.state.u_key} name = {this.state.name}/>             
              <KeyboardSpacer/>
           </View> 
      </View>
    );
  }

  renderViewPagerPage = (data) => {
    return(<View style={styles.page}>
      <Text>{data}</Text>
    </View>)
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
  },
  submitButton: {
      backgroundColor: '#5084e2',
      padding: 10,
      margin: 15,
      height: 40,
   },   
   submitButtonText:{
     textAlign: 'center',
     color: 'white'
   },
   input: {
      margin: 15,
      height: 40,
      borderColor: '#f5f5f5',
      borderWidth: 1,
      padding: 10
   },
}); 

const SimpleApp = StackNavigator(
{
  LegalIssueDetail: {
    screen: LegalIssueDetail, 
    navigationOptions: { tabBarVisible: false },
  },
},
{ headerMode: 'none' }
);

export default SimpleApp;