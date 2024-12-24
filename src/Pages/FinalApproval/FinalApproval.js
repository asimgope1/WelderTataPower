import {
    View,
    Text,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    TextInput,
} from 'react-native';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { BRAND, RED, WHITE } from '../../constants/color';
import Header from '../../components/Header';
import { HEIGHT, MyStatusBar, WIDTH } from '../../constants/config';
import { appStyles } from '../../styles/AppStyles';
import { GETNETWORK, POSTNETWORK } from '../../utils/Network';
import { BAS_URL } from '../../constants/url';
import { Icon } from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';
import { styles } from '../TPI/TPI';
import { RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const FinalApproval = ({ navigation }) => {
    const [JobList, SetJobList] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state to manage data fetching


    const [filterCriteria, setFilterCriteria] = useState('');

    const [filtermodalVisible, setfilterModalVisible] = useState(false); // State for modal visibility



    const [refreshing, setRefreshing] = useState(false); // Refresh state to manage data refreshing
    const refresh = async () => {
        setRefreshing(true);
        GetJobList();



        setRefreshing(false);
    };





    const handleFilter = (type) => {
        if (type === 'select') {
            setfilterModalVisible(!filtermodalVisible);; // Open the modal when "Select Filter" is tapped
        } else if (type === 'clear') {
            // Handle filter clear action
            setFilterCriteria('')
            setSelectedComponent(null);
            setSelectedArea(null);
            setSelectedHanger(null);
            setSelectedCoil(null)
            setSelectedPanel(null)
            setSelectedRow(null)
            console.log('Filter cleared');
        }
    };



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

    const [welderItems, setwelderItems] = useState([]);
    const [selectedWelder, setSelectedWelder] = useState(null);
    const [welderOpen, setWelderOpen] = useState(false);


    const [elevationItems, setelevationItems] = useState([]);
    const [selectedelevation, setSelectedelevation] = useState(null);
    const [elevationtOpen, setelevationOpen] = useState(false);

    const [wallblowerItems, setwallblowerItems] = useState([]);
    const [selectedwallblower, setSelectedwallblower] = useState(null);
    const [wallblowertOpen, setwallblowerOpen] = useState(false);


    const [panellItems, setpanellItems] = useState([]);
    const [selectedpanell, setSelectedpanell] = useState(null);
    const [panelltOpen, setpanellOpen] = useState(false);


    const [neckItems, setneckItems] = useState([]);
    const [selectedneck, setSelectedneck] = useState(null);
    const [necktOpen, setneckOpen] = useState(false);


    // Fetch data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `${BAS_URL}welding/api/v1/query/filters/`;
                const response = await GETNETWORK(url, true); // Use GETNETWORK instead of fetch

                if (response.status === "success") {
                    // Update state with API data
                    setUnitItems(response.data.unit.map(([id, label]) => ({ label, value: id })));
                    setComponentItems(response.data.components.map((component) => ({ label: component, value: component })));
                    setAreaItems(response.data.areas.map((area) => ({ label: area, value: area })));
                    setHangerItems(response.data.hangers.map((hanger) => ({ label: hanger, value: hanger })));
                    setCoilItems(response.data.coil_number.map((coil) => ({ label: coil, value: coil })));
                    setPanelItems(response.data.panel_number.map((panel) => ({ label: panel, value: panel })));
                    setRowItems(response.data.row_number.map((row) => ({ label: row, value: row })));
                    setTubeItems(response.data.tube_number.map((tube) => ({ label: tube, value: tube })));
                    setJointItems(response.data.joint_number.map((joint) => ({ label: joint, value: joint })));
                    setelevationItems(response.data.elevation.map((elevation) => ({ label: elevation, value: elevation })));
                    setwallblowerItems(response.data.wall_blower.map((wallblower) => ({ label: wallblower, value: wallblower })));

                    // Panel and Neck items
                    setpanellItems((response.data.panel || []).map((panel) => ({ label: panel, value: panel })));
                    setneckItems((response.data.neck || []).map((neck) => ({ label: neck, value: neck })));
                } else {
                    console.log("Error fetching data:", response.message);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);




    const handleApproval = async (item) => {
        console.log('i m here', item)
        const payload = {
            "sl": item.sl,  // Use the jobsl from the selected item
            "approved_status": "Approved"
        };
        console.log('payload', payload)

        // The API endpoint URL
        const url = `${BAS_URL}welding/api/v1/finalapproval/`;

        try {
            // Make the POST request using POSTNETWORK
            const response = await POSTNETWORK(url, payload, true); // Assuming `true` for token if it's needed

            console.log('Cancel Result:', response);

            if (response.status === 'success') {
                // Handle a successful cancellation
                GetJobList();
                alert('Job successfully Approved');
                // Optionally, refresh the job list to update the UI
                // GetJobList();
            } else {
                alert('Failed to Approved the job');
            }
        } catch (error) {
            console.error('Cancel Error:', error);
            alert('An error occurred while Approving the job');
        }
    };

    const handleCancel = async (item) => {
        // The payload for the cancel request
        const payload = {
            "sl": item.sl,  // Use the jobsl from the selected item
            "approved_status": "Cancelled"
        };

        // The API endpoint URL
        const url = `${BAS_URL}welding/api/v1/finalapproval/`;

        try {
            // Make the POST request using POSTNETWORK
            const response = await POSTNETWORK(url, payload, true); // Assuming `true` for token if it's needed

            console.log('Cancel Result:', response);

            if (response.status === 'success') {
                // Handle a successful cancellation
                GetJobList();
                alert('Job successfully cancelled');
                // Optionally, refresh the job list to update the UI
                // GetJobList();
            } else {
                alert('Failed to cancel the job');
            }
        } catch (error) {
            console.error('Cancel Error:', error);
            alert('An error occurred while cancelling the job');
        }
    };




    const GetJobList = async () => {
        const url = `${BAS_URL}welding/api/v1/finalapproval-list/`;
        setLoading(true); // Start loading
        try {
            const response = await GETNETWORK(url, true);
            if (response.status === 'success') {
                console.log('FinalApproval', response.data);
                SetJobList(response.data);
            } else {
                console.log('Error:', response.message);
            }
        } catch (error) {
            console.error('Network Error:', error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    useFocusEffect(


        useCallback(() => {
            GetJobList();

            setFilterCriteria('')
            setSelectedUnit(null)
            setSelectedComponent(null);
            setSelectedArea(null);
            setSelectedHanger(null);
            setSelectedCoil(null)
            setSelectedPanel(null)
            setSelectedRow(null)
            setSelectedTube(null)
            setSelectedJoint(null)
            setSelectedWelder(null)



            // If you need to clean up when the screen loses focus, return a cleanup function
            return () => {
                // cleanup code (if needed)
            };
        }, [navigation]) // dependencies of the useCallback
    );

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                disabled={true}
                style={{
                    backgroundColor: '#f9f9f9',
                    borderRadius: 8,
                    padding: 15,
                    marginVertical: 8,
                    marginHorizontal: 10,
                    borderWidth: 1,
                    borderColor: '#ddd',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                    elevation: 2,
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    {/* Icon Section */}
                    <Icon
                        name={'task'}
                        type='material'
                        color={'#555'}
                        size={28}
                        containerStyle={{ marginRight: 15 }}
                    />

                    {/* Job Description Section */}
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 }}>
                            Job Number: {item.job_number}
                        </Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 }}>
                            Component Name: {item.component_name}
                        </Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 }}>
                            Unit Number: {item.unit_number}
                        </Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 }}>
                            Tube Joints: {item.tube_joints}
                        </Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 }}>
                            Job Description Number: {item.job_desc_number}
                        </Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 }}>
                            Job Offer Date: {item.job_offer_date}
                        </Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 }}>
                            Defect Name: {item.defect_name}
                        </Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 }}>
                            Job Status: {item.job_status}
                        </Text>


                    </View>
                </View>

                {/* Buttons Section */}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginTop: 15,
                    borderTopWidth: 1,
                    borderTopColor: '#e0e0e0',
                    paddingTop: 10,
                }}>
                    {/* Approve Button */}
                    <TouchableOpacity
                        style={{
                            backgroundColor: 'green',
                            paddingVertical: 10,
                            paddingHorizontal: 25,
                            borderRadius: 5,
                        }}
                        onPress={() => handleApproval(item)}
                    >
                        <Text style={styless.buttonText}>Approve</Text>
                    </TouchableOpacity>

                    {/* Cancel Button */}
                    <TouchableOpacity
                        style={{
                            backgroundColor: 'red',
                            paddingVertical: 10,
                            paddingHorizontal: 25,
                            borderRadius: 5,
                        }}
                        onPress={() => handleCancel(item)}
                    >
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <Fragment>
            <MyStatusBar backgroundColor={BRAND} barStyle={'light-content'} />
            <SafeAreaView style={appStyles.safeareacontainer}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        keyboardShouldPersistTaps={'handled'}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            flexGrow: 1,
                            paddingBottom: 20,
                        }}
                        scrollEnabled={false}
                    >
                        <Header
                            onMenuPress={() => navigation.toggleDrawer()}
                            title="Final-Approval"
                        // onAddPress={() => navigation.navigate('AddJob')}
                        />

                        <View style={{ width: '100%', zIndex: 1000 }}>
                            {loading ? (
                                <ActivityIndicator size="large" color={BRAND} />
                            ) : (
                                <>
                                    <View style={styles.filterContainer}>
                                        {/* Left side content, 70% width */}
                                        <View style={styles.leftContent}>
                                            {/* <TouchableOpacity style={styles.filterButton}> */}
                                            <TextInput
                                                style={styles.filterTextInput}
                                                placeholder="Enter Filter Criteria"
                                                placeholderTextColor="#888"
                                                value={filterCriteria}
                                                editable={false}
                                                multiline
                                            // onChangeText={(text) => setFilterCriteria(text)}
                                            />
                                            {/* </TouchableOpacity> */}
                                        </View>

                                        {/* Right side buttons, 30% width */}
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
                                    </View>

                                    <View
                                        style={{
                                            height: HEIGHT * 0.8,
                                            width: WIDTH,
                                            alignSelf: 'center',

                                        }}
                                    >

                                        <FlatList

                                            refreshControl={
                                                <RefreshControl
                                                    refreshing={refreshing}
                                                    onRefresh={refresh}
                                                />

                                            }
                                            data={JobList}
                                            renderItem={renderItem}
                                            keyExtractor={(item, index) => index.toString()}
                                            contentContainerStyle={{ paddingTop: 10 }}
                                            ListFooterComponent={
                                                <View style={{ height: HEIGHT * 0.05 }} />
                                            }
                                        />
                                    </View>
                                </>
                            )}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>

            <Modal
                visible={filtermodalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setfilterModalVisible(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalContainer}>

                        <ScrollView contentContainerStyle={styles.modalContainer} >
                            <Text style={styles.modalTitle}>Filter</Text>




                            <DropDownPicker
                                searchable={true}
                                open={unitOpen}
                                value={selectedUnit}
                                items={unitItems}
                                setOpen={setUnitOpen}
                                setValue={setSelectedUnit}
                                setItems={setUnitItems}
                                placeholder="Select Unit"
                                style={{ ...styles.dropdown, zIndex: 1200 }}
                                dropDownContainerStyle={styles.dropdownContainer}
                            />



                            <DropDownPicker
                                searchable={true}
                                open={componentOpen}
                                value={selectedComponent}
                                items={componentItems}
                                setOpen={setComponentOpen}
                                setValue={setSelectedComponent}
                                setItems={setComponentItems}
                                placeholder="Select Component"
                                style={{ ...styles.dropdown, zIndex: 1100 }}
                                dropDownContainerStyle={styles.dropdownContainer}
                            />

                            {/* Area Dropdown */}
                            <DropDownPicker
                                searchable={true}
                                open={areaOpen}
                                value={selectedArea}
                                items={areaItems}
                                setOpen={setAreaOpen}
                                setValue={setSelectedArea}
                                setItems={setAreaItems}
                                placeholder="Select Area"
                                style={{ ...styles.dropdown, zIndex: 1000 }}
                                dropDownContainerStyle={styles.dropdownContainer}
                            />

                            {/* Hanger Dropdown */}
                            <DropDownPicker
                                searchable={true}
                                open={hangerOpen}
                                value={selectedHanger}
                                items={hangerItems}
                                setOpen={setHangerOpen}
                                setValue={setSelectedHanger}
                                setItems={setHangerItems}
                                placeholder="Select Hanger"
                                style={{ ...styles.dropdown, zIndex: 900 }}
                                dropDownContainerStyle={styles.dropdownContainer}
                            />
                            <DropDownPicker
                                searchable={true}
                                open={coilOpen}
                                value={selectedCoil}
                                items={coilItems}
                                setOpen={setCoilOpen}
                                setValue={setSelectedCoil}
                                setItems={setCoilItems}
                                placeholder="Select Coil"
                                style={{ ...styles.dropdown, zIndex: 800 }}
                                dropDownContainerStyle={styles.dropdownContainer}
                            />
                            <DropDownPicker
                                searchable={true}
                                open={panelOpen}
                                value={selectedPanel}
                                items={panelItems}
                                setOpen={setPanelOpen}
                                setValue={setSelectedPanel}
                                setItems={setPanelItems}
                                placeholder="Select Panel"
                                style={{ ...styles.dropdown, zIndex: 700 }}
                                dropDownContainerStyle={styles.dropdownContainer}
                            />
                            <DropDownPicker
                                searchable={true}
                                open={rowOpen}
                                value={selectedRow}
                                items={rowItems}
                                setOpen={setRowOpen}
                                setValue={setSelectedRow}
                                setItems={setRowItems}
                                placeholder="Select Row"
                                style={{ ...styles.dropdown, zIndex: 600 }}
                                dropDownContainerStyle={styles.dropdownContainer}
                            />

                            <DropDownPicker
                                searchable={true}
                                open={tubeOpen}
                                value={selectedTube}
                                items={tubeItems}
                                setOpen={setTubeOpen}
                                setValue={setSelectedTube}
                                setItems={setTubeItems}
                                placeholder="Select Tube"
                                style={{ ...styles.dropdown, zIndex: 500 }}
                                dropDownContainerStyle={styles.dropdownContainer}
                            />
                            <DropDownPicker
                                searchable={true}
                                open={jointOpen}
                                value={selectedJoint}
                                items={jointItems}
                                setOpen={setJointOpen}
                                setValue={setSelectedJoint}
                                setItems={setJointItems}
                                placeholder="Select Joint"
                                style={{ ...styles.dropdown, zIndex: 400 }}
                                dropDownContainerStyle={styles.dropdownContainer}
                            />
                            <DropDownPicker
                                searchable={true}
                                open={welderOpen}
                                value={selectedWelder}
                                items={welderItems}
                                setOpen={setWelderOpen}
                                setValue={setSelectedWelder}
                                setItems={setwelderItems}
                                placeholder="Select welder"
                                style={{ ...styles.dropdown, zIndex: 300 }}
                                dropDownContainerStyle={styles.dropdownContainer}
                            />


                            <Text style={styles.dropdownHeader}>Elevation</Text>
                            <DropDownPicker
                                searchable={true}
                                open={elevationtOpen}
                                value={selectedelevation} // Should correspond to 'elevation_number'
                                items={elevationItems} // Ensure elevationItems has a correct structure
                                setOpen={setelevationOpen}
                                setValue={setSelectedelevation}
                                setItems={setelevationItems}
                                placeholder="Select Elevation" // Placeholder corrected
                                style={{ ...styles.dropdown, zIndex: 350 }}
                                dropDownContainerStyle={styles.dropdownContainer}
                            />
                            <Text style={styles.dropdownHeader}>WallBlower</Text>
                            <DropDownPicker
                                searchable={true}
                                open={wallblowertOpen}
                                value={selectedwallblower} // Should correspond to 'wallblower_number'
                                items={wallblowerItems} // Ensure wallblowerItems has a correct structure
                                setOpen={
                                    setwallblowerOpen
                                }
                                setValue={setSelectedwallblower}
                                setItems={setwallblowerItems}



                                placeholder="Select WallBlower" // Placeholder corrected
                                style={{ ...styles.dropdown, zIndex: 300 }}
                                dropDownContainerStyle={styles.dropdownContainer}
                            />
                            <Text style={styles.dropdownHeader}>Panel</Text>
                            <DropDownPicker
                                searchable={true}
                                open={panelltOpen}
                                value={selectedpanell} // Should correspond to 'panell_number'
                                items={panellItems} // Ensure panellItems has a correct structure
                                setOpen={
                                    setpanellOpen
                                }
                                setValue={setSelectedpanell}
                                setItems={setpanellItems}



                                placeholder="Select Panel" // Placeholder corrected
                                style={{ ...styles.dropdown, zIndex: 250 }}
                                dropDownContainerStyle={styles.dropdownContainer}
                            />
                            <Text style={styles.dropdownHeader}>Neck</Text>
                            <DropDownPicker
                                searchable={true}
                                open={necktOpen}
                                value={selectedneck} // Should correspond to 'neck_number'
                                items={neckItems} // Ensure neckItems has a correct structure
                                setOpen={
                                    setneckOpen
                                }
                                setValue={setSelectedneck}
                                setItems={setneckItems}



                                placeholder="Select Neck" // Placeholder corrected
                                style={{ ...styles.dropdown, zIndex: 350 }}
                                dropDownContainerStyle={styles.dropdownContainer}
                            />

                            {/* Buttons */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    width: '100%',
                                    justifyContent: 'space-evenly',
                                }}
                            >


                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        style={[styles.actionButton, styles.cancelButton]}
                                        onPress={() => setfilterModalVisible(false)}
                                    >
                                        <Text style={styles.buttonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        style={[styles.actionButton, styles.submitButton]}
                                        onPress={() => {
                                            const criteria = [
                                                selectedComponent,
                                                selectedArea,
                                                selectedHanger,
                                                selectedCoil,
                                                selectedPanel,
                                                selectedRow,
                                            ]
                                                .filter(Boolean) // Remove any null or undefined values
                                                .join(', '); // Join them with a comma for better readability

                                            setFilterCriteria(criteria); // Set the concatenated string
                                            setfilterModalVisible(false);
                                        }}

                                    >
                                        <Text style={styles.buttonText}>Submit</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </Fragment>
    );
};

export default FinalApproval;

const styless = {
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    cardDate: {
        fontSize: 12,
        color: '#888',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        textAlign: 'center',
    },
};
