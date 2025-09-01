export default ({ config }) => {
  const res = {
    ...config,
    name: "League Lock",
    slug: "mobile-ts-client",
    version: "1.0.2",
    orientation: "portrait",
    icon: "./assets/leaguelock.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/leaguelock.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      bundleIdentifier: "com.maxnbf.mobiletsclient",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
      name: "League Lock",
      supportsTablet: false,
      deviceFamilies: [1],
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
