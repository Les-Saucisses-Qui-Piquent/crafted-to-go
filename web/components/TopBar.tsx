import {
	Text,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { ThemedView } from "./ThemedView";
import { COLORS, SIZES } from "@/constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { red } from "react-native-reanimated/lib/typescript/Colors";

export function TopBar() {
	const insets = useSafeAreaInsets();

	return (
		<View style={[styles.safeArea, { paddingTop: insets.top }]}>
			<ThemedView style={styles.container}  >
				<ThemedView style={styles.leftContainer}  >
				<Text>LOGO</Text>
				
				</ThemedView>

				<ThemedView style={styles.centerContainer}  >
					<Text>RECHERCHE</Text>
				</ThemedView>

				<ThemedView style={styles.rightContainer}  >
					<TouchableOpacity style={styles.iconButton} onPress={() => {}}>
						<Text>CLOCHE</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.iconButton} onPress={() => {}}>
						
					</TouchableOpacity>
				</ThemedView>
			</ThemedView>
		</View>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		backgroundColor: "blue",
	},
	container: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 5,
		paddingVertical: SIZES.padding2,
		height: 56,
		backgroundColor: "red",
	},
	leftContainer: {
		alignItems: "flex-start",
		backgroundColor : "transparent"
	},
	centerContainer: {
		flex: 2,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor : "transparent"
	},
	rightContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
		gap: 16,
		backgroundColor : "transparent"
	},
	iconButton: {
		padding: SIZES.padding,
	},
	logo: {
		width: SIZES.width,
		height: 30,
	},
});
