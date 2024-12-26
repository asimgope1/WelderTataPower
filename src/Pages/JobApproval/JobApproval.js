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
    Alert,
    RefreshControl,
    TextInput,
    StyleSheet,
    Modal,
} from 'react-native';
import React, { Fragment, useEffect, useState } from 'react';
import { BRAND, RED, WHITE } from '../../constants/color';
import Header from '../../components/Header';
import { HEIGHT, MyStatusBar, WIDTH } from '../../constants/config';
import { appStyles } from '../../styles/AppStyles';
import { GETNETWORK, POSTNETWORK } from '../../utils/Network';
import { BAS_URL } from '../../constants/url';
import { CheckBox, Icon } from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';

const JobApproval = ({ navigation }) => {
    const [JobList, SetJobList] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state to manage data fetching
    const [refreshing, setRefreshing] = useState(false); // Refresh state to manage data refreshing
    const refresh = async () => {
        setRefreshing(true);
        await GetJobList();
        setRefreshing(false);
    };
    const [filterCriteria, setFilterCriteria] = useState({});
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

    const [selectedJobs, setSelectedJobs] = useState([]);
    const [selectAll, setSelectAll] = useState(false);









    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `${BAS_URL}welding/api/v1/query/filters/`;
                const response = await GETNETWORK(url, true); // Use GETNETWORK instead of fetch
                console.log('object response', response)

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





    const handleApproveAll = async () => {
        if (selectedJobs.length > 0) {
            // Extract jobsl from selectedJobs
            const jobslArray = selectedJobs.map((jobId) => {
                const job = JobList.find((job) => job.jobsl === jobId);
                return job ? job.jobsl : null; // Ensure no null values are included
            }).filter(Boolean); // Remove nulls

            console.log("Jobs to approve:", jobslArray); // Logs the selected job IDs

            // Prepare payload
            const payload = {
                jobsl: jobslArray,
                approved_status: "Approved"
            };

            try {
                // Call API using POSTNETWORK
                const response = await POSTNETWORK(
                    `${BAS_URL}/welding/job/update-job/`,
                    payload,
                    true // Token is required
                );

                if (response.status === 'success') {
                    console.log("API Response:", response);
                    GetJobList();
                    setSelectAll(false)
                    alert('Job successfully Approved');
                    alert("All selected jobs approved successfully.");
                } else {
                    GetJobList();
                    setSelectAll(false)
                    alert("Failed to approve selected jobs. Please try again.");
                }
            } catch (error) {
                console.error("API Error:", error);
                alert("An error occurred while approving selected jobs.");
            }
        } else {
            alert("No jobs selected for approval.");
        }
    };
    const handleCancelAll = async () => {
        if (selectedJobs.length > 0) {
            // Extract jobsl from selectedJobs
            const jobslArray = selectedJobs.map((jobId) => {
                const job = JobList.find((job) => job.jobsl === jobId);
                return job ? job.jobsl : null; // Ensure no null values are included
            }).filter(Boolean); // Remove nulls

            console.log("Jobs to Cancel:", jobslArray); // Logs the selected job IDs

            // Prepare payload
            const payload = {
                jobsl: jobslArray,
                approved_status: "Cancelled"
            };

            try {
                // Call API using POSTNETWORK
                const response = await POSTNETWORK(
                    `${BAS_URL}/welding/job/update-job/`,
                    payload,
                    true // Token is required
                );

                if (response.status === 'success') {
                    console.log("API Response:", response);
                    GetJobList();
                    setSelectAll(false)
                    alert('Job successfully Cancel');
                    alert("All selected jobs Cancelled successfully.");
                } else {
                    GetJobList();
                    setSelectAll(false)
                    alert("Failed to Cancel selected jobs. Please try again.");
                }
            } catch (error) {
                console.error("API Error:", error);
                alert("An error occurred while Cancelling selected jobs.");
            }
        } else {
            alert("No jobs selected for Cancel.");
        }
    };


    const handleFilter = (type) => {
        if (type === 'select') {
            setfilterModalVisible(!filtermodalVisible);; // Open the modal when "Select Filter" is tapped
            fetchData()
        } else if (type === 'clear') {
            // Handle filter clear action
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




            GetJobList()
            console.log('Filter cleared');
        }
    };

    const handleApproval = async (item) => {
        // Show confirmation alert before proceeding with the approval
        Alert.alert(
            'Confirm Approval', // Title of the alert
            'Are you sure you want to approve this job?', // Message to display
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Approve',
                    onPress: async () => {
                        const payload = {
                            jobsl: item.jobsl,  // Use the jobsl from the selected item
                            approved_status: 'Approved',
                        };

                        // The API endpoint URL
                        const url = `${BAS_URL}welding/jobmaster/update-job/`;

                        try {
                            // Make the POST request using POSTNETWORK
                            const response = await POSTNETWORK(url, payload, true); // Assuming `true` for token if it's needed

                            console.log('Approval Result:', response);

                            if (response.status === 'success') {
                                // Handle a successful approval
                                GetJobList();
                                alert('Job successfully Approved');
                                // Optionally, refresh the job list to update the UI
                            } else {
                                alert('Failed to approve the job');
                            }
                        } catch (error) {
                            console.error('Approval Error:', error);
                            alert('An error occurred while approving the job');
                        }
                    },
                },
            ],
            { cancelable: true } // Allow the user to dismiss the alert without making a choice
        );
    };

    const handleCancel = async (item) => {
        // Show confirmation alert before proceeding with the cancellation
        Alert.alert(
            'Confirm Cancellation', // Title of the alert
            'Are you sure you want to cancel this job?', // Message to display
            [
                {
                    text: 'No', // Button text
                    style: 'cancel', // Button style, does nothing when pressed
                },
                {
                    text: 'Yes, Cancel',
                    onPress: async () => {
                        const payload = {
                            jobsl: item.jobsl,  // Use the jobsl from the selected item
                            approved_status: 'Cancelled',
                        };

                        // The API endpoint URL
                        const url = `${BAS_URL}welding/jobmaster/update-job/`;

                        try {
                            // Make the POST request using POSTNETWORK
                            const response = await POSTNETWORK(url, payload, true); // Assuming `true` for token if it's needed

                            console.log('Cancel Result:', response);

                            if (response.status === 'success') {
                                // Handle a successful cancellation
                                GetJobList();
                                alert('Job successfully cancelled');
                                // Optionally, refresh the job list to update the UI
                            } else {
                                alert('Failed to cancel the job');
                            }
                        } catch (error) {
                            console.error('Cancel Error:', error);
                            alert('An error occurred while cancelling the job');
                        }
                    },
                },
            ],
            { cancelable: true } // Allow the user to dismiss the alert without making a choice
        );
    };

    useEffect(() => {
        GetJobList();
    }, [navigation]);



    const fetchData = async (params = {}) => {
        // Do not call the API if no parameters are provided
        if (Object.keys(params).length === 0) {
            console.log("No parameters provided. Skipping API call.");
            SetJobList([]); // Reset job list
            return;
        }

        setLoading(true);

        // Base URL
        const url = `${BAS_URL}welding/jobmaster/joblist/`;

        // Construct query string
        const queryString = `?${new URLSearchParams(params).toString()}`;
        const finalUrl = `${url}${queryString}`;
        console.log("Final URL:", finalUrl); // Debug URL

        try {
            const response = await GETNETWORK(finalUrl, true); // Make API call

            if (response.status === 'success') {
                if (response.data && response.data.length > 0) {
                    // Populate the job list with fetched data
                    SetJobList(response.data);
                    console.log('joblist', response);
                } else {
                    // No data returned; set JobList to empty array
                    SetJobList([]);
                    console.log('No data available for the selected query parameters.');
                }
            } else {
                // API responded with an error
                SetJobList([]); // Reset job list
                console.log('Error:', response.message);
            }
        } catch (error) {
            // Handle fetch error
            SetJobList([]); // Reset job list
            console.error('Fetch Error:', error);
        } finally {
            setLoading(false); // Always reset loading state
        }
    };




    useEffect(() => {

        fetchData();
    }, []);

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

    const GetJobList = async () => {
        const url = `${BAS_URL}welding/jobmaster/joblist/`;
        setLoading(true); // Start loading
        try {
            const response = await GETNETWORK(url, true);
            if (response.status === 'success') {
                console.log('JobApproval', response.data);
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


    const toggleSelectAll = () => {
        if (selectAll) {
            // Unselect all
            setSelectedJobs([]);
        } else {
            // Select all
            const allJobs = JobList.map((job) => job.jobsl);
            setSelectedJobs(allJobs);
            console.log("All jobs selected:", allJobs);
        }
        setSelectAll(!selectAll);
    };

    const toggleJobSelection = (jobId) => {
        if (selectedJobs.includes(jobId)) {
            // Remove the job from selectedJobs
            const updatedJobs = selectedJobs.filter((id) => id !== jobId);
            setSelectedJobs(updatedJobs);
            console.log("Job deselected:", jobId);
        } else {
            // Add the job to selectedJobs
            const updatedJobs = [...selectedJobs, jobId];
            setSelectedJobs(updatedJobs);
            console.log("Job selected:", jobId);
        }
    };

    const renderItem = ({ item }) => {
        const isSelected = selectedJobs.includes(item.jobsl);
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
                    borderLeftColor: 'orange',
                    borderLeftWidth: 4,
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    {/* Checkbox */}
                    <CheckBox
                        checked={isSelected}
                        onPress={() => toggleJobSelection(item.jobsl)}
                        style={{ marginRight: 10 }}
                    />

                    {/* Job Description Section */}
                    <View style={{ flex: 1 }}>
                        <Text style={styless.cardTitle}>Job Number: {item.job_number}</Text>
                        <Text style={styless.cardTitle}>Component Name: {item.component_name}</Text>
                        <Text style={styless.cardTitle}>Unit Number: {item.unit_number}</Text>
                        <Text style={styless.cardTitle}>Tube Joints: {item.tube_joints}</Text>
                        <Text style={styless.cardTitle}>Job Description Number: {item.job_desc_number}</Text>
                        <Text style={styless.cardTitle}>Job Date: {item.job_offer_date}</Text>
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

                    <TouchableOpacity
                        style={{
                            backgroundColor: 'red',
                            paddingVertical: 10,
                            paddingHorizontal: 25,
                            borderRadius: 5,
                        }}
                        onPress={() => handleCancel(item)}
                    >
                        <Text style={styless.buttonText}>Cancel</Text>
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
                            title="Job-Approval"
                        />

                        <View style={{ width: '100%', zIndex: 1000 }}>
                            {loading ? (
                                <ActivityIndicator size="large" color={BRAND} />
                            ) : (
                                <>
                                    <View style={styles.filterContainer}>
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

                                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, justifyContent: 'space-between' }}>

                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}
                                            >

                                                <CheckBox
                                                    checked={selectAll}
                                                    onPress={toggleSelectAll}
                                                    style={{ marginRight: 10 }}
                                                />
                                                <Text style={{ fontSize: 13 }}>Select All</Text>
                                            </View>

                                            {/* {selectAll == true && */}
                                            <>

                                                <TouchableOpacity
                                                    style={{
                                                        backgroundColor: 'blue',
                                                        paddingVertical: 12,
                                                        paddingHorizontal: 15,
                                                        borderRadius: 5,
                                                        marginBottom: 10,
                                                        alignItems: 'center',
                                                    }}
                                                    onPress={handleApproveAll}
                                                >
                                                    {selectAll == true ? <Text style={{ color: 'white', fontSize: 13, fontWeight: 'bold' }}>Approve All</Text> : <Text style={{ color: 'white', fontSize: 13, fontWeight: 'bold' }}>Approve selected</Text>}
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={{
                                                        backgroundColor: 'red',
                                                        paddingVertical: 12,
                                                        paddingHorizontal: 15,
                                                        borderRadius: 5,
                                                        marginBottom: 10,
                                                        alignItems: 'center',
                                                    }}
                                                    onPress={handleCancelAll}
                                                >
                                                    {selectAll == true ? <Text style={{ color: 'white', fontSize: 13, fontWeight: 'bold' }}>Cancel All</Text> :
                                                        <Text style={{ color: 'white', fontSize: 13, fontWeight: 'bold' }}>Cancel selected</Text>}
                                                </TouchableOpacity>
                                            </>

                                            {/* } */}
                                        </View>

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

                                            ListEmptyComponent={
                                                <View style={{
                                                    flex: 1, justifyContent: 'center', alignItems: 'center'
                                                }}>
                                                    <Text>No Jobs Available</Text>
                                                </View>
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
                            style={{ ...styles.dropdown, zIndex: 1200 }}
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
                            style={{ ...styles.dropdown, zIndex: 1100 }}
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
                            style={{ ...styles.dropdown, zIndex: 1000 }}
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
                            style={{ ...styles.dropdown, zIndex: 900 }}
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
                            style={{ ...styles.dropdown, zIndex: 800 }}
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
                            style={{ ...styles.dropdown, zIndex: 700 }}
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
                            style={{ ...styles.dropdown, zIndex: 600 }}
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
                            style={{ ...styles.dropdown, zIndex: 500 }}
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
                            style={{ ...styles.dropdown, zIndex: 400 }}
                            dropDownContainerStyle={styles.dropdownContainer}
                        />

                        {/* Welder Dropdown */}

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
                                            selectedpanell,
                                            selectedelevation,
                                            selectedwallblower,
                                            selectedneck,

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
                                            panel: selectedpanell || undefined,
                                            elevation: selectedelevation || undefined,
                                            wall_blower: selectedwallblower || undefined,
                                            neck: selectedneck || undefined,
                                        };

                                        // Remove any keys with undefined values
                                        const filteredParams = Object.fromEntries(
                                            Object.entries(queryParams).filter(([_, v]) => v != null)
                                        );

                                        console.log("Filtered Params:", filteredParams); // Debugging filtered params

                                        // Call fetchData with filtered query params
                                        fetchData(filteredParams);

                                        setfilterModalVisible(false); // Close the modal
                                    }}
                                >
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

export default JobApproval;

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        // flex: 1,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        alignSelf: 'center'
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    inputContainer: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
        marginBottom: 5,
    },
    textInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    buttonContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    actionButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    cancelButton: {
        backgroundColor: '#FF3B30',
    },
    submitButton: {
        backgroundColor: '#4CAF50',  // Green
    },

    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center',
    },
    filterContainer: {
        width: '100%',
        height: HEIGHT * 0.07,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    // Left content (70% width)
    leftContent: {
        flex: 0.7,
        justifyContent: 'center',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterTextInput: {
        width: '95%', // Full width inside the TouchableOpacity
        padding: 10,
        fontSize: 16,
        color: '#333', // Text color
        backgroundColor: '#F0F0F0', // Light background color for input
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    filterText: {
        fontSize: 14,
        color: '#555',
        marginLeft: 10,
    },
    // Right side buttons (30% width)
    rightButtons: {
        flex: 0.3,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    // Select Filter button
    selectButton: {
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
        marginRight: 5,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearButton: {
        padding: 10,
        backgroundColor: '#FF6347', // Different color for clear action
        borderRadius: 5,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // buttonText: {
    // color: '#fff',
    // fontSize: 12,
    // fontWeight: 'bold',
    // },
    dropdown: {
        width: '100%',
        marginBottom: 15,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
    },
    dropdownContainer: {
        borderColor: '#ccc',
        height: 200,

    },
    dropdownHeader: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333', // Adjust color as needed
    },
    previewContainer: {
        width: '100%',
        height: 70,
        borderRadius: 8,
        elevation: 10,
        backgroundColor: WHITE,
        marginTop: 20,
        alignItems: 'center',
    },
    previewText: {
        fontSize: 14,
        color: 'black',
        marginTop: 5,
    },
    apiCallButton: {
        backgroundColor: 'cyan',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 5,
        marginTop: 15,
        alignSelf: 'center',
    },
});
