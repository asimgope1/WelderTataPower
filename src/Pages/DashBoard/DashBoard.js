import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  FlatList,
  Modal,
  Dimensions,
} from 'react-native';
import React, {Fragment, useEffect, useState} from 'react';
import {HEIGHT, MyStatusBar, WIDTH} from '../../constants/config';
import {BLACK, BLUE, BRAND, GRAY, WHITE} from '../../constants/color';
import {appStyles} from '../../styles/AppStyles';
import LinearGradient from 'react-native-linear-gradient';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import Header from '../../components/Header';
import {Icon} from 'react-native-elements';
import {BAS_URL} from '../../constants/url';
import {GETNETWORK} from '../../utils/Network';
import {useFocusEffect} from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { StackedBarChart } from 'react-native-chart-kit';
const screenWidth = Dimensions.get('window').width;
import { useWindowDimensions } from 'react-native';


import {
  BOLD,
  EXTRABOLD,
  LIGHT,
  REGULAR,
  SEMIBOLD,
} from '../../constants/fontfamily';
import {Loader} from '../../components/Loader';
import {clearAll, getObjByKey, storeObjByKey} from '../../utils/Storage';
import {PieChart} from 'react-native-chart-kit';
import {white} from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {checkuserToken} from '../../redux/actions/auth';
import DropDownPicker from 'react-native-dropdown-picker';

const DashBoard = ({navigation}) => {
  const [JobList, SetJobList] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalData, setModalData] = useState(null); // Store API data for the modal
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);
  const [shutdownID, setShutdownID] = useState(null);
  const [isTableModalVisible, setTableModalVisible] = useState(false);
  const [isComponentModalVisible, setComponentModalVisible] = useState(false);
  const[isUnitModalVisible,setUnitModalVisible]= useState(false);
  const { width, height } = useWindowDimensions();
const isLandscape = width > height;
const cardWidth = width / 4 - 20; // 4 cards per row with padding



  
  

  const handlePress = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setTableModalVisible(true);
    }, 1000); // 1 second delay
  };
  const handlePress2 = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setComponentModalVisible(true);
    }, 1000); // 1 second delay
  };
  const handlePress3 = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setUnitModalVisible(true);
    }, 1000); // 1 second delay
  };
  const dispatch = useDispatch();

  // useFocusEffect(
  //   React.useCallback(() => {
  //     GetJobList();
  //     GetDashboard();
  //   }, [navigation]),
  // );

  // useFocusEffect(
  //   React.useCallback(() => {
  //     GetShutdown();
  //     GetJobList(); 
  //   }, [navigation])
  // );

  useEffect(() => {
    const fetchLoginLogs = async () => {
      try {
        const logs = await AsyncStorage.getItem('loginLogs');
        if (logs) {
          const parsedLogs = JSON.parse(logs);
          // console.log('Retrieved login logs:', parsedLogs); // Console log the logs
        } else {
          console.log('No login logs found');
        }
      } catch (error) {
        console.error('Error retrieving login logs:', error);
      }
    };

    fetchLoginLogs();
    const loadSelectedShutdown = async () => {
      // setIsLoading(true)
      try {
        const storedValue = await AsyncStorage.getItem('selectedShutdown');
        if (storedValue) {
          setShutdownID(storedValue);
          setValue(storedValue);
          await GetDashboard(storedValue); // ✅ Load dashboard data based on stored value
        }
         else {
          GetShutdown(); // ✅ Load default value if none is stored
        }
      } catch (error) {
        console.error('Failed to load shutdown:', error);
      }
      
      // finally {
      // setIsLoading(false)
      // }
    };
  
    loadSelectedShutdown();
  }, []);
  
  const GetShutdown = async () => {
    const url = `${BAS_URL}welding/api/v1/all-shutdown-details/`;
  
    try {
      const response = await GETNETWORK(url, true);
  
      if (response.status === 'success') {
        const formattedData = response.data.shutdowns.map(item => ({
          label: item.shutdown_name,
          value: item.shutdown_id,
        }));
  
        setItems(formattedData); // Set the items no matter what
  
        const currentShutdownData = response.data.current_shutdown;
  
        let defaultShutdownID = null;
  
        if (currentShutdownData && currentShutdownData.shutdown_id != null) {
          const currentShutdown = {
            label: currentShutdownData.shutdown_name,
            value: currentShutdownData.shutdown_id,
          };
  
          // Add to the top if not already in the list
          if (!formattedData.some(item => item.value === currentShutdown.value)) {
            formattedData.unshift(currentShutdown);
            setItems(formattedData); // Update with current at top
          }
  
          defaultShutdownID = currentShutdown.value;
  
        } else if (formattedData.length > 0) {
          // If currentShutdown is null, fallback to first shutdown in array
          defaultShutdownID = formattedData[0].value;
        }
  
        // ✅ Only proceed if we don’t already have a shutdownID set
        if (!shutdownID && defaultShutdownID != null) {
          setShutdownID(defaultShutdownID);
          setValue(defaultShutdownID);
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
  
  
  const GetDashboard = async (id) => {
    setIsLoading(true);
    try {
      const url = `${BAS_URL}welding/api/v1/dashboard/?shutdown_id=${id}`;
      const response = await GETNETWORK(url, true);
  
      if (response.status === 'success') {
        setDashboardData(response.data);
      } else {
        console.log('Error:', response.message);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }finally{
      setIsLoading(false);
    }
  };
  
  const handleChangeShutdown = async (selectedValue) => {
    const selectedShutdown = items.find(item => item.value === selectedValue);
    
    if (selectedShutdown) {
      // console.log('Selected Shutdown:', selectedShutdown.value);
  
      setShutdownID(selectedShutdown.value);
      setValue(selectedShutdown.value);
      await AsyncStorage.setItem('selectedShutdown', selectedShutdown.value);
  
      await GetDashboard(selectedShutdown.value);
    }
  };
  
  useFocusEffect(
    React.useCallback(() => {
      if (shutdownID) {
        GetDashboard(shutdownID);
      }
    }, [shutdownID])
  );

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);
  useEffect(() => {
    GetShutdown(); 
  }, []);

  // Fetch Job List
  const GetJobList = () => {
    setIsLoading(true);
    const url = `${BAS_URL}welding/jobmaster/joblist/`;
    GETNETWORK(url, true).then(response => {
      if (response.status === 'success') {
        setIsLoading(false);
        SetJobList(response.data);
      } else {
        setIsLoading(false);
        console.log('Error:', response.message);
      }
    });
  };

  const handleLogout = async () => {
    clearAll(); // Clear all stored data
    dispatch(checkuserToken());

    // navigation.navigate('LoginStack');
    alert('Logout Successfully. Please reload the app to log in again.');
  };
  // Fetch Dashboard Data
  // const GetDashboard = () => {
  //   const url = `${BAS_URL}welding/api/v1/dashboard/?shutdown_id=${shutdownID}`;
  //   GETNETWORK(url, true).then(response => {
  //     if (response.status === 'success') {
  //       setDashboardData(response.data);
  //     } else {
  //       console.log('Error:', response.message);
  //     }
  //   });
  // };

  // const GetDashboard = async (shutdownID) => {
  //   const url = `${BAS_URL}welding/api/v1/dashboard/?shutdown_id=${shutdownID}`;
    
  //   try {
  //     const response = await GETNETWORK(url, true);
  //     if (response.status === 'success') {
  //       setDashboardData(response.data);
  //     } else {
  //       console.log('Error:', response.message);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching dashboard data:', error);
  //   }
  // };
  
  


  // const GetShutdown = async () => {
  //   const url = `${BAS_URL}welding/api/v1/all-shutdown-details/`;
  
  //   try {
  //     const response = await GETNETWORK(url, true);
  //     if (response.status === 'success') {
  //       console.log('Shutdown Data:', response.data);
  
  //       // ✅ Extract shutdowns and format data
  //       const formattedData = response.data.shutdowns.map(item => ({
  //         label: item.shutdown_name,
  //         value: item.shutdown_id,
  //       }));
  
  //       // ✅ Include current_shutdown in dropdown items
  //       if (response.data.current_shutdown) {
  //         const currentShutdown = {
  //           label: response.data.current_shutdown.shutdown_name,
  //           value: response.data.current_shutdown.shutdown_id,
  //         };
  
  //         // Add current shutdown if it's not already included
  //         if (!formattedData.some(item => item.value === currentShutdown.value)) {
  //           formattedData.unshift(currentShutdown);
  //         }
  
  //         // ✅ Set default value to current_shutdown
  //         setValue(currentShutdown.value);
  //         setShutdownID(currentShutdown.value);
  
  //         // ✅ Fetch default dashboard data based on current shutdown
  //         await GetDashboard(currentShutdown.value);
  //       }
  
  //       setItems(formattedData);
  //     } else {
  //       console.log('Error:', response.message);
  //     }
  //   } catch (error) {
  //     console.error('Fetch Error:', error);
  //   }
  // };
  

  // Refresh the Data
  const refresh = async () => {
    setRefreshing(true);
    await GetDashboard();
    await GetJobList();
    setRefreshing(false);
  };

  const getRandomColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColor}`;
  };

  const [Token, SetToken] = useState('');

  useEffect(() => {
    GetToken();
  }, []);

  const GetToken = async () => {
    const Token = await getObjByKey('loginResponse');
    console.log('token: ' + Token.token);
    SetToken(Token?.token);
  };
  // Fetch job status details
  const fetchJobStatusDetails = async name => {
    // console.log('Fetching details for:', name,shutdownID);

    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Token ${Token}`);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    try {
      const response = await fetch(
        `${BAS_URL}welding/api/v1/job-status-details/?job_status=${name}&shutdown_id=${shutdownID}`,
        requestOptions,
      );
      console.log('responseedd', JSON.stringify(response));
      const result = await response.json();
      // console.log('result',result)

      if (result.status === 'success' && Array.isArray(result.data)) {
        setModalData(result.data.length > 0 ? result.data : []); // Ensure empty array is set
      } else {
        setModalData([]); // Handle unexpected API response
      }

      // console.log('API Response:', result.data.length);
    } catch (error) {
      console.error('Error fetching data:', error);
      setModalData([]); // Set empty array on error
    }
  };
  useEffect(() => {
    if (isModalVisible && selectedItem?.name) {
      setModalData(null); // Reset data before fetching
      fetchJobStatusDetails(selectedItem.name);
    }
  }, [isModalVisible, selectedItem]);

  const renderStatsCards = () => {
    if (!dashboardData) return null;

    return (
      <View
      style={{
        ...styles.statsContainer,
        width: isLandscape ? width : WIDTH,
      }}
    >
      <FlatList
        data={dashboardData.status_count}
        numColumns={4} // Always 4 columns to match card width
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedItem(item);
              setIsModalVisible(true);
              fetchJobStatusDetails(item.name);
            }}
          >
            <View
              style={{
                ...styles.statsCard,
                width: cardWidth,
                height: isLandscape ? height * 0.18 : HEIGHT * 0.1,
                borderTopColor: getRandomColor(),
                borderTopWidth: 8,
              }}
            >
              <Text
                style={styles.statsName}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item.name}
              </Text>
              <Text style={styles.statsFigure}>{item.count}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      />
    </View>
    
    );
  };

  // Render Job Status Bar Char

  // Render Pie Chart for Units Overview

  const renderStatusPieChart = () => {
    if (!dashboardData || !dashboardData.status_count) return null;

    // Define the slice colors for each category
    const sliceColors = [
      '#FF5733', // Red-orange
      '#33FF57', // Green
      '#3357FF', // Blue
      '#FF33A1', // Pink
      '#FF9633', // Orange
      '#8A33FF', // Purple
      '#33FFF6', // Aqua
      '#FFD633', // Yellow
      '#33FFB8', // Teal
      '#FF3333', // Red
    ];

    // Prepare the data for the PieChart
    const pieData = dashboardData.status_count.map((status, index) => ({
      name: status.name,
      population: status.count,
      color: sliceColors[index % sliceColors.length], // Cycle through the color list
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    }));

    // Chart configuration
    const chartConfig = {
      backgroundGradientFrom: '#1E2923',
      backgroundGradientFromOpacity: 0,
      backgroundGradientTo: '#08130D',
      backgroundGradientToOpacity: 0.5,
      color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
      strokeWidth: 2, // optional, default 3
      barPercentage: 0.5,
      useShadowColorFromDataset: false, // optional
    };

    return (
      <View
        style={{
          width: WIDTH,
          alignSelf: 'center',
          alignItems: 'center',
        }}>
        <PieChart
          data={pieData}
          width={WIDTH * 0.9}
          height={220}
          chartConfig={chartConfig}
          accessor={'population'}
          backgroundColor={'transparent'}
          paddingLeft={'15'}
          center={[10, 0]} // Center the chart
          absolute // Show absolute values instead of percentages
        />
      </View>
    );
  };

//   const renderwelderCountTable = () => {
//     if (!dashboardData || !dashboardData.welder_count) return null;
//     const chartData = {
//       labels: dashboardData.welder_count.map(item => item.Name),
//       legend: ['Accepted', 'Retake', 'Repair'],
//       data: dashboardData.welder_count.map(item => [
//         item.Accepted,
//         item.Retake,
//         item.Repair,
//       ]),
//       barColors: ['#4CAF50', '#FFC107', '#F44336'],
//     };
  
//     return (
//       <>
//        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
//   <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
//     Welder Count Overview
//   </Text>

//   <TouchableOpacity
//     onPress={() => {
//       // your action here
//       setTableModalVisible(true)
//     }}
//     style={{
//       backgroundColor: '#007bff',
//       paddingVertical: 6,
//       paddingHorizontal: 12,
//       borderRadius: 5,
      
//     }}>
//     <Text style={{ color: '#fff', fontWeight: 'bold' }}>View Table</Text>
//   </TouchableOpacity>
// </View>

  
//         <ScrollView horizontal>
//         <StackedBarChart
//   data={chartData}
//   width={Math.max(chartData.labels.length * 170, screenWidth)}
//   height={300}
//   chartConfig={{
//     backgroundGradientFrom: '#ffffff',
//     backgroundGradientTo: '#ffffff',
//     color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//     labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//     barPercentage: 0.9,
//     decimalPlaces: 0,
//     propsForLabels: {
//       fontSize: 10, // helps prevent overlap
//     },
//   }}
//   style={{
//     marginVertical: 8,
//     // marginHorizontal:50,
//     borderRadius: 10,
//   }}
// />

//         </ScrollView>
//       </>
//     );
    

//     // return (
//     //   <>
//     //     <Text
//     //       style={{
//     //         fontWeight: 'bold',
//     //         fontSize: 18,
//     //         // marginBottom: 10,
//     //       }}>
//     //       Welder Count Table <Text style={{fontWeight: 'bold'}}></Text>
//     //     </Text>
//     //     <ScrollView horizontal style={styles.tableContainer}>
//     //       <View style={styles.table}>
//     //         {/* Table Header Row */}
//     //         <View style={[styles.tableRow, styles.headerRow]}>
//     //           {[
//     //             'Welder ID',
//     //             'Name',
//     //             'Total',
//     //             'Accepted',
//     //             'Repair',
//     //             'Retake',
//     //             'Failure Rate',
//     //           ].map((header, index) => (
//     //             <View key={index} style={[styles.tableCell, styles.headerCell]}>
//     //               <Text style={styles.headerText}>{header}</Text>
//     //             </View>
//     //           ))}
//     //         </View>

//     //         {/* Table Data Rows */}
//     //         {dashboardData.welder_count.map((item, index) => (
//     //           <View key={index} style={styles.tableRow}>
//     //             <View style={styles.tableCell}>
//     //               <Text style={styles.cellText}>{item.welder_id}</Text>
//     //             </View>
//     //             <View style={styles.tableCell}>
//     //               <Text style={styles.cellText}>{item.Name}</Text>
//     //             </View>
//     //             <View style={styles.tableCell}>
//     //               <Text style={styles.cellText}>{item.Total}</Text>
//     //             </View>
//     //             <View style={styles.tableCell}>
//     //               <Text style={styles.cellText}>{item.Accepted}</Text>
//     //             </View>
//     //             <View style={styles.tableCell}>
//     //               <Text style={styles.cellText}>{item.Repair}</Text>
//     //             </View>
//     //             <View style={styles.tableCell}>
//     //               <Text style={styles.cellText}>{item.Retake}</Text>
//     //             </View>
//     //             <View style={styles.tableCell}>
//     //               <Text style={styles.cellText}>{item.Failure_Rate}%</Text>
//     //             </View>
//     //           </View>
//     //         ))}
//     //       </View>
//     //     </ScrollView>
//     //   </>
//     // );
    
//   };
  
const renderwelderCountTable = () => {
  if (!dashboardData || !dashboardData.welder_count) return null;

  const labels = dashboardData.welder_count.map(item => item.welder_id);
  const data = dashboardData.welder_count.map(item => [parseFloat(item.Failure_Rate)]);
  const barColors = dashboardData.welder_count.map(item => {
    const rate = parseFloat(item.Failure_Rate);
    return rate > 10 ? 'red' : 'skyblue';
  });

  const chartData = {
    labels,
    legend: ['Failure Rate %'],
    data,
    barColors,
  };

  const barHeight = 200;
  const baseChartWidth = chartData.labels.length * 60;
  const fixedPortraitWidth = WIDTH - 40;

  const chartWidth = isLandscape
    ? Math.max(WIDTH, baseChartWidth)
    : Math.max(fixedPortraitWidth, baseChartWidth);

  // Custom left offsets for each index (tweak as needed)
  const customOffsets = [
    70,  
    130, 
    170, 
    225, 
    290, 
    345, 
    390, 
    435, 
    490, 
    545, 
    610
  ];
  
  return (
    <View style={{
      backgroundColor: '#ECF7F9',
      borderRadius: 12,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      padding: 5,
      marginHorizontal: 10,
      marginBottom: 15,
      height: 330,
      width: isLandscape ? WIDTH * 1.8 : WIDTH * 0.95,
    }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginVertical: 15,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        width: WIDTH * 0.9,
        alignSelf: isLandscape ? 'center' : 'auto',

      }}>
        <Text style={{ fontWeight: 'bold', fontSize: 19, color: '#1e3a8a' }}>
          Welder Failure Rate (%)
        </Text>
        <TouchableOpacity
          onPress={handlePress}
          style={{
            backgroundColor: '#2563eb',
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderRadius: 5,
          }}>
          <Text style={{
            color: '#fff',
            fontSize: 12,
            fontWeight: '600',
          }}>View Table</Text>
        </TouchableOpacity>
      </View>

      {/* Chart with overlay */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 10,
          minWidth: fixedPortraitWidth,
        }}>
        <View style={{ position: 'relative' }}>
          {/* Dot Label Overlay */}
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: chartWidth,
            height: barHeight,
            zIndex: 1,
          }}>
            {chartData.data.map((dataArr, i) => {
              const failureValue = dataArr[0];
              const scaledHeight = (failureValue / 100) * barHeight;
              const dotColor = 'skyblue';

              return (
                <View
                  key={i}
                  style={{
                    position: 'absolute',
                    left: customOffsets[i] ?? i * 60 + 45,
                    bottom: scaledHeight + 20,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: '#ffffffee',
                      paddingVertical: 2,
                      paddingHorizontal: 6,
                      borderRadius: 5,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        backgroundColor: dotColor,
                        borderRadius: 4,
                        marginRight: 4,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: 'bold',
                        color: '#000',
                      }}
                    >
                      {failureValue}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Chart */}
          <StackedBarChart
            data={chartData}
            width={chartWidth}
            height={barHeight}
            yAxisSuffix="%"
            fromZero
            hideLegend
            withVerticalLabels
            segments={5}
            chartConfig={{
              backgroundGradientFrom: '#ECF7F9',
              backgroundGradientTo: '#ECF7F9',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(30, 64, 175, ${opacity})`,
              decimalPlaces: 0,
              barPercentage: 0.4,
              propsForHorizontalLabels: {
                fontSize: 11,
                fontWeight: '500',
                dy: 10,
              },
              propsForVerticalLabels: {
                fontSize: 10,
                fontWeight: '600',
              },
              verticalLabelRotation: isLandscape ? 0 : 45,
              propsForBackgroundLines: {
                stroke: 'transparent',
              },
              fillShadowGradientOpacity: 1,
              yAxisInterval: 10,
              xAxisHeight: 60,
              yAxisWidth: 60,
            }}
            style={{
              marginVertical: 10,
              borderRadius: 8,
              paddingRight: 35,
              paddingLeft: 10,
              paddingTop: 30,
            }}
          />
        </View>
      </ScrollView>

      {/* Table Modal */}
      <Modal
        visible={isTableModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setTableModalVisible(false)}>
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: '#fff',
            padding: 20,
            borderRadius: 12,
            maxHeight: '80%',
            width: '95%',
          }}>
            {/* Modal Header */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
              <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                Welder Count Table
              </Text>
              <TouchableOpacity onPress={() => setTableModalVisible(false)}>
                <Text style={{ fontSize: 18, color: 'red' }}>Close</Text>
              </TouchableOpacity>
            </View>

            {/* Table */}
            <ScrollView horizontal style={styles.tableContainer}>
  <ScrollView>
    <View style={styles.table}>
      <View style={[styles.tableRow, styles.headerRow]}>
        {['Welder ID', 'Name', 'Total', 'Accepted', 'Repair', 'Retake', 'Failure Rate']
          .map((header, index) => (
            <View
              key={index}
              style={[styles.tableCell, styles.headerCell]}>
              <Text style={styles.headerText}>{header}</Text>
            </View>
          ))}
      </View>

      {dashboardData.welder_count.map((item, index) => {
        const isHighFailure = parseFloat(item.Failure_Rate) > 10;

        return (
          <View
            key={index}
            style={[
              styles.tableRow,
              isHighFailure && { backgroundColor: '#ffe5e5' },
            ]}
          >
            <View style={styles.tableCell}>
              <Text style={styles.cellText}>{item.welder_id}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.cellText}>{item.Name}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.cellText}>{item.Total}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.cellText}>{item.Accepted}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.cellText}>{item.Repair}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.cellText}>{item.Retake}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={[
                styles.cellText,
                isHighFailure && { color: 'red', fontWeight: 'bold' }
              ]}>
                {item.Failure_Rate}%
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  </ScrollView>
</ScrollView>

          </View>
        </View>
      </Modal>
    </View>
  );
};


const rendercomponentCount = () => {
  if (!dashboardData || !dashboardData.component_count) return null;

  const visibleData = dashboardData.component_count;
  const labels = visibleData.map(item => {
    const name = item.pressure_part_component_name;

    if (isLandscape && name.length > 8) {
      const mid = Math.floor(name.length / 2);
      return `${name.slice(0, mid)}\n${name.slice(mid)}`;
    }

    return name.length > 8 ? name.slice(0, 5) + '...' : name;
  });

  const legend = ['Accepted', 'Retake', 'Repair'];
  const data = visibleData.map(item => [item.Accepted, item.Retake, item.Repair]);

  const chartData = {
    labels,
    legend,
    data,
    barColors: ['skyblue', '#FFB951', '#FF5252'],
  };

  const barHeight = 210;
  const barWidth = 60;
  const chartWidth = isLandscape ? WIDTH * 3 : barWidth * chartData.labels.length;
  const barMaxValue = Math.max(...data.map(arr => arr.reduce((a, b) => a + b, 0)));
  const barScale = barHeight / barMaxValue;

  const customOffsetsPortrait = [
    45, 105, 160, 215, 270, 325, 380, 435, 490, 545, 600, 670, 730
  ];
  const customOffsetsLandscape = [
    60, 130, 200, 290, 350, 430, 520, 600, 680, 750, 840,890,980
  ];

  const getBarLeftOffset = (index) => {
    const offsetList = isLandscape ? customOffsetsLandscape : customOffsetsPortrait;
    let left = offsetList[index] ?? index * barWidth + 45;
  
    // Apply shift ONLY in portrait for last two
    if (!isLandscape && index >= chartData.data.length - 2) {
      left -= 30;
    }
  
    return left;
  };
  

  return (
    <View
      style={{
        backgroundColor: '#ECF7F9',
        borderRadius: 12,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        padding: 5,
        marginHorizontal: 10,
        marginBottom: 15,
        height: 340,
        width: isLandscape ? WIDTH * 1.8 : WIDTH * 0.95,
        
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 12,
          marginVertical: 15,
          backgroundColor: '#f8f9fa',
          borderRadius: 12,
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          width: WIDTH * 0.9,
          alignSelf: isLandscape ? 'center' : 'auto',

        }}
      >
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 17,
            color: '#1e3a8a',
          }}
        >
          Component Count Overview
        </Text>

        <TouchableOpacity
          onPress={handlePress2}
          style={{
            backgroundColor: '#2563eb',
            paddingVertical: 4,
            paddingHorizontal: 5,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontSize: 12,
              fontWeight: '600',
            }}
          >
            View Table
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chart */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
        <View style={{ position: 'relative', width: chartWidth }}>
          {/* Overlay Dots with Values */}
          <View
            style={{
              position: 'absolute',
              top: 30,
              left: 0,
              flexDirection: 'row',
              zIndex: 1,
            }}
          >
            {chartData.data.map((dataArr, i) => {
              const left = getBarLeftOffset(i);
              const totalHeight = dataArr.reduce((sum, val) => sum + val * barScale, 0);
              const entries = dataArr
                .map((val, idx) => ({
                  value: val,
                  color: chartData.barColors[idx],
                }))
                .filter(entry => entry.value !== 0);

              return (
                <View
                  key={i}
                  style={{
                    width: barWidth + 15,
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    height: barHeight,
                    position: 'absolute',
                    left,
                  }}
                >
                  <View
                    style={{
                      position: 'absolute',
                      bottom: Math.min(totalHeight + 8, barHeight - 30),
                      backgroundColor: '#ffffffee',
                      padding: 3,
                      borderRadius: 6,
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                    }}
                  >
                    {entries.map((entry, idx) => (
                      <View
                        key={idx}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginRight: isLandscape ? 7 + idx * 3 : 4 + idx * 2,
                          marginBottom: 2,
                        }}
                      >
                        <View
                          style={{
                            width: 8,
                            height: 8,
                            backgroundColor: entry.color,
                            borderRadius: 4,
                            marginRight: 3,
                          }}
                        />
                        <Text
                          style={{
                            fontSize: 10,
                            fontWeight: '600',
                            color: '#000',
                          }}
                        >
                          {entry.value}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>

          {/* Chart */}
          <StackedBarChart
            data={chartData}
            width={chartWidth}
            height={barHeight}
            chartConfig={{
              backgroundGradientFrom: '#ECF7F9',
              backgroundGradientTo: '#ECF7F9',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              barPercentage: 0.4,
              decimalPlaces: 0,
              propsForHorizontalLabels: {
                fontSize: 11,
                fontWeight: '500',
                dy: 10,
              },
              propsForVerticalLabels: {
                fontSize: 8,
                fontWeight: '600',
              },
              verticalLabelRotation: isLandscape ? 0 : 45,
              propsForBackgroundLines: {
                stroke: 'transparent',
              },
              yAxisInterval: 1,
              xAxisHeight: 60,
              yAxisWidth: 60,
            }}
            withHorizontalLabels={true}
            withVerticalLabels={true}
            fromZero={true}
            hideLegend={true}
            segments={6}
            style={{
              borderRadius: 8,
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 40,
            }}
          />
        </View>
      </ScrollView>

      {/* Modal Table */}
      <Modal
        visible={isComponentModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setComponentModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: '#fff',
            padding: 20,
            borderRadius: 10,
            maxHeight: '85%',
            width: '95%',
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Component Count Table</Text>
              <TouchableOpacity onPress={() => setComponentModalVisible(false)}>
                <Text style={{ fontSize: 18, color: 'red' }}>Close</Text>
              </TouchableOpacity>
            </View>

          <ScrollView>
          <ScrollView horizontal contentContainerStyle={styles.tableContainer}>
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.headerRow]}>
                  {['Component Name', 'Total', 'Accepted', 'Repair', 'Retake', 'Failure Rate'].map((header, index) => (
                    <View key={index} style={[styles.tableCell, styles.headerCell]}>
                      <Text style={styles.headerText}>{header}</Text>
                    </View>
                  ))}
                </View>

                {visibleData.map((item, index) => (
                  <View key={index} style={styles.tableRow}>
                    <View style={styles.tableCell}>
                      <Text style={styles.cellText}>{item.pressure_part_component_name}</Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={styles.cellText}>{item.Total}</Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={styles.cellText}>{item.Accepted}</Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={styles.cellText}>{item.Repair}</Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={styles.cellText}>{item.Retake}</Text>
                    </View>
                    <View
                      style={[
                        styles.tableCell,
                        parseFloat(item.Failure_Rate) > 10 && { backgroundColor: '#ffcccc' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.cellText,
                          parseFloat(item.Failure_Rate) > 10 && { color: 'red', fontWeight: 'bold' },
                        ]}
                      >
                        {item.Failure_Rate}%
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};



const renderunitCount = () => {
  if (!dashboardData || !dashboardData.unit_count) return null;

  const unitData = dashboardData.unit_count;

  const labels = unitData.map(item => {
    const name = item.unit_no;
  
    if (isLandscape && name.length > 8) {
      // Try to split on space or hyphen if possible
      const splitIndex =
        name.indexOf(' ') > 0
          ? name.indexOf(' ')
          : name.indexOf('-') > 0
          ? name.indexOf('-')
          : Math.floor(name.length / 2);
  
      const firstLine = name.slice(0, splitIndex);
      const secondLine = name.slice(splitIndex);
      return `${firstLine}\n${secondLine}`;
    }
  
    return name.length > 8 ? name.slice(0, 5) + '...' : name;
  });
  

  const legend = ['Accepted', 'Repair', 'Retake'];

  const data = unitData.map(item => [
    item.accepted_count,
    item.repair_count,
    item.retake_count,
  ]);

  const chartData = {
    labels,
    legend,
    data,
    barColors: ['skyblue', '#FFB951', '#FF5252'],
  };

  const barHeight = 210;
  // const barMaxValue = Math.max(...data.map(arr => arr.reduce((a, b) => a + b, 0)));
  const barScale = barHeight / barMaxValue;
  const barWidth = 80;

  const chartWidth = Math.max(WIDTH * 0.96, barWidth * chartData.labels.length);

    const barMaxValue = Math.max(...data.map(arr => arr.reduce((a, b) => a + b, 0)));
  

  return (
    <View style={{
      backgroundColor: '#ECF7F9',
      borderRadius: 12,
      elevation: 5, // Android shadow
      shadowColor: '#000', // iOS shadow
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      // padding: 5,
      marginHorizontal: 10,
      marginBottom: 15,
      height: 340,
      width: isLandscape ? WIDTH * 1.8 : WIDTH * 0.95, // ✅ Wider in portrait

    }}>
      {/* Header */}
      <View style={{
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 16,
  paddingVertical: 10,
  marginVertical: 15,
  marginHorizontal: 10,
  backgroundColor: '#f8f9fa',
  borderRadius: 12,
  elevation: 4,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  width:WIDTH*0.9,
  alignSelf: isLandscape ? 'center' : 'auto',

  
}}>
  <Text style={{
    fontWeight: 'bold',
    fontSize: 20,
    color: '#1e3a8a',
  }}>
    Unit Count Overview
  </Text>

  <TouchableOpacity
    onPress={handlePress3}
    style={{
      backgroundColor: '#2563eb',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 8,
    }}>
    <Text style={{
      color: '#fff',
      fontSize: 12,
      fontWeight: '600',
    }}>
      View Table
    </Text>
  </TouchableOpacity>
</View>


      {/* Chart with Overlayed Values */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        <View style={{ position: 'relative' }}>
          {/* Overlay Values */}
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 20,
              flexDirection: 'row',
              zIndex: 1,
            }}
          >
            {chartData.data.map((dataArr, i) => {
              const totalHeight = dataArr.reduce((sum, val) => sum + val * barScale, 0);
              const entries = dataArr
                .map((val, idx) => ({
                  value: val,
                  color: chartData.barColors[idx],
                }))
                .filter(entry => entry.value !== 0);

              return (
                <View
                  key={i}
                  style={{
                    width: 90,
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    height: barHeight,
                  }}
                >
                  <View
                    style={{
                      position: 'absolute',
                      bottom: Math.min(totalHeight + 8, barHeight - 30),
                      backgroundColor: '#ffffffee',
                      padding: 4,
                      borderRadius: 6,
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                    }}
                  >
                    {entries.map((entry, idx) => (
                      <View
                        key={idx}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginRight: 6,
                          marginBottom: 2,
                        }}
                      >
                        <View
                          style={{
                            width: 8,
                            height: 8,
                            backgroundColor: entry.color,
                            borderRadius: 4,
                            marginRight: 3,
                          }}
                        />
                        <Text
                          style={{
                            fontSize: 10,
                            fontWeight: '600',
                            color: '#000',
                          }}
                        >
                          {entry.value}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>

          {/* Stacked Bar Chart */}
          <StackedBarChart
            data={chartData}
            width={chartWidth}
            height={barHeight}
            fromZero={true}
            hideLegend={true}
            withVerticalLabels={true}
            withHorizontalLabels={true}
            segments={6}
            chartConfig={{
              backgroundGradientFrom: '#ECF7F9',
              backgroundGradientTo: '#ECF7F9',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(30, 64, 175, ${opacity})`,
              decimalPlaces: 0,
              barPercentage: 0.4,
              propsForHorizontalLabels: {
                fontSize: 11,
                fontWeight: '500',
                dy: 10,
              },
              propsForVerticalLabels: {
                fontSize: 8,
                fontWeight: '600',
              },
              propsForBackgroundLines: {
                stroke: 'transparent',
              },
              fillShadowGradientOpacity: 1,
              yAxisInterval: 1,
              xAxisHeight: 60,
              yAxisWidth: 60,
            }}
            style={{
              marginVertical: 10,
              borderRadius: 8,
              paddingRight: 35,
              paddingLeft: 10,
              paddingTop: 40,
              
            }}
          />
        </View>
      </ScrollView>

      {/* Modal Table */}
      <Modal
        visible={isUnitModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setUnitModalVisible(false)}>
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: '#fff',
            padding: 20,
            borderRadius: 10,
            maxHeight: '85%',
            width: '95%',
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Unit Count Table</Text>
              <TouchableOpacity onPress={() => setUnitModalVisible(false)}>
                <Text style={{ fontSize: 18, color: 'red' }}>Close</Text>
              </TouchableOpacity>
            </View>

           <ScrollView>
             {/* Table */}
             <ScrollView horizontal contentContainerStyle={styles.tableContainer}>
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.headerRow]}>
                  {['Unit No', 'Total Jobs', 'Accepted', 'Repair', 'Retake'].map((header, index) => (
                    <View key={index} style={[styles.tableCell, styles.headerCell]}>
                      <Text style={styles.headerText}>{header}</Text>
                    </View>
                  ))}
                </View>

                {unitData.map((item, index) => (
                  <View key={index} style={styles.tableRow}>
                    <View style={styles.tableCell}>
                      <Text style={styles.cellText}>{item.unit_no}</Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={styles.cellText}>{item.total_jobs}</Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={styles.cellText}>{item.accepted_count}</Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={styles.cellText}>{item.repair_count}</Text>
                    </View>
                    <View style={styles.tableCell}>
                      <Text style={styles.cellText}>{item.retake_count}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
           </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
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
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refresh} />
            }>
            <View style={{ flex: 1,
            width: width, // auto-resize width
            minHeight: height, // auto-adjust height for landscape
            backgroundColor: WHITE,}}>
             <LinearGradient
    colors={[BRAND, WHITE]}
    start={{ x: 0.7, y: 0 }}
    end={{ x: 0.3, y: 1.8 }}
    style={{
      width: '100%',
      height: isLandscape ? HEIGHT * 0.35 :HEIGHT * 0.3, // adjusted height
      alignItems: 'center',
      zIndex: 5,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    }}
  >
                <View
                  style={{
                    width:isLandscape ? width:WIDTH,
                    height: '25%',
                    padding: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Icon
                    name="menu"
                    size={35}
                    color={WHITE}
                    onPress={() => navigation.toggleDrawer()}
                  />
                  <View
                    style={{
                      paddingHorizontal: 10,
                      height:HEIGHT*0.07
                    }}>
                   <DropDownPicker
  open={open}
  value={value}
  items={items}
  setOpen={setOpen}
  setValue={setValue}
  setItems={setItems}
  // placeholder="Shut Down"
  style={styles.dropdown}
  dropDownContainerStyle={styles.dropdownContainer}
  textStyle={styles.text}
  listItemLabelStyle={styles.listItem}
  placeholderStyle={styles.placeholder}
  // onChangeValue={selectedValue => {
  //   const selectedShutdown = items.find(
  //     item => item.value === selectedValue,
  //   );
  //   console.log('Selected Shutdown:', selectedShutdown?.value);

  //   setShutdownID(selectedShutdown?.value); 
  //   setValue(selectedShutdown?.value);

  //   // ✅ Fetch new dashboard data based on selected shutdown
  //   if (selectedShutdown?.value) {
  //     GetDashboard(selectedShutdown.value);
  //     //console the GetDashboard selectedShutdown.value
  //     console.log('.................', selectedShutdown.value);
      
  //   }
  // }}
  onChangeValue={handleChangeShutdown} 
  // modalAnimationType="fade"
  onOpen={() => {
    // setValue(null);
    GetShutdown(); // ✅ Refresh dropdown data when opened
  }}
/>

                  </View>
                </View>
                <View
                  style={{
                    width: '70%',
                    height: '30%',
                    alignItems: 'center',
                    padding: 10,
                    marginBottom: 15,
                  }}>
                  <Text
                    onPress={() => {
                      navigation.navigate('Joints', {
                        name: dashboardData?.stats[0]?.name,
                        id:shutdownID
                      });
                      // console.log('item.namee', dashboardData?.stats[0]?.name);
                    }}
                    style={{
                      fontSize: RFValue(13),
                      color: WHITE,
                      fontFamily: REGULAR,
                    }}>
                    {dashboardData?.stats[0]?.name}
                  </Text>
                  <Text
                    onPress={() => {
                      navigation.navigate('Joints', {
                        name: dashboardData?.stats[0]?.name,
                        id:shutdownID
                      });
                      // console.log('item.namee', dashboardData?.stats[0]?.name,'shutdownID',shutdownID);
                    }}
                    style={{
                      fontSize: RFValue(25),
                      color: WHITE,
                      fontFamily: REGULAR,
                    }}>
                    {dashboardData?.stats[0]?.figure}(
                    {dashboardData?.stats[0]?.total_monthly})
                  </Text>
                  <Text
                    style={{
                      fontSize: RFValue(13),
                      color: WHITE,
                      fontFamily: LIGHT,
                    }}>
                    {new Date().toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    height: '40%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 0,
                    marginTop: 25,
                  }}>
                  {dashboardData?.stats.slice(1).map((item, index) => (
                    <View
                      key={index}
                      style={{
                        width: '33%',
                        height: '1000%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: 10,
                      }}>
                      <Text
                        onPress={() => {
                          navigation.navigate('Joints', {name: item.name,
                              id: shutdownID
                          });
                          // console.log('item.name', item.name);
                        }}
                        style={{
                          fontSize: RFValue(9.5),
                          color: WHITE,
                          fontFamily: REGULAR,
                        }}>
                        {item.name}
                      </Text>
                      <Text
                        onPress={() => {
                          navigation.navigate('Joints', {name: item.name,
                              id: shutdownID
                          });
                          // console.log('item.name', item.name);
                        }}
                        style={{
                          fontSize: RFValue(10),
                          color: WHITE,
                          fontFamily: REGULAR,
                        }}>
                        {item.figure}({item.total_monthly})
                      </Text>
                    </View>
                  ))}
                </View>
              </LinearGradient>

              {renderStatsCards()}

              <View style={[styles.chartContainer, { width: width }]}>
  <View
    style={{
      height: isLandscape ? height * 0.08 : HEIGHT * 0.05,
      width: width,
      backgroundColor: BRAND,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    }}
  >
    <Text
      onPress={() => {
        clearAll();
        dispatch(checkuserToken());
      }}
      style={styles.tableTitle}
    >
      Job Status Overview
    </Text>
  </View>

  {renderwelderCountTable()}
  {rendercomponentCount()}
  {renderunitCount()}
</View>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <Loader visible={isLoading} />
        {/* Modal */}

        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setIsModalVisible(false);
                  setModalData([]);
                }}>
                <Icon name="close" type="material" color="white" size={24} />
              </TouchableOpacity>

              {/* Show the selected job status in the modal title */}
              <Text
                style={styles.modalTitle}
                numberOfLines={1}
                ellipsizeMode="tail">
                Job {selectedItem ? selectedItem.name : 'Loading...'}
              </Text>

              {/* Check if modalData exists and display FlatList */}
              {modalData === null ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color="blue" />
                  <Text style={styles.loadingText}>Loading data...</Text>
                </View>
              ) : modalData.length > 0 ? (
                <FlatList
                  data={modalData}
                  keyExtractor={(item, index) =>
                    item.job_number || index.toString()
                  }
                  renderItem={({item}) => (
                    <View style={styles.card}>
                      <Text style={styles.cardTitle}>
                        Job Number: {item.job_number}
                      </Text>
                      <Text style={styles.cardText}>
                        Component Name: {item.component_name}
                      </Text>
                      <Text style={styles.cardText}>
                        Unit Number: {item.unit_number}
                      </Text>
                      <Text style={styles.cardText}>
                        Job Offer Date: {item.job_offer_date}
                      </Text>
                      <Text style={styles.cardText}>
                        Job Desc Number: {item.job_desc_number}
                      </Text>
                      <Text style={styles.cardText}>
                        Tube Joints: {item.tube_joints}
                      </Text>
                    </View>
                  )}
                  contentContainerStyle={{padding: 10}}
                />
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>No Data Found</Text>
                </View>
              )}
            </View>
          </View>
        </Modal>

        {/* <Modal
        transparent={true}
        animationType="fade"
        visible={shutdownModalVisible}
        onRequestClose={() => setShutdownModalVisible(false)}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setShutdownModalVisible(false)}>
          <View style={styles.dropdown}>
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    console.log('Item got clicked',item);
                    setShutdownModalVisible(false);
                  }}>
                  <Text style={styles.itemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal> */}
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  headerGradient: {
    width: '100%',
    height: HEIGHT * 0.35,
    alignItems: 'center',
    zIndex: 5,
    paddingBottom: 50,
  },
  balanceContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  balanceTitle: {
    fontSize: 18,
    color: WHITE,
    fontFamily: REGULAR,
  },
  balanceValue: {
    fontSize: 42,
    color: WHITE,
    fontFamily: EXTRABOLD,
  },
  balanceDate: {
    fontSize: 14,
    color: WHITE,
    fontFamily: LIGHT,
  },
  statsContainer: {
    
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    // marginVertical: 20,
    // marginRight: 20,
  },
  statsCard: {
    backgroundColor: WHITE,
    // height: HEIGHT * 0.1,
    borderWidth: 1,

    borderRadius: 10,
    margin: 8,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    width: WIDTH * 0.2,
    justifyContent: 'center',
    alignSelf: 'center',

    alignItems: 'center',
  },
  statsName: {
    fontSize: RFValue(8),
    color: BLACK,
    fontWeight: '600',
    // fontFamily: BOLD,
  },
  statsFigure: {
    fontSize: RFValue(15),
    color: BLACK,
    fontFamily: BOLD,
    marginVertical: 5,
  },
  statsMonthly: {
    fontSize: RFValue(10),
    color: GRAY,
  },
  chartContainer: {
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: 'gray',
  },
  chartTitle: {
    fontSize: RFValue(15),
    color: BLACK,
    fontFamily: SEMIBOLD,
    marginBottom: 10,
  },
  tableContainer: {
    width: WIDTH,
    paddingHorizontal: 10,
    // marginTop: 20,
    backgroundColor: WHITE,
    paddingBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  tableTitle: {
    fontSize: RFValue(18),
    color: WHITE,
    fontFamily: BOLD,
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: GRAY,
    marginBottom: 10,
    marginTop: 10,
  },
  tableHeaderText: {
    fontSize: RFValue(10),
    color: BLACK,
    fontFamily: BOLD,
    // flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: GRAY,
  },
  tableText: {
    fontSize: RFValue(11),
    color: BLACK,
    fontFamily: REGULAR,
    // flex: 1,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background
    padding: 20, // Adjust the padding for spacing around the modal
  },
  modalContent: {
    width: '100%', // Set the width of the modal to 80% of the screen width
    height: '90%', // Set the height to 50% of the screen height
    padding: 15, // Reduce padding inside the modal content to decrease its size
    backgroundColor: WHITE,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: BOLD,
    marginBottom: 15,
    justifyContent: 'center',
    textAlign: 'center',
  },
  modalText: {
    color: BLACK,
    fontSize: 14,
    fontFamily: REGULAR,
    marginBottom: 10,
  },
  modalButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: BRAND,
    borderRadius: '60%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: WHITE,
    fontSize: 20,
    fontFamily: BOLD,
  },
  card: {
    backgroundColor: WHITE,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 15,
    width: '100%',
  },

  cardTitle: {
    fontSize: 13,
    fontFamily: BOLD,
    color: BLACK,
    marginBottom: 8,
  },

  cardText1: {
    fontSize: 14,
    fontFamily: REGULAR,
    color: BLACK,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  cardText: {
    fontSize: 13,
    fontFamily: REGULAR,
    color: BLACK,
    marginBottom: 5,
  },
  closeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 50,
    padding: 10,
    zIndex: 10,
  },
  tableContainer: {
    marginVertical: 20,
    backgroundColor: '#f8f9fa', // Light background
    borderRadius: 10,
    padding: 10,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc', // Outer border for the table
    borderRadius: 8,
    // overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1, // Horizontal line between rows
    borderColor: '#ccc',
  },
  headerRow: {
    backgroundColor: '#007BFF', // Blue header
  },
  tableCell: {
    // flex: 1,
    width: WIDTH * 0.4,
    height: HEIGHT * 0.049,
    // paddingVertical: 12,
    // paddingHorizontal: 15,
    borderRightWidth: 1, // Vertical line between columns
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  headerCell: {
    padding: 10,
    backgroundColor: '#007BFF', // Blue header cell
  },
  headerText: {
    color: '#fff',
    fontSize: RFPercentage(1.5),
    fontFamily: BOLD,
    // fontWeight: 'bold',
    textAlign: 'center',
  },
  cellText: {
    // fontSize: RFPercentage(0.7),
    color: '#333',
    fontFamily: REGULAR,

    textAlign: 'center',
  },
  cellText: {
    textAlign: 'center',
    fontSize: RFPercentage(1.5),
    color: 'black',
    fontFamily: BOLD,
  },
  dropdown: {
    backgroundColor: '#3A9BDC',
    borderRadius: 8,
    borderWidth: 0,
    width: WIDTH*0.75,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,

  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 5,
    width: WIDTH*0.75,
    // maxHeight: 120, 

    
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
});

export default DashBoard;
