/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  BackHandler,
  Modal,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, { Fragment, useEffect, useState } from 'react';
import { BLACK, BRAND, GRAY, GREEN, ORANGE, WHITE } from '../../constants/color';
import CustomButton from '../../components/CustomButton';
import { loginStyles } from './LoginStyles';
import { HEIGHT, MyStatusBar, WIDTH } from '../../constants/config';
import { CustomTextInput } from '../../components/CustomTextInput';
import { Loader } from '../../components/Loader';
import { appStyles } from '../../styles/AppStyles';
import { EXTRABOLD, MEDIUM, REGULAR, SEMIBOLD } from '../../constants/fontfamily';
import { RFValue } from 'react-native-responsive-fontsize';
import { useFocusEffect } from '@react-navigation/native';
import { BASE_URL } from '../../constants/url';
import { POSTNETWORK } from '../../utils/Network';
import { clearAll, storeObjByKey } from '../../utils/Storage';
import Alertmodal from '../../components/Alertmodal/Alertmodal';
import Exitmodal from '../../components/Exitmodal';
import { BG, LOGO, TATA } from '../../constants/imagepath';
import { Card, Icon, Input } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import { Switch, TextInput } from 'react-native-paper';
import { checkuserToken } from '../../redux/actions/auth';
import { useDispatch } from 'react-redux';

const Login = ({ navigation, route }) => {
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [alertModal, setAlertModal] = useState(false);
  const [exitModal, setExitModal] = useState(false);
  const dispatch = useDispatch()

  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };


  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPassword('');
      setEmail('');
    });
    return unsubscribe;
  }, [navigation]);


  const handleLogin = () => {
    const url = `${BASE_URL}auth/`;
    const obj = {
      "username": email,
      "password": password
    };

    setLoader(true);

    // Prepare the headers
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // Prepare the request options
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(obj),
      redirect: "follow"
    };

    // Use fetch instead of POSTNETWORK
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(res => {
        console.log('response', res);
        if (res?.token) {
          storeObjByKey('loginResponse', res)

          dispatch(checkuserToken());

          // });
        } else {
          setLoader(false);
          alert('Invalid credentials');
        }
      })
      .catch(() => {
        Alert.alert('Error', 'Something went wrong!');
      })
      .finally(() => {
        setLoader(false);
      });
  };


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route?.params?.registered) {
        setAlertMsg('Registered successfully, Please login!');
        setAlertModal(true);
        navigation.setParams({ registered: false });
      }
    });
    return unsubscribe;
  }, [navigation, route]);

  useFocusEffect(() => {
    const backAction = () => {
      setExitModal(true);
      setAlertMsg('Are you sure you want to Exit app?');
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  });

  const login = () => {
    navigation.navigate('DashBoard');
  }

  return (
    <Fragment>
      <MyStatusBar backgroundColor={'black'} barStyle={'light-content'} />
      <SafeAreaView
        style={[appStyles.safeareacontainer, { backgroundColor: WHITE }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>
          <ImageBackground
            style={{
              flex: 1,

              justifyContent: 'center',
              alignItems: 'center',
            }}
            source={BG}
            resizeMode="cover"
            resizeMethod="scale">
            <ScrollView
              keyboardShouldPersistTaps={'handled'}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                flexGrow: 1,
                alignItems: 'center',
                paddingBottom: 50,
                alignSelf: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  width: WIDTH * 0.97,
                  height: HEIGHT * 0.58,
                  alignSelf: 'center',
                  backgroundColor: WHITE,
                  alignItems: 'center',
                  borderRadius: 10,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 5,
                  elevation: 10,
                  paddingTop: HEIGHT * 0.1, // Adds space to prevent overlap
                  marginTop: HEIGHT * 0.22, // Increased margin to avoid overlap
                }}>
                <LinearGradient
                  colors={['white', BRAND]}
                  start={{ x: 3.5, y: 0 }}
                  end={{ x: 0, y: 0.5 }}
                  style={{
                    width: WIDTH * 0.86,
                    height: HEIGHT * 0.16,
                    marginBottom: HEIGHT * 0.1, // Increased margin to avoid overlap
                    position: 'absolute',
                    top: -HEIGHT * 0.05,
                    borderRadius: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 12,
                  }}>
                  <View
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 10,
                      overflow: 'hidden',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={TATA}
                      style={{
                        width: WIDTH * 0.2,
                        height: HEIGHT * 0.1,
                        tintColor: WHITE,
                      }}
                      resizeMode="center"
                    />
                    <Image
                      source={LOGO}
                      style={{
                        width: WIDTH * 0.5,
                        height: HEIGHT * 0.05,
                        tintColor: WHITE,
                      }}
                      resizeMode="center"
                    />
                  </View>
                </LinearGradient>

                <TextInput
                  label="Email"
                  style={{
                    width: WIDTH * 0.9,
                    marginTop: HEIGHT * 0.05,
                    backgroundColor: 'white',
                  }}
                  mode="outlined"
                  outlineColor={BRAND}
                  activeOutlineColor={BRAND}
                  placeholder="Email"
                  placeholderTextColor={GRAY}
                  value={email}
                  onChangeText={text => setEmail(text)}
                />
                <TextInput
                  secureTextEntry={true}
                  label="Password"
                  style={{
                    width: WIDTH * 0.9,
                    marginTop: HEIGHT * 0.02,
                    backgroundColor: 'white',
                  }}
                  mode="outlined"
                  outlineColor={BRAND}
                  activeOutlineColor={BRAND}
                  placeholder="Password"
                  placeholderTextColor={GRAY}
                  value={password}
                  onChangeText={text => setPassword(text)}
                />

                <View
                  style={{
                    width: WIDTH * 0.95,
                    height: HEIGHT * 0.07,
                    alignItems: 'center',
                    flexDirection: 'row',
                    marginRight: HEIGHT * 0.075,
                    marginTop: HEIGHT * 0.02,
                  }}>
                  <Switch
                    value={isSwitchOn}
                    onValueChange={onToggleSwitch}
                    style={{
                      width: WIDTH * 0.22,
                      height: HEIGHT * 0.1,

                      tintColor: isSwitchOn ? WHITE : ORANGE,
                    }}
                    color="orange"
                  />
                  <Text
                    style={{
                      color: BLACK,
                      fontSize: RFValue(12),
                      fontFamily: REGULAR,
                    }}>
                    Remember Me
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={toggleModal}
                  // clearAll()
                  // dispatch(checkuserToken())

                  style={{
                    width: WIDTH * 0.9,
                    height: HEIGHT * 0.05,
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    marginTop: HEIGHT * 0.02,
                  }}>
                  <Text
                    style={{
                      color: BLACK,
                      fontSize: RFValue(12),
                      fontFamily: SEMIBOLD,
                    }}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleLogin()}
                  style={{
                    width: WIDTH * 0.9,
                    height: HEIGHT * 0.065,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: BRAND,
                    borderRadius: 10,
                    marginTop: HEIGHT * 0.02,
                  }}>
                  <Text
                    style={{
                      color: WHITE,
                      fontSize: RFValue(14),
                      fontFamily: REGULAR,
                    }}>
                    Login
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  width: WIDTH * 0.9,
                  height: HEIGHT * 0.04,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: HEIGHT * 0.06,
                  marginBottom: HEIGHT * 0.005,
                }}>
                <Text
                  style={{
                    color: WHITE,
                    fontSize: RFValue(12),
                    fontFamily: MEDIUM,
                  }}>
                  © 2024,made by{' '}
                  <Text
                    style={{
                      color: WHITE,
                      fontSize: RFValue(14),
                      fontFamily: EXTRABOLD,
                    }}>
                    Epsumlabs
                  </Text>
                </Text>
              </View>
            </ScrollView>
          </ImageBackground>

          {loader && <Loader
            visible={loader}
          />}
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Modals */}
      {alertModal && (
        <Alertmodal
          visible={alertModal}
          message={alertMsg}
          onClose={() => setAlertModal(false)}
        />
      )}
      {exitModal && (
        <Exitmodal
          visible={exitModal}
          message="Are you sure you want to exit?"
          onClose={() => setExitModal(false)}
          onConfirm={() => BackHandler.exitApp()}
        />
      )}


      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Please contact your admin.
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={toggleModal}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Fragment>
  );
};

export default Login;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  openButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,


    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    height: HEIGHT * 0.3,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  modalText: {
    fontSize: RFValue(15),
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#FF5C5C',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
