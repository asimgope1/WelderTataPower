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
import React, {Fragment, useEffect, useState} from 'react';
import {BLACK, BRAND, GRAY, GREEN, ORANGE, WHITE} from '../../constants/color';
import {HEIGHT, MyStatusBar, WIDTH} from '../../constants/config';
import {appStyles} from '../../styles/AppStyles';
import {RFValue} from 'react-native-responsive-fontsize';
import {useFocusEffect} from '@react-navigation/native';
import {BASE_URL} from '../../constants/url';
import {clearAll, storeObjByKey} from '../../utils/Storage';
import {checkuserToken} from '../../redux/actions/auth';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Loader} from '../../components/Loader';
import {BG, LOGO, TATA} from '../../constants/imagepath';
import {Switch, TextInput} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Alertmodal from '../../components/Alertmodal/Alertmodal';
import Exitmodal from '../../components/Exitmodal';
import DeviceInfo, {getIpAddress} from 'react-native-device-info';
import {encode} from 'base-64';

// === Constants ===
const MAX_ATTEMPTS = 5;
const LOCK_TIME_MS = 10 * 60 * 1000; // 10 minutes lockout
const RATE_LIMIT_MS = 60000; // 1 minute rate limit
const MAX_REQUESTS = 3;

const Login = ({navigation, route}) => {
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [alertModal, setAlertModal] = useState(false);
  const [exitModal, setExitModal] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();

  // === Modal Toggle ===
  const toggleModal = () => setIsModalVisible(!isModalVisible);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  // === Validate Email & Password ===
  const validateInput = (email, password) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^[a-zA-Z0-9@!#%&]+$/;

    if (!emailPattern.test(email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return false;
    }
    if (password.length < 8 || !passwordPattern.test(password)) {
      Alert.alert(
        'Weak Password',
        'Password must be at least 8 characters and contain only allowed characters.',
      );
      return false;
    }
    return true;
  };

  // === Log Login Attempts ===
  const logLoginAttempt = async (email, status, message) => {
    try {
      const ip_address = await DeviceInfo.getIpAddress(); // Fetch IP Address
      const logData = {
        email,
        ip_address,
        status,
        message,
        timestamp: new Date().toISOString(),
      };

      // Save to AsyncStorage
      const existingLogs =
        JSON.parse(await AsyncStorage.getItem('loginLogs')) || [];
      existingLogs.push(logData);
      await AsyncStorage.setItem('loginLogs', JSON.stringify(existingLogs));

      // Call API to send log data
      const response = await fetch(`${BASE_URL}add-audit-log/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData),
      });

      const result = await response.json();
    } catch (error) {
      console.error('Error logging login attempt:', error);
    }
  };

  // === Brute Force Protection ===
  const checkLoginAttempts = async email => {
    const logs = JSON.parse(await AsyncStorage.getItem('loginLogs')) || [];
    const recentAttempts = logs.filter(
      log =>
        log.email === email &&
        log.status === 'failed' &&
        new Date() - new Date(log.timestamp) < LOCK_TIME_MS,
    );

    if (recentAttempts.length >= MAX_ATTEMPTS) {
      const lockTimeRemaining =
        LOCK_TIME_MS - (new Date() - new Date(recentAttempts[0].timestamp));
      Alert.alert(
        'Account Locked',
        `Too many failed attempts. Try again in ${
          Math.round(lockTimeRemaining / 60000) || 1
        } minute(s).`,
      );
      return false;
    }
    return true;
  };

  // === Rate Limiting Check ===
  const checkRateLimit = async email => {
    const rateLimitData =
      JSON.parse(await AsyncStorage.getItem('rateLimit')) || {};
    const userRate = rateLimitData[email] || {count: 0, lastAttempt: null};

    if (
      userRate.lastAttempt &&
      new Date() - new Date(userRate.lastAttempt) < RATE_LIMIT_MS
    ) {
      if (userRate.count >= MAX_REQUESTS) {
        Alert.alert('Too Many Requests', 'Please wait before trying again.');
        return false;
      }
      userRate.count += 1;
    } else {
      userRate.count = 1;
      userRate.lastAttempt = new Date().toISOString();
    }

    rateLimitData[email] = userRate;
    await AsyncStorage.setItem('rateLimit', JSON.stringify(rateLimitData));
    return true;
  };

  // === Handle Login ===

  // const handleLogin = async () => {
  //   if (!validateInput(email, password)) {
  //     return;
  //   }
  //   const proceedWithLogin = await checkLoginAttempts(email);
  //   if (!proceedWithLogin) return;

  //   const rateLimitPassed = await checkRateLimit(email);
  //   if (!rateLimitPassed) return;

  //   const url = `${BASE_URL}auth/`;

  //   // Encode email and password separately
  //   const encodedPassword = encode(password);

  //   // Encode full credentials string
  //   const encodedCredentials = encode(`${email}:${encodedPassword}`);

  //   console.log("Original Password:", password);
  //   console.log("Encoded Credentials:", encodedCredentials);

  //   const obj = {
  //     credentials: encodedCredentials, // Send as a single encoded string
  //   };

  //   setLoader(true);

  //   fetch(url, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(obj),
  //   })
  //     .then(response => response.json())
  //     .then(async res => {
  //       console.log('response', res);
  //       if (res?.token) {
  //         await logLoginAttempt(email, 'success');
  //         storeObjByKey('loginResponse', res);
  //         dispatch(checkuserToken());
  //         navigation.navigate('DashBoard');
  //       } else {
  //         await logLoginAttempt(email, 'failed');
  //         Alert.alert('Invalid Credentials', 'Please check your details.');
  //       }
  //     })
  //     .catch(() => {
  //       Alert.alert('Error', 'Something went wrong!');
  //     })
  //     .finally(() => {
  //       setLoader(false);
  //     });
  // };

  const handleLogin = async () => {
    if (!validateInput(email, password)) {
      return;
    }
    const proceedWithLogin = await checkLoginAttempts(email);
    if (!proceedWithLogin) return;

    const rateLimitPassed = await checkRateLimit(email);
    if (!rateLimitPassed) return;

    const url = `${BASE_URL}auth/`;

    // Encode password
    const encodedPassword = encode(password);
    const encodedCredentials = encode(`${email}:${encodedPassword}`);

    // Set headers
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Basic ${encodedCredentials}`);
    myHeaders.append('Content-Type', 'application/json');

    // Request body
    const raw = JSON.stringify({
      username: email,
      password: password, // Send the original password
    });

    // Request options
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    setLoader(true);

    // API call
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(async res => {
        if (res?.message === 'OK') {
          // Modify the login log message before saving
          const successData = {
            email: email,
            ip_address: res?.ip_address || 'Unknown IP',
            status: 'LOGIN_SUCCESS',
            message: 'User logged in successfully.', // Replacing "OK" with descriptive message
            timestamp: new Date().toISOString(),
          };

          // Save login logs to AsyncStorage
          await AsyncStorage.setItem(
            'loginStatus',
            JSON.stringify(successData),
          );

          // Log login attempt
          await logLoginAttempt(email, successData.status, successData.message);

          // Store response and navigate
          storeObjByKey('loginResponse', res.data);
          dispatch(checkuserToken());
          // navigation.navigate('DashBoard');
        } else if (res.status === 'error') {
          // Modify the failure message before saving
          const failureData = {
            email: email,
            ip_address: res?.ip_address || 'Unknown IP',
            status: 'LOGIN_FAILURE',
            message: 'Invalid Username or password', // Descriptive failure message
            timestamp: new Date().toISOString(),
          };

          // Save failure logs to AsyncStorage
          await AsyncStorage.setItem(
            'loginStatus',
            JSON.stringify(failureData),
          );

          // Log login attempt
          await logLoginAttempt(email, failureData.status, failureData.message);

          Alert.alert('Invalid Credentials', 'Please check your details.');
        }
      })
      .catch(async error => {
        console.error('API Error:', error);

        // Save error response
        const errorData = {
          status: 'ERROR',
          message: error.message || 'Something went wrong!',
          timestamp: new Date().toISOString(),
        };
        await AsyncStorage.setItem('loginStatus', JSON.stringify(errorData));

        Alert.alert('Error', 'Something went wrong!');
      })
      .finally(() => {
        setLoader(false);
      });
  };

  // === Modal & Navigation Handling ===
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPassword('');
      setEmail('');
    });
    return unsubscribe;
  }, [navigation]);

  useFocusEffect(() => {
    const backAction = () => {
      setExitModal(true);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  });

  // === Password Expiry Check ===
  const checkPasswordExpiry = async () => {
    const loginData = JSON.parse(await AsyncStorage.getItem('loginResponse'));
    if (loginData?.passwordSetDate) {
      const passwordAge =
        (new Date() - new Date(loginData.passwordSetDate)) /
        (1000 * 60 * 60 * 24);
      if (passwordAge > 90) {
        Alert.alert(
          'Password Expired',
          'Your password has expired. Please reset it.',
        );
        navigation.navigate('ResetPassword');
      }
    }
  };

  useEffect(() => {
    checkPasswordExpiry();
  }, []);

  return (
    <Fragment>
      <MyStatusBar backgroundColor={'black'} barStyle={'light-content'} />
      <SafeAreaView
        style={[appStyles.safeareacontainer, {backgroundColor: WHITE}]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
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
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.2,
                  shadowRadius: 5,
                  elevation: 10,
                  paddingTop: HEIGHT * 0.1,
                  marginTop: HEIGHT * 0.22,
                }}>
                <LinearGradient
                  colors={['white', BRAND]}
                  start={{x: 3.5, y: 0}}
                  end={{x: 0, y: 0.5}}
                  style={{
                    width: WIDTH * 0.86,
                    height: HEIGHT * 0.16,
                    position: 'absolute',
                    top: -HEIGHT * 0.05,
                    borderRadius: 10,
                    elevation: 12,
                  }}>
                  <View
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 10,
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
                  value={password}
                  onChangeText={text => setPassword(text)}
                />
                <TouchableOpacity
                  onPress={
                    () => handleLogin()
                    // clearAll()
                  }
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
                    }}>
                    Login
                  </Text>
                </TouchableOpacity>

                <Text
                  style={{
                    marginTop: 10,
                    fontSize: RFValue(12),
                    color: BRAND,
                  }}>
                  version: 1.0
                </Text>
              </View>
            </ScrollView>
          </ImageBackground>
          {loader && <Loader visible={loader} />}
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
    </Fragment>
  );
};

export default Login;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    height: HEIGHT * 0.3,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
});
