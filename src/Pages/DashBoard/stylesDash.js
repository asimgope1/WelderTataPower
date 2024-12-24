import { RFValue } from "react-native-responsive-fontsize";
import { EXTRABOLD } from "../../constants/fontfamily";
import { BLACK, WHITE } from "../../constants/color";
import { HEIGHT, WIDTH } from "../../constants/config";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    calendarContainer: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginTop: 20, // Add top margin to elevate the calendar
        marginBottom: 20, // Add bottom margin
        backgroundColor: 'white',
        borderRadius: 10, // Add rounded corners for the elevated look
        elevation: 5, // Add shadow for elevation
        borderBottomColor: 'lightgray',
        borderBottomWidth: 1,
    },
    calendarList: {
        flexDirection: 'row',
    },
    dateItem: {
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginHorizontal: 5,
        backgroundColor: '#f0f0f0',
        elevation: 4,
        margin: 10,
    },
    selectedDateItem: {
        backgroundColor: '#215be9',
    },
    dateText: {
        fontSize: 18,
        color: 'black',
        fontFamily: 'Poppins-Regular',
    },
    selectedDateText: {
        color: 'white',
        fontFamily: 'Poppins-Bold',
    },
    monthText: {
        fontSize: 12,
        color: 'gray',
        fontFamily: 'Poppins-Regular',
    },
    selectedMonthText: {
        color: 'white',
        fontFamily: 'Poppins-Medium',
    },
    bannerContainer: {
        marginTop: -25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bannerContainer1: {
        marginTop: HEIGHT * 0.07,
        alignItems: 'center',
        justifyContent: 'center',
        height: HEIGHT * 0.1,
        marginBottom: HEIGHT * 0.09,
    },
    bannerCard: {
        width: WIDTH * 0.9,
        height: HEIGHT * 0.12,
        borderRadius: 10,
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 15,
        elevation: 5,
    },
    bannerCard1: {
        width: WIDTH * 0.9,
        height: HEIGHT * 0.3,
        borderRadius: 10,
        backgroundColor: 'white',
        // paddingHorizontal: 20,
        // paddingVertical: 15,
        elevation: 5,
        padding: 20,
    },
    bannerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        // alignSelf: 'center',
    },
    section: {
        alignItems: 'center',
    },
    sectionTitle: {
        fontFamily: EXTRABOLD,
        fontSize: RFValue(12),
        color: BLACK,
    },
    sectionData: {
        fontFamily: EXTRABOLD,
        fontSize: RFValue(16),
        color: BLACK,
    },
    separator: {
        width: 1,
        height: 40,
        backgroundColor: 'lightgray',
    },
    mainContent: {
        marginHorizontal: 15,
        marginVertical: 10,
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // paddingVertical: 15,
        // paddingHorizontal: 20,
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
        borderLeftWidth: 5,
        backgroundColor: WHITE,
        elevation: 5,
        width: '99%'
    },
    cardTitle: {
        fontSize: RFValue(13),
        color: BLACK,
        fontFamily: EXTRABOLD,
    },
    statusContainer: {
        flexDirection: 'row',
        width: '25%',
        alignItems: 'center',

    },
    cardStatus: {
        fontSize: RFValue(12),
        color: BLACK,
        fontFamily: 'Poppins-Medium',
        marginRight: 5,
    },
    blinkingCircle: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    listContainer: {
        paddingBottom: 30,
    },
    cardSubtitle: {
        fontSize: RFValue(14),
        color: 'gray',
        fontFamily: 'Poppins-Regular',
    },
    startButton: {
        marginTop: 10, // Adds space between the status and the button
        padding: 10,

        borderRadius: 5,
        alignItems: 'center',
    },
    stopButton: {
        marginTop: 10, // Adds space between the status and the button
        padding: 10,
        backgroundColor: 'red',
        borderRadius: 5,
        alignItems: 'center',
    },
    startButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        // padding: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 25,
        right: 20,
        zIndex: 1,
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 10
    },
    closeButtonText: {
        fontSize: 18,
        color: 'black',
    },
    modalContent: {
        width: WIDTH * 0.8,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: RFValue(18),
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: EXTRABOLD,
        color: BLACK,
    },
    modalSubtitle: {
        fontSize: RFValue(14),
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
        color: BLACK,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    otpBox: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        width: 50,
        height: 50,
        textAlign: 'center',
        fontSize: 18,
        marginHorizontal: 5,
        color: BLACK,
    },
    verifyButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
    },
    verifyButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'red'
    },
    noDataText: {
        fontSize: 18,
        color: 'black',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
        color: BLACK
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    column: {
        flex: 1,
        marginRight: 10, // For spacing between columns
    },
    halfInput: {
        height: 40,
        borderColor: '#ccc',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        // paddingHorizontal: 10,
        backgroundColor: '#fff',
        color: BLACK
    },
    cardContainer: {
        width: '90%',
        height: HEIGHT * 0.16,
        padding: 10,

        backgroundColor: '#fff',
        borderRadius: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,  // for Android shadow
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10,
        // elevation: 3, // for Android shadow
        shadowColor: '#000', // for iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    cardHeader: {
        marginBottom: 8,
    },

    cardSubTitle: {
        fontSize: 14,
        color: '#666',
    },
    cardBody: {
        marginTop: 8,
    },
    cardBodyText: {
        fontSize: 16,
        color: '#444',
    },
});