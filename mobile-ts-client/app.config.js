export default ({ config }) => {
  const res = {
    ...config,
    name: "Prem Predictor",
    slug: "mobile-ts-client",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/premlogo.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/premlogo.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.maxnbf.mobiletsclient", // need to put in real thing? from apple developer
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: true,
        },
      },
    },
    updates: {
      url: "https://u.expo.dev/1eca2a24-57ce-476f-aa3d-ab6e8d0c02e4",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.maxnbf.mobiletsclient",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "1eca2a24-57ce-476f-aa3d-ab6e8d0c02e4",
      },
    },
  };
  return res;
};
