import { StyleSheet } from "react-native";
import { BLACK, BRAND, GRAY, WHITE } from "../constants/color";
import { HEIGHT, WIDTH } from "../constants/config";
export const appStyles = StyleSheet.create({
  safeareacontainer: {
    flex: 1,
    backgroundColor: WHITE,
  },
  maincontainer: {
    flex: 1,
    alignItems: "center",
  },
  customButtonWrapper: {
    width: "100%",
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  textcolor: {
    color: BLACK,
  },
  customTextInputWrapper: {
    width: "90%",
    alignSelf: "center",
  },
  termstextWrapper: {
    width: "100%",
  },
  rowInputsStyleWrapper: {
    flexDirection: "row",
    width: "90%",
    alignSelf: "center",
    justifyContent: "space-between",
    // backgroundColor: "red",
  },
  dateSection: {
    marginVertical: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: GRAY,
  },
  dropdown: {
    backgroundColor: WHITE,
    // width: '30%',
    borderWidth: 1,
    borderColor: GRAY,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
  },
  dropdownStyle: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: GRAY,
  },
  checkboxContainer: {
    marginVertical: 20,
    width: '100%',
    alignItems: 'flex-start',
  },
  checkbox: {
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: BRAND,
    width: '100%',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButtonText: {
    fontSize: 18,
    color: WHITE,
  },
});
