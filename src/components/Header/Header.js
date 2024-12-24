import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DropDownPicker from 'react-native-dropdown-picker';
import { RFValue } from 'react-native-responsive-fontsize';
import { HEIGHT, WIDTH } from '../../constants/config';
import { BLACK, BRAND, WHITE } from '../../constants/color';
import { EXTRABOLD } from '../../constants/fontfamily';
import { Icon } from 'react-native-elements';
import { GETNETWORK } from '../../utils/Network';
import { BAS_URL } from '../../constants/url';
import { WebView } from 'react-native-webview'; // For PDF preview
import { Linking } from 'react-native'; // For handling the download

const Header = ({ title, onMenuPress, onAddPress }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropdownHeader, setDropdownHeader] = useState('');
  const [dropdownItems, setDropdownItems] = useState([]);
  const [dropdownValue, setDropdownValue] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [fileUrl, setFileUrl] = useState(null); // Store the URL of the selected PDF

  const handleApiCall = async (type) => {
    setDropdownHeader('');
    setDropdownItems([]);
    setDropdownValue(null);
    setSelectedData(null);
    setDropdownOpen(false);

    setLoading(true);
    setModalVisible(true);

    try {
      if (type === 'first') {
        setDropdownHeader('Schema');
        const response = await GETNETWORK(`${BAS_URL}welding/api/v1/schema-list/`, true);
        if (response.status === "success" && response.data) {
          const formattedData = response.data.map((item) => ({
            label: item.schema_name,
            value: item.schema_name,
            imageUrl: item.schema_diagram,
          }));
          setDropdownItems(formattedData);
        }
      } else if (type === 'second') {
        setDropdownHeader('Pressure');
        const response = await GETNETWORK(`${BAS_URL}welding/api/v1/boiler-pressure-parts-component-list/`, true);
        if (response.status === "success" && response.data) {
          const formattedData = response.data.map((item) => ({
            label: item.pressure_part_component_name,
            value: item.pressure_part_component_name,
            details: item,
          }));
          setDropdownItems(formattedData);
        }
      }
    } catch (error) {
      console.error('Error during API handling:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDropdownChange = (value) => {
    const selectedItem = dropdownItems.find(item => item.value === value);
    setDropdownValue(value);

    if (selectedItem) {
      if (dropdownHeader === 'Schema') {
        const fileUrl = `${BAS_URL}${selectedItem.imageUrl}`;
        setFileUrl(fileUrl); // Set the file URL

        if (fileUrl.endsWith('.pdf')) {
          // If the file is a PDF, render it using WebView for preview
          setSelectedData(
            <WebView
              source={{ uri: fileUrl }}
              style={styles.pdfViewer}
            />
          );
        } else {
          // If the file is an image, render it using Image component
          setSelectedData(
            <Image
              source={{ uri: fileUrl }}
              style={styles.previewImage}
            />
          );
        }
      } else if (dropdownHeader === 'Pressure') {
        const details = selectedItem.details;
        setSelectedData(
          <View>
            <Text style={styles.boldText}>Component: <Text style={styles.bigText}>{details.pressure_part_component_name}</Text></Text>
            <Text style={styles.boldText}>OD: <Text style={styles.bigText}>{details.outer_diameter}</Text></Text>
            <Text style={styles.boldText}>Thickness: <Text style={styles.bigText}>{details.thickness}</Text></Text>
            <Text style={styles.boldText}>Material: <Text style={styles.bigText}>{details.material_of_construction}</Text></Text>
            <Text style={styles.boldText}>Design Pressure: <Text style={styles.bigText}>{details.design_pressure}</Text></Text>
            <Text style={styles.boldText}>Operating Pressure: <Text style={styles.bigText}>{details.operating_pressure}</Text></Text>
          </View>
        );
      }
    }
  };

  // Function to handle PDF download
  const handleDownload = () => {
    if (fileUrl) {
      Linking.openURL(fileUrl); // This will open the PDF in the default browser or download manager
    }
  };

  return (
    <>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={[BRAND, BRAND]}
        style={styles.headerContainer}
      >
        <View style={styles.headerContent}>
          {onMenuPress && (
            <TouchableOpacity onPress={onMenuPress} style={styles.iconContainer}>
              <Image
                style={styles.icon}
                source={require('../../assets/images/hamburger.png')}
              />
            </TouchableOpacity>
          )}
          <Text style={{ ...styles.headerText, marginLeft: onMenuPress ? 0 : 15, marginRight: onAddPress ? 0 : 15 }}>
            {title}
          </Text>
          <View style={styles.rightIconsContainer}>

            <View
              style={{
                height: HEIGHT * 0.04,
                width: WIDTH * 0.10,
                backgroundColor: WHITE,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                elevation: 10,


              }}
            >


              <TouchableOpacity onPress={() => handleApiCall('first')} style={styles.iconContainer}>
                <Icon name="schema" type="material" color={BLACK} size={25} />
              </TouchableOpacity>
            </View>


            <View
              style={{
                height: HEIGHT * 0.04,
                width: WIDTH * 0.10,
                backgroundColor: WHITE,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                elevation: 10,


              }}
            >


              <TouchableOpacity onPress={() => handleApiCall('second')} style={styles.iconContainer}>
                <Icon name="car-brake-low-pressure" type="material-community" color={BLACK} size={22} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>

      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {loading ? (
              <ActivityIndicator size="large" color={BRAND} />
            ) : (
              <>
                <Text style={styles.dropdownHeader}>{dropdownHeader}</Text>
                <DropDownPicker
                  searchable={true}
                  open={dropdownOpen}
                  value={dropdownValue}
                  items={dropdownItems}
                  setOpen={setDropdownOpen}
                  onSelectItem={(value) => handleDropdownChange(value.value)}
                  placeholder={`Select ${dropdownHeader}`}
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                />
                {selectedData && (
                  <View style={styles.dataContainer}>
                    {typeof selectedData === 'string' ? (
                      <Text style={styles.dataText}>{selectedData}</Text>
                    ) : (
                      selectedData
                    )}
                  </View>
                )}

                {/* Add download button if the selected data is a PDF */}
                {fileUrl && fileUrl.endsWith('.pdf') && (
                  <TouchableOpacity onPress={handleDownload} style={styles.downloadButton}>
                    <Text style={styles.downloadButtonText}>Preview Doc.</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity onPress={() => {
                  // clear all state in modal



                  setModalVisible(false)
                }} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  // ... other styles

  headerContainer: {
    width: '100%',
    height: HEIGHT * 0.12,
    justifyContent: 'center',
    shadowColor: BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    paddingHorizontal: WIDTH * 0.05,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerText: {
    color: WHITE,
    fontSize: RFValue(16),
    fontFamily: EXTRABOLD,
    textAlign: 'center',
    flex: 1,
  },
  rightIconsContainer: {
    width: '24%',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  iconContainer: {
    paddingHorizontal: 10,
  },
  boldText: {
    fontWeight: 'bold', // Make the text bold
    fontSize: RFValue(13), // Make the text bigger
    color: BLACK, // Adjust text color if needed
  },

  bigText: {
    fontSize: RFValue(13),
    fontWeight: '500'

  },

  icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    tintColor: WHITE,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: WHITE,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: BRAND,
    borderRadius: 5,
  },
  closeButtonText: {
    color: WHITE,
    fontSize: RFValue(14),
  },
  dropdownHeader: {
    fontSize: RFValue(16),
    color: BLACK,
    marginTop: 20,
    marginBottom: 10,
  },
  dropdown: {
    width: '100%',
    borderColor: BRAND,
  },
  dropdownContainer: {
    borderColor: BRAND,
  },
  dataContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  dataText: {
    color: BLACK,
    fontSize: RFValue(14),
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  pdfViewer: {
    width: '100%',
    height: 400, // Set a height for the PDF viewer
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  pdfViewer: {
    width: '100%',
    height: 400, // Set a height for the PDF viewer
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  downloadButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  downloadButtonText: {
    color: WHITE,
    fontSize: RFValue(14),
  },
});

export default Header;
