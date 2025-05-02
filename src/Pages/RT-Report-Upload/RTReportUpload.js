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
  FlatList,
  Image,
} from 'react-native';
import React, {Fragment, useEffect, useState} from 'react';
import Header from '../../components/Header';
import {HEIGHT, MyStatusBar, WIDTH} from '../../constants/config';
import {BRAND, GREEN, WHITE} from '../../constants/color';
import {appStyles} from '../../styles/AppStyles';
import DropDownPicker from 'react-native-dropdown-picker';
import {Icon} from 'react-native-elements';
import {pick} from 'react-native-document-picker';
import {BAS_URL, BASE_URL} from '../../constants/url';
import {GETNETWORK, POSTNETWORK} from '../../utils/Network';
import {Calendar} from 'react-native-calendars';
import {getObjByKey} from '../../utils/Storage';
import {RefreshControl} from 'react-native-gesture-handler';
import {useFocusEffect} from '@react-navigation/native';
import {Loader} from '../../components/Loader';
import ImageCropPicker from 'react-native-image-crop-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
const RTReportUpload = ({navigation}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [reportNumber, setReportNumber] = useState('');
  const [getReports, setGetReports] = useState('');
  const[modalListModalVisible, setModalListModalVisible] = useState(false);
  const [reportDate, setReportDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);


  const handleDateSelect = day => {
    setReportDate(day.dateString);

    setShowModal(false);
  };

  useEffect(() => {
    console.log('Selected Report Updated:', selectedReport);
  }, [selectedReport]); // This will log whenever selectedReport is updated
  
  const handleFilePick = async () => {
    setModalVisible(false); 
    try {
      const options = {
        mediaType: 'photo',
        cameraType: 'back', // Use the back camera
        quality: 1,
        includeBase64: false,
        saveToPhotos: false, // Don't save to gallery (optional)
      };
  
      launchCamera(options, async response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.log('Image Picker Error:', response.errorMessage);
          Alert.alert('Error', 'Failed to capture image');
        } else {
          const image = response.assets[0]; // Get the captured image details
  
          console.log('Captured Image:', image);
  
          try {
            // Pass the captured image URI to crop
            const croppedImage = await ImageCropPicker.openCropper({
              path: image.uri,
              width: 300, // Desired crop width
              height: 300, // Desired crop height
              cropping: true, // Enable cropping
              mediaType: 'photo', // Ensure it's a photo
              freeStyleCropEnabled: true, // Allow manual control

            });
  
            console.log('Cropped Image:', croppedImage);
            setSelectedFile({
              uri: croppedImage.path,
              name: `cropped_${Date.now()}.jpg`, // Unique file name
              type: croppedImage.mime, // Image type (e.g., image/jpeg)
            });
          } catch (cropError) {
            console.error('Cropping error:', cropError);
            Alert.alert('Error', 'Failed to crop image');
          }
        }
      });
    } catch (error) {
      console.error('Camera Error:', error);
      Alert.alert('Error', 'Something went wrong while capturing image');
    }
  };

  
  const handleImagePick = async () => {
    setModalVisible(false); 
    try {
      const pickResult = await ImageCropPicker.openPicker({
        width: 300, // Desired cropped width
        height: 300, // Desired cropped height
        cropping: true, // Enable cropping
        mediaType: 'photo', // Allows only images
        freeStyleCropEnabled: true, // Allow manual control

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
    setGetReports('');
    setReportDate('');
    // setSelectedReport(null);
    // Fetch defect types and job statuses when the modal is mounted
    GetReportNumber();
    RetriveData();
    
  }, []);
  useEffect(() => {
    console.log('hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii')
    GetListItem();
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

  
  const renderItem = ({ item }) => (
    <View style={styles.card}>
  <View style={styles.row}>
    <View style={styles.textColumn}>
      <Text style={styles.title}>{item.report_no}</Text>
      <Text style={styles.dateText}>Date: {item.report_date}</Text>
    </View>

    <TouchableOpacity
      style={styles.viewIcon}
      onPress={() => {
ViewRtReport(item.report_no);
console.log('helo')
setModalListModalVisible(true);    
}}
    >
      <Icon name="visibility" size={24} color="#007bff" />
    </TouchableOpacity>
  </View>
</View>

  );

const GetListItem= async()=>{

  try {
    console.log('inside-------------')
    const url = `${BAS_URL}welding/api/v1/get-rt-reports/`;
    const result = await GETNETWORK(url, true);
    console.log('reporthiiiiiiiiii', result);

    if (result.status === 'success' && result.data?.length > 0) {
     console.log('object', result.data);
     setGetReports(result.data);
    } else {
      console.error('Failed to fetch data:', result.errors || result.message);
    }
  } catch (error) {
    console.error('Error fetching defect and status data:', error);
  }
  finally {
    setLoading(false);
  }

}



const ViewRtReport = async (reportNo) => {
  try {
    setLoading(true);
    console.log('Fetching report for:', reportNo);

    const url = `${BAS_URL}welding/api/v1/view-rt-reports/?report_no=${reportNo}`;
    const result = await GETNETWORK(url, true);

    if (result?.status === 'success' && result.data?.report_file) {
      const BASE_DOMAIN = 'https://tatapower.epsumlabs.in';
let reportFile = result.data.report_file;

// Remove extra /media if present
if (reportFile.startsWith('/media/media/')) {
  reportFile = reportFile.replace('/media/media/', '/media/');
}

const imageUrl = `${BASE_DOMAIN}${reportFile}`;


      const updatedReport = {
        ...result.data,
        imageUrl,
      };

      console.log('Updated Selected Report:', updatedReport);
      setSelectedReport(updatedReport);

      // Delay modal open until state is set
      setTimeout(() => {
        setModalListModalVisible(true);
      }, 100);
    } else {
      Alert.alert('Error', result.message || 'Failed to fetch report.');
    }
  } catch (error) {
    console.error('Network error:', error);
    Alert.alert('Error', 'Network request failed');
  } finally {
    setLoading(false);
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
            // refreshControl={
            //   <RefreshControl
            //     refreshing={refreshing}
            //     onRefresh={onRefresh}
            //     colors={[BRAND]}
            //     tintColor={BRAND}
            //   />
            // }
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
                 <TouchableOpacity
      onPress={() => {
        setLoading(true); 
    setTimeout(() => {
      onRefresh();
      setLoading(false); // Hide loader after timeout
      // Call your refresh logic
    }, 1000); // 2 seconds delay (you can change it)
  }}
      style={{
        position:'absolute',
        right:10,
        top:100,
        
        padding: 8,
        backgroundColor: '#007BFF',
        borderRadius: 5,
      }}>
      <Text style={{ color: '#fff', fontWeight: 'bold' }}>Refresh</Text>
    </TouchableOpacity>
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
                // onPress={handleFilePick}
                onPress={()=>{
                  setModalVisible(true)
                }}
                
                >
                <Text
                  style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
                  Attach File
                </Text>
                <Icon name="attachment" size={25} style={{marginLeft: 10}} />
              </TouchableOpacity>

              <View
  style={{
    width: WIDTH * 0.95,
    height: HEIGHT * 0.45,
    marginTop: 20,
    alignSelf: 'center',
  }}>
  {loading ? (
<Loader visible={loading} />
) : (
    <>
      {/* Table Header */}
      <View
        style={{
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderBottomColor: '#999',
          paddingBottom: 8,
          marginBottom: 5,
          backgroundColor: '#f2f2f2',
        }}>
        <Text style={{ flex: 1, fontWeight: 'bold', color: '#000' }}>
          Sl No.
        </Text>
        <Text style={{ flex: 2, fontWeight: 'bold', color: '#000' }}>
          Report No.
        </Text>
        <Text style={{ flex: 2, fontWeight: 'bold', color: '#000' }}>
          Date
        </Text>
        <Text style={{ flex: 1, fontWeight: 'bold', color: '#000', textAlign: 'center' }}>
          Action
        </Text>
      </View>

      {/* Table Rows */}
      <FlatList
        data={getReports}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 8,
              borderBottomWidth: 0.5,
              borderColor: '#ccc',
              alignItems: 'center',
            }}>
            <Text style={{ flex: 1, color: '#333' }}>
              {index + 1} {/* Displaying Serial Number */}
            </Text>
            <Text style={{ flex: 2, color: '#333' }}>{item.report_no}</Text>
            <Text style={{ flex: 2, color: '#333' }}>{item.report_date}</Text>
            <TouchableOpacity
              onPress={() => {
                ViewRtReport(item.report_no);
                // setModalListModalVisible(true)
              }
              }
              style={{ flex: 1, alignItems: 'center' }}>
              <Icon name="visibility" size={22} color="#007bff" />
            </TouchableOpacity>
          </View>
        )}
      />
    </>
  )}
</View>



              <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose an Option</Text>

            <TouchableOpacity style={styles.optionButton} onPress={handleFilePick}>
              <Text style={styles.optionText}> Capture from Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionButton} onPress={handleImagePick}>
              <Text style={styles.optionText}> Pick from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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





      <Modal
  visible={modalListModalVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setModalListModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      {/* Image */}
      {selectedReport?.imageUrl ? (
  <>
    {loading && (
      
      <Loader visible={loading} />
    )}
    <Image
      source={{ uri: selectedReport.imageUrl }}
      style={styles.modalImage}
      resizeMode="cover"
      onLoadStart={() => setLoading(true)}
      onLoadEnd={() => setLoading(false)}
    />
  </>
) : (
  <Text>No image available.</Text>
)}



      
      <Text style={styles.modalTitle}>{selectedReport?.report_no}</Text>
      <Text>By: {selectedReport?.report_by}</Text>
      <Text>Date: {selectedReport?.report_date}</Text>
     
      <TouchableOpacity
        onPress={() => setModalListModalVisible(false)}
        style={styles.closeButton}
      >
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
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
    marginTop:20
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
  refreshButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 8,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  refreshText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  optionButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  optionText: { color: 'white', fontSize: 16 },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textColumn: {
    flexDirection: 'column',
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  viewIcon: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  cancelText: { color: 'white', fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalImage: {
    width: 300,
    height: 200,
    resizeMode: 'contain',
    borderRadius: 10,
    marginBottom: 15,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor:'grey'
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
});
