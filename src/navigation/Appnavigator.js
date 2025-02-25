import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {checkuserToken} from '../redux/actions/auth';
import HomeStack from './HomeStack';
import LoginStack from './LoginStack';
import {View, ActivityIndicator} from 'react-native';

const Appnavigator = () => {
  const dispatch = useDispatch();
  const authStatus = useSelector(state => state?.authStatus);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthStatus = async () => {
      await dispatch(checkuserToken());
      setLoading(false);
    };

    fetchAuthStatus();
  }, [dispatch]);

  console.log('Auth Status:', authStatus);

  // Prevent UI transition conflicts
  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return authStatus ? <HomeStack /> : <LoginStack />;
};

export default Appnavigator;
