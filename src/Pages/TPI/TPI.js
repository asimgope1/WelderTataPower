import {
    View,
    Text,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
    SafeAreaView,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
    RefreshControl,
} from "react-native";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { BRAND, GRAY, WHITE } from "../../constants/color";
import Header from "../../components/Header";
import { HEIGHT, MyStatusBar } from "../../constants/config";
import { appStyles } from "../../styles/AppStyles";
import { GETNETWORK, POSTNETWORK } from "../../utils/Network";
import { BAS_URL } from "../../constants/url";
import DropDownPicker from "react-native-dropdown-picker";
import { Calendar } from "react-native-calendars";
import { CheckBox, Icon } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";

const TPI = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
    const [reportNumber, setReportNumber] = useState('');
    const [reportDate, setReportDate] = useState('');
    const [reportTime, setReportTime] = useState('');
    const [SelectedJob, setSelectedJob] = useState(null);

    const [filterCriteria, setFilterCriteria] = useState('');

    const [filtermodalVisible, setfilterModalVisible] = useState(false); // State for modal visibility


    const [isChecked, setIsChecked] = useState(false);

    // Function to handle checkbox press
    const handleCheckBoxPress = () => {
        setIsChecked(!isChecked); // Toggle the checkbox state
    };



    const [startDate, setStartDate] = useState(
        new Date().toISOString().slice(0, 10)
    );
    const [showModal, setShowModal] = useState(false);


    const handleDateSelect = day => {
        setStartDate(day.dateString);

        setReportDate(day.dateString);

        setShowModal(false);
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
            fetchData()

            console.log('Filter cleared');
        }
    };

    const [refreshing, setRefreshing] = useState(false); // Refresh state to manage data refreshing
    const refresh = async () => {
        setRefreshing(true);
        fetchData();



        setRefreshing(false);
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









    const GetDefectStatus = async () => {
        try {
            // Use GETNETWORK to fetch data
            const url = `${BAS_URL}welding/api/v1/defecttype-list/`;
            const result = await GETNETWORK(url, true); // Assuming a token is required

            // Check if the API call was successful
            if (result.status === "success" && result.data && result.data.length > 0) {
                // Destructure the data to get defect types and statuses
                const { defect_type, status } = result.data[0];

                // Set state with the fetched data
                setDefectItems(defect_type.map((item) => ({ label: item, value: item })));
                setJobStatusItems(status.map((item) => ({ label: item, value: item })));
            } else {
                console.error('Failed to fetch data:', result.errors || result.message);
            }
        } catch (error) {
            console.error('Error fetching defect and status data:', error);
        }
    };

    // Fetch data when the component mounts
    useEffect(() => {
        GetDefectStatus();
    }, []);


    const [DefectItems, setDefectItems] = useState([]);
    const [selectedDefect, setSelectedDefect] = useState(null);
    const [DefectOpen, setDefectOpen] = useState(false);


    const [JobStatusItems, setJobStatusItems] = useState([]);
    const [selectedJobStatus, setSelectedJobStatus] = useState(null);
    const [JobStatusOpen, setJobStatusOpen] = useState(false);




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






    const handleApiCall = async () => {
        try {
            // Logging the state variables for debugging
            console.log('hhsd', SelectedJob, selectedDefect, selectedJobStatus, reportNumber, isChecked);

            // Construct the payload using the current state
            const payload = {
                sl: SelectedJob,                // Use the selected job from state
                defect_name: selectedDefect,    // Use the selected defect from state
                tpi_remark: reportNumber,       // Use the report number from state
                job_status: selectedJobStatus,  // Use the job status from state
                check_shot: isChecked           // Use the checkbox state
            };

            // API endpoint
            const url = `${BAS_URL}welding/api/v1/tpiinspection-assignment/`;

            // Make the API call using POSTNETWORK
            const result = await POSTNETWORK(url, payload, true); // Assume token is required

            // Handle the response
            if (result.status === 'error') {
                console.error('Error in response:', result);
                alert(`Error: ${result.errors?.error || result.message}`);
                setReportNumber('')
                setSelectedDefect(null)
                setSelectedJobStatus(null)
                setModalVisible(false)
                fetchData()
                setIsChecked(false)
            } else {
                console.log('API Response:', result);
                alert(`Success: ${JSON.stringify(result.data?.message || result.message)}`);
                setModalVisible(false)
                fetchData()
                setReportNumber('')
                setSelectedDefect(null)
                setSelectedJobStatus(null)
                setIsChecked(false)
            }
        } catch (error) {
            // Catch and log any errors during the API call
            console.error('Error in API call:', error);
            alert('Error in API call. Please check console for more details.');
        }
    };





    const fetchData = async (params = {}) => {
        setLoading(true);

        // Base URL
        const url = `${BAS_URL}welding/api/v1/to-be-tpiinspection-list/`;

        // Check if there are any query params in the `params` object
        const queryString = Object.keys(params).length
            ? `?${new URLSearchParams(params).toString()}`
            : ''; // Construct query string

        // Final URL with or without query parameters
        const finalUrl = `${url}${queryString}`;

        console.log("Final URL:", finalUrl); // Debug: Check constructed URL

        // Fetch data using GETNETWORK with the constructed URL
        GETNETWORK(finalUrl, true)
            .then((response) => {
                if (response.status === 'success') {
                    setData(response.data);
                    console.log('PAUTReport', response);

                    // Reset selected filters after data is fetched
                    // setSelectedUnit(null);
                    // setSelectedComponent(null);
                    // setSelectedArea(null);
                    // setSelectedHanger(null);
                    // setSelectedCoil(null);
                    // setSelectedPanel(null);
                    // setSelectedRow(null);
                    // setSelectedTube(null);
                    // setSelectedJoint(null);
                    // setSelectedWelder(null);
                    setLoading(false);
                } else {
                    // Reset selected filters in case of error
                    setLoading(false);
                    setSelectedUnit(null);
                    setSelectedComponent(null);
                    setSelectedArea(null);
                    setSelectedHanger(null);
                    setSelectedCoil(null);
                    setSelectedPanel(null);
                    setSelectedRow(null);
                    setSelectedTube(null);
                    setSelectedJoint(null);
                    setSelectedWelder(null);
                    console.log('Error:', response.message);
                }
            })
            .catch((error) => {
                setLoading(false);
                console.error('Fetch Error:', error);
            });
    };



    useFocusEffect(


        useCallback(() => {
            fetchData();

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


    // Fetch API data


    const renderItem = ({ item }) => (
        <View
            style={{
                padding: 15,
                marginVertical: 8,
                marginHorizontal: 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#ddd',
                elevation: 5,
                backgroundColor: 'white'
            }}
        >
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
                Job Number: {item.job_number}
            </Text>
            <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#333',
                marginBottom: 4,
            }}>
                Component Name: {item.component_name}
            </Text>
            <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#333',
                marginBottom: 4,
            }}>
                Unit Number: {item.unit_number}
            </Text>
            <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#333',
                marginBottom: 4,
            }}>
                Tube Joints : {item.tube_joints}
            </Text>
            <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#333',
                marginBottom: 4,
            }}>
                Job Description Number: {item.job_desc_number}
            </Text>
            <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#333',
                marginBottom: 4,
            }}>
                Job Offer Date: {item.job_offer_date}
            </Text>
            <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#333',
                marginBottom: 4,
            }}>
                Remarks: {item.contract_remark}
            </Text>


            <TouchableOpacity

                onPress={() => {
                    setSelectedJob(item.sl);
                    setModalVisible(true);
                }}
                style={{
                    backgroundColor: 'green',
                    paddingVertical: 10,
                    paddingHorizontal: 25,
                    borderRadius: 5,
                    marginTop: 10,
                }}
            >
                <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <Fragment>
            <MyStatusBar backgroundColor={BRAND} barStyle={"light-content"} />
            <SafeAreaView style={appStyles.safeareacontainer}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        keyboardShouldPersistTaps={"handled"}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            flexGrow: 1,
                            paddingBottom: 20,
                        }}
                    >
                        <Header
                            onMenuPress={() => {
                                navigation.toggleDrawer();
                            }}
                            title="TPI"
                        />

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

                                <FlatList
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={refreshing}
                                            onRefresh={refresh}
                                        />
                                    }

                                    data={data}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={renderItem}
                                    contentContainerStyle={{ paddingBottom: 20 }}
                                    ListEmptyComponent={
                                        <View style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            alignSelf: 'center'
                                        }}>
                                            <Text style={styles.emptyListText}>
                                                No data available
                                            </Text>

                                        </View>
                                    }
                                />
                            </>
                        )}
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Verify Report</Text>


                        {/* Input for Report Time */}
                        <DropDownPicker
                            searchable={true}
                            open={DefectOpen}
                            value={selectedDefect}
                            items={DefectItems}
                            setOpen={setDefectOpen}
                            setValue={setSelectedDefect}
                            setItems={setDefectItems}
                            placeholder="Select Defect Type"
                            style={{ ...styles.dropdown, zIndex: 1000 }}
                            dropDownContainerStyle={styles.dropdownContainer}
                        />
                        <DropDownPicker
                            searchable={true}
                            open={JobStatusOpen}
                            value={selectedJobStatus}
                            items={JobStatusItems}
                            setOpen={setJobStatusOpen}
                            setValue={setSelectedJobStatus}
                            setItems={setJobStatusItems}
                            placeholder="Select Job-Status "
                            style={{ ...styles.dropdown, zIndex: 900 }}
                            dropDownContainerStyle={styles.dropdownContainer}
                        />

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Remarks:</Text>
                            <TextInput
                                style={{ ...styles.textInput, height: 100 }}
                                placeholder="Enter Remarks"
                                value={reportNumber} // State value for report number
                                onChangeText={(text) => setReportNumber(text)} // Update state
                                multiline
                            />
                        </View>

                        <CheckBox
                            title="Check Shot"
                            checked={isChecked}
                            onPress={handleCheckBoxPress}

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
                                    onPress={() => {
                                        setReportNumber('')
                                        setSelectedDefect(null)
                                        setSelectedJobStatus(null)
                                        setIsChecked(false)
                                        setModalVisible(false)
                                    }}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.submitButton]}
                                    onPress={handleApiCall}
                                >
                                    <Text style={styles.buttonText}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                visible={filtermodalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setfilterModalVisible(false)}
            >
                <View style={styles.modalBackdrop}>
                    <ScrollView contentContainerStyle={styles.modalContainer} >
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
                        <Text style={styles.dropdownHeader}>Welder</Text>
                        <DropDownPicker
                            searchable={true}
                            open={welderOpen}
                            value={selectedWelder}
                            items={welderItems}
                            setOpen={setWelderOpen}
                            setValue={setSelectedWelder}
                            setItems={setwelderItems}
                            placeholder="Select Welder"
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
                                            selectedWelder,
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
                                            weldersl: selectedWelder || undefined,
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

            <Modal
                visible={showModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowModal(false)}>
                <View style={styles.modalContainer}>
                    <Calendar
                        style={styles.calendar}
                        onDayPress={handleDateSelect} // Handle date selection
                    />
                </View>
            </Modal>

        </Fragment>
    );
};

export default TPI;

export const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '95%',
        backgroundColor: '#fff',
        // borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        // elevation: 5,
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



