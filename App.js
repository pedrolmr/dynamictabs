import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Tabs, Tab, Input } from 'native-base';
// import constants from '../../helpers/constants';
import {
  isName,
  isEmail,
  isAddress,
  isPhone,
  isUrl,
  isCityState
} from './helpers/inputValidators'
import { parseAddress, parseCityState, parseName } from './helpers/parsers';

class SearchForm extends Component {
  state = {
    name: '',
    cityState: '',
    email: '',
    address: '',
    phone: '',
    url: '',
    inputValidate: true,
    tabPage: 0,
  };
  inputHandler = (name, value) => {
    const inputName = name;
    const inputValue = this.state[name];
    let nameInput;
    let cityStateInput;

    const tabPages = { name: 0, email: 1, address: 2, phone: 3, url: 4 };

    if (inputValue.length === 0) {
      if (inputName === 'name') {
        cityStateInput = this.state.cityState;
      } else if (inputName === 'cityState') {
        nameInput = this.state.name;
      } else {
        cityStateInput = '';
        nameInput = '';
      }
      this.setState({
        name: nameInput,
        cityState: cityStateInput,
        email: '',
        address: '',
        phone: '',
        url: '',
        tabPage: tabPages[name]
      });
    }
    this.setState({ [name]: value });

    if (name === 'name') {
      if (this.state.name) {
        this.setState({ inputValidate: isName(value) })
      }
    }
    else if (name === 'cityState') {
      if (this.state.cityState) {
        this.setState({ inputValidate: isCityState(value) })
      }
    }
    else if (name === 'email') {
      this.setState({ inputValidate: isEmail(value) })
    }
    else if (name === 'address') {
      this.setState({ inputValidate: isAddress(value) })
    }
    else if (name === 'phone') {
      this.setState({ inputValidate: isPhone(value) })
    }
    else if (name === 'url') {
      this.setState({ inputValidate: isUrl(value) })
    }
  };

  handleFormSubmit = () => {
    let inputKey;
    let inputValue;
    let formattedObject = null;

    // const inputObj = this.findInputWithLength();

    // if (!inputObj) {
    //   // console.log('No input');
    //   return;
    // }

    for (let [key, value] of Object.entries(inputObj)) {
      inputKey = key;
      inputValue = value;
    }
    let searchType;
    if (isName(inputValue)) {
      if (!this.state.name) {
        this.setState({ name: inputValue, [inputKey]: '', tabPage: 0 });
      }
      searchType = 'name';
      formattedObject = this.formatRequestObject(inputValue, 'name');
    } else if (isEmail(inputValue)) {
      if (!this.state.email) {
        this.setState({ email: inputValue, [inputKey]: '', tabPage: 1 });
      }
      searchType = 'email';
      formattedObject = this.formatRequestObject(inputValue, 'email');
    } else if (isAddress(inputValue)) {
      if (!this.state.address) {
        this.setState({ address: inputValue, [inputKey]: '', tabPage: 2 });
      }
      searchType = 'address';
      formattedObject = this.formatRequestObject(inputValue, 'address');
    } else if (isPhone(inputValue)) {
      if (!this.state.phone) {
        this.setState({ phone: inputValue, [inputKey]: '', tabPage: 3 });
      }
      searchType = 'phone';
      formattedObject = this.formatRequestObject(inputValue, 'phone');
    } else if (isUrl(inputValue)) {
      if (!this.state.url) {
        this.setState({ url: inputValue, [inputKey]: '', tabPage: 4 });
      }
      searchType = 'url';
      formattedObject = this.formatRequestObject(inputValue, 'url');
    }
    else {
      console.log('your input is not valid');
    }

    if (formattedObject) {
      this.props.handleSearch(formattedObject, searchType, inputValue);
    } else {
      console.log('formattedObject: error');
      this.props.sendSearchErrorMessage({ inputKey, inputValue });
    }
  };

  findInputWithLength = () => {
    let input;
    let name;

    for (let key in this.state) {
      if (key !== 'cityState' && key !== 'tabPage') {
        if (this.state[key].length) {
          input = this.state[key];
          name = key;
        }
      }
    }
    if (name && input) {
      return { [name]: input };
    } else {
      // console.log('Something went wrong!');
    }
  };

  formatRequestObject = (inputValue, type) => {
    const person = {};

    switch (type) {
      case 'name':
        person.names = [];
        const parsedName = parseName(inputValue);
        person.names.push(parsedName);

        if (this.state.cityState.length) {
          person.addresses = [];
          const location = parseCityState(this.state.cityState);
          person.addresses.push(location);
        }
        break;

      case 'email':
        person.emails = [];
        person.emails.push({
          address: inputValue
        });
        break;
      case 'address':
        person.addresses = [];
        const addresses = parseAddress(inputValue);
        person.addresses.push(addresses);
        break;

      case 'phone':
        person.phones = [];
        person.phones.push({
          number: inputValue.replace(/[^0-9]+/g, '')
        });
        break;

      case 'url':
        person.urls = [];
        person.urls.push({
          url: inputValue
        });
        break;

      default:
        // console.log('Something happened ERROR');
        break;
    }
    return person;
  };

  startOver = () => {
    this.setState({
      name: '',
      cityState: '',
      email: '',
      address: '',
      phone: '',
      url: '',
    });
  };

  // toggleCityStateInput = (data) => {
  //   console.log(data.i)
  //   this.setState({ showCityStateInput: data.i == 0 ? true : false, tabPage: data.i });
  // }

  render() {
    // console.log('IN RENDER', this.props);
    return (
      <View>
        <Tabs
          style={styles.container}
          activeTextStyle={{ color: '#64aab8' }}
          tabBarUnderlineStyle={{ backgroundColor: '#000' }}
          page={this.state.tabPage}
        >
          <Tab
            heading="Name"
            style={[styles.nameInput, { color: '#64aab8' }]}
            activeTextStyle={styles.activeTextStyle}
            textStyle={styles.textStyle}
            activeTabStyle={{ backgroundColor: '#fff' }}
            tabStyle={{ backgroundColor: '#fff' }}
          >
            <View style={styles.nameInputFullWidth}>
              <Input
                placeholder="First and last, middle optional"
                style={[styles.textInput, !this.state.inputValidate ? styles.error : null]}
                value={this.state.name}
                onChangeText={text => this.inputHandler('name', text)}
              />
              <View>
                <Input
                  placeholder="City, State"
                  // style={styles.textInput}
                  style={[styles.textInput, !this.state.inputValidate ? styles.error : null]}
                  value={this.state.cityState}
                  onChangeText={text => this.inputHandler('cityState', text)}
                />
              </View>
            </View>
          </Tab>

          <Tab
            heading="Email"
            activeTextStyle={[styles.activeTextStyle]}
            textStyle={styles.textStyle}
            activeTabStyle={[{ backgroundColor: '#fff' }]}
            tabStyle={[{ backgroundColor: '#fff' }]}
            style={[{ flex: 0 }]}


          >
            <View>
              <Input
                placeholder="Email address"
                style={[styles.textInput, !this.state.inputValidate ? styles.error : null]}
                value={this.state.email}
                onChangeText={text => this.inputHandler('email', text)}
              />
            </View>
          </Tab>

          <Tab
            heading="Address"
            activeTextStyle={styles.activeTextStyle}
            textStyle={styles.textStyle}
            activeTabStyle={{ backgroundColor: '#fff' }}
            tabStyle={{ backgroundColor: '#fff' }}
          >
            <View>
              <Input
                placeholder="Mailing address"
                style={[styles.textInput, !this.state.inputValidate ? styles.error : null]}
                value={this.state.address}
                onChangeText={text => this.inputHandler('address', text)}
              />
            </View>
          </Tab>

          <Tab
            heading="Phone"
            activeTextStyle={styles.activeTextStyle}
            textStyle={styles.textStyle}
            activeTabStyle={{ backgroundColor: '#fff' }}
            tabStyle={{ backgroundColor: '#fff' }}
          >
            <View>
              <Input
                placeholder="Phone any format, no letters"
                style={[styles.textInput, !this.state.inputValidate ? styles.error : null]}
                value={this.state.phone}
                onChangeText={text =>
                  this.inputHandler('phone', text)}
              />
            </View>
          </Tab>

          <Tab
            heading="URL"
            activeTextStyle={styles.activeTextStyle}
            textStyle={styles.textStyle}
            activeTabStyle={{ backgroundColor: '#fff' }}
            tabStyle={{ backgroundColor: '#fff' }}
          >
            <View>
              <Input
                placeholder="Social profile link or any URL"
                style={[styles.textInput, !this.state.inputValidate ? styles.error : null]}
                value={this.state.url}
                onChangeText={text => this.inputHandler('url', text)}
              />
            </View>
          </Tab>
        </Tabs>
        <View style={{ flexDirection: 'row' }}>
          <Button style={styles.button} onPress={this.handleFormSubmit}>
            <Text style={styles.buttonText}> Search </Text>
          </Button>

          <Button style={styles.greyButton} onPress={this.startOver}>
            <Text style={styles.buttonText}> Start Over </Text>
          </Button>

          {/* <Button info style={styles.greyButton} onPress={this.getData}>
            <Text style={styles.buttonText}> get object </Text>
          </Button> */}
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 5, flex: 0
  },
  textInput: {
    borderColor: '#64aab8',
    borderWidth: 1,
    borderStyle: 'solid',
    width: '100%'
  },

  textInputSmall: {
    flex: 1
  },
  nameInput: {
    flexDirection: 'row'
  },

  button: {
    margin: 10,
    padding: 10,
    backgroundColor: `${constants.highlightColor}`
  },

  tab: {
    backgroundColor: 'white'
  },

  buttonText: {
    color: 'white'
  },

  link: {
    color: '#64aab8',
    lineHeight: 17,
    padding: 15,
    backgroundColor: `${constants.highlightColor}`,
    borderRadius: 10,
    marginBottom: 20
  },
  matchesText: {
    fontSize: 20,
    color: `${constants.highlightColor}`,
    marginBottom: 20
  },
  greyButton: {
    backgroundColor: 'grey',
    margin: 10,
    padding: 10
  },
  activeTextStyle: {
    color: '#000',
    fontFamily: constants.fontFamily,
    fontSize: 16
  },
  textStyle: {
    color: '#64aab8',
    fontFamily: constants.fontFamily,
    fontSize: 16
  },
  nameInputFullWidth: {
    width: '100%'
  }
});


export default SearchForm;