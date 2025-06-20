import Ionicons from "@react-native-vector-icons/ionicons";

export type IconData = {
  component: React.ComponentType<any>;
  name?: string;
};

export const icons: Record<string, IconData> = {
  filter: {
    component: Ionicons,
    name: "filter",
  },
  "arrow-forward": {
    component: Ionicons,
    name: "arrow-forward",
  },
  "cloud-upload-outline": {
    component: Ionicons,
    name: "cloud-upload-outline",
  },
  close: {
    component: Ionicons,
    name: "close",
  },
  "ellipsis-vertical": {
    component: Ionicons,
    name: "ellipsis-vertical",
  },

  home: {
    component: Ionicons,
    name: "home-outline",
  },
  person: {
    component: Ionicons,
    name: "person-outline",
  },
  receipt: {
    component: Ionicons,
    name: "receipt-outline",
  },
  grid: {
    component: Ionicons,
    name: "grid-outline",
  },

  "home-active": {
    component: Ionicons,
    name: "home",
  },
  "person-active": {
    component: Ionicons,
    name: "person",
  },
  "receipt-active": {
    component: Ionicons,
    name: "receipt",
  },
  "grid-active": {
    component: Ionicons,
    name: "grid",
  },
  "cart-outline": {
    component: Ionicons,
    name: "cart-outline",
  },
  "notifications-outline": {
    component: Ionicons,
    name: "notifications-outline",
  },
  notifications: {
    component: Ionicons,
    name: "notifications",
  },
  "search-outline": {
    component: Ionicons,
    name: "search-outline",
  },
  search: {
    component: Ionicons,
    name: "search",
  },
  "add-outline": {
    component: Ionicons,
    name: "add-outline",
  },
  add: {
    component: Ionicons,
    name: "add",
  },
  "remove-outline": {
    component: Ionicons,
    name: "remove-outline",
  },
  remove: {
    component: Ionicons,
    name: "remove",
  },
  "trash-outline": {
    component: Ionicons,
    name: "trash-outline",
  },
  "pricetag-outline": {
    component: Ionicons,
    name: "pricetag-outline",
  },
  "information-circle-outline": {
    component: Ionicons,
    name: "information-circle-outline",
  },
  "chevron-back-outline": {
    component: Ionicons,
    name: "chevron-back-outline",
  },
  "chevron-forward-outline": {
    component: Ionicons,
    name: "chevron-forward-outline",
  },
  "chevron-down-outline": {
    component: Ionicons,
    name: "chevron-down-outline",
  },
  "chevron-up-outline": {
    component: Ionicons,
    name: "chevron-up-outline",
  },
  "chevron-back": {
    component: Ionicons,
    name: "chevron-back",
  },
  "chevron-forward": {
    component: Ionicons,
    name: "chevron-forward",
  },
  "chevron-down": {
    component: Ionicons,
    name: "chevron-down",
  },
  "chevron-up": {
    component: Ionicons,
    name: "chevron-up",
  },
  "arrow-back-outline": {
    component: Ionicons,
    name: "arrow-back-outline",
  },
};
