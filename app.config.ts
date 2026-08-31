import {ExpoConfig, ConfigContext} from 'expo/config'

export default ({config}: ConfigContext): ExpoConfig => {
    return {
        ...config,
        name: "AUTO Mechanic",
        slug: "auto-mechanic",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "automechanic",
        userInterfaceStyle: "light",
        ios: {
            supportsTablet: true,
            infoPlist: {
                SKAdNetworkItems: [
                    {
                        SKAdNetworkIdentifier: "v9wttpbfk9.skadnetwork"
                    },
                    {
                        SKAdNetworkIdentifier: "n38lu8286q.skadnetwork"
                    }
                ]
            }
        },
        android: {
            googleServicesFile: "./google-services.json",
            adaptiveIcon: {
                backgroundColor: "#000000",
                foregroundImage: "./assets/images/android-icon-foreground.png",
                backgroundImage: "./assets/images/android-icon-background.png",
                monochromeImage: "./assets/images/android-icon-monochrome.png"
            },
            predictiveBackGestureEnabled: false,
            package: "com.bunsenplus.automechanic",
            permissions: [
                "android.permission.INTERNET"
            ]
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/favicon.png"
        },
        plugins: [
            "@react-native-vector-icons/ionicons",
            "@react-native-vector-icons/material-design-icons",
            "expo-router",
            [
                "expo-splash-screen",
                {
                    image: "./assets/images/auto-logo.png",
                    resizeMode: "contain",
                    backgroundColor: "#000000"
                }
            ],
            [
                "@react-native-google-signin/google-signin",
                {
                    iosUrlScheme: "com.googleusercontent.apps.EXPO_PUBLIC_IOS_CLIENT_ID"
                }
            ],
            [
                "expo-image-picker",
                {
                    photosPermission: "The app accesses your photos to let you share them with your friends.",
                    color: {
                        "cropToolbarColor": "#000000"
                    },
                    dark: {
                        "colors": {
                            "cropToolbarColor": "#000000"
                        }
                    }
                }
            ],
            [
                "expo-camera",
                {
                    cameraPermission: "Allow AUTO Mechanic to access your camera"
                }
            ],
            [
                "expo-media-library",
                {
                    photosPermission: "Allow AUTO Mechanic to access your photos",
                    savePhotosPermission: "Allow AUTO Mechanic to save photos"
                }
            ],
            "expo-secure-store",
            [
                "react-native-fbsdk-next",
                {
                    appID: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID_HERE || "",
                    clientToken: process.env.EXPO_PUBLIC_FACEBOOK_CLIENT_TOKEN_HERE || "",
                    displayName: "AUTO Mechanic",
                    advertiserIDCollectionEnabled: false,
                    autoLogAppEventsEnabled: false
                }
            ]
        ],
        experiments: {
            typedRoutes: true
        },
        extra: {
            router: {},
            eas: {
                projectId: "96eb9554-f315-4dc4-bf75-53d31bdb9297"
            }
        },
        owner: "bunsenplus-dev"
    }
};