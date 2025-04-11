import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import React, {Fragment, useEffect, useState} from 'react';
import Header from '../../components/Header';
import {HEIGHT, MyStatusBar, WIDTH} from '../../constants/config';
import {BRAND, GREEN, WHITE} from '../../constants/color';
import {appStyles} from '../../styles/AppStyles';
import DropDownPicker from 'react-native-dropdown-picker';
import {Icon} from 'react-native-elements';
import {pick} from 'react-native-document-picker';
import {BAS_URL} from '../../constants/url';
import {GETNETWORK, POSTNETWORK} from '../../utils/Network';
import {Calendar} from 'react-native-calendars';
import {getObjByKey} from '../../utils/Storage';
import {RefreshControl} from 'react-native-gesture-handler';
import {useFocusEffect} from '@react-navigation/native';
import {Loader} from '../../components/Loader';
import ImageCropPicker from 'react-native-image-crop-picker';

const RTReportUpload = ({navigation}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [reportNumber, setReportNumber] = useState('');
  const [reportDate, setReportDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDateSelect = day => {
    setReportDate(day.dateString);

    setShowModal(false);
  };

  const handleFilePick = async () => {
    try {
      const pickResult = await ImageCropPicker.openPicker({
        width: 300, // Desired cropped width
        height: 300, // Desired cropped height
        cropping: true, // Enable cropping
        mediaType: 'photo', // Allows only images
      });

      console.log('Cropped Image:', pickResult);
      setSelectedFile({
        uri: pickResult.path,
        name: `cropped_${Date.now()}.jpg`, // Give a unique name
        type: pickResult.mime, // Image type (e.g., image/jpeg)
      });
    } catch (error) {
      console.error('File picking/cropping error:', error);
      Alert.alert('Error', 'Failed to pick or crop image');
    }
  };

  const [ReportOpen, setReportOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [ReportItems, setReportItems] = useState([]);
  const [token, setToken] = useState('');

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);

    // Clear all states
    setSelectedFile(null);
    setReportNumber('');
    setReportDate('');
    setSelectedReport(null);

    // Refetch Data
    GetReportNumber();
    RetriveData();

    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      setSelectedFile(null);
      setReportNumber('');
      setReportDate('');
      setSelectedReport(null);
      GetReportNumber();
      RetriveData();
    }, [navigation]),
  );

  useEffect(() => {
    setSelectedFile(null);
    setReportNumber('');
    setReportDate('');
    setSelectedReport(null);
    // Fetch defect types and job statuses when the modal is mounted
    GetReportNumber();
    RetriveData();
  }, []);

  const RetriveData = async () => {
    const data = await getObjByKey('loginResponse');
    if (data) {
      console.log('data', data);
      setToken(data.token);
    }
  };
  const GetReportNumber = async () => {
    try {
      const url = `${BAS_URL}welding/api/v1/get-report-numbers/`;
      const result = await GETNETWORK(url, true);
      console.log('report numbers', result);

      if (result.status === 'success' && result.data?.length > 0) {
        // Convert the data array into the format DropDownPicker requires
        const formattedData = result.data.map(item => ({
          label: item, // Display text
          value: item, // Internal value
        }));
        setReportItems(formattedData);
      } else {
        console.error('Failed to fetch data:', result.errors || result.message);
      }
    } catch (error) {
      console.error('Error fetching defect and status data:', error);
    }
  };

  const UploadReport = async () => {
    setLoading(true);
    if (!reportNumber || !reportDate || !selectedFile) {
      Alert.alert('Error', 'Please fill all fields');
      setLoading(false);
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Token ${token}`);

    const formdata = new FormData();
    formdata.append('report_no', reportNumber);
    formdata.append('report_date', reportDate);
    formdata.append('file', {
      uri: selectedFile.uri,
      name: selectedFile.name,
      type: selectedFile.type,
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    try {
      const response = await fetch(
        `${BAS_URL}welding/api/v1/rt-report-entry/`,
        requestOptions,
      );
      const result = await response.json();
      setLoading(false);

      if (result.status === 'success') {
        Alert.alert('Success', result.data.message);

        // Clear States on Success
        setSelectedFile(null);
        setReportNumber('');
        setReportDate('');
        setSelectedReport(null);
      } else {
        Alert.alert('Error', result.message || 'Failed to upload report');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error('Upload Error:', error);
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <MyStatusBar backgroundColor={BRAND} barStyle={'light-content'} />
      <SafeAreaView style={appStyles.safeareacontainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[BRAND]}
                tintColor={BRAND}
              />
            }
            keyboardShouldPersistTaps={'handled'}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: 20,
            }}
            scrollEnabled={false}>
            <Header
              onMenuPress={() => {
                navigation.toggleDrawer();
              }}
              title="RT-Report-Upload"
            />
            <View
              style={{
                flex: 1,
                width: '99%',
                padding: 20,
                alignSelf: 'center',
                alignItems: 'center',
              }}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Report Number:</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter Report Number"
                  value={reportNumber} // State value for report number
                  onChangeText={text => setReportNumber(text)} // Update state
                />
              </View>
              <TouchableOpacity
                onPress={() => setShowModal(true)}
                style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Report Date:</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter Report Date (YYYY-MM-DD)"
                  value={reportDate}
                  onChangeText={text => setReportDate(text)}
                  editable={false}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: 'gray',
                  padding: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={handleFilePick}>
                <Text
                  style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
                  Attach File
                </Text>
                <Icon name="attachment" size={25} style={{marginLeft: 10}} />
              </TouchableOpacity>

              {selectedFile && (
                <View style={styles.previewContainer}>
                  <Text style={styles.previewText}>Selected File:</Text>
                  <Text style={styles.previewText}>
                    Name: {selectedFile.name}
                  </Text>
                </View>
              )}

              {selectedFile && (
                <TouchableOpacity
                  style={{
                    backgroundColor: GREEN,
                    paddingVertical: 10,
                    paddingHorizontal: 25,
                    borderRadius: 5,
                    marginTop: 15,
                    alignSelf: 'center',
                  }}
                  onPress={UploadReport}>
                  <Text style={styles.buttonText}>Submit Report</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalContainer}>
          <Calendar style={styles.calendar} onDayPress={handleDateSelect} />
        </View>
      </Modal>
      <Loader visible={loading} />
    </Fragment>
  );
};

export default RTReportUpload;

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  apiCallButton: {
    backgroundColor: GREEN,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginTop: 15,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    width: '90%',
    // flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignSelf: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    width: WIDTH * 0.98,
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#555',
    marginBottom: 5,
  },
  textInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: {
    height: 80,
    padding: 15,
    marginBottom: 50,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  submitButton: {
    backgroundColor: '#4CAF50', // Green
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  filterContainer: {
    width: '100%',
    height: HEIGHT * 0.08,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  // Left content (70% width)
  leftContent: {
    flex: 0.7,
    justifyContent: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterTextInput: {
    width: '95%', // Full width inside the TouchableOpacity
    padding: 10,
    fontSize: 16,
    color: '#333', // Text color
    backgroundColor: '#F0F0F0', // Light background color for input
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
  },
  // Right side buttons (30% width)
  rightButtons: {
    flex: 0.3,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // Select Filter button
  selectButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    marginRight: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButton: {
    padding: 10,
    backgroundColor: '#FF6347', // Different color for clear action
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // buttonText: {
  // color: '#fff',
  // fontSize: 12,
  // fontWeight: 'bold',
  // },
  dropdown: {
    width: '100%',
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  dropdownContainer: {
    borderColor: '#ccc',
    height: 200,
  },
  dropdownHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333', // Adjust color as needed
  },
  previewContainer: {
    width: '100%',
    height: 70,
    borderRadius: 8,
    elevation: 10,
    backgroundColor: WHITE,
    marginTop: 20,
    alignItems: 'center',
  },
  previewText: {
    fontSize: 14,
    color: 'black',
    marginTop: 5,
  },
  apiCallButton: {
    backgroundColor: 'cyan',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginTop: 15,
    alignSelf: 'center',
  },
});
