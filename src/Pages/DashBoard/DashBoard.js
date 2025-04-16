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
import {StackedBarChart} from 'react-native-chart-kit';
const screenWidth = Dimensions.get('window').width;

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
  const [isUnitModalVisible, setUnitModalVisible] = useState(false);

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
        } else {
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
          if (
            !formattedData.some(item => item.value === currentShutdown.value)
          ) {
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

  const GetDashboard = async id => {
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeShutdown = async selectedValue => {
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
    }, [shutdownID]),
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
      <View style={styles.statsContainer}>
        <FlatList
          data={dashboardData.status_count} // Use status_count here
          numColumns={4} // Set to 4 columns for grid layout
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedItem(item);
                setIsModalVisible(true);
                fetchJobStatusDetails(item.name);
                // console.log('itemname updated', item.name);
              }}>
              <View
                style={{
                  ...styles.statsCard,
                  borderTopColor: getRandomColor(), // Apply random borderTopColor
                  borderTopWidth: 8, // Add width to the border
                }}>
                <Text
                  style={{...styles.statsName}}
                  numberOfLines={2} // Limit to 1 line
                  ellipsizeMode="tail" // Add ellipsis at the tail if text overflows
                >
                  {item.name}
                </Text>
                <Text style={styles.statsFigure}>{item.count}</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{paddingHorizontal: 10}}
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

    const labels = dashboardData.welder_count.map(item =>
      item.Name.length > 4 ? item.Name.slice(0, 4) + '...' : item.Name,
    );

    const legend = ['Accepted', 'Retake', 'Repair'];

    const data = dashboardData.welder_count.map(item => {
      const values = [item.Accepted, item.Retake, item.Repair];
      console.log('Welder Data:', values); // ✅ Clean array output
      return values;
    });

    const chartData = {
      labels,
      legend,
      data,
      barColors: ['#00A389', '#FFB951', '#FF5252'],
    };

    return (
      <>
        {/* Header with button */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 18}}>
            Welder Count Overview
          </Text>

          <View
            style={{
              marginLeft: WIDTH * 0.15,
            }}>
            <TouchableOpacity
              onPress={() => setTableModalVisible(true)}
              style={{
                backgroundColor: '#007bff',
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 5,
              }}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>
                View Table
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Custom Legend */}
        <View
          style={{flexDirection: 'row', marginBottom: 10, flexWrap: 'wrap'}}>
          {chartData.legend.map((label, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: 15,
                marginBottom: 5,
              }}>
              <View
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: chartData.barColors[index],
                  marginRight: 5,
                  borderRadius: 2,
                }}
              />
              <Text style={{fontSize: 12}}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Chart */}
        {/* Chart with overlayed values */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 10}}>
          <View style={{position: 'relative'}}>
            {/* Overlayed Segment Values with Color Matching */}
            <View
              style={{
                position: 'absolute',

                top: 0,
                left: 20,
                flexDirection: 'row',
                zIndex: 1,
              }}>
              {chartData.data.map((dataArr, i) => {
                const barHeight = 300;
                const barMaxValue = Math.max(
                  ...chartData.data.map(arr => arr.reduce((a, b) => a + b, 0)),
                );
                const barScale = barHeight / barMaxValue;

                const totalHeight = dataArr.reduce(
                  (sum, val) => sum + val * barScale,
                  0,
                );

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
                    }}>
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
                      }}>
                      {entries.map((entry, idx) => (
                        <View
                          key={idx}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginRight: 6,
                          }}>
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
                            }}>
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
              width={chartData.labels.length * 90}
              height={HEIGHT * 0.45}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                barPercentage: 0.4,
                decimalPlaces: 0,
                formatYLabel: yValue => `${parseInt(yValue, 10)}`,
                propsForVerticalLabels: {
                  fontSize: 10,
                  fontWeight: '600',
                  fill: '#222222',
                  textAnchor: 'middle',
                  dx: 10,
                },
                propsForHorizontalLabels: {
                  fontSize: 11,
                  fontWeight: '500',
                  dy: 10,
                },
                propsForLabels: {
                  fontSize: 5,
                  fontWeight: '600',
                  rotation: 0,
                  originY: 35,
                  originX: 10,
                  textAnchor: 'end',
                },
                propsForBackgroundLines: {
                  stroke: 'blue',
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
                paddingLeft: 10, // ← Should match overlay
                // paddingBottom: 45,
                paddingTop: 40, // ← Should match overlay
              }}
              withHorizontalLabels={true}
              withCustomBarColorFromData={true}
              flatColor={true}
              fromZero={true}
              hideLegend={true}
              segments={6}
              horizontalLabelRotation={0}
              verticalLabelRotation={0}
              withInnerLines={true}
              withOuterLines={true}
              withScrollableDot={false}
            />
          </View>
        </ScrollView>

        {/* Table Modal */}
        <Modal
          visible={isTableModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setTableModalVisible(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                padding: 20,
                borderRadius: 12,
                maxHeight: '80%',
                width: '95%',
              }}>
              {/* Modal Header */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>
                  Welder Count Table
                </Text>
                <TouchableOpacity onPress={() => setTableModalVisible(false)}>
                  <Text style={{fontSize: 18, color: 'red'}}>Close</Text>
                </TouchableOpacity>
              </View>

              {/* Table */}
              <ScrollView horizontal style={styles.tableContainer}>
                <View style={styles.table}>
                  <View style={[styles.tableRow, styles.headerRow]}>
                    {[
                      'Welder ID',
                      'Name',
                      'Total',
                      'Accepted',
                      'Repair',
                      'Retake',
                      'Failure Rate',
                    ].map((header, index) => (
                      <View
                        key={index}
                        style={[styles.tableCell, styles.headerCell]}>
                        <Text style={styles.headerText}>{header}</Text>
                      </View>
                    ))}
                  </View>

                  {dashboardData.welder_count.map((item, index) => (
                    <View key={index} style={styles.tableRow}>
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
                        <Text style={styles.cellText}>
                          {item.Failure_Rate}%
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </>
    );
  };

  const rendercomponentCount = () => {
    if (!dashboardData || !dashboardData.component_count) return null;

    const visibleData = dashboardData.component_count;

    const labels = visibleData.map(item => {
      const name = item.pressure_part_component_name;
      return name.length > 6
        ? name.slice(0, 3) + '\n' + name.slice(3, 6) + '...'
        : name.slice(0, 3) + '\n' + name.slice(3, 6);
    });

    const legend = ['Accepted', 'Retake', 'Repair'];

    const data = visibleData.map(item => [
      item.Accepted,
      item.Retake,
      item.Repair,
    ]);

    const chartData = {
      labels,
      legend,
      data,
      barColors: ['#00A389', '#FFB951', '#FF5252'],
    };

    const barHeight = 300;
    const barMaxValue = Math.max(
      ...data.map(arr => arr.reduce((a, b) => a + b, 0)),
    );
    const barScale = barHeight / barMaxValue;

    return (
      <>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 18}}>
            Component Count Overview
          </Text>
          <View
            style={{
              marginLeft: WIDTH * 0.07,
            }}>
            <TouchableOpacity
              onPress={() => setComponentModalVisible(true)}
              style={{
                backgroundColor: '#007bff',
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 5,
              }}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>
                View Table
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Custom Legend */}
        <View
          style={{flexDirection: 'row', marginBottom: 10, flexWrap: 'wrap'}}>
          {legend.map((label, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: 15,
              }}>
              <View
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: chartData.barColors[index],
                  marginRight: 5,
                  borderRadius: 2,
                }}
              />
              <Text style={{fontSize: 12}}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Chart */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 10}}>
          <View style={{position: 'relative'}}>
            {/* Overlayed values */}
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 20,
                flexDirection: 'row',
                zIndex: 1,
              }}>
              {chartData.data.map((dataArr, i) => {
                const totalHeight = dataArr.reduce(
                  (sum, val) => sum + val * barScale,
                  0,
                );

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
                    }}>
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
                      }}>
                      {entries.map((entry, idx) => (
                        <View
                          key={idx}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginRight: 6,
                          }}>
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
                            }}>
                            {entry.value}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Stacked Chart */}
            <StackedBarChart
              data={chartData}
              width={chartData.labels.length * 90}
              height={barHeight}
              chartConfig={{
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                barPercentage: 0.4,
                decimalPlaces: 0,
                formatYLabel: yValue => `${parseInt(yValue, 10)}`,
                propsForVerticalLabels: {
                  fontSize: 10,
                  fontWeight: '600',
                  fill: '#222222',
                  textAnchor: 'middle',
                  dx: 10,
                },
                propsForHorizontalLabels: {
                  fontSize: 11,
                  fontWeight: '500',
                  dy: 10,
                },
                propsForBackgroundLines: {
                  stroke: 'blue',
                },
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
              withHorizontalLabels={true}
              withCustomBarColorFromData={true}
              flatColor={true}
              fromZero={true}
              hideLegend={true}
              segments={6}
              horizontalLabelRotation={0}
              verticalLabelRotation={0}
              withInnerLines={true}
              withOuterLines={true}
            />
          </View>
        </ScrollView>

        {/* Table Modal */}
        <Modal
          visible={isComponentModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setComponentModalVisible(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                padding: 20,
                borderRadius: 10,
                maxHeight: '85%',
                width: '95%',
              }}>
              {/* Modal Header */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}>
                <Text style={{fontWeight: 'bold', fontSize: 18}}>
                  Component Count Table
                </Text>
                <TouchableOpacity
                  onPress={() => setComponentModalVisible(false)}>
                  <Text style={{fontSize: 18, color: 'red'}}>Close</Text>
                </TouchableOpacity>
              </View>

              {/* Table */}
              <ScrollView
                horizontal
                contentContainerStyle={styles.tableContainer}>
                <View style={styles.table}>
                  <View style={[styles.tableRow, styles.headerRow]}>
                    {[
                      'Component Name',
                      'Total',
                      'Accepted',
                      'Repair',
                      'Retake',
                      'Failure Rate',
                    ].map((header, index) => (
                      <View
                        key={index}
                        style={[styles.tableCell, styles.headerCell]}>
                        <Text style={styles.headerText}>{header}</Text>
                      </View>
                    ))}
                  </View>

                  {visibleData.map((item, index) => (
                    <View key={index} style={styles.tableRow}>
                      <View style={styles.tableCell}>
                        <Text style={styles.cellText}>
                          {item.pressure_part_component_name}
                        </Text>
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
                        <Text style={styles.cellText}>
                          {item.Failure_Rate}%
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </>
    );
  };

  const renderunitCount = () => {
    if (!dashboardData || !dashboardData.unit_count) return null;

    const unitData = dashboardData.unit_count;

    const labels = unitData.map(item =>
      item.unit_no.length > 6
        ? item.unit_no.slice(0, 3) + '\n' + item.unit_no.slice(3, 6) + '...'
        : item.unit_no.slice(0, 3) + '\n' + item.unit_no.slice(3),
    );

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
      barColors: ['#00A389', '#FFB951', '#FF5252'],
    };

    const barHeight = 300;
    const barMaxValue = Math.max(
      ...data.map(arr => arr.reduce((a, b) => a + b, 0)),
    );
    const barScale = barHeight / barMaxValue;

    return (
      <>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 18}}>
            Unit Count Overview
          </Text>
          <View
            style={{
              marginLeft: WIDTH * 0.22,
            }}>
            <TouchableOpacity
              onPress={() => setUnitModalVisible(true)}
              style={{
                backgroundColor: '#007bff',
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 5,
              }}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>
                View Table
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Custom Legend */}
        <View style={{flexDirection: 'row', marginBottom: 10}}>
          {legend.map((label, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: 15,
              }}>
              <View
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: chartData.barColors[index],
                  marginRight: 5,
                  borderRadius: 2,
                }}
              />
              <Text style={{fontSize: 12}}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Chart with Overlayed Values */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{position: 'relative'}}>
            {/* Overlay values */}
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 20,
                flexDirection: 'row',
                zIndex: 1,
              }}>
              {chartData.data.map((dataArr, i) => {
                const totalHeight = dataArr.reduce(
                  (sum, val) => sum + val * barScale,
                  0,
                );
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
                      height: barHeight,
                    }}>
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
                      }}>
                      {entries.map((entry, idx) => (
                        <View
                          key={idx}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginRight: 6,
                          }}>
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
                            }}>
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
              width={chartData.labels.length * 120}
              height={barHeight}
              chartConfig={{
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                barPercentage: 0.4,
                decimalPlaces: 0,
                formatYLabel: yValue => `${parseInt(yValue, 10)}`,
                propsForVerticalLabels: {
                  fontSize: 10,
                  fontWeight: '600',
                  fill: '#222222',
                  textAnchor: 'middle',
                  dx: 10,
                },
                propsForHorizontalLabels: {
                  fontSize: 11,
                  fontWeight: '500',
                  dy: 10,
                },
                propsForBackgroundLines: {
                  stroke: 'blue',
                },
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
              withHorizontalLabels={true}
              withCustomBarColorFromData={true}
              flatColor={true}
              fromZero={true}
              hideLegend={true}
              segments={6}
              horizontalLabelRotation={0}
              verticalLabelRotation={0}
              withInnerLines={true}
              withOuterLines={true}
            />
          </View>
        </ScrollView>

        {/* Modal Table */}
        <Modal
          visible={isUnitModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setUnitModalVisible(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                padding: 20,
                borderRadius: 10,
                maxHeight: '85%',
                width: '95%',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}>
                <Text style={{fontWeight: 'bold', fontSize: 18}}>
                  Unit Count Table
                </Text>
                <TouchableOpacity onPress={() => setUnitModalVisible(false)}>
                  <Text style={{fontSize: 18, color: 'red'}}>Close</Text>
                </TouchableOpacity>
              </View>

              {/* Table */}
              <ScrollView
                horizontal
                contentContainerStyle={styles.tableContainer}>
                <View style={styles.table}>
                  <View style={[styles.tableRow, styles.headerRow]}>
                    {[
                      'Unit No',
                      'Total Jobs',
                      'Accepted',
                      'Repair',
                      'Retake',
                    ].map((header, index) => (
                      <View
                        key={index}
                        style={[styles.tableCell, styles.headerCell]}>
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
                        <Text style={styles.cellText}>
                          {item.accepted_count}
                        </Text>
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
            </View>
          </View>
        </Modal>
      </>
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
            <View style={{flex: 1, width: WIDTH, backgroundColor: WHITE}}>
              <LinearGradient
                colors={[BRAND, WHITE]}
                start={{x: 0.7, y: 0}}
                end={{x: 0.3, y: 1.8}}
                style={{
                  width: '100%',
                  height: HEIGHT * 0.3,
                  alignItems: 'center',
                  zIndex: 5,
                  borderBottomLeftRadius: 20,
                  borderBottomRightRadius: 20,
                  // paddingBottom: 50,
                }}>
                <View
                  style={{
                    width: '100%',
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
                      height: HEIGHT * 0.07,
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
                        id: shutdownID,
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
                        id: shutdownID,
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
                          navigation.navigate('Joints', {
                            name: item.name,
                            id: shutdownID,
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
                          navigation.navigate('Joints', {
                            name: item.name,
                            id: shutdownID,
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

              <View style={styles.chartContainer}>
                <View
                  style={{
                    height: HEIGHT * 0.05,
                    width: WIDTH,
                    backgroundColor: BRAND,
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 10,
                  }}>
                  <Text onPress={() => {}} style={styles.tableTitle}>
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
    justifyContent: 'space-around',
    // marginVertical: 20,
    // marginRight: 20,
  },
  statsCard: {
    backgroundColor: WHITE,
    height: HEIGHT * 0.1,
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
    width: WIDTH,
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
    width: WIDTH * 0.75,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 5,
    width: WIDTH * 0.75,
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
