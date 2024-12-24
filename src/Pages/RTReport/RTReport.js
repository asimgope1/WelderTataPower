import {
    View,
    Text,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
    SafeAreaView,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet,
    Modal,
    TextInput,
    Alert,
    RefreshControl,
} from "react-native";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { BLACK, BRAND, GRAY, WHITE } from "../../constants/color";
import Header from "../../components/Header";
import { HEIGHT, MyStatusBar, WIDTH } from "../../constants/config";
import { appStyles } from "../../styles/AppStyles";
import { GETNETWORK } from "../../utils/Network";
import { BAS_URL } from "../../constants/url";
import { CheckBox, Icon } from "react-native-elements";
import DropDownPicker from "react-native-dropdown-picker";
import { pick, keepLocalCopy, DocumentPicker } from "react-native-document-picker";
import { Calendar } from "react-native-calendars";
import { getObjByKey } from "../../utils/Storage";
import { useFocusEffect } from "@react-navigation/native";

const RTReport = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
    const [ApprovemodalVisible, SetApprovemodalVisible] = useState(false); // State for modal visibility

    const [filtermodalVisible, setfilterModalVisible] = useState(false); // State for modal visibility
    const [SelectedJob, setSelectedJob] = useState();

    const [scroll, setScroll] = useState(true);
    const [reportNumber, setReportNumber] = useState('');
    const [remarks, setRemarks] = useState('');
    const [reportDate, setReportDate] = useState('');
    const [reportTime, setReportTime] = useState('');
    const [filterCriteria, setFilterCriteria] = useState({});

    const [DefectOpen, setDefectOpen] = useState(false);
    const [selectedDefect, setSelectedDefect] = useState(null);
    const [DefectItems, setDefectItems] = useState([]);
    const [JobStatusOpen, setJobStatusOpen] = useState(false);
    const [selectedJobStatus, setSelectedJobStatus] = useState(null);
    const [JobStatusItems, setJobStatusItems] = useState([]);
    const [isChecked, setIsChecked] = useState(false);
    const [isCheck, setIsCheck] = useState(false);

    const [startDate, setStartDate] = useState(
        new Date().toISOString().slice(0, 10)
    );
    const [showModal, setShowModal] = useState(false);



    const [refreshing, setRefreshing] = useState(false); // Refresh state to manage data refreshing
    const refresh = async () => {
        setRefreshing(true);
        fetchData();



        setRefreshing(false);
    };


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
            fetchData()
            console.log('Filter cleared');
        }
    };




    const [Token, SetToken] = useState('');

    const GetToken = async () => {
        const Token = await getObjByKey('loginResponse');
        console.log('token: ' + Token.token);
        SetToken(Token?.token);
    }



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

    const [selectedJobs, setSelectedJobs] = useState([]);  // To hold selected job sl ids
    const [selectAll, setSelectAll] = useState(false);

    const handleCheckBoxPress = () => {
        setIsChecked(!isChecked);
    };
    const handleCheckBoxPres = () => {
        setIsCheck(!isCheck);
    };


    // Fetch data when the component mounts
    useEffect(() => {
        GetToken();
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
    }, [navigation]);




    useFocusEffect(
        useCallback(() => {
            // Function to fetch data
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


            const fetchData = async () => {
                try {
                    await GetToken(); // Assuming GetToken() is an async function

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
                        setwelderItems(response.data.welders.map(([id, name]) => ({ label: name, value: id })));
                    } else {
                        console.log("Error fetching data:", response.message);
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };

            fetchData();

            // Cleanup function (if needed)
            return () => {
                // cleanup code (if necessary)
            };
        }, [navigation]) // Dependencies go here
    );



    const [selectedFile, setSelectedFile] = useState(null);

    const handleFilePick = async () => {
        try {
            // const [pickResult] = await pick()
            const [pickResult] = await pick({ mode: 'import' }) // equivalent
            console.log('picked one', pickResult)
            setSelectedFile(pickResult)
            // do something with the picked file
        } catch (err) {
            // see error handling
        }
    };


    const handleApiCall = async () => {
        if (selectedFile) {
            try {
                // Create a new instance of Headers and add the Authorization token
                const myHeaders = new Headers();
                myHeaders.append("Authorization", `Token ${Token}`);

                // Create a FormData object and append necessary fields
                const formData = new FormData();
                formData.append("sl", SelectedJob);
                formData.append("report_number", reportNumber);
                formData.append("report_date", startDate);
                // Append the selected file to the form data
                formData.append("file", {
                    uri: selectedFile.uri,
                    name: selectedFile.name,
                    type: selectedFile.type || "application/octet-stream", // Default MIME type if not provided
                });
                console.log('formData', formData)
                // Construct request options
                const requestOptions = {
                    method: "POST",
                    headers: myHeaders,
                    body: formData,
                    redirect: "follow",
                };

                // Make the API call
                const response = await fetch(`${BAS_URL}welding/api/v1/rt-assignment/`, requestOptions);
                const result = await response.json();
                setModalVisible(false)
                console.log("API Response:", result);
                if (result.status === "error") {
                    setReportDate('');
                    setReportNumber('');
                    setSelectedFile(null);
                    fetchData();
                    alert(`Error: ${result.errors.error || result.message}`);
                } else {
                    alert(`Success: ${JSON.stringify(result.data.message)}`);
                    fetchData();
                    setReportDate('');
                    setReportNumber('');
                    setSelectedFile(null);
                }
            } catch (error) {
                alert('Error in API call:', error);
                console.error("Error in API call:", error);
            }
        } else {
            setModalVisible(false)
            console.warn("No file selected.");
        }
    };



    // Fetch API data
    const fetchData = async (params = {}) => {
        setLoading(true);

        // Base URL
        const url = `${BAS_URL}welding/api/v1/to-be-rt-list/`;

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
                    console.log('RTReport', response);

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

            // If you need to clean up when the screen loses focus, return a cleanup function
            return () => {
                // cleanup code (if needed)
            };
        }, [navigation]) // dependencies of the useCallback
    );


    const handleApproveAll = async () => {


        if (selectedJobs.length > 0) {

            console.log('selectedJobs', selectedJobs)

            // Prepare the form data for the API
            const formData = new FormData();
            formData.append("sl", JSON.stringify(selectedJobs)); // Send jobslArray as a stringified array

            formData.append("report_number", reportNumber);
            formData.append("report_date", reportDate);
            formData.append("file", selectedFile); // Assuming selectedFile is a File object
            formData.append("defect_type", selectedDefect);
            formData.append("job_status", selectedJobStatus); // Example value
            formData.append("remarks", remarks); // Example value
            formData.append("checkshot", isChecked); // Example value
            formData.append("assign_welder", isCheck); // Example value

            console.log('formData', formData)

            try {
                // API call using fetch
                const response = await fetch(`${BAS_URL}welding/api/v1/bulk-rt-assignment/`, {
                    method: "POST",
                    headers: {
                        Authorization: `Token ${Token}`,
                    },
                    body: formData,
                    redirect: "follow",
                });

                const result = await response.json();

                if (response.ok && result.status === "success") {
                    console.log("API Response:", result);
                    setSelectAll(false); // Deselect Select All after approval
                    SetApprovemodalVisible(false); // Close the modal
                    setSelectedDefect(null);
                    setSelectedJobStatus(null)
                    setReportDate('')
                    setReportNumber('')
                    setRemarks('')
                    setIsChecked(false);
                    setIsCheck(false);


                    fetchData()
                    alert("Job successfully Approved");
                } else {
                    alert("Failed to approve selected jobs. Please try again.");
                    fetchData()
                    setSelectAll(false); // Deselect Select All after approval
                    SetApprovemodalVisible(false); // Close the modal
                    setSelectedDefect(null);
                    setSelectedJobStatus(null)
                    setReportDate('')
                    setReportNumber('')
                    setRemarks('')
                    setIsChecked(false);
                    setIsCheck(false);

                }
            } catch (error) {
                console.error("API Error:", error);
                alert("An error occurred while approving selected jobs.");
                SetApprovemodalVisible(false); // Close the modal

            }
        } else {
            alert("No jobs selected for approval.");
        }
    };






    useEffect(() => {
        // Fetch defect types and job statuses when the modal is mounted
        GetDefectStatus();
    }, []);

    const GetDefectStatus = async () => {
        try {
            const url = `${BAS_URL}welding/api/v1/defecttype-list/`;
            const result = await GETNETWORK(url, true);

            if (result.status === "success" && result.data && result.data.length > 0) {
                const { defect_type, status } = result.data[0];

                setDefectItems(defect_type.map((item) => ({ label: item, value: item })));
                setJobStatusItems(status.map((item) => ({ label: item, value: item })));
            } else {
                console.error('Failed to fetch data:', result.errors || result.message);
            }
        } catch (error) {
            console.error('Error fetching defect and status data:', error);
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
                    setSelectAll(false)
                    alert('Job successfully Cancel');
                    alert("All selected jobs Cancelled successfully.");
                } else {
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
    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedJobs([]); // Unselect all
        } else {
            setSelectedJobs(data.map((item) => item.sl)); // Select all jobs based on 'sl'
        }
        setSelectAll(!selectAll); // Toggle Select All state
    };

    // Function to toggle individual job selection
    const toggleJobSelection = (jobSl) => {
        if (selectedJobs.includes(jobSl)) {
            setSelectedJobs(selectedJobs.filter((id) => id !== jobSl)); // Deselect the job
        } else {
            setSelectedJobs([...selectedJobs, jobSl]); // Select the job
        }
    };



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
                backgroundColor: 'white',
                borderLeftWidth: 4,
                borderLeftColor: 'orange'
            }}
        >
            {/* Checkbox for individual selection */}
            <CheckBox
                checked={selectedJobs.includes(item.sl)} // Check if the job is selected
                onPress={() => toggleJobSelection(item.sl)} // Toggle individual selection
                style={{ marginRight: 10 }}
            />





            {/* Job Details */}
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Job Number: {item.job_number}</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Component Name: {item.component_name}</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Unit Number: {item.unit_number}</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Tube Joints: {item.tube_joints}</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Job Description Number: {item.job_desc_number}</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Job Offer Date: {item.job_offer_date}</Text>

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
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </View >
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
                        scrollEnabled={false}
                    >
                        <Header
                            onMenuPress={() => {
                                navigation.toggleDrawer();
                            }}
                            title="RT-Report"
                        />

                        {loading ? (
                            <ActivityIndicator size="large" color={BRAND} />
                        ) : (
                            <>
                                {/* filter here for calling the list api  */}

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


                                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, justifyContent: 'space-between' }}>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >

                                        <CheckBox
                                            checked={selectAll} // If selectAll is true, check the checkbox
                                            onPress={toggleSelectAll} // Toggle Select All state
                                            style={{ marginRight: 10 }}
                                        />
                                        <Text style={{ fontSize: 16, color: '#333' }}>Select All</Text>
                                    </View>

                                    <>
                                        {selectedJobs.length > 0 &&
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: 'blue',
                                                    paddingVertical: 12,
                                                    paddingHorizontal: 10,
                                                    borderRadius: 5,
                                                    marginBottom: 10,
                                                    alignItems: 'center',
                                                }}
                                                onPress={() => {
                                                    SetApprovemodalVisible(true)
                                                }}
                                            >
                                                {selectAll == true ? <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Approve All</Text> : <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Approve selected</Text>}
                                            </TouchableOpacity>}



                                    </>
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
                                        data={data}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={renderItem}
                                        ListFooterComponent={
                                            <View style={{ height: 100 }} />
                                        }

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




                                </View>

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

                        {/* Input for Report Number */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Report Number:</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter Report Number"
                                value={reportNumber} // State value for report number
                                onChangeText={(text) => setReportNumber(text)} // Update state
                            />
                        </View>

                        {/* Input for Report Date */}
                        <TouchableOpacity
                            onPress={() => {
                                setShowModal(true);
                            }}
                            style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Report Date:</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter Report Date (YYYY-MM-DD)"
                                value={reportDate} // State value for report date
                                onChangeText={(text) => setReportDate(text)} // Update state
                                editable={false}
                            />
                        </TouchableOpacity>

                        {/* Input for Report Time */}



                        <TouchableOpacity
                            style={{
                                backgroundColor: GRAY,
                                padding: 10,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}

                            onPress={handleFilePick}
                        >
                            <Text style={{
                                color: WHITE,
                                fontSize: 16,
                                fontWeight: 'bold',
                            }}>Attach File</Text>

                            <Icon
                                name="attachment"
                                size={25}
                                style={{
                                    marginLeft: 10,
                                }}
                            />

                        </TouchableOpacity>

                        {selectedFile && (
                            <View style={styles.previewContainer}>
                                <Text style={styles.previewText}>Selected File:</Text>
                                <Text style={styles.previewText}>Name: {selectedFile.name}</Text>
                                { }

                                {/* <TouchableOpacity onPress={handleApiCall} style={styles.apiCallButton}>
                                    <Text style={styles.emptyListText}>Send to API</Text>
                                </TouchableOpacity> */}
                            </View>
                        )}

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
                                        setReportDate('');
                                        setReportNumber('');
                                        setSelectedFile(null);
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
                visible={ApprovemodalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => SetApprovemodalVisible(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Verify Report</Text>

                        {/* Input for Report Number */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Report Number:</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter Report Number"
                                value={reportNumber}
                                onChangeText={(text) => setReportNumber(text)}
                            />
                        </View>

                        {/* Input for Report Date */}
                        <TouchableOpacity
                            onPress={() => {
                                setShowModal(true);
                            }}
                            style={styles.inputContainer}
                        >
                            <Text style={styles.inputLabel}>Report Date:</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter Report Date (YYYY-MM-DD)"
                                value={reportDate}
                                onChangeText={(text) => setReportDate(text)}
                                editable={false}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                backgroundColor: 'gray',
                                padding: 10,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                            onPress={handleFilePick}
                        >
                            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Attach File</Text>
                            <Icon name="attachment" size={25} style={{ marginLeft: 10 }} />
                        </TouchableOpacity>

                        {selectedFile && (
                            <View style={styles.previewContainer}>
                                <Text style={styles.previewText}>Selected File:</Text>
                                <Text style={styles.previewText}>Name: {selectedFile.name}</Text>
                            </View>
                        )}



                        {/* DropDownPicker for Defect Type */}
                        <DropDownPicker
                            searchable={true}
                            open={DefectOpen}
                            value={selectedDefect}
                            items={DefectItems}
                            setOpen={setDefectOpen}
                            setValue={setSelectedDefect}
                            setItems={setDefectItems}
                            placeholder="Select Defect Type"
                            style={{ ...styles.dropdown, zIndex: 1000, marginTop: 10 }}
                            dropDownContainerStyle={styles.dropdownContainer}
                        />

                        {/* DropDownPicker for Job Status */}
                        <DropDownPicker
                            searchable={true}
                            open={JobStatusOpen}
                            value={selectedJobStatus}
                            items={JobStatusItems}
                            setOpen={setJobStatusOpen}
                            setValue={setSelectedJobStatus}
                            setItems={setJobStatusItems}
                            placeholder="Select Job-Status"
                            style={{ ...styles.dropdown, zIndex: 900 }}
                            dropDownContainerStyle={styles.dropdownContainer}
                        />

                        <View style={{ ...styles.inputContainer, }}>
                            <Text style={styles.inputLabel}>Remarks:</Text>
                            <TextInput
                                style={{ ...styles.textInput, height: HEIGHT * 0.15 }}
                                placeholder="Enter Remarks"
                                value={remarks}
                                onChangeText={(text) => setRemarks(text)}
                            />
                        </View>

                        {/* Checkbox */}
                        <CheckBox
                            title="Check Shot"
                            checked={isChecked}
                            onPress={handleCheckBoxPress}
                        />
                        <CheckBox
                            title="Assigned Welder"
                            checked={isCheck}
                            onPress={handleCheckBoxPres}
                        />

                        {/* File Selection */}


                        {/* Buttons */}
                        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-evenly' }}>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.cancelButton]}
                                    onPress={() => {
                                        setReportNumber('');
                                        setReportDate('');
                                        setSelectedFile(null);
                                        SetApprovemodalVisible(false);
                                    }}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.submitButton]}
                                    onPress={() => { handleApproveAll() }}
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
                    <ScrollView contentContainerStyle={styles.modalContainer} scrollEnabled={scroll}>
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
                        onDayPress={handleDateSelect}
                    />
                </View>
            </Modal>

        </Fragment>
    );
};

export default RTReport;

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

