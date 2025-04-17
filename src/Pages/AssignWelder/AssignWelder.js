import {
  View,
  Text,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Modal,
  Button,
  StyleSheet,
  RefreshControl,
  TextInput,
} from 'react-native';
import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {BLACK, BRAND, WHITE} from '../../constants/color';
import Header from '../../components/Header';
import {HEIGHT, MyStatusBar, WIDTH} from '../../constants/config';
import {appStyles} from '../../styles/AppStyles';
import {GETNETWORK, POSTNETWORK} from '../../utils/Network'; // Assuming you have this utility function
import {BAS_URL} from '../../constants/url';
import DropDownPicker from 'react-native-dropdown-picker'; // Import DropDownPicker
import {useFocusEffect} from '@react-navigation/native';
import {styles} from '../TPI/TPI';


import {CheckBox, Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AssignWelder = ({navigation}) => {
  // State to store the welder list
  const [welderList, setWelderList] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [selectedWelder, setSelectedWelder] = useState(null); // State for selected welder
  const [availableWelders, setAvailableWelders] = useState([]); // State for available welders from API
  const [open, setOpen] = useState(false); // State for dropdown open status
  const [items, setItems] = useState([]); // State for dropdown items
  const [selectedJob, setSelectedJob] = useState(''); // State for selected job

  const [refreshing, setRefreshing] = useState(false); // Refresh state to manage data refreshing
  const refresh = async () => {
    setRefreshing(true);
    console.log('Refreshing...');
  
    try {
      await fetchWelderList();
      await fetchAvailableWelders();
      await GetShutdown(); // This will internally trigger GetDashboard
      await fetchData()
  
      console.log('Refresh complete.');
    } catch (err) {
      console.error('Refresh error:', err);
    }
  
    setRefreshing(false);
  };
  
  const [filterCriteria, setFilterCriteria] = useState({});
  const [data, setData] = useState([]);
  const [filtermodalVisible, setfilterModalVisible] = useState(false); // State for modal visibility

  const [unitItems, setUnitItems] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [unitOpen, setUnitOpen] = useState(false);

  const [componentItems, setComponentItems] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [componentOpen, setComponentOpen] = useState(false);

  const [areaItems, setAreaItems] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [areaOpen, setAreaOpen] = useState(false);

  const [hangerItems, setHangerItems] = useState([]);
  const [selectedHanger, setSelectedHanger] = useState(null);
  const [hangerOpen, setHangerOpen] = useState(false);

  const [coilItems, setCoilItems] = useState([]);
  const [selectedCoil, setSelectedCoil] = useState(null);
  const [coilOpen, setCoilOpen] = useState(false);

  const [panelItems, setPanelItems] = useState([]);
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const [rowItems, setRowItems] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowOpen, setRowOpen] = useState(false);

  const [tubeItems, setTubeItems] = useState([]);
  const [selectedTube, setSelectedTube] = useState(null);
  const [tubeOpen, setTubeOpen] = useState(false);

  const [jointItems, setJointItems] = useState([]);
  const [selectedJoint, setSelectedJoint] = useState(null);
  const [jointOpen, setJointOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState([]); // To hold selected job sl ids

     const [openShutdown, setOpenShutdown] = useState(false);
      const [valueShutdown, setValueShutdown] = useState(null);
      const [itemsShutdown, setItemsShutdown] = useState([]);
      const [shutdownID, setShutdownID] = useState(null);

      // useEffect(() => {
      //   const loadInitialShutdown = async () => {
      //     try {
      //       const url = `${BAS_URL}welding/api/v1/all-shutdown-details/`;
      //       const response = await GETNETWORK(url, true);
      
      //       if (response.status === 'success') {
      //         const formattedData = response.data.shutdowns.map(item => ({
      //           label: item.shutdown_name,
      //           value: item.shutdown_id,
      //         }));
      
      //         let defaultShutdownID = null;
      
      //         const currentShutdownData = response.data.current_shutdown;
      
      //         if (currentShutdownData && currentShutdownData.shutdown_id != null) {
      //           defaultShutdownID = currentShutdownData.shutdown_id;
      
      //           // Push currentShutdown to top if missing
      //           if (!formattedData.some(item => item.value === defaultShutdownID)) {
      //             formattedData.unshift({
      //               label: currentShutdownData.shutdown_name,
      //               value: currentShutdownData.shutdown_id,
      //             });
      //           }
      
      //         } else if (formattedData.length > 0) {
      //           defaultShutdownID = formattedData[0].value;
      //         }
      
      //         // ✅ Set everything
      //         setItemsShutdown(formattedData);
      //         setShutdownID(defaultShutdownID);
      //         setValueShutdown(defaultShutdownID);
      //         await AsyncStorage.setItem('selectedShutdown', defaultShutdownID);
      //         await GetDashboard(defaultShutdownID);
      
      //       } else {
      //         console.log('Error:', response.message);
      //       }
      //     } catch (error) {
      //       console.error('Error loading initial shutdown:', error);
      //     }
      //   };
      
      //   loadInitialShutdown();
      // }, []);
      
 
 // 🔹 Function moved outside useEffect
const fetchDropdownData = async () => {
  try {
    const url = `${BAS_URL}welding/api/v1/query/filters/`;
    const response = await GETNETWORK(url, true);

    if (response.status === 'success') {
      // Populate all dropdowns
      setUnitItems(
        response.data.unit.map(([id, label]) => ({ label, value: id }))
      );
      setComponentItems(
        response.data.components.map(component => ({
          label: component,
          value: component,
        }))
      );
      setAreaItems(
        response.data.areas.map(area => ({ label: area, value: area }))
      );
      setHangerItems(
        response.data.hangers.map(hanger => ({
          label: hanger,
          value: hanger,
        }))
      );
      setCoilItems(
        response.data.coil_number.map(coil => ({ label: coil, value: coil }))
      );
      setPanelItems(
        response.data.panel_number.map(panel => ({
          label: panel,
          value: panel,
        }))
      );
      setRowItems(
        response.data.row_number.map(row => ({ label: row, value: row }))
      );
      setTubeItems(
        response.data.tube_number.map(tube => ({ label: tube, value: tube }))
      );
      setJointItems(
        response.data.joint_number.map(joint => ({
          label: joint,
          value: joint,
        }))
      );
    } else {
      console.log('Error fetching data:', response.message);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

useEffect(() => {
  GetShutdown();
  fetchDropdownData();
}, []);


useEffect(() => {
  if (shutdownID) {
    fetchData();
  }
}, [shutdownID]);
useEffect(() => {
  fetchWelderList();
  fetchAvailableWelders(); // Fetch available welders to assign
}, [navigation]);

        const GetShutdown = async () => {
          const url = `${BAS_URL}welding/api/v1/all-shutdown-details/`;
        
          try {
            const response = await GETNETWORK(url, true);
        
            if (response.status === 'success') {
              const formattedData = response.data.shutdowns.map(item => ({
                label: item.shutdown_name,
                value: item.shutdown_id,
              }));
        
              setItemsShutdown(formattedData); 
              const currentShutdownData = response.data.current_shutdown;
        
              let defaultShutdownID = null;
        
              if (currentShutdownData && currentShutdownData.shutdown_id != null) {
                const currentShutdown = {
                  label: currentShutdownData.shutdown_name,
                  value: currentShutdownData.shutdown_id,
                };
        
                // Add to top if not present
                if (!formattedData.some(item => item.value === currentShutdown.value)) {
                  formattedData.unshift(currentShutdown);
                  setItemsShutdown(formattedData); // 👈 Refresh items again
                }
        
                defaultShutdownID = currentShutdown.value;
        
              } else if (formattedData.length > 0) {
                defaultShutdownID = formattedData[0].value;
              }
        
              // ✅ Set value in state only if not already selected
              if (!valueShutdown && defaultShutdownID != null) {
                setShutdownID(defaultShutdownID);
                setValueShutdown(defaultShutdownID);
                await AsyncStorage.setItem('selectedShutdown', defaultShutdownID);
                await GetDashboard(defaultShutdownID);
              }
        
            } else {
              console.log('Error:', response.message);
            }
        
          } catch (error) {
            console.error('Fetch Error:', error);
          }
        };
        

  // Add this function to save the job list data to AsyncStorage
const saveJobListData = async (data) => {
  try {
    await AsyncStorage.setItem('savedJobList', JSON.stringify(data));
  } catch (error) {
    console.error('Error saving job list data:', error);
  }
};

// Update your fetchData function to save data when successful
const fetchData = async (params = {}) => {
  if (!shutdownID) {
    console.log('No shutdown ID available, checking for cached data');
    
    // Try to load cached data if no shutdownID
    try {
      const cachedData = await AsyncStorage.getItem('savedJobList');
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setWelderList(parsedData);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error('Error loading cached data:', error);
    }
    
    setLoading(false);
    return;
  }
  
  setLoading(true);
  
  try {
    // Create base URL with the shutdown_id parameter
    const baseUrl = `${BAS_URL}welding/jobmaster/joblist/`;
    
    // Combine all parameters including shutdown_id
    const allParams = { 
      shutdown_id: shutdownID,
      ...params 
    };
    
    // Create the URL with all parameters
    const queryString = new URLSearchParams(allParams).toString();
    const finalUrl = `${baseUrl}?${queryString}`;
    
    console.log('Final URL:', finalUrl);
    
    const response = await GETNETWORK(finalUrl, true);
    
    if (response.status === 'success') {
      setWelderList(response.data);
      console.log('joblist', response);
      
      // Save the job list data to AsyncStorage for future use
      await saveJobListData(response.data);
      
      setModalVisible(false);
    } else {
      console.log('Error:', response.message);
      // Reset selected filters in case of error
      setSelectedUnit(null);
      setSelectedComponent(null);
      setSelectedArea(null);
      setSelectedHanger(null);
      setSelectedCoil(null);
      setSelectedPanel(null);
      setSelectedRow(null);
      setSelectedTube(null);
      setSelectedJoint(null);
      setSelectedWelder(null);
    }
  } catch (error) {
    console.error('Fetch Error:', error);
    
    // If there's an error, try to load cached data
    try {
      const cachedData = await AsyncStorage.getItem('savedJobList');
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setWelderList(parsedData);
      }
    } catch (cacheError) {
      console.error('Error loading cached data:', cacheError);
    }
  } finally {
    setLoading(false);
  }
};

// Modify your useFocusEffect to load data more intelligently
useFocusEffect(
  useCallback(() => {
    const loadData = async () => {
      // First try to load from cache for immediate display
      try {
        const cachedData = await AsyncStorage.getItem('savedJobList');
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          setWelderList(parsedData);
        }
      } catch (error) {
        console.error('Error loading cached job list:', error);
      }
      
      // Then check if we have a shutdownID
      const storedShutdownID = await AsyncStorage.getItem('selectedShutdown');
      
      if (storedShutdownID && (!shutdownID || shutdownID !== storedShutdownID)) {
        setShutdownID(storedShutdownID);
        setValueShutdown(storedShutdownID);
      }
      
      // Only do fresh fetches if we have an ID
      if (shutdownID || storedShutdownID) {
        // Set a small delay to ensure UI is responsive with cached data first
        setTimeout(() => {
          fetchData();
          fetchAvailableWelders();
        }, 1000);
      }
    };
    
    loadData();
    
    return () => {
      // Any cleanup if needed
    };
  }, [])  // Remove shutdownID dependency to prevent double-fetching
);

  const handleFilter = type => {
    if (type === 'select') {
      setfilterModalVisible(!filtermodalVisible); // Open the modal when "Select Filter" is tapped
      fetchWelderList();
    } else if (type === 'clear') {
      // Handle filter clear action
      setFilterCriteria('');
      setSelectedUnit(null);
      setSelectedComponent(null);
      setSelectedArea(null);
      setSelectedHanger(null);
      setSelectedCoil(null);
      setSelectedPanel(null);
      setSelectedRow(null);
      setSelectedTube(null);
      setSelectedJoint(null);

      fetchWelderList();
      console.log('Filter cleared');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDropdownData();
      fetchWelderList();
      fetchAvailableWelders();


      // Return a cleanup function if needed
      return () => {
        // Clean up if necessary
      };
    }, [navigation]),
  );
  



  // Function to fetch welder list using GETNETWORK
  const fetchWelderList = async () => {
    setLoading(true); // Show loading while fetching

    try {
      const url = `${BAS_URL}welding/welderassign/list/`;
      const response = await GETNETWORK(url, true);

      if (response.status === 'success') {
        console.log('Welder List:', response.data);
        setData(response.data);

        setWelderList(response.data || []); // Update the state with the fetched list or an empty array if null
      } else {
        console.log('Error:', response.message);
      }
    } catch (error) {
      console.error('Error fetching welder list:', error);
    } finally {
      setLoading(false); // Hide loading once the request is complete
    }
  };

  // Function to fetch available welders using GETNETWORK
  const fetchAvailableWelders = async () => {
    try {
      const url = `${BAS_URL}welding/api/v1/welder-list/`;
      const response = await GETNETWORK(url, true);

      if (response.status === 'success') {
        console.log('Available Welders:', response.data);
        // Format welders data for dropdown
        const formattedWelders = response.data.map(welder => ({
          label: welder.welder_name,
          value: welder.weldersl,
        }));
        setItems(formattedWelders); // Update dropdown items
      } else {
        console.log('Error:', response.message);
      }
    } catch (error) {
      console.error('Error fetching available welders:', error);
    }
  };

  // Function to render each item in the FlatList
  const renderWelderItem = ({item}) => (
    <View
    style={{
      backgroundColor: '#f9f9f9',
      borderRadius: 8,
      padding: 10,
      alignSelf: 'center',
      marginVertical: 8,
      marginHorizontal: 10,
      borderLeftWidth: 4,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
      borderLeftColor: 'orange',
      width: '95%',

    }}>
    
    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
      
      {/* Checkbox on far left */}
      <CheckBox
        style={{ marginRight: 10, marginTop: 5 }}
        checked={selectedJobs?.includes(item.jobsl)}
        onPress={() => toggleJobSelection(item.jobsl)}
      />
  
      {/* Content section on the right */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
          Job Number: {item.job_number}
        </Text>
        <Text style={styless.textStyle}>Component Name: {item.component_name}</Text>
        <Text style={styless.textStyle}>Unit Number: {item.unit_number}</Text>
        <Text style={styless.textStyle}>Joint Number: {item.joint_number}</Text>
        <Text style={styless.textStyle}>Job Description Number: {item.job_desc_number}</Text>
        <Text style={styless.textStyle}>Job Offer Date: {item.job_offer_date}</Text>
  
        <TouchableOpacity
          onPress={() => {
            setSelectedJob(item.sl);
            fetchWelderList();
            setModalVisible(true);
          }}
          style={{
            backgroundColor: 'green',
            paddingVertical: 10,
            paddingHorizontal: 25,
            borderRadius: 5,
            marginTop: 10,
            alignSelf: 'flex-start',
          }}>
          <Text style={styless.buttonText}>Assign Welder</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
  
  );

  // Function to render when the list is empty
  const renderEmptyComponent = () => (
    <View style={{padding: 20, alignItems: 'center'}}>
      <Text style={{fontSize: 16, color: '#999'}}>
        No welders assigned yet.
      </Text>
    </View>
  );
  const handleApproveAll = async () => {
    console.log('hii', selectedJobs, selectedWelder);
    // if (selectedJobs.length > 0) {
    //     // Extract jobsl from selectedJobs
    //     const jobslArray = selectedJobs
    //         .map(jobId => {
    //             const job = JobList.find(job => job.jobsl === jobId);
    //             return job ? job.jobsl : null; // Ensure no null values are included
    //         })
    //         .filter(Boolean); // Remove nulls

    //     console.log('Jobs to approve:', jobslArray); // Logs the selected job IDs

    //     // Prepare payload
    //     const payload = {
    //         jobsl: jobslArray,
    //         approved_status: 'Approved',
    //     };

    //     try {
    //         // Call API using POSTNETWORK
    //         const response = await POSTNETWORK(
    //             `${BAS_URL}/welding/job/update-job/`,
    //             payload,
    //             true, // Token is required
    //         );

    //         if (response.status === 'success') {
    //             console.log('API Response:', response);
    //             GetJobList();
    //             setSelectAll(false);
    //             alert('Job successfully Approved');
    //             alert('All selected jobs approved successfully.');
    //         } else {
    //             GetJobList();
    //             setSelectAll(false);
    //             alert('Failed to approve selected jobs. Please try again.');
    //         }
    //     } catch (error) {
    //         console.error('API Error:', error);
    //         alert('An error occurred while approving selected jobs.');
    //     }
    // } else {
    //     alert('No jobs selected for approval.');
    // }

    if (selectedWelder) {
      try {
        // Create the payload object
        const payload = {
          sl: selectedJobs, // Converts selectedJob to an integer
          weldersl: selectedWelder,
        };

        // Use POSTNETWORK to send the POST request
        const response = await POSTNETWORK(
          `${BAS_URL}welding/api/v1/bulk-welder-assignment/`,
          payload,
          true, // Pass true if you need the token for authorization
        );

        // Log the response
        console.log('Assignment Response:', response);
        if (response.status === 'success') {
          alert('Welder assigned successfully!', response.message);

          // reset all states
          setSelectedJobs(null);
          setSelectedWelder(null);
          // setItems([])
          fetchWelderList();
        } else {
          alert('Error assigning welder:', response.message);
          setSelectedJob(null);
          setSelectedWelder(null);
          // setItems([])
          fetchWelderList();
        }

        // Close the modal after successful assignment
        setModalVisible(false);
      } catch (error) {
        console.error('Error assigning welder:', error);
      }
    } else {
      console.log('No welder selected.');
    }
  };
  const handleCancelAll = async () => {
    if (selectedJobs?.length > 0) {
      // Extract jobsl from selectedJobs
      const jobslArray = selectedJobs
        .map(jobId => {
          const job = JobList.find(job => job.jobsl === jobId);
          return job ? job.jobsl : null; // Ensure no null values are included
        })
        .filter(Boolean); // Remove nulls

      console.log('Jobs to Cancel:', jobslArray); // Logs the selected job IDs

      // Prepare payload
      const payload = {
        jobsl: jobslArray,
        approved_status: 'Cancelled',
      };

      try {
        // Call API using POSTNETWORK
        const response = await POSTNETWORK(
          `${BAS_URL}/welding/job/update-job/`,
          payload,
          true, // Token is required
        );

        if (response.status === 'success') {
          console.log('API Response:', response);
          GetJobList();
          setSelectAll(false);
          alert('Job successfully Cancel');
          alert('All selected jobs Cancelled successfully.');
        } else {
          GetJobList();
          setSelectAll(false);
          alert('Failed to Cancel selected jobs. Please try again.');
        }
      } catch (error) {
        console.error('API Error:', error);
        alert('An error occurred while Cancelling selected jobs.');
      }
    } else {
      alert('No jobs selected for Cancel.');
    }
  };

  // Function to handle assigning welder using POSTNETWORK
  const handleAssignWelder = async () => {
    console.log('sl', selectedJob, 'selectedWelder', selectedWelder);

    if (selectedWelder) {
      try {
        // Create the payload object
        const payload = {
          sl: parseInt(selectedJob), // Converts selectedJob to an integer
          weldersl: selectedWelder,
        };

        // Use POSTNETWORK to send the POST request
        const response = await POSTNETWORK(
          `${BAS_URL}welding/welderassign/`,
          payload,
          true, // Pass true if you need the token for authorization
        );

        // Log the response
        console.log('Assignment Response:', response);
        if (response.status === 'success') {
          alert('Welder assigned successfully!', response.message);

          // reset all states
          setSelectedJob(null);
          setSelectedWelder(null);
          // setItems([])
          fetchWelderList();
        } else {
          alert('Error assigning welder:', response.message);
          setSelectedJob(null);
          setSelectedWelder(null);
          // setItems([])
          fetchWelderList();
        }

        // Close the modal after successful assignment
        setModalVisible(false);
      } catch (error) {
        console.error('Error assigning welder:', error);
      }
    } else {
      console.log('No welder selected.');
    }
  };
  //   const toggleSelectAll = () => {
  //     if (selectAll) {
  //       // Unselect all
  //       setSelectedJobs([]);
  //     } else {
  //       // Select all
  //       const allJobs = JobList.map(job => job.jobsl);
  //       setSelectedJobs(allJobs);
  //       console.log('All jobs selected:', allJobs);
  //     }
  //     setSelectAll(!selectAll);
  //   };

  //   const toggleJobSelection = jobId => {
  //     if (selectedJobs.includes(jobId)) {
  //       // Remove the job from selectedJobs
  //       const updatedJobs = selectedJobs.filter(id => id !== jobId);
  //       setSelectedJobs(updatedJobs);
  //       console.log('Job deselected:', jobId);
  //     } else {
  //       // Add the job to selectedJobs
  //       const updatedJobs = [...selectedJobs, jobId];
  //       setSelectedJobs(updatedJobs);
  //       console.log('Job selected:', jobId);
  //     }
  //   };
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedJobs([]); // Unselect all
    } else {
      setSelectedJobs(welderList.map(item => item.jobsl)); // Select all
    }
    setSelectAll(!selectAll);
  };
  

  // Function to toggle individual job selection
  const toggleJobSelection = jobsl => {
    if (selectedJobs.includes(jobsl)) {
      setSelectedJobs(selectedJobs.filter(id => id !== jobsl));
    } else {
      setSelectedJobs([...selectedJobs, jobsl]);
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
            keyboardShouldPersistTaps={'handled'}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: 'center',
              paddingBottom: 20,
            }}
            scrollEnabled={false}>
            <Header
              onMenuPress={() => {
                navigation.toggleDrawer();
              }}
              title="Assign-Welder"
            />
            <View style={{
                                      marginTop:10,
                                      marginRight:30
                                    }}>
                                           <TouchableOpacity
                                            onPress={() => {
                                              setLoading(true); 
                                          setTimeout(async () => {
                                            await GetShutdown(); 
                                            setLoading(false); // Hide loader after timeout
                                            // Call your refresh logic
                                          }, 1000); // 2 seconds delay (you can change it)
                                        }}
                                            style={{
                                              // position:'absolute',
                                              left:'40%',
                                              // top:100,
                                              width:100,
                                              padding: 10,
                                              backgroundColor: '#007BFF',
                                              borderRadius: 5,
                                            }}>
                                            <Text style={{ color: '#fff', fontWeight: 'bold',textAlign:'center' }}>Refresh</Text>
                                          </TouchableOpacity>
                                    </View>

<DropDownPicker
  open={openShutdown}
  value={valueShutdown}
  items={itemsShutdown}
  setOpen={setOpenShutdown}
  setValue={setValueShutdown}
  setItems={setItemsShutdown}
  placeholder="Select a Shutdown"
  style={styless.dropdown}
  dropDownContainerStyle={styless.dropdownContainer}
  textStyle={styles.text}
  listItemLabelStyle={styless.listItem}
  placeholderStyle={styless.placeholder}
  onChangeValue={(selectedValue) => {
    const selectedShutdown = items.find(item => item.value === selectedValue);
    console.log('Selected Shutdown:',selectedValue);
    // fetchData(selectedShutdown?.value)
    setShutdownID(selectedValue); 
  }}
  onOpen={() => {
     GetShutdown(); 
  }}
/>

            {/* Welder List Display */}
            <View style={{width: '100%', paddingHorizontal: 10, marginTop: 20}}>
              {loading ? (
                <Text
                  style={{
                    fontSize: 16,
                    color: '#666',
                    textAlign: 'center',
                    marginTop: 20,
                  }}>
                  Loading welders...
                </Text>
              ) : (
                <>
                  {/* <View style={styles.filterContainer}>
                                        <View style={styles.leftContent}>
                                            <TextInput
                                                style={styles.filterTextInput}
                                                placeholder="Enter Filter Criteria"
                                                placeholderTextColor="#888"
                                                value={filterCriteria}
                                                editable={false}
                                                multiline
                                            />
                                        </View>

                                        <View style={styles.rightButtons}>
                                            <TouchableOpacity
                                                style={styles.selectButton}
                                                onPress={() => handleFilter('select')}
                                            > <Icon
                                                    name={'filter-alt'}
                                                    type='material'
                                                    color={WHITE}
                                                    size={24}
                                                    containerStyle={{ marginBottom: 5 }}
                                                />
                                                <Text style={{
                                                    color: '#fff',
                                                    fontSize: 12,
                                                    fontWeight: 'bold',
                                                }}>Filter</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={{ ...styles.clearButton, backgroundColor: filterCriteria.length > 0 ? '#FF6347' : '#4CAF50' }}
                                                onPress={() => handleFilter('clear')}
                                            >
                                                <Icon
                                                    name={'delete'}
                                                    type='material'
                                                    color={WHITE}
                                                    size={24}
                                                    containerStyle={{ marginBottom: 5 }}
                                                />
                                                <Text style={{
                                                    color: '#fff',
                                                    fontSize: 12,
                                                    fontWeight: 'bold',
                                                }}>Clear </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View> */}
                  <View
                    style={{
                      height: HEIGHT * 0.8,
                      width: WIDTH,
                      alignSelf: 'center',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 10,
                        justifyContent: 'space-between',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          // justifyContent: 'space-evenly',
                          alignItems: 'center',
                        }}>
                        <CheckBox
                          style={{marginRight: 10}}
                          checked={selectAll}
                          onPress={toggleSelectAll}
                        />
                        <Text style={{fontSize: 13}}>Select All</Text>
                        {/* {selectAll == true && */}
                      </View>
                      <>
                        {selectedJobs?.length > 0 && (
                          <TouchableOpacity
                            style={{
                              backgroundColor: 'green',
                              paddingVertical: 10,
                              paddingHorizontal: 15,
                              borderRadius: 5,
                              marginBottom: 10,
                              alignItems: 'center',
                            }}
                            onPress={() => {
                              setModalVisible(true);
                            }}>
                            {selectAll == true ? (
                              <Icon
                                name={'done'}
                                type="material"
                                color={WHITE}
                                size={24}
                                containerStyle={{marginBottom: 5}}
                              />
                            ) : (
                              <Icon
                                name={'done'}
                                type="material"
                                color={WHITE}
                                size={24}
                                containerStyle={{marginBottom: 5}}
                              />
                            )}
                          </TouchableOpacity>
                        )}
                      </>
                    </View>

                    <FlatList
                      refreshControl={
                        <RefreshControl
                          refreshing={refreshing}
                          onRefresh={refresh}
                        />
                      }
                      data={welderList}
                      renderItem={renderWelderItem}
                      keyExtractor={(item, index) => index.toString()}
                      contentContainerStyle={{paddingBottom: 100}}
                      ListEmptyComponent={renderEmptyComponent}
                    />
                  </View>
                </>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Modal for welder assignment */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styless.modalBackdrop}>
            <View style={styless.modalContainer}>
              <Text style={styless.modalTitle}>Assign Welder</Text>

              {/* DropDownPicker for welder selection */}
              <DropDownPicker
                searchable={true}
                open={open}
                value={selectedWelder}
                items={items}
                setOpen={setOpen}
                setValue={setSelectedWelder}
                setItems={setItems}
                placeholder="Select Welder"
                style={styless.dropdownStyle}
                textStyle={styless.dropdownTextStyle}
                dropDownStyle={styless.dropdownListStyle}
              />

              <View style={styless.buttonContainer}>
                <TouchableOpacity
                  style={styless.assignButton}
                  onPress={() => {
                    if (selectedJobs?.length > 0) {
                      handleApproveAll();
                    } else {
                      handleAssignWelder();
                    }
                  }}>
                  <Text style={styless.buttonText}>Assign Welder</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styless.cancelButton}
                  onPress={() => {
                    setSelectedWelder(null);
                    setModalVisible(false);
                  }}>
                  <Text style={styless.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>

      <Modal
        visible={filtermodalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setfilterModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <ScrollView contentContainerStyle={styles.modalContainer}>
            <Text style={styles.modalTitle}>Filter</Text>

            {/* Unit Dropdown */}

            <Text style={styles.dropdownHeader}>Unit</Text>
            <DropDownPicker
              searchable={true}
              open={unitOpen}
              value={selectedUnit}
              items={unitItems}
              setOpen={setUnitOpen}
              setValue={setSelectedUnit}
              setItems={setUnitItems}
              placeholder="Select Unit"
              style={{...styles.dropdown, zIndex: 1200}}
              dropDownContainerStyle={styles.dropdownContainer}
            />

            {/* Component Dropdown */}
            <Text style={styles.dropdownHeader}>Component</Text>
            <DropDownPicker
              searchable={true}
              open={componentOpen}
              value={selectedComponent}
              items={componentItems}
              setOpen={setComponentOpen}
              setValue={setSelectedComponent}
              setItems={setComponentItems}
              placeholder="Select Component"
              style={{...styles.dropdown, zIndex: 1100}}
              dropDownContainerStyle={styles.dropdownContainer}
            />

            {/* Area Dropdown */}
            <Text style={styles.dropdownHeader}>Area</Text>
            <DropDownPicker
              searchable={true}
              open={areaOpen}
              value={selectedArea}
              items={areaItems}
              setOpen={setAreaOpen}
              setValue={setSelectedArea}
              setItems={setAreaItems}
              placeholder="Select Area"
              style={{...styles.dropdown, zIndex: 1000}}
              dropDownContainerStyle={styles.dropdownContainer}
            />

            {/* Hanger Dropdown */}
            <Text style={styles.dropdownHeader}>Hanger</Text>
            <DropDownPicker
              searchable={true}
              open={hangerOpen}
              value={selectedHanger}
              items={hangerItems}
              setOpen={setHangerOpen}
              setValue={setSelectedHanger}
              setItems={setHangerItems}
              placeholder="Select Hanger"
              style={{...styles.dropdown, zIndex: 900}}
              dropDownContainerStyle={styles.dropdownContainer}
            />

            {/* Coil Dropdown */}
            <Text style={styles.dropdownHeader}>Coil</Text>
            <DropDownPicker
              searchable={true}
              open={coilOpen}
              value={selectedCoil}
              items={coilItems}
              setOpen={setCoilOpen}
              setValue={setSelectedCoil}
              setItems={setCoilItems}
              placeholder="Select Coil"
              style={{...styles.dropdown, zIndex: 800}}
              dropDownContainerStyle={styles.dropdownContainer}
            />

            {/* Panel Dropdown */}
            <Text style={styles.dropdownHeader}>Panel</Text>
            <DropDownPicker
              searchable={true}
              open={panelOpen}
              value={selectedPanel}
              items={panelItems}
              setOpen={setPanelOpen}
              setValue={setSelectedPanel}
              setItems={setPanelItems}
              placeholder="Select Panel"
              style={{...styles.dropdown, zIndex: 700}}
              dropDownContainerStyle={styles.dropdownContainer}
            />

            {/* Row Dropdown */}
            <Text style={styles.dropdownHeader}>Row</Text>
            <DropDownPicker
              searchable={true}
              open={rowOpen}
              value={selectedRow}
              items={rowItems}
              setOpen={setRowOpen}
              setValue={setSelectedRow}
              setItems={setRowItems}
              placeholder="Select Row"
              style={{...styles.dropdown, zIndex: 600}}
              dropDownContainerStyle={styles.dropdownContainer}
            />

            {/* Tube Dropdown */}
            <Text style={styles.dropdownHeader}>Tube</Text>
            <DropDownPicker
              searchable={true}
              open={tubeOpen}
              value={selectedTube}
              items={tubeItems}
              setOpen={setTubeOpen}
              setValue={setSelectedTube}
              setItems={setTubeItems}
              placeholder="Select Tube"
              style={{...styles.dropdown, zIndex: 500}}
              dropDownContainerStyle={styles.dropdownContainer}
            />

            {/* Joint Dropdown */}
            <Text style={styles.dropdownHeader}>Joint</Text>
            <DropDownPicker
              searchable={true}
              open={jointOpen}
              value={selectedJoint}
              items={jointItems}
              setOpen={setJointOpen}
              setValue={setSelectedJoint}
              setItems={setJointItems}
              placeholder="Select Joint"
              style={{...styles.dropdown, zIndex: 400}}
              dropDownContainerStyle={styles.dropdownContainer}
            />

            {/* Welder Dropdown */}

            {/* Buttons */}
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-evenly',
              }}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={() => setfilterModalVisible(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.submitButton]}
                  onPress={() => {
                    // Construct the criteria string for display purposes
                    const criteria = [
                      selectedUnit,
                      selectedComponent,
                      selectedArea,
                      selectedHanger,
                      selectedCoil,
                      selectedPanel,
                      selectedRow,
                      selectedTube,
                      selectedJoint,
                    ]
                      .filter(Boolean) // Remove any null or undefined values
                      .join(', '); // Join them with a comma for better readability

                    setFilterCriteria(criteria); // Set the concatenated string

                    // Construct the query params object for fetchData
                    const queryParams = {
                      unit_number: selectedUnit || undefined,
                      component_name: selectedComponent || undefined,
                      area: selectedArea || undefined,
                      hanger_number: selectedHanger || undefined,
                      coil_number: selectedCoil || undefined,
                      panel_number: selectedPanel || undefined,
                      row_number: selectedRow || undefined,
                      tube_number: selectedTube || undefined,
                      joint_number: selectedJoint || undefined,
                    };

                    // Remove any keys with undefined values
                    const filteredParams = Object.fromEntries(
                      Object.entries(queryParams).filter(([_, v]) => v != null),
                    );

                    console.log('Filtered Params:', filteredParams); // Debugging filtered params

                    // Call fetchData with filtered query params
                    fetchData(filteredParams);

                    setfilterModalVisible(false); // Close the modal
                  }}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </Fragment>
  );
};

export default AssignWelder;

const styless = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  dropdownStyle: {
    width: '100%',
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  dropdownTextStyle: {
    fontSize: 16,
    color: '#333',
  },
  dropdownListStyle: {
    backgroundColor: '#f9f9f9',
    borderColor: '#ccc',
    borderRadius: 8,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  assignButton: {
    backgroundColor: '#4CAF50', // Green
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f44336', // Red
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },

  dropdown: {
    backgroundColor: '#3A9BDC',
    borderRadius: 8,
    borderWidth: 0,
    // paddingHorizontal: 12,
    // height: 10, // ✅ Decreased height of the dropdown button
    width: '95%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    alignSelf:'center',
     alignItems:'center',
    justifyContent:'center',
    marginTop:10

  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 5,
    width: '95%',
    alignSelf:'center',
     

    
  },
  text: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '500',
  },
  listItem: {
    fontSize: 10,
    color: '#333',
  },
  placeholder: {
    color: '#fff',
    fontSize: 10,
  },
  textStyle:{
    fontSize: 16,
  fontWeight: 'bold',
  color: '#333',
  marginBottom: 4,
  }
});
