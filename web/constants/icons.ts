
import Ionicons from "@react-native-vector-icons/ionicons";

export type IconData = {
    component: React.ComponentType<any>;
    name?: string;
};

export const icons: Record<string, IconData> = {
    filter: {
        component: Ionicons, name: "filter",
    },
    "arrow-forward": {
        component: Ionicons, name: "arrow-forward",
    },

}