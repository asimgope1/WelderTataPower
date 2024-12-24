import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { BLACK, BRAND, WHITE } from '../constants/color';
import { HEIGHT, WIDTH } from '../constants/config';
import { BOLD, REGULAR, SEMIBOLD } from '../constants/fontfamily';
import { RFValue } from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { getObjByKey } from '../utils/Storage';
import { BAS_URL } from '../constants/url';
import { GETNETWORK } from '../utils/Network';
import { checkuserToken } from '../redux/actions/auth';

// Define a larger set of colors for unique coloring of each item
const colors = [
    '#007AFF',  // Blue
    '#FCBE03',  // Pale Yellow
    '#FC6603',  // Orange
    '#34C759',  // Green
    '#FF3B30',  // Red
    '#5856D6',  // Purple
    '#FF9500',  // Amber
    '#AF52DE',  // Violet
    '#FF2D55',  // Pink
];

// Menu items
const menuItems = [
    { name: 'Registration', icon: 'receipt', label: 'Registration', requiredPermission: 'add_tpuser' },
    { name: 'New Job', icon: 'new-label', label: 'New Job', requiredPermission: 'add_jobmaster' },
    { name: 'Job Approval', icon: 'thumb-up', label: 'Job Approval', requiredPermission: 'job_approval' },
    { name: 'Assign Welder', icon: 'work', label: 'Assign Welder', requiredPermission: 'user_role_management' },
    { name: 'RT Report', icon: 'menu-book', label: 'RT Report', requiredPermission: 'rt_report_entry' },
    { name: 'PAUT-Report', icon: 'menu-book', label: 'PAUT Report', requiredPermission: 'paut_report_entry' },
    { name: 'Quality Verification', icon: 'check-circle-outline', label: 'Q-Verification', requiredPermission: 'contractor_quality_verification' },
    { name: 'TPI', icon: 'report-gmailerrorred', label: 'TPI-Verification', requiredPermission: 'tpi_quality_engineer_verification' },
    { name: 'Final Approval', icon: 'thumbs-up-down', label: 'Final Approval', requiredPermission: 'final_approval' },
];





const CustomDrawerContent = (props) => {
    const { navigation } = props;
    const dispatch = useDispatch();
    const [user, setUser] = React.useState({});
    const [permissions, setPermissions] = React.useState([]);


    useEffect(() => {
        GetPermissions();
        fetchProfileData();
    }, []);

    const GetPermissions = async () => {
        const Permissions = await getObjByKey('loginResponse');
        if (Permissions && Permissions.permissions) {
            setPermissions(Permissions.permissions); // Store permissions in state
        }
        console.log('Permissions', Permissions);
    };




    const fetchProfileData = async () => {
        try {
            // Fetch profile data using GETNETWORK
            const result = await GETNETWORK(
                `${BAS_URL}api/v1/profile/`,
                true // `true` indicates that the Authorization token is required
            );

            // Check if the result is successful
            if (result.status === 'success') {
                // Extract the profile data
                const { address, company_name, email, full_name, phone, role } = result.data;

                // Store data in variables
                const profileData = {
                    address: address,
                    companyName: company_name,
                    email: email,
                    fullName: full_name,
                    phone: phone,
                    role: role
                };
                setUser(profileData);

                // Log the profile data (or you can use these variables wherever needed)
                console.log("Profile Data Variables:", profileData);

                // You can now use these variables in your component or state
                // Example: setState(profileData) if using React state
            } else {
                console.error("Error fetching profile data:", result.message);
            }
        } catch (error) {
            console.error("Error fetching profile data:", error);
        }
    };

    // Call the function to fetch profile data



    // Call the function to fetch the profile data

    const filteredMenuItems = menuItems.filter(item =>
        !item.requiredPermission || permissions.includes(item.requiredPermission)
    );


    const handleLogout = async () => {
        await AsyncStorage.clear();
        navigation.navigate('LoginStack');
        // dispatch(checkuserToken())
        alert('Logout Successfully. Please reload the app to log in again.');
    };

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
            {/* Header Section */}


            {/* Profile Section */}
            <View style={styles.profileContainer}>
                <Image
                    source={{ uri: 'https://via.placeholder.com/100' }} // Placeholder image URL for profile picture
                    style={styles.profileImage}
                />
                <View style={styles.profileDetails}>
                    <Text style={styles.profileName}>{
                        user.fullName}</Text>
                    <Text style={styles.profileDepartment}>{user.role}</Text>
                    <Text style={styles.profileEmail}>{user.email}</Text>
                </View>
            </View>

            {/* Menu Section */}
            <View style={styles.gridContainer}>
                {filteredMenuItems.map((item, index) => (
                    <View key={index} style={styles.menuItemContainer}>
                        <TouchableOpacity
                            style={[
                                styles.menuItem,
                                { backgroundColor: colors[index % colors.length] },
                            ]}
                            onPress={() => navigation.navigate(item.name)}
                        >
                            <View style={styles.iconContainer}>
                                <Icon name={item.icon} size={45} color={WHITE} />
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.label}>{item.label}</Text>
                    </View>
                ))}
            </View>


            {/* Navigation Buttons Section */}
            <View style={styles.navigationButtonsContainer}>
                <TouchableOpacity
                    style={[styles.navigationButton, styles.homeButton]}
                    onPress={() => {
                        navigation.toggleDrawer();
                        navigation.navigate('DashBoard');
                    }}
                >
                    <Text style={styles.navigationButtonText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.navigationButton, styles.logoutButton]}
                    onPress={handleLogout}
                >
                    <Text style={styles.navigationButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>

            {/* Footer Section */}
            <View style={styles.footerContainer}>
                <Text style={styles.footerText}>© 2024 Tata Power. All rights reserved.</Text>
            </View>
        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    drawerContainer: {
        flexGrow: 1,
        backgroundColor: WHITE,
        paddingVertical: HEIGHT * 0.02,
    },
    // Header styles
    headerContainer: {
        backgroundColor: BRAND,
        paddingVertical: HEIGHT * 0.015,
        paddingHorizontal: WIDTH * 0.05,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: RFValue(17),
        fontFamily: BOLD,
        color: WHITE,
    },
    // Profile styles
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: WIDTH * 0.05,
        backgroundColor: WHITE,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    profileImage: {
        width: RFValue(60),
        height: RFValue(60),
        borderRadius: 30,
        marginRight: WIDTH * 0.05,
        backgroundColor: '#ddd',
    },
    profileDetails: {
        flex: 1,
    },
    profileName: {
        fontSize: RFValue(16),
        fontFamily: BOLD,
        color: BLACK,
    },
    profileDepartment: {
        fontSize: RFValue(12),
        color: '#666',
        fontFamily: REGULAR,
        marginTop: 5,
    },
    profileEmail: {
        fontSize: RFValue(10),
        color: '#999',
        fontFamily: SEMIBOLD,
        marginTop: 5,
    },
    // Menu styles
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingVertical: HEIGHT * 0.02,
    },
    menuItemContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: WIDTH * 0.28,
        margin: 10,
    },
    menuItem: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: HEIGHT * 0.12,
        borderRadius: 15,
        margin: 5,
        opacity: 0.95,
    },
    iconContainer: {
        marginBottom: 8,
    },
    label: {
        color: BLACK,
        fontSize: RFValue(12),
        fontWeight: '800',
        textAlign: 'center',
        marginTop: 5,
    },
    // Navigation buttons
    navigationButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: HEIGHT * 0.025,
        paddingHorizontal: WIDTH * 0.05,
    },
    navigationButton: {
        flex: 1,
        height: HEIGHT * 0.06,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        marginHorizontal: WIDTH * 0.02,
    },
    homeButton: {
        backgroundColor: '#34C759',
    },
    logoutButton: {
        backgroundColor: '#FF3B30',
    },
    navigationButtonText: {
        color: WHITE,
        fontSize: RFValue(14),
        fontFamily: BOLD,
    },
    // Footer styles
    footerContainer: {
        width: '100%',
        padding: HEIGHT * 0.02,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: '#f9f9f9',
    },
    footerText: {
        fontSize: RFValue(10),
        color: '#888',
        fontFamily: BOLD,
    },
});

export default CustomDrawerContent;
