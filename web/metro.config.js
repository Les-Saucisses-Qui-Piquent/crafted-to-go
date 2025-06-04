const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

// Set the app root for Expo Router before getting config
process.env.EXPO_ROUTER_APP_ROOT = path.resolve(__dirname, "./app");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
