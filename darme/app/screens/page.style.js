import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../constants/theme";

const pages = StyleSheet.create({
    viewOne: { backgroundColor: COLORS.primary, height: SIZES.height },
    viewTwo: {
        backgroundColor: '#C0C0C0',
        height: SIZES.height - 140,
        borderBottomEndRadius: 30,
        borderBottomStartRadius: 30,
    },
    viewThree: {
        backgroundColor: '#C0C0C0',
        height: SIZES.height - 80,
        borderBottomEndRadius: 30,
        borderBottomStartRadius: 30,
    },
});

export default pages;