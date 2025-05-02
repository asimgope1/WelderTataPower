import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {HEIGHT, MyStatusBar, WIDTH} from '../../constants/config';
import {BLACK, BRAND, WHITE} from '../../constants/color';
import {appStyles} from '../../styles/AppStyles';
import {ScrollView} from 'react-native-gesture-handler';
import {BAS_URL} from '../../constants/url';
import {GETNETWORK} from '../../utils/Network';
import {Icon} from 'react-native-elements';
import {BOLD} from '../../constants/fontfamily';
import {Loader} from '../../components/Loader';
import { useFocusEffect } from '@react-navigation/native';

const Joints = ({route, navigation}) => {
  const [filteredName, setFilteredName] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shutdownID, setShutdownID] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [filterLoading, setFilterLoading] = useState(false);

  

  useEffect(() => {
    if (route?.params?.name) {
      const name = route.params.name;
      const id=route.params.id;
      const filtered = name.replace('Joints', '').trim();
      console.log('Filtered Name:', filtered);
      setFilteredName(filtered);
      setShutdownID(id);
    }
  }, [route]);

  // useFocusEffect(
  //   useCallback(
  //     () =>{
  //       setSearchQuery('');
  //       setFilteredData(data);
  //       console.log('Filter cleared');
  //       return () => {
  //         // Clean up if necessary
  //       };
  //     },[]
  //   )
  // )

  // useEffect(() => {
    
  //   const filtered = data.filter((item) =>
  //     item?.job_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     item?.job_desc_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     item?.job_details?.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  //   setFilteredData(filtered);
  // }, [searchQuery, data]);


  useEffect(() => {
    setFilterLoading(true); // Start the loader when filtering starts
    
    const timeout = setTimeout(() => {
      const filtered = data.filter((item) =>
        item?.job_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item?.job_desc_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item?.job_details?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
      setFilterLoading(false); // Stop the loader after filtering is done
    }, 300); // Add a slight delay to prevent too many updates
  
    return () => clearTimeout(timeout);
  }, [searchQuery, data]);
  
  const fetchData = useCallback(async () => {
    if (!filteredName || !shutdownID) return;
  
    const jobStatus = filteredName === 'Total' ? 'All' : filteredName;
    const url = `${BAS_URL}welding/api/v1/get-job-details/?job_status=${jobStatus}&shutdown_id=${shutdownID}`;
    console.log('Fetching URL:', url);
  
    setLoading(true);
    try {
      const response = await GETNETWORK(url, true);
      // console.log('Fetched Data:', JSON.stringify(response.data, null, 2));
      console.log(response.data)

      setData(response?.data || []);
    } catch (error) {
      console.error('Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  }, [filteredName, shutdownID]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  

  const renderItem = ({item}) => {
const date=item?.job_history[0]?.status_date
const formattedDate = new Date(date).toISOString().split('T')[0];

    return(
      
      <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>Job Number:</Text>
        <Text style={styles.value}>{item.job_number}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Job Description:</Text>
        <Text style={styles.value}>{item.job_desc_number}</Text>
      </View>
      {/* <View style={styles.row}>
        <Text style={styles.title}>Job Details:</Text>
        <Text style={styles.value}>{item.job_details}</Text>
      </View> */}
      <View style={styles.row}>
        <Text style={styles.title}>Offer Date:</Text>
        <Text style={styles.value}>{item.job_offer_date}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Fresh/Old:</Text>
        <Text style={styles.value}>{item.fresh_old}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Unit Number:</Text>
        <Text style={styles.value}>{item.unit_number}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>Joint Number:</Text>
        <Text style={styles.value}>{item.component.joint_number}</Text>
      </View>
      
      <View style={styles.row}>
        <Text style={styles.title}>Tube Joint:</Text>
        <Text style={styles.value}>{item.tube_joints}</Text>
      </View>

      {item.component && (
        <View style={styles.row}>
          <Text style={styles.title}>Component Name:</Text>
          <Text style={styles.value}>{item.component.component_name}</Text>
        </View>
      )}
      {item.job_history && (
        <View style={styles.row}>
          <Text style={styles.title}>Welder Name:</Text>
          <Text style={styles.value}>{item.job_history[0].welder_name}</Text>
        </View>
      )}
      {/* {item.job_history && (
        <View style={styles.row}>
          <Text style={styles.title}>Status Date:</Text>
          <Text style={styles.value}>{formattedDate}</Text>
        </View>
      )} */}
    </View>
    )
  }
  
  

  return (
    <Fragment>
      <MyStatusBar backgroundColor={BRAND} barStyle={'light-content'} />
      <SafeAreaView style={appStyles.safeareacontainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <View style={styles.header}>
            {/* back button */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Dashboard')}
              style={styles.backButton}>
              <Icon name="arrow-back" size={30} color={WHITE} />
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 18,
                fontFamily: BOLD,
                color: WHITE,
                marginLeft: WIDTH * 0.12,
              }}>
              {filteredName} joints job Details
            </Text>
          </View>
          <TextInput
        style={styles.searchInput}
        placeholder="Search by Job Number, Description..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
          <ScrollView
            keyboardShouldPersistTaps={'handled'}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}>
            <View style={{width: '100%', flex: 1, alignSelf: 'center'}}>
              {loading ? (
                <Text style={{textAlign: 'center', marginTop: 20}}>
                  Loading...
                </Text>
              ) : data.length === 0 ? (
                <Text style={{textAlign: 'center', marginTop: 20}}>
                  No Data Found
                </Text>
              ) : (
                <View style={{width: '100%'}}>


                 {/* <FlatList
  data={filteredData}
  keyExtractor={(item, index) => index.toString()}
  renderItem={renderItem}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  getItemLayout={(data, index) => ({
    length: 100, // approximate height of each item
    offset: 100 * index,
    index,
  })}
  // contentContainerStyle={{padding: 1}}
  removeClippedSubviews={true} // Unmount components outside of view
/> */}


{filterLoading ? (
 <Loader visible={true} />
) : filteredData.length === 0 ? (
  <Text style={{textAlign: 'center', marginTop: 20}}>No Data Found</Text>
) : (
  <FlatList
    data={filteredData}
    keyExtractor={(item, index) => index.toString()}
    renderItem={renderItem}
    initialNumToRender={10}
    maxToRenderPerBatch={10}
    windowSize={5}
    getItemLayout={(data, index) => ({
      length: 10, 
      offset: 10 * index,
      index,
    })}
    removeClippedSubviews={true}
  />
)}


                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <Loader visible={loading} />
    </Fragment>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    marginVertical: 3,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 5,
    color: BLACK,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: 3,
  },
  value: {
    fontSize: 12,
    color: BLACK,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    padding: 15,
    backgroundColor: BRAND,
    alignItems: 'center',
  },
  searchInput: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    marginVertical: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
});

export default Joints;
