import {
	Text,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { ThemedView } from "./ThemedView";
import { COLORS, SIZES } from "@/constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function TopBar() {
	const insets = useSafeAreaInsets();

	return (
		<View style={[styles.safeArea, { paddingTop: insets.top }]}>
			<ThemedView style={styles.container}>
				
			</ThemedView>
		</View>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		backgroundColor: COLORS.white,
	},
	container: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: SIZES.padding2,
		height: 56,
		backgroundColor: COLORS.white,
	},
});
