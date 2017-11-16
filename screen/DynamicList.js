'use strict';
import React, {Component} from 'react';
import {
    View, Text, Alert, AlertIOS, ListView, ListViewDataSource, StyleSheet, Modal, TouchableHighlight,
    TouchableOpacity, InteractionManager, RefreshControl, Animated, Platform, Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast, {DURATION} from 'react-native-easy-toast';
import md5 from 'md5';
import Prompt from 'react-native-prompt';
import FormData from 'FormData';
import LegalIssueDetail from './LegalIssueDetail';

const window = Dimensions.get('window');

class DynamicListRow extends Component {

    // these values will need to be fixed either within the component or sent through props
    _defaultHeightValue = 60;
    _defaultTransition  = 500;

    state = {
        _rowHeight  : new Animated.Value(this._defaultHeightValue),
        _rowOpacity : new Animated.Value(0)
    };

    componentDidMount() {
        Animated.timing(this.state._rowOpacity, {
            toValue  : 1,
            duration : this._defaultTransition
        }).start()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.remove) {
            this.onRemoving(nextProps.onRemoving);
        } else {
            this.resetHeight()
        }
    }

    onRemoving(callback) {
        Animated.timing(this.state._rowHeight, {
            toValue  : 0,
            duration : this._defaultTransition
        }).start(callback);
    }

    resetHeight() {
        Animated.timing(this.state._rowHeight, {
            toValue  : this._defaultHeightValue,
            duration : 0
        }).start();
    }

    

    render() {
        return (
            <Animated.View
                style={{height: this.state._rowHeight, opacity: this.state._rowOpacity}}>
                {this.props.children}
            </Animated.View>
        );
    }
}

export default class DynamicList extends Component {

    /**
     * Default state values
     * */
    static navigationOptions = {
        title: 'Add Step Detail',
       
      };
   
    state = {
        loading     : true,
        dataSource  : new ListView.DataSource({
            rowHasChanged : (row1, row2) => true
        }),
        refreshing  : false,
        rowToDelete : null,
        data : [],
        promptVisible: false,
        u_key: '',
    };

    componentWillMount() {
        
        const {state} = this.props.navigation;
        this.setState({u_key: state.params.u_key});
        this.getstepfromdb(state.params.u_key);
    }

    getstepfromdb = (u_key) => {
        /**/
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

          fetch('api', data)  // api url to get steps
            .then((response) => response.json())
            .then((responseJson) => { 
              this.setState({data: responseJson});
            })
            .catch((error) => { console.error(error); });

            /**/
    };

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this._loadData()
        });
    }

    _loadData(refresh) {
        refresh && this.setState({
            refreshing : true
        });
        this.dataLoadSuccess({data : this.state.data});
    }

    dataLoadSuccess(result) {

        this._data = result.data;
        let ds = this.state.dataSource.cloneWithRows(this._data);
        this.setState({
            loading     : false,
            refreshing  : false,
            rowToDelete : -1,
            dataSource  : ds
        });
    }


    render() {
        return (
            <View style={styles.container}>
                <View style={styles.addPanel}>
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={() => this.onSave()}>
                        <Text style={styles.addButtonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => this.setState({ promptVisible: true })}>
                        <Text style={styles.addButtonText}>+ Add Step</Text>
                    </TouchableOpacity>
                    <Prompt
                        title="Add Step Name"
                        placeholder="Step Name"
                        defaultValue=""
                        visible={ this.state.promptVisible }
                        onCancel={ () => this.setState({
                          promptVisible: false,
                          message: "You cancelled"
                        }) }
                        onSubmit={ (value) => {
                            this._addItem(value);
                            this.setState({promptVisible: false,});
                            }
                        }/>
                </View>
                <ListView
                    refreshControl={
                      <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._loadData.bind(this, true)}
                        tintColor="#00AEC7"
                        title="Loading..."
                        titleColor="#00AEC7"
                        colors={['#FFF', '#FFF', '#FFF']}
                        progressBackgroundColor="#00AEC7"

                      />
                    }
                    enableEmptySections={true}
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow.bind(this)}
                />
                <Toast ref="toast"
                  fadeInDuration={750}
                  fadeOutDuration={1000}
                  opacity={0.8}
                />
            </View>
        );
    }



    _renderRow(rowData, sectionID, rowID) {
        return (
            <DynamicListRow
                remove={rowData.id === this.state.rowToDelete}
                onRemoving={this._onAfterRemovingElement.bind(this)}>
                <View style={styles.rowStyle}>
                    <View style={styles.contact} >
                        <Text style={[styles.name]} >{rowData.title}</Text>
                        <Text style={styles.phone}>{rowData.description}</Text>
                    </View>
                    <TouchableOpacity style={styles.deleteWrapper} onPress={() => this._deleteItem(rowData.id)}>
                        <Icon name='md-remove-circle' style={styles.deleteIcon}/>
                    </TouchableOpacity>
                </View>
            </DynamicListRow>
        );
    }

    /*_addItemPressed() {
        //for ios start
        AlertIOS.prompt(
            'Add Item',
            'Name here:',
            [
                {
                    text    : 'OK',
                    onPress : (name) => {
                        this._addItem(name);
                    }
                }
            ],
            'plain-text',
            ''
        );
        //for ios end


        Alert.alert(
          'Alert Title',
          'My Alert Msg',
          [
            {text: 'OK', onPress: (name) => this._addItem(name)},
          ],
          { cancelable: true }
        )
    }*/

    onSave() {
        var temp = this.state.dataSource._dataBlob.s1;
        var finalJSON = [];
        for (var i in temp){
            finalJSON.push(temp[i]["title"]); 
        }
        this.setState({finalArray: finalJSON});
        if( finalJSON == ''){
            this.props.navigation.navigate('LegalIssueDetail');
        } else {
            var formData = new FormData();
              formData.append('title', JSON.stringify(finalJSON));
              formData.append('description', 'test');
              formData.append('u_key', this.state.u_key);

              let data = {
                  method: 'POST',
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'multipart/form-data',
                  },
                  body: formData
              }

              fetch('https://int.mylegalwork.com/api/addlegalissuestep', data)  //https://int.mylegalwork.com/api/app_login  //https://int.mylegalwork.com/appface/check
                .then((response) => response.json())
                .then((responseJson) => { 
                  if( responseJson.status == 1){
                    this.props.navigation.navigate('LegalIssueDetail', {u_key: this.state.u_key});            
                  } else {
                     this.refs.toast.show('Error while adding step', 2000);
                  }
                })
                .catch((error) => { console.error(error); });
        }
    }

    _addItem(name) {
        this._data.push({
            id    : md5(name + Math.random()),
            title  : name,
        });
        this.setState({
            rowToDelete : -1,
            dataSource  : this.state.dataSource.cloneWithRows(this._data)
        });
    }

    componentWillUpdate(nexProps, nexState) {
        if (nexState.rowToDelete !== null) {
            this._data = this._data.filter((item) => {
                if (item.id !== nexState.rowToDelete) {
                    return item;
                }
            });
        }
    }

    _deleteItem(id) {
        this.setState({
            rowToDelete : id
        });
    }

    _onAfterRemovingElement() {
        this.setState({
            rowToDelete : null,
            dataSource  : this.state.dataSource.cloneWithRows(this._data)
        });
    }

}

const styles = StyleSheet.create({
    container : {
        flex            : 1,
        backgroundColor : '#fff'
    },
    noData    : {
        color     : '#000',
        fontSize  : 18,
        alignSelf : 'center',
        top       : 200
    },
    addPanel      : {
        flexDirection   : 'row',
        justifyContent: 'space-between',
        paddingTop      : 40,
        paddingBottom   : 20,
        backgroundColor : '#F9F9F9'
    },
    saveButton    : {
        backgroundColor : '#75b74f',
        width           : 120,
        alignSelf       : 'flex-start',
        marginLeft     : 10,
        padding         : 5,
        borderRadius    : 5
    },
    addButton     : {
        backgroundColor : '#0A5498',
        width           : 120,
        alignSelf       : 'flex-end',
        marginRight     : 10,
        padding         : 5,
        borderRadius    : 5
    },
    addButtonText : {
        color     : '#fff',
        alignSelf : 'center'
    },

    rowStyle : {
        backgroundColor   : '#FFF',
        paddingVertical   : 5,
        paddingHorizontal : 10,
        borderBottomColor : '#ccc',
        borderBottomWidth : 1,
        flexDirection     : 'row'
    },

    rowIcon : {
        width            : 30,
        alignSelf        : 'flex-start',
        marginHorizontal : 10,
        fontSize         : 24
    },

    name    : {
        color    : '#212121',
        fontSize : 14
    },
    phone   : {
        color    : '#212121',
        fontSize : 10
    },
    contact : {
        width     : window.width - 100,
        alignSelf : 'flex-start'
    },

    dateText      : {
        fontSize         : 10,
        color            : '#ccc',
        marginHorizontal : 10
    },
    editWrapper : {
        paddingVertical : 10,
        width           : 80,
        alignSelf       : 'flex-start'
    },
    editIcon    : {
        fontSize  : 24,
        color     : '#DA281C',
        alignSelf : 'center'
    },
    deleteWrapper : {
        paddingVertical : 10,
        width           : 80,
        alignSelf       : 'flex-end'
    },
    deleteIcon    : {
        fontSize  : 24,
        color     : '#DA281C',
        alignSelf : 'center'
    }
});