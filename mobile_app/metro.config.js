const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push("onnx");
config.maxWorkers = 1;

module.exports = config;
