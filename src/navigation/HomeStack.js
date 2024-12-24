import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import CustomDrawerContent from './CustomDrawerContent';
import DashBoard from '../Pages/DashBoard/DashBoard';
import Registration from '../Pages/Registratration/Registration';
import NewJob from '../Pages/NewJob/NewJob';
import JobApproval from '../Pages/JobApproval/JobApproval';
import RTReport from '../Pages/RTReport/RTReport';
import PAUTReport from '../Pages/PAUTReport/PAUTReport';
import TPI from '../Pages/TPI/TPI';
import FinalApproval from '../Pages/FinalApproval/FinalApproval';
import AssignWelder from '../Pages/AssignWelder/AssignWelder';
import LoginStack from './LoginStack';
import { WIDTH } from '../constants/config';
import { useDispatch } from 'react-redux';
import { checkuserToken } from '../redux/actions/auth';
import QualityVerification from '../Pages/QualityVerification\'/QualityVerification';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const [userDetails, setUserDetails] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch user details from storage
    const fetchUserDetails = async () => {
      const response = await getObjByKey('userDetails');
      if (response?.data_value?.length) {
        setUserDetails(response?.data_value[0]); // Assuming data_value is an array
      }
    };

    fetchUserDetails();
  }, []);

  const handleSignOut = async () => {
    await clearAll(); // Clear all stored data
    dispatch(checkuserToken(false)); // Update auth state
  };

  return (
    <Drawer.Navigator
      initialRouteName="DashBoard"
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: WIDTH,
        },
      }}
      drawerContent={(props) => (
        <CustomDrawerContent
          {...props}
          userDetails={userDetails}
          onSignOut={handleSignOut} // Pass sign-out logic
        />
      )}
    >
      <Drawer.Screen name="DashBoard" component={DashBoard} />
      <Drawer.Screen name="Assign Welder" component={AssignWelder} />
      <Drawer.Screen name="Registration" component={Registration} />
      <Drawer.Screen name="New Job" component={NewJob} />
      <Drawer.Screen name="Job Approval" component={JobApproval} />
      <Drawer.Screen name="RT Report" component={RTReport} />
      <Drawer.Screen name="PAUT-Report" component={PAUTReport} />
      <Drawer.Screen name="Quality Verification" component={QualityVerification} />
      <Drawer.Screen name="TPI" component={TPI} />
      <Drawer.Screen name="Final Approval" component={FinalApproval} />
    </Drawer.Navigator>
  );
};

const HomeStack = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Drawer">
        <Stack.Screen
          name="Drawer"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginStack"
          component={LoginStack}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default HomeStack;
