// import React, {useEffect, useState} from 'react';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import {createDrawerNavigator} from '@react-navigation/drawer';
// import CustomDrawerContent from './CustomDrawerContent';
// import DashBoard from '../Pages/DashBoard/DashBoard';
// import Registration from '../Pages/Registratration/Registration';
// import NewJob from '../Pages/NewJob/NewJob';
// import JobApproval from '../Pages/JobApproval/JobApproval';
// import RTReport from '../Pages/RTReport/RTReport';
// import PAUTReport from '../Pages/PAUTReport/PAUTReport';
// import TPI from '../Pages/TPI/TPI';
// import FinalApproval from '../Pages/FinalApproval/FinalApproval';
// import AssignWelder from '../Pages/AssignWelder/AssignWelder';
// import LoginStack from './LoginStack';
// import {WIDTH} from '../constants/config';
// import {useDispatch} from 'react-redux';
// import {checkuserToken} from '../redux/actions/auth';
// import QualityVerification from "../Pages/QualityVerification'/QualityVerification";
// import {clearAll, getObjByKey} from '../utils/Storage';
// import Login from '../Pages/Login/Login';

// const Stack = createNativeStackNavigator();
// const Drawer = createDrawerNavigator();

// const DrawerNavigator = () => {
//   const [userDetails, setUserDetails] = useState({});
//   const dispatch = useDispatch();

// useEffect(() => {
//   const fetchUserDetails = async () => {
//     const response = await getObjByKey('userDetails');
//     if (response?.data_value?.length) {
//       setUserDetails(response?.data_value[0]); // Assuming data_value is an array
//     }
//   };

//   fetchUserDetails();
// }, []);

//   const handleSignOut = async () => {
//     await clearAll(); // Ensure async handling
//     dispatch(checkuserToken()); // Update auth state
//   };

//   return (
//     <Drawer.Navigator
//       initialRouteName="DashBoard"
// screenOptions={{
//   headerShown: false,
//   drawerStyle: {width: WIDTH},
// }}
// drawerContent={props => (
//   <CustomDrawerContent
//     {...props}
//     userDetails={userDetails}
//     onSignOut={handleSignOut}
//   />
// )}>
// <Drawer.Screen name="DashBoard" component={DashBoard} />
// <Drawer.Screen name="Assign Welder" component={AssignWelder} />
// <Drawer.Screen name="Registration" component={Registration} />
// <Drawer.Screen name="New Job" component={NewJob} />
// <Drawer.Screen name="Job Approval" component={JobApproval} />
// <Drawer.Screen name="RT Report" component={RTReport} />
// <Drawer.Screen name="PAUT-Report" component={PAUTReport} />
// <Drawer.Screen
//   name="Quality Verification"
//   component={QualityVerification}
// />
// <Drawer.Screen name="TPI" component={TPI} />
// <Drawer.Screen name="Final Approval" component={FinalApproval} />
//     </Drawer.Navigator>
//   );
// };

// const HomeStack = () => {
//   return (
//     <Stack.Navigator initialRouteName="Drawer">
//       <Stack.Screen
//         name="Drawer"
//         component={DrawerNavigator}
//         options={{headerShown: false}}
//       />
//       <Stack.Screen
//         name="LoginStack"
//         component={Login}
//         options={{headerShown: false}}
//       />
//     </Stack.Navigator>
//   );
// };

// export default HomeStack;

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../Pages/Home/Home';
import {Icon} from 'react-native-paper';
import {BLACK, DARKGREEN, GREEN, RED, WHITE} from '../constants/color';
import {clearAll, getObjByKey, storeObjByKey} from '../utils/Storage';
import {checkuserToken} from '../redux/actions/auth';
import {useDispatch} from 'react-redux';

import {RFPercentage} from 'react-native-responsive-fontsize';
import {BOLD, REGULAR, SEMIBOLD} from '../constants/fontfamily';
import DashBoard from '../Pages/DashBoard/DashBoard';
import CustomDrawerContent from './CustomDrawerContent';
import {useEffect, useState} from 'react';
import AssignWelder from '../Pages/AssignWelder/AssignWelder';
import Registration from '../Pages/Registratration/Registration';
import NewJob from '../Pages/NewJob/NewJob';
import JobApproval from '../Pages/JobApproval/JobApproval';
import RTReport from '../Pages/RTReport/RTReport';
import PAUTReport from '../Pages/PAUTReport/PAUTReport';
import QualityVerification from "../Pages/QualityVerification'/QualityVerification";
import TPI from '../Pages/TPI/TPI';
import FinalApproval from '../Pages/FinalApproval/FinalApproval';
import {WIDTH} from '../constants/config';
import RTReportUpload from '../Pages/RT-Report-Upload/RTReportUpload';

// Define Stack and Drawer Navigators
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Custom Drawer Content Component

// Stack Navigator for Home and Profile
const HomeStack: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Dashboard">
      <Stack.Screen
        name="Dashboard"
        component={DashBoard}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

// Drawer Navigator Component
const CustomDrawer: React.FC<DrawerContentComponentProps> = ({...props}) => {
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const fetchUserDetails = async () => {
      const response = await getObjByKey('userDetails');
      if (response?.data_value?.length) {
        setUserDetails(response?.data_value[0]); // Assuming data_value is an array
      }
    };
    fetchUserDetails();
  }, []);

  return (
    <>
      <StatusBar translucent={true} barStyle={'dark-content'} />
      <CustomDrawerContent {...props} userDetails={userDetails} />
    </>
  );
};

const MyDrawer: React.FC = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {width: WIDTH},
      }}>
      <Drawer.Screen name="Home" component={HomeStack} />
      <Drawer.Screen name="Assign Welder" component={AssignWelder} />
      <Drawer.Screen name="Registration" component={Registration} />
      <Drawer.Screen name="New Job" component={NewJob} />
      <Drawer.Screen name="Job Approval" component={JobApproval} />
      <Drawer.Screen name="RT Report" component={RTReport} />
      <Drawer.Screen name="PAUT-Report" component={PAUTReport} />
      <Drawer.Screen
        name="Quality Verification"
        component={QualityVerification}
      />
      <Drawer.Screen name="TPI" component={TPI} />
      <Drawer.Screen name="Final Approval" component={FinalApproval} />
      <Drawer.Screen name="RT-Report-Upload" component={RTReportUpload} />
    </Drawer.Navigator>
  );
};

export default MyDrawer;
