import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {Fragment, useEffect, useState} from 'react';
import {HEIGHT, MyStatusBar, WIDTH} from '../../constants/config';
import {BLACK, BRAND, WHITE} from '../../constants/color';
import {appStyles} from '../../styles/AppStyles';
import {ScrollView} from 'react-native-gesture-handler';
import {BAS_URL} from '../../constants/url';
import {GETNETWORK} from '../../utils/Network';
import {Icon} from 'react-native-elements';
import {BOLD} from '../../constants/fontfamily';
import {Loader} from '../../components/Loader';

const Joints = ({route, navigation}) => {
  const [filteredName, setFilteredName] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (route?.params?.name) {
      const name = route.params.name;
      const filtered = name.replace('Joints', '').trim();
      console.log('Filtered Name:', filtered);
      setFilteredName(filtered);
    }
  }, [route]);

  useEffect(() => {
    const fetchData = async () => {
      const jobStatus = filteredName === 'Total' ? 'All' : filteredName;
      const url = `${BAS_URL}welding/api/v1/get-job-details/?job_status=${jobStatus}`;
      console.log('Fetching URL:', url);

      setLoading(true);
      try {
        const response = await GETNETWORK(url, true);
        console.log('Fetched Data:', response);
        console.log('Length:', response?.data?.length || 0);

        if (response?.data) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (filteredName) {
      fetchData();
    }
  }, [filteredName]);

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>Job Description:</Text>
        <Text style={styles.value}>{item.job_desc_number}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.title}>Status:</Text>
        <Text style={styles.value}>{item.status}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.title}>Created By:</Text>
        <Text style={styles.value}>{item.created_by}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.title}>Tube Joints:</Text>
        <Text style={styles.value}>{item.tube_joints}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.title}>Unit Number:</Text>
        <Text style={styles.value}>{item.unit_number}</Text>
      </View>

      {item.component && (
        <View style={styles.row}>
          <Text style={styles.title}>Component Name:</Text>
          <Text style={styles.value}>{item.component.component_name}</Text>
        </View>
      )}
    </View>
  );

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
              onPress={() => navigation.goBack()}
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
                  <FlatList
                    data={data}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{padding: 10}}
                  />
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
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: BLACK,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  value: {
    fontSize: 14,
    color: BLACK,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    padding: 15,
    backgroundColor: BRAND,
    alignItems: 'center',
  },
});

export default Joints;
