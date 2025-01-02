import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
    SafeAreaView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    StyleSheet,
    TextInput,
    Modal,
    RefreshControl,
    FlatList,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { BRAND, WHITE, GRAY } from '../../constants/color';
import Header from '../../components/Header';
import { HEIGHT, MyStatusBar, WIDTH } from '../../constants/config';
import { appStyles } from '../../styles/AppStyles';
import { GETNETWORK, POSTNETWORK } from '../../utils/Network';
import { BAS_URL } from '../../constants/url';
import { CheckBox } from 'react-native-elements';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';

const NewJob = ({ navigation }) => {
    const resetForm = () => {
        setFormData({
            unit_number: '',
            component_name: '',
            area: '',
            hanger_number: '',
            coil_number: '',
            panel_number: '',
            row_number: '',
            tube_number: '',
            joint_number: '',
            rt_required: false,
            paut_required: false,
            job_details: '',
            tube_joints: '',
            job_desc_number: '',
            fresh_old: '',
            offer_date: new Date().toISOString().slice(0, 10), // Reset to current date,
            elevation: '',
            wall_blower: '',
            panel: '',
            neck: '',
        });
        setUnitItems([]);
        setcomponentItems([]);
        setAreaItems([]);
        setHangerItems([]);
        setCoilItems([]);
        setPanelItems([]);
        setRowItems([]);
        setTubeItems([]);
        setJointItems([]);
        setelevationItems([]);
        setwallBlowerItems([]);
        setPanelItems([]);
        setneckItems([]);
        setDropdownStates({ unitOpen: false });
        setcomponentStates({ componentOpen: false });
        setAreaStates({ areaOpen: false });
        setHangerStates({ hangerOpen: false });
        setCoilStates({ coilOpen: false });
        setPanelStates({ panelOpen: false });
        setRowStates({ rowOpen: false });
        setTubeStates({ tubeOpen: false });
        setJointStates({ jointOpen: false });
    };
    const [formData, setFormData] = useState({
        unit_number: '',
        component_name: '',
        area: '',
        hanger_number: '',
        coil_number: '',
        panel_number: '',
        row_number: '',
        tube_number: '',
        joint_number: '',
        rt_required: false,
        paut_required: false,
        job_details: '',
        tube_joints: '',
        job_desc_number: '',
        offer_date: startDate,
        fresh_old: '',
        elevation: '',
        wall_blower: '',
        panel: '',
        neck: '',
        rows: [],
    });
    const [startDate, setStartDate] = useState(
        new Date().toISOString().slice(0, 10),
    );

    useEffect(() => {
        setFormData(prevData => ({
            ...prevData,
            tube_joints: `${prevData.tube_number} ${prevData.joint_number}`,
        }));
    }, [formData.tube_number, formData.joint_number]);

    // Update `job_desc_number` whenever relevant fields change
    useEffect(() => {
        setFormData(prevData => ({
            ...prevData,
            job_desc_number: [
                prevData?.area,
                prevData?.hanger_number,
                prevData?.coil_number,
                prevData?.panel_number,
                prevData?.row_number,
                prevData?.wall_blower,
                prevData?.elevation,
                prevData?.panel,
                prevData?.neck,
            ]
                .filter(value => value) // Filter out empty or undefined values
                .join(' '), // Join remaining values with a space
        }));
    }, [
        formData.area,
        formData.hanger_number,
        formData.coil_number,
        formData.panel_number,
        formData.row_number,
        formData.wall_blower,
        formData.elevation,
        formData.panel,
        formData.neck,
    ]);

    const [showModal, setShowModal] = useState(false);

    const handleDateSelect = day => {
        setStartDate(day.dateString);

        setFormData(prevState => ({
            ...prevState,
            offer_date: day.dateString, // Sets the current date
        }));

        setShowModal(false);
    };

    const [loading, setLoading] = useState(true);

    const [unitItems, setUnitItems] = useState([]);
    const [dropdownStates, setDropdownStates] = useState({
        unitOpen: false,
    });
    const [componentItems, setcomponentItems] = useState([]);
    const [componentStates, setcomponentStates] = useState({
        componentOpen: false,
    });

    const [areaItems, setAreaItems] = useState([]);
    const [areaStates, setAreaStates] = useState({
        areaOpen: false,
    });
    const [hangerItems, setHangerItems] = useState([]);
    const [hangerStates, setHangerStates] = useState({
        hangerOpen: false,
    });
    const [coilItems, setCoilItems] = useState([]);
    const [coilStates, setCoilStates] = useState({
        coilOpen: false,
    });
    const [panelItems, setPanelItems] = useState([]);
    const [panelStates, setPanelStates] = useState({
        panelOpen: false,
    });
    const [rowItems, setRowItems] = useState([]);
    const [rowStates, setRowStates] = useState({
        rowOpen: false,
    });
    const [tubeItems, setTubeItems] = useState([]);
    const [tubeStates, setTubeStates] = useState({
        tubeOpen: false,
    });
    const [jointItems, setJointItems] = useState([]);
    const [jointStates, setJointStates] = useState({
        jointOpen: false,
    });
    const [fresholdItems, setfresholdItems] = useState([]);
    const [fresholdStates, setfresholdStates] = useState({
        fresholdOpen: false,
    });
    const [elevationItems, setelevationItems] = useState([]);
    const [elevationStates, setelevationStates] = useState({
        elevationOpen: false,
    });
    const [wallBlowerItems, setwallBlowerItems] = useState([]);
    const [wallBlowerStates, setwallBlowerStates] = useState({
        wallBlowerOpen: false,
    });
    const [PanellItems, setPanellItems] = useState([]);
    const [PanellStates, setPanellStates] = useState({
        PanellOpen: false,
    });
    const [neckItems, setneckItems] = useState([]);
    const [neckStates, setneckStates] = useState({
        neckOpen: false,
    });

    const [selectedWelder, setSelectedWelder] = useState(null); // State for selected welder
    const [availableWelders, setAvailableWelders] = useState([]); // State for available welders from API
    const [open, setOpen] = useState(false); // State for dropdown open status
    const [items, setItems] = useState([]); // State for dropdown items

    const [refreshing, setRefreshing] = useState(false); // Refresh state to manage data refreshing
    const refresh = async () => {
        setRefreshing(true);
        fetchDropdownData();

        setRefreshing(false);
    };

    const fetchDropdownData = async () => {
        try {
            const response = await GETNETWORK(
                `${BAS_URL}welding/jobmaster/create-job/`,
                true,
            );

            if (response.status === 'success') {
                fetchAvailableWelders();
                setUnitItems(
                    response.data.unit_number.map(item => ({ label: item, value: item })),
                );
                setcomponentItems([]);
                setAreaItems([]);
                setHangerItems([]);
                setCoilItems([]);
                setPanelItems([]);
                setRowItems([]);
                setTubeItems([]);
                setJointItems([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchDropdownData();
    }, [navigation]);

    const handleInputChange = (field, value) => {
        console.log('hii', field, value);
        setFormData(prevData => ({ ...prevData, [field]: value }));
    };

    const handleSubmit = async () => {
        console.log('Form Data:', formData);

        // Validate the required fields before form submission
        if (
            !formData.area &&
            !formData.hanger_number &&
            !formData.coil_number &&
            !formData.panel_number
        ) {
            Alert.alert(
                'Validation Error',
                'Please fill at least one of the following: Area, Hanger Number, Coil Number, or Panel Number.',
            );
            return;
        }

        if (!formData.tube_number && !formData.joint_number) {
            Alert.alert(
                'Validation Error',
                'Please fill at least one of the following: Tube Number or Joint Number.',
            );
            return;
        }

        try {
            console.log('Submitting Form:', formData);

            let url = `${BAS_URL}welding/jobmaster/create-job/`;
            if (formData?.rows?.length > 0) {
                url = `${BAS_URL}welding/jobmaster/bulk-create-job/`;
            }

            const response = await POSTNETWORK(url, formData, true, false);

            console.log('Response:', response);

            if (response && response.status === 'success') {
                resetForm(); // Reset form on success
                Alert.alert('Success', 'Job created successfully');
                navigation.navigate('DashBoard');
            } else {
                Alert.alert('Error', response?.errors?.error || 'Failed to create job');
                resetForm();
            }
        } catch (error) {
            console.error('Error during form submission:', error);
            Alert.alert('Error', 'An unexpected error occurred.');
        }
    };


    const handleAdd = async () => {
        const { tube_number, joint_number, rows } = formData || {}; // Safeguard against undefined formData
        const welder_name = selectedWelder || '';

        // Validate inputs
        if (!tube_number || !joint_number) {
            Alert.alert(
                'Missing Fields',
                'Please provide both Tube Number and Joint Number.',
                [{ text: 'OK' }],
            );
            return;
        }

        // Construct a new row
        const newRow = { tube_number, joint_number, welder_name };

        // Check if the row already exists
        const isDuplicate = (rows || []).some(
            row =>
                row.tube_number === newRow.tube_number &&
                row.joint_number === newRow.joint_number &&
                row.welder_name === newRow.welder_name,
        );

        if (isDuplicate) {
            Alert.alert(
                'Duplicate Entry',
                'This combination of Tube Number, Joint Number, and Welder Name already exists.',
                [{ text: 'OK' }],
            );
            return;
        }

        // Dynamically update the rows array
        setFormData(prevState => ({
            ...prevState,
            rows: [...(prevState.rows || []), newRow],
        }));

        Alert.alert('Success', 'Row added successfully!', [{ text: 'OK' }]);

        // Log the updated rows
        console.log('Updated rows:', [...(rows || []), newRow]);
    };

    useFocusEffect(
        React.useCallback(() => {
            resetForm();

            const fetchDropdownData = async () => {
                try {
                    const response = await GETNETWORK(
                        `${BAS_URL}welding/jobmaster/create-job/`,
                        true,
                    );

                    if (response.status === 'success') {
                        setUnitItems(
                            response.data.unit_number.map(item => ({
                                label: item,
                                value: item,
                            })),
                        );
                        setcomponentItems([]);
                        setAreaItems([]);
                        setHangerItems([]);
                        setCoilItems([]);
                        setPanelItems([]);
                        setRowItems([]);
                        setTubeItems([]);
                        setJointItems([]);
                        setfresholdItems(
                            response.data.fresh_old.map(item => ({ label: item, value: item })),
                        );
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchDropdownData();
        }, [navigation]),
    );

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: WHITE,
                }}>
                <ActivityIndicator size="large" color={BRAND} />
            </View>
        );
    }

    // Helper function to validate and set items
    const setValidItems = (data, setterFunction) => {
        if (
            Array.isArray(data) &&
            data.length > 0 &&
            data.some(item => item.trim() !== '')
        ) {
            setterFunction(data.map(item => ({ label: item, value: item })));
        }
    };

    const areaSelect = async value => {
        console.log('value-areaSelect', value);

        try {
            const response = await GETNETWORK(
                `${BAS_URL}welding/jobmaster/create-job/?component_name=${formData.component_name}&area=${value}`,
                true,
            );

            if (response.status === 'success') {
                // Reset all arrays to empty
                setHangerItems([]);
                setCoilItems([]);
                setPanelItems([]);
                setRowItems([]);
                setTubeItems([]);
                setJointItems([]);

                const {
                    hanger_number,
                    coil_number,
                    panel_number,
                    row_number,
                    tube_number,
                    joint_number,
                } = response.data;

                // Set hanger items only if there's valid data
                setValidItems(hanger_number, setHangerItems);

                // Set coil items only if there's valid data
                setValidItems(coil_number, setCoilItems);

                // Set panel items only if there's valid data
                setValidItems(panel_number, setPanelItems);

                // Set row items only if there's valid data
                setValidItems(row_number, setRowItems);

                // Set tube items only if there's valid data
                setValidItems(tube_number, setTubeItems);

                // Set joint items only if there's valid data
                setValidItems(joint_number, setJointItems);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to validate and set items

    // Clear all dropdown items
    const clearDropdownItems = () => {
        setHangerItems([]);
        setPanelItems([]);
        setRowItems([]);
        setTubeItems([]);
        setJointItems([]);
        setPanellItems([]);
        setelevationItems([]);
        setwallBlowerItems([]);
        setneckItems([]);
    };

    const hangerSelect = async value => {
        try {
            const response = await GETNETWORK(
                `${BAS_URL}welding/jobmaster/create-job/?component_name=${formData.component_name}&area=${formData.area}&hanger_number=${value}`,
                true,
            );

            if (response.status === 'success') {
                // Set hanger items only if there's valid data
                setValidItems(response.data?.hanger_number, setHangerItems);

                // Set coil items only if there's valid data
                setValidItems(response.data?.coil_number, setCoilItems);

                // Set panel items only if there's valid data
                setValidItems(response.data?.panel_number, setPanelItems);

                // Set row items only if there's valid data
                setValidItems(response.data?.row_number, setRowItems);

                // Set tube items only if there's valid data
                setValidItems(response.data?.tube_number, setTubeItems);

                // Set joint items only if there's valid data
                setValidItems(response.data?.joint_number, setJointItems);
            } else {
                // Clear dropdown items if the response status isn't successful
                clearDropdownItems();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // Clear data in case of an error
            clearDropdownItems();
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableWelders = async () => {
        try {
            const url = `${BAS_URL}welding/api/v1/welder-list/`;
            const response = await GETNETWORK(url, true);

            if (response.status === 'success') {
                console.log('Available Welders:', response.data);
                // Format welders data for dropdown
                const formattedWelders = response?.data.map(welder => ({
                    label: welder.welder_name,
                    value: welder.weldersl,
                }));
                setItems(formattedWelders); // Update dropdown items
            } else {
                console.log('Error:', response.message);
            }
        } catch (error) {
            console.error('Error fetching available welders:', error);
        }
    };

    const coilSelect = async value => {
        try {
            const response = await GETNETWORK(
                `${BAS_URL}welding/jobmaster/create-job/?component_name=${formData.component_name}&area=${formData.area}&coil_number=${value}`,
                true,
            );

            if (response.status === 'success') {
                // Set hanger items only if there's valid data
                setValidItems(response.data?.hanger_number, setHangerItems);

                // Set panel items only if there's valid data
                setValidItems(response.data?.panel_number, setPanelItems);

                // Set row items only if there's valid data
                setValidItems(response.data?.row_number, setRowItems);

                // Set tube items only if there's valid data
                setValidItems(response.data?.tube_number, setTubeItems);

                // Set joint items only if there's valid data
                setValidItems(response.data?.joint_number, setJointItems);

                // Set panell items only if there's valid data
                setValidItems(response.data?.panel, setPanellItems);

                // Set elevation items only if there's valid data
                setValidItems(response.data?.elevation, setelevationItems);

                // Set wall blower items only if there's valid data
                setValidItems(response.data?.wall_blower, setwallBlowerItems);

                // Set neck items only if there's valid data
                setValidItems(response.data?.neck, setneckItems);
            } else {
                // Clear dropdown items if the response status isn't successful
                clearDropdownItems();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // Clear data in case of an error
            clearDropdownItems();
        } finally {
            setLoading(false);
        }
    };

    const panelSelect = async value => {
        try {
            const response = await GETNETWORK(
                `${BAS_URL}welding/jobmaster/create-job/?component_name=${formData.component_name}&area=${formData.area}&coil_number=${formData.coil_number}&panel_number=${value}`,
                true,
            );

            if (response.status === 'success') {
                // Set hanger items only if there's valid data
                setValidItems(response.data?.hanger_number, setHangerItems);

                // Set panel items only if there's valid data
                setValidItems(response.data?.panel_number, setPanelItems);

                // Set row items only if there's valid data
                setValidItems(response.data?.row_number, setRowItems);

                // Set tube items only if there's valid data
                setValidItems(response.data?.tube_number, setTubeItems);

                // Set joint items only if there's valid data
                setValidItems(response.data?.joint_number, setJointItems);

                // Set panell items only if there's valid data
                setValidItems(response.data?.panel, setPanellItems);

                // Set elevation items only if there's valid data
                setValidItems(response.data?.elevation, setelevationItems);

                // Set wall blower items only if there's valid data
                setValidItems(response.data?.wall_blower, setwallBlowerItems);

                // Set neck items only if there's valid data
                setValidItems(response.data?.neck, setneckItems);
            } else {
                // Clear dropdown items if the response status isn't successful
                clearDropdownItems();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // Clear data in case of an error
            clearDropdownItems();
        } finally {
            setLoading(false);
        }
    };

    const rowSelect = async value => {
        try {
            const response = await GETNETWORK(
                `${BAS_URL}welding/jobmaster/create-job/?component_name=${formData.component_name}&area=${formData.area}&coil_number=${formData.coil_number}&panel_number=${formData.panel_number}&ow_number=${value}`,
                true,
            );
            console.log('rowSelect', response);

            if (response.status === 'success') {
                // Set hanger items only if there's valid data
                setValidItems(response.data?.hanger_number, setHangerItems);

                // Set panel items only if there's valid data
                setValidItems(response.data?.panel_number, setPanelItems);

                // Set row items only if there's valid data
                setValidItems(response.data?.row_number, setRowItems);

                // Set tube items only if there's valid data
                setValidItems(response.data?.tube_number, setTubeItems);

                // Set joint items only if there's valid data
                setValidItems(response.data?.joint_number, setJointItems);

                // Set panell items only if there's valid data
                setValidItems(response.data?.panel, setPanellItems);

                // Set elevation items only if there's valid data
                setValidItems(response.data?.elevation, setelevationItems);

                // Set wall blower items only if there's valid data
                setValidItems(response.data?.wall_blower, setwallBlowerItems);

                // Set neck items only if there's valid data
                setValidItems(response.data?.neck, setneckItems);
            } else {
                // Clear dropdown items if the response status isn't successful
                clearDropdownItems();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // Clear data in case of an error
            clearDropdownItems();
        } finally {
            setLoading(false);
        }
    };

    const elevationSelect = async value => {
        try {
            const response = await GETNETWORK(
                `${BAS_URL}welding/jobmaster/create-job/?component_name=${formData.component_name}&area=${formData.area}&coil_number=${formData.coil_number}&panel_number=${formData.panel_number}&ow_number=${formData.row_number}&elevation=${value}`,
                true,
            );
            console.log('elevationSelect', response);
            if (response.status === 'success') {
                setHangerItems(
                    response.data.hanger_number.map(item => ({ label: item, value: item })),
                );
                setPanelItems(
                    response.data.panel_number.map(item => ({ label: item, value: item })),
                );
                setRowItems(
                    response.data.row_number.map(item => ({ label: item, value: item })),
                );
                setTubeItems(
                    response.data.tube_number.map(item => ({ label: item, value: item })),
                );
                setJointItems(
                    response.data.joint_number.map(item => ({ label: item, value: item })),
                );
                setPanellItems(
                    response.data.panel.map(item => ({ label: item, value: item })),
                );
                setelevationItems(
                    response.data.elevation.map(item => ({ label: item, value: item })),
                );
                setwallBlowerItems(
                    response.data.wall_blower.map(item => ({ label: item, value: item })),
                );
                setneckItems(
                    response.data.neck.map(item => ({ label: item, value: item })),
                );
            } else {
                // Clear dropdown items if the response status isn't successful
                clearDropdownItems();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // Clear data in case of an error
            clearDropdownItems();
        } finally {
            setLoading(false);
        }
    };

    const wallblowerSelect = async value => {
        try {
            const response = await GETNETWORK(
                `${BAS_URL}welding/jobmaster/create-job/?component_name=${formData.component_name}&area=${formData.area}&coil_number=${formData.coil_number}&panel_number=${formData.panel_number}&ow_number=${formData.row_number}&elevation=${formData.elevation}&wall_blower=${value}`,
                true,
            );
            console.log('wallblowerSelect', response);
            if (response.status === 'success') {
                setHangerItems(
                    response.data.hanger_number.map(item => ({ label: item, value: item })),
                );
                setPanelItems(
                    response.data.panel_number.map(item => ({ label: item, value: item })),
                );
                setRowItems(
                    response.data.row_number.map(item => ({ label: item, value: item })),
                );
                setTubeItems(
                    response.data.tube_number.map(item => ({ label: item, value: item })),
                );
                setJointItems(
                    response.data.joint_number.map(item => ({ label: item, value: item })),
                );
                setPanellItems(
                    response.data.panel.map(item => ({ label: item, value: item })),
                );
                setelevationItems(
                    response.data.elevation.map(item => ({ label: item, value: item })),
                );
                setwallBlowerItems(
                    response.data.wall_blower.map(item => ({ label: item, value: item })),
                );
                setneckItems(
                    response.data.neck.map(item => ({ label: item, value: item })),
                );
            } else {
                // Clear dropdown items if the response status isn't successful
                clearDropdownItems();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // Clear data in case of an error
            clearDropdownItems();
        } finally {
            setLoading(false);
        }
    };

    const PanellSelect = async value => {
        try {
            const response = await GETNETWORK(
                `${BAS_URL}welding/jobmaster/create-job/?component_name=${formData.component_name}&area=${formData.area}&coil_number=${formData.coil_number}&panel_number=${formData.panel_number}&ow_number=${formData.row_number}&elevation=${formData.elevation}&wall_blower=${formData.wall_blower}&panel=${value}`,
                true,
            );
            console.log('PanellSelect', response);
            if (response.status === 'success') {
                setHangerItems(
                    response.data.hanger_number.map(item => ({ label: item, value: item })),
                );
                setPanelItems(
                    response.data.panel_number.map(item => ({ label: item, value: item })),
                );
                setRowItems(
                    response.data.row_number.map(item => ({ label: item, value: item })),
                );
                setTubeItems(
                    response.data.tube_number.map(item => ({ label: item, value: item })),
                );
                setJointItems(
                    response.data.joint_number.map(item => ({ label: item, value: item })),
                );
                setPanellItems(
                    response.data.panel.map(item => ({ label: item, value: item })),
                );
                setelevationItems(
                    response.data.elevation.map(item => ({ label: item, value: item })),
                );
                setwallBlowerItems(
                    response.data.wall_blower.map(item => ({ label: item, value: item })),
                );
                setneckItems(
                    response.data.neck.map(item => ({ label: item, value: item })),
                );
            } else {
                // Clear dropdown items if the response status isn't successful
                clearDropdownItems();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // Clear data in case of an error
            clearDropdownItems();
        } finally {
            setLoading(false);
        }
    };
    const NeckSelect = async value => {
        try {
            const response = await GETNETWORK(
                `${BAS_URL}welding/jobmaster/create-job/?component_name=${formData.component_name}&area=${formData.area}&coil_number=${formData.coil_number}&panel_number=${formData.panel_number}&ow_number=${formData.row_number}&elevation=${formData.elevation}&wall_blower=${formData.wall_blower}&panel=${formData.panel}&neck=${value}`,
                true,
            );
            console.log('NeckSelect', response);
            if (response.status === 'success') {
                setHangerItems(
                    response.data.hanger_number.map(item => ({ label: item, value: item })),
                );
                setPanelItems(
                    response.data.panel_number.map(item => ({ label: item, value: item })),
                );
                setRowItems(
                    response.data.row_number.map(item => ({ label: item, value: item })),
                );
                setTubeItems(
                    response.data.tube_number.map(item => ({ label: item, value: item })),
                );
                setJointItems(
                    response.data.joint_number.map(item => ({ label: item, value: item })),
                );
                setPanellItems(
                    response.data.panel.map(item => ({ label: item, value: item })),
                );
                setelevationItems(
                    response.data.elevation.map(item => ({ label: item, value: item })),
                );
                setwallBlowerItems(
                    response.data.wall_blower.map(item => ({ label: item, value: item })),
                );
                setneckItems(
                    response.data.neck.map(item => ({ label: item, value: item })),
                );
            } else {
                // Clear dropdown items if the response status isn't successful
                clearDropdownItems();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // Clear data in case of an error
            clearDropdownItems();
        } finally {
            setLoading(false);
        }
    };

    const UnitSelect = async value => {
        console.log('here');

        try {
            const response = await GETNETWORK(
                `${BAS_URL}welding/jobmaster/create-job/?unit_number=${value}`,
                true,
            );

            if (response.status === 'success') {
                // Reset all arrays to empty
                setAreaItems([]);
                setHangerItems([]);
                setCoilItems([]);
                setPanelItems([]);
                setRowItems([]);
                setTubeItems([]);
                setJointItems([]);

                const {
                    component_name,
                    area,
                    hanger_number,
                    coil_number,
                    panel_number,
                    row_number,
                    tube_number,
                    joint_number,
                } = response.data;

                // Set component items only if there's valid data
                if (
                    Array.isArray(component_name) &&
                    component_name.length > 0 &&
                    component_name.some(item => item.trim() !== '')
                ) {
                    setcomponentItems(
                        component_name.map(item => ({ label: item, value: item })),
                    );
                }

                // Set area items only if there's valid data
                if (
                    Array.isArray(area) &&
                    area.length > 0 &&
                    area.some(item => item.trim() !== '')
                ) {
                    setAreaItems(area.map(item => ({ label: item, value: item })));
                }

                // Set hanger items only if there's valid data
                if (
                    Array.isArray(hanger_number) &&
                    hanger_number.length > 0 &&
                    hanger_number.some(item => item.trim() !== '')
                ) {
                    setHangerItems(
                        hanger_number.map(item => ({ label: item, value: item })),
                    );
                }

                // Set coil items only if there's valid data
                if (
                    Array.isArray(coil_number) &&
                    coil_number.length > 0 &&
                    coil_number.some(item => item.trim() !== '')
                ) {
                    setCoilItems(coil_number.map(item => ({ label: item, value: item })));
                }

                // Set panel items only if there's valid data
                if (
                    Array.isArray(panel_number) &&
                    panel_number.length > 0 &&
                    panel_number.some(item => item.trim() !== '')
                ) {
                    setPanelItems(panel_number.map(item => ({ label: item, value: item })));
                }

                // Set row items only if there's valid data
                if (
                    Array.isArray(row_number) &&
                    row_number.length > 0 &&
                    row_number.some(item => item.trim() !== '')
                ) {
                    setRowItems(row_number.map(item => ({ label: item, value: item })));
                }

                // Set tube items only if there's valid data
                if (
                    Array.isArray(tube_number) &&
                    tube_number.length > 0 &&
                    tube_number.some(item => item.trim() !== '')
                ) {
                    setTubeItems(tube_number.map(item => ({ label: item, value: item })));
                }

                // Set joint items only if there's valid data
                if (
                    Array.isArray(joint_number) &&
                    joint_number.length > 0 &&
                    joint_number.some(item => item.trim() !== '')
                ) {
                    setJointItems(joint_number.map(item => ({ label: item, value: item })));
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const componentSelect = async value => {
        console.log('value-componentSelect', formData.unit_number);

        try {
            // Fetching data from API based on selected unit_number and component_name
            const response = await GETNETWORK(
                `${BAS_URL}welding/jobmaster/create-job/?unit_number=${formData.unit_number}&component_name=${value}`,
                true,
            );

            if (response.status === 'success') {
                console.log('componentSelect', response);

                const {
                    area,
                    hanger_number,
                    coil_number,
                    panel_number,
                    row_number,
                    tube_number,
                    joint_number,
                    panel,
                    elevation,
                    wall_blower,
                    neck,
                } = response.data;

                // Set state only if data is valid and not just empty strings
                if (
                    Array.isArray(area) &&
                    area.length > 0 &&
                    area.some(item => item.trim() !== '')
                ) {
                    setAreaItems(area.map(item => ({ label: item, value: item })));
                }

                if (
                    Array.isArray(hanger_number) &&
                    hanger_number.length > 0 &&
                    hanger_number.some(item => item.trim() !== '')
                ) {
                    setHangerItems(
                        hanger_number.map(item => ({ label: item, value: item })),
                    );
                }

                if (
                    Array.isArray(coil_number) &&
                    coil_number.length > 0 &&
                    coil_number.some(item => item.trim() !== '')
                ) {
                    setCoilItems(coil_number.map(item => ({ label: item, value: item })));
                }

                if (
                    Array.isArray(panel_number) &&
                    panel_number.length > 0 &&
                    panel_number.some(item => item.trim() !== '')
                ) {
                    setPanelItems(panel_number.map(item => ({ label: item, value: item })));
                }

                if (
                    Array.isArray(row_number) &&
                    row_number.length > 0 &&
                    row_number.some(item => item.trim() !== '')
                ) {
                    setRowItems(row_number.map(item => ({ label: item, value: item })));
                }

                if (
                    Array.isArray(tube_number) &&
                    tube_number.length > 0 &&
                    tube_number.some(item => item.trim() !== '')
                ) {
                    setTubeItems(tube_number.map(item => ({ label: item, value: item })));
                }

                if (
                    Array.isArray(joint_number) &&
                    joint_number.length > 0 &&
                    joint_number.some(item => item.trim() !== '')
                ) {
                    setJointItems(joint_number.map(item => ({ label: item, value: item })));
                }

                if (
                    Array.isArray(panel) &&
                    panel.length > 0 &&
                    panel.some(item => item.trim() !== '')
                ) {
                    setPanellItems(panel.map(item => ({ label: item, value: item })));
                }

                if (
                    Array.isArray(elevation) &&
                    elevation.length > 0 &&
                    elevation.some(item => item.trim() !== '')
                ) {
                    setelevationItems(
                        elevation.map(item => ({ label: item, value: item })),
                    );
                }

                if (
                    Array.isArray(wall_blower) &&
                    wall_blower.length > 0 &&
                    wall_blower.some(item => item.trim() !== '')
                ) {
                    setwallBlowerItems(
                        wall_blower.map(item => ({ label: item, value: item })),
                    );
                }

                if (
                    Array.isArray(neck) &&
                    neck.length > 0 &&
                    neck.some(item => item.trim() !== '')
                ) {
                    setneckItems(neck.map(item => ({ label: item, value: item })));
                }
            } else {
                console.error('Failed to fetch data:', response.message);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    console.log('form', formData);

    return (
        <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            {' '}
            {/* Light gray background */}
            <MyStatusBar backgroundColor={BRAND} barStyle={'light-content'} />
            <SafeAreaView style={appStyles.safeareacontainer}>
                <Header onMenuPress={() => navigation.toggleDrawer()} title="New Job" />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}>
                    <ScrollView
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
                        }
                        keyboardShouldPersistTaps={'handled'}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            flexGrow: 1,
                            paddingBottom: 25,
                            paddingHorizontal: 20,
                        }}>
                        <View
                            style={{
                                flex: 1,
                                width: WIDTH,
                                alignItems: 'center',
                                alignSelf: 'center',
                                paddingHorizontal: 10,
                                elevation: 10,
                                backgroundColor: WHITE,
                            }}>
                            <View
                                style={{
                                    flex: 1,
                                    width: WIDTH * 0.96, // Make sure you have a valid WIDTH value (e.g., `Dimensions.get('window').width`)
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    paddingHorizontal: 10,
                                    elevation: 10, // Adds shadow for Android
                                    backgroundColor: WHITE,
                                    borderRadius: 10, // Rounded corners for the card
                                    shadowColor: '#000', // Shadow color
                                    shadowOffset: { width: 0, height: 5 }, // Shadow offset
                                    shadowOpacity: 0.2, // Shadow opacity
                                    shadowRadius: 10, // Shadow spread radius
                                    marginTop: 5,
                                }}>
                                {/* Card Section for Date and Unit */}
                                <View style={{ ...styles.cardContainer, zIndex: 1100 }}>
                                    <View
                                        style={{
                                            width: '100%',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                        }}>
                                        <View
                                            style={{
                                                width: '30%',
                                                flexDirection: 'row',
                                                justifyContent: 'space-around',
                                            }}>
                                            <Text style={styles.sectionTitle}>Job Details</Text>
                                        </View>

                                        {/* refresh clear state button */}
                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: BRAND,
                                                padding: 5,
                                                borderRadius: 10,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                            onPress={() => {
                                                resetForm();
                                                fetchDropdownData();
                                            }}>
                                            <Text
                                                style={{
                                                    color: WHITE,
                                                }}>
                                                Refresh
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.row}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setShowModal(true);
                                            }}
                                            style={styles.inputContainer}>
                                            <Text style={{ ...styles.dropdownHeader, marginTop: 5 }}>
                                                Date
                                            </Text>
                                            <View style={styles.dateContainer}>
                                                <Text style={appStyles.dateText}>
                                                    Date: {startDate}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>

                                        <View style={styles.inputContainer}>
                                            <Text style={styles.dropdownHeader}>Type</Text>
                                            <DropDownPicker
                                                searchable={true}
                                                open={fresholdStates.fresholdOpen}
                                                value={formData.fresh_old} // Correct value should be 'freshold_number'
                                                items={fresholdItems} // Ensure fresholdItems is structured correctly
                                                setOpen={open =>
                                                    setfresholdStates(prevState => ({
                                                        ...prevState,
                                                        fresholdOpen: open,
                                                    }))
                                                }
                                                setValue={callback => {
                                                    const value = callback();
                                                    handleInputChange('fresh_old', value); // Correct field updated
                                                }}
                                                placeholder="fresh/old "
                                                style={styles.dropdownStyle}
                                                textStyle={styles.dropdownTextStyle}
                                            />
                                        </View>
                                    </View>
                                </View>

                                {/* Card Section for Component and Area */}
                                <View style={{ ...styles.cardContainer, zIndex: 1000 }}>
                                    <View style={styles.row}>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.dropdownHeader}>Unit</Text>
                                            <DropDownPicker
                                                searchable={true}
                                                open={dropdownStates.unitOpen}
                                                value={formData.unit_number}
                                                items={unitItems}
                                                setOpen={open =>
                                                    setDropdownStates(prevState => ({
                                                        ...prevState,
                                                        unitOpen: open,
                                                    }))
                                                }
                                                setValue={callback => {
                                                    const value = callback();
                                                    handleInputChange('unit_number', value);
                                                }}
                                                onSelectItem={item => {
                                                    // console.log('item', item);
                                                    UnitSelect(item?.value);
                                                }}
                                                placeholder="Select Unit"
                                                style={styles.dropdownStyle}
                                                textStyle={styles.dropdownTextStyle}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.dropdownHeader}>Component</Text>
                                            <DropDownPicker
                                                scrollViewProps={{
                                                    contentContainerStyle: {
                                                        maxHeight: '300px',
                                                        overflow: 'auto',
                                                    },
                                                    //    ...scrollViewProps,
                                                }}
                                                searchable={true}
                                                autoScroll={true}
                                                open={componentStates.componentOpen}
                                                value={formData.component_name}
                                                items={componentItems}
                                                setOpen={open =>
                                                    setcomponentStates(prevState => ({
                                                        ...prevState,
                                                        componentOpen: open,
                                                    }))
                                                }
                                                setValue={callback => {
                                                    const value = callback();
                                                    handleInputChange('component_name', value);
                                                }}
                                                onSelectItem={item => {
                                                    componentSelect(item?.value);
                                                }}
                                                placeholder="Component"
                                                style={styles.dropdownStyle}
                                                textStyle={styles.dropdownTextStyle}
                                            />
                                        </View>
                                    </View>
                                </View>

                                {/* Additional Card Sections for Other Fields */}
                                <View style={{ ...styles.cardContainer, zIndex: 900 }}>
                                    <View style={styles.row}>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.dropdownHeader}>Area</Text>
                                            <DropDownPicker
                                                searchable={true}
                                                open={areaStates.areaOpen}
                                                value={formData.area}
                                                items={areaItems}
                                                setOpen={open =>
                                                    setAreaStates(prevState => ({
                                                        ...prevState,
                                                        areaOpen: open,
                                                    }))
                                                }
                                                setValue={callback => {
                                                    const value = callback();
                                                    handleInputChange('area', value);
                                                }}
                                                onSelectItem={item => {
                                                    areaSelect(item?.value);
                                                }}
                                                placeholder="Select Area"
                                                style={styles.dropdownStyle}
                                                textStyle={styles.dropdownTextStyle}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.dropdownHeader}>Hanger Number</Text>
                                            <DropDownPicker
                                                searchable={true}
                                                open={hangerStates.hangerOpen}
                                                value={formData.hanger_number}
                                                items={hangerItems}
                                                setOpen={open =>
                                                    setHangerStates(prevState => ({
                                                        ...prevState,
                                                        hangerOpen: open,
                                                    }))
                                                }
                                                setValue={callback => {
                                                    const value = callback();
                                                    handleInputChange('hanger_number', value);
                                                }}
                                                onSelectItem={item => hangerSelect(item?.value)}
                                                placeholder="Hanger Number"
                                                style={styles.dropdownStyle}
                                                textStyle={styles.dropdownTextStyle}
                                            />
                                        </View>
                                    </View>
                                </View>

                                <View style={{ ...styles.cardContainer, zIndex: 800 }}>
                                    <View style={styles.row}>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.dropdownHeader}>Coil Number</Text>
                                            <DropDownPicker
                                                searchable={true}
                                                open={coilStates.coilOpen}
                                                value={formData.coil_number} // Ensure formData.coil_number is a valid value
                                                items={coilItems} // Ensure coilItems has a structure like [{ label: 'Item 1', value: 'item1' }]
                                                setOpen={open =>
                                                    setCoilStates(prevState => ({
                                                        ...prevState,
                                                        coilOpen: open,
                                                    }))
                                                }
                                                setValue={callback => {
                                                    const value = callback();
                                                    handleInputChange('coil_number', value); // Ensure the correct field is updated
                                                }}
                                                onSelectItem={item => coilSelect(item?.value)}
                                                placeholder="Select Coil Number" // Improved placeholder for clarity
                                                style={styles.dropdownStyle}
                                                textStyle={styles.dropdownTextStyle}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.dropdownHeader}>Panel Number</Text>
                                            <DropDownPicker
                                                searchable={true}
                                                open={panelStates.panelOpen}
                                                value={formData.panel_number}
                                                items={panelItems}
                                                setOpen={open =>
                                                    setPanelStates(prevState => ({
                                                        ...prevState,
                                                        panelOpen: open,
                                                    }))
                                                }
                                                // setValue={callback => {
                                                //     const value = callback();
                                                //     handleInputChange('panel_number', value);
                                                // }}
                                                onSelectItem={item => {
                                                    handleInputChange('panel_number', item.value);

                                                    panelSelect(item?.value);
                                                }}
                                                placeholder="Panel Number"
                                                style={styles.dropdownStyle}
                                                textStyle={styles.dropdownTextStyle}
                                            />
                                        </View>
                                    </View>
                                </View>

                                <View style={{ ...styles.cardContainer, zIndex: 700 }}>
                                    <View style={styles.row}>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.dropdownHeader}>Row Number</Text>
                                            <DropDownPicker
                                                searchable={true}
                                                open={rowStates.rowOpen}
                                                value={formData.row_number}
                                                items={rowItems}
                                                setOpen={open =>
                                                    setRowStates(prevState => ({
                                                        ...prevState,
                                                        rowOpen: open,
                                                    }))
                                                }
                                                // setValue={callback => {
                                                //     const value = callback();
                                                //     handleInputChange('row_number', value);
                                                // }}
                                                onSelectItem={item => {
                                                    handleInputChange('row_number', item.value);
                                                    rowSelect(item?.value);
                                                }}
                                                placeholder="Row Number"
                                                style={styles.dropdownStyle}
                                                textStyle={styles.dropdownTextStyle}
                                            />
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <Text style={styles.dropdownHeader}>Elevation</Text>
                                            <DropDownPicker
                                                searchable={true}
                                                open={elevationStates.elevationOpen}
                                                value={formData.elevation} // Should correspond to 'elevation_number'
                                                items={elevationItems} // Ensure elevationItems has a correct structure
                                                setOpen={open =>
                                                    setelevationStates(prevState => ({
                                                        ...prevState,
                                                        elevationOpen: open,
                                                    }))
                                                }
                                                onSelectItem={item => {
                                                    handleInputChange('elevation', item.value);
                                                    elevationSelect(item?.value);
                                                }}
                                                placeholder="Elevation" // Placeholder corrected
                                                style={styles.dropdownStyle}
                                                textStyle={styles.dropdownTextStyle}
                                            />
                                        </View>
                                    </View>
                                </View>

                                <View style={{ ...styles.cardContainer, zIndex: 650 }}>
                                    <View style={styles.row}>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.dropdownHeader}>Wall Blower</Text>
                                            <DropDownPicker
                                                searchable={true}
                                                open={wallBlowerStates.wallBlowerOpen}
                                                value={formData.wall_blower} // Correct value should be 'wallBlower_number'
                                                items={wallBlowerItems} // Ensure wallBlowerItems is structured correctly
                                                setOpen={open =>
                                                    setwallBlowerStates(prevState => ({
                                                        ...prevState,
                                                        wallBlowerOpen: open,
                                                    }))
                                                }
                                                // setValue={callback => {
                                                //     const value = callback();
                                                //     handleInputChange('joint_number', value); // Correct field updated
                                                // }}

                                                onSelectItem={item => {
                                                    handleInputChange('wall_blower', item.value);
                                                    wallblowerSelect(item.value);
                                                }}
                                                placeholder="Wall blower"
                                                style={styles.dropdownStyle}
                                                textStyle={styles.dropdownTextStyle}
                                            />
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <Text style={styles.dropdownHeader}>Panel</Text>
                                            <DropDownPicker
                                                searchable={true}
                                                open={PanellStates.PanellOpen}
                                                value={formData.panel} // Should correspond to 'Panell_number'
                                                items={PanellItems} // Ensure PanellItems has a correct structure
                                                setOpen={open =>
                                                    setPanellStates(prevState => ({
                                                        ...prevState,
                                                        PanellOpen: open,
                                                    }))
                                                }
                                                // setValue={callback => {
                                                //     const value = callback();
                                                //     handleInputChange('tube_number', value); // Correct field updated
                                                // }}

                                                onSelectItem={item => {
                                                    handleInputChange('panel', item.value);
                                                    PanellSelect(item.value);
                                                }}
                                                placeholder="Panel" // Placeholder corrected
                                                style={styles.dropdownStyle}
                                                textStyle={styles.dropdownTextStyle}
                                            />
                                        </View>
                                    </View>
                                </View>

                                <View style={{ ...styles.cardContainer, zIndex: 600 }}>
                                    <View style={styles.row}>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.dropdownHeader}>Neck</Text>
                                            <DropDownPicker
                                                searchable={true}
                                                open={neckStates.neckOpen}
                                                value={formData.neck} // Correct value should be 'neck_number'
                                                items={neckItems} // Ensure neckItems is structured correctly
                                                setOpen={open =>
                                                    setneckStates(prevState => ({
                                                        ...prevState,
                                                        neckOpen: open,
                                                    }))
                                                }
                                                // setValue={callback => {
                                                //     const value = callback();
                                                //     handleInputChange('joint_number', value); // Correct field updated
                                                // }}

                                                onSelectItem={item => {
                                                    handleInputChange('neck', item.value);
                                                    NeckSelect(item.value);
                                                }}
                                                placeholder="Neck"
                                                style={styles.dropdownStyle}
                                                textStyle={styles.dropdownTextStyle}
                                            />
                                        </View>
                                    </View>
                                </View>

                                <View style={{ ...styles.cardContainer, zIndex: 550 }}>
                                    <View style={styles.row}>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.dropdownHeader}>Tube Number</Text>
                                            <DropDownPicker
                                                searchable={true}
                                                open={tubeStates.tubeOpen}
                                                value={formData.tube_number} // Should correspond to 'tube_number'
                                                items={tubeItems} // Ensure tubeItems has a correct structure
                                                setOpen={open =>
                                                    setTubeStates(prevState => ({
                                                        ...prevState,
                                                        tubeOpen: open,
                                                    }))
                                                }
                                                // setValue={callback => {
                                                //     const value = callback();
                                                //     handleInputChange('tube_number', value); // Correct field updated
                                                // }}

                                                onSelectItem={item => {
                                                    handleInputChange('tube_number', item.value);
                                                }}
                                                placeholder="Tube Number" // Placeholder corrected
                                                style={styles.dropdownStyle}
                                                textStyle={styles.dropdownTextStyle}
                                            />
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <Text style={styles.dropdownHeader}>Joint Number</Text>
                                            <DropDownPicker
                                                searchable={true}
                                                open={jointStates.jointOpen}
                                                value={formData.joint_number} // Correct value should be 'joint_number'
                                                items={jointItems} // Ensure jointItems is structured correctly
                                                setOpen={open =>
                                                    setJointStates(prevState => ({
                                                        ...prevState,
                                                        jointOpen: open,
                                                    }))
                                                }
                                                // setValue={callback => {
                                                //     const value = callback();
                                                //     handleInputChange('joint_number', value); // Correct field updated
                                                // }}

                                                onSelectItem={item => {
                                                    handleInputChange('joint_number', item.value);
                                                }}
                                                placeholder="Joint Number"
                                                style={styles.dropdownStyle}
                                                textStyle={styles.dropdownTextStyle}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View style={{ ...styles.cardContainer, zIndex: 525 }}>
                                    <View style={styles.row}>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.dropdownHeader}>Assign Welder</Text>

                                            {/* DropDownPicker for welder selection */}
                                            <DropDownPicker
                                                searchable={true}
                                                open={open}
                                                value={selectedWelder}
                                                items={items}
                                                setOpen={setOpen}
                                                setValue={setSelectedWelder}
                                                setItems={setItems}
                                                placeholder="Select Welder"
                                                style={styles.dropdownStyle}
                                                textStyle={styles.dropdownTextStyle}
                                            />
                                        </View>

                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: BRAND,
                                                height: HEIGHT * 0.05,
                                                width: '40%',
                                                paddingVertical: 15,
                                                borderRadius: 8,
                                                alignItems: 'center',
                                                marginTop: 30,
                                            }}
                                            onPress={() => handleAdd()}>
                                            <Text style={appStyles.submitButtonText}>Add</Text>
                                        </TouchableOpacity>


                                    </View>
                                    <View
                                        style={{
                                            backgroundColor: 'white',
                                            height: HEIGHT * 0.25,
                                            width: '100%',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderWidth: 1,
                                            borderColor: 'lightgray',
                                            borderRadius: 5,
                                            marginBottom: 10,
                                            marginTop: 10
                                        }}
                                    >
                                        <FlatList
                                            data={formData.rows}
                                            nestedScrollEnabled={true}
                                            renderItem={
                                                ({ item }) => (
                                                    <View style={{
                                                        width: '100%',
                                                        alignSelf: 'center',
                                                        backgroundColor: '#fff',
                                                        marginVertical: 8,
                                                        marginHorizontal: 16,
                                                        borderRadius: 8,
                                                        padding: 16,
                                                        elevation: 3, // Adds shadow on Android
                                                        shadowColor: '#000', // iOS shadow settings
                                                        shadowOffset: { width: 0, height: 2 },
                                                        shadowOpacity: 0.2,
                                                        shadowRadius: 4,
                                                    }}>
                                                        <Text style={{
                                                            fontSize: 14,
                                                            marginBottom: 5,
                                                            fontWeight: 'bold',
                                                            color: '#333',
                                                        }}>
                                                            Welder Name: {item.welder_name}
                                                        </Text>
                                                        <Text style={{
                                                            fontSize: 14,
                                                            marginBottom: 5,
                                                            fontWeight: 'bold',
                                                            color: '#333',
                                                        }}>
                                                            Joint Number: {item.joint_number}
                                                        </Text>
                                                        <Text style={{
                                                            fontSize: 14,
                                                            marginBottom: 5,
                                                            fontWeight: 'bold',
                                                            color: '#333',
                                                        }}>
                                                            Tube Number: {item.tube_number}
                                                        </Text>
                                                    </View>
                                                )
                                            }
                                        />

                                    </View>
                                </View>

                                <View style={{ ...styles.cardContainer, zIndex: 500 }}>
                                    <View style={styles.row}>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.label}>Tube Joints</Text>
                                            <TextInput
                                                style={styles.textInput}
                                                value={`${formData.tube_number} ${formData.joint_number}`}
                                                onChangeText={text =>
                                                    handleInputChange(
                                                        'tube_joints',
                                                        `${formData.tube_number} ${formData.joint_number}`,
                                                    )
                                                }
                                                placeholder="Enter Tube Joints"
                                                keyboardType="numeric"
                                                editable={false}
                                            />
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <Text style={styles.label}>Job Description</Text>
                                            <TextInput
                                                style={[styles.textInput, styles.disabledInput]}
                                                value={`${formData.area} ${formData.hanger_number} ${formData.panel_number} ${formData.row_number} ${formData.coil_number} ${formData.wall_blower} ${formData.elevation} ${formData.panel} ${formData.neck}`}
                                                onChangeText={text =>
                                                    handleInputChange(
                                                        'job_desc_number',
                                                        `${formData.area} ${formData.hanger_number} ${formData.panel_number} ${formData.row_number} ${formData.coil_number} ${formData.wall_blower} ${formData.elevation} ${formData.panel} ${formData.neck}`,
                                                    )
                                                }
                                                editable={false} // Disabled field
                                            />
                                        </View>
                                    </View>
                                </View>

                                <View style={{ ...styles.inputContainer, width: '95%' }}>
                                    <Text style={styles.label}>Job Details</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        value={formData.job_details}
                                        onChangeText={text =>
                                            handleInputChange('job_details', text)
                                        }
                                        placeholder="Enter Job Details"
                                        multiline
                                    />
                                </View>

                                {/* Checkbox Section */}
                                <View style={styles.cardContainer}>
                                    <Text style={styles.sectionTitle}>Options</Text>
                                    <View style={styles.checkboxRow}>
                                        <CheckBox
                                            title="RT Required"
                                            checked={formData.rt_required}
                                            onPress={() =>
                                                handleInputChange('rt_required', !formData.rt_required)
                                            }
                                        />
                                        <CheckBox
                                            title="PAUT Required"
                                            checked={formData.paut_required}
                                            onPress={() =>
                                                handleInputChange(
                                                    'paut_required',
                                                    !formData.paut_required,
                                                )
                                            }
                                        />
                                    </View>
                                </View>

                                {/* Submit Button */}
                                <TouchableOpacity
                                    style={appStyles.submitButton}
                                    onPress={() => handleSubmit()}>
                                    <Text style={appStyles.submitButtonText}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
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
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 5,
        // marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        // elevation: 3,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    calendar: {
        alignSelf: 'center',
        width: '80%',
        marginTop: 100,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
    },
    textInput: {
        height: 50,
        paddingHorizontal: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: '#fff',
        fontSize: 16,
        color: '#000',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputContainer: {
        width: '48%', // Makes two fields fit side by side,
    },
    dropdownStyle: {
        width: '100%',
        marginTop: 5,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
    },
    dropdownTextStyle: {
        fontSize: 15,
        color: '#333',
    },
    dropdownHeader: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#444',
        marginBottom: 12,
    },
    dateContainer: {
        height: 50,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    checkboxRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
});

export default NewJob;
