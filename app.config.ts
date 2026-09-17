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
        userInterfaceStyle: "automatic",
        ios: {
            googleServicesFile: "./GoogleService-Info.plist",
            bundleIdentifier: "com.bunsenplus.automechanic",
            supportsTablet: true,
            entitlements: {
                "keychain-access-groups": [
                    "$(AppIdentifierPrefix)com.google.GIDSignIn",
                    "$(AppIdentifierPrefix)com.bunsenplus.automechanic"
                ]
            },
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
                "android.permission.INTERNET",
                "android.permission.ACCESS_FINE_LOCATION",
                "android.permission.ACCESS_COARSE_LOCATION"
            ]
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/favicon.png"
        },
        plugins: [
            [
                "@react-native-firebase/app",
                {
                    ios: {
                        disableSPM: true
                    }
                }
            ],
            [
                "expo-build-properties",
                {
                    ios: {
                        useFrameworks: "static"
                    }
                }
            ],
            "@react-native-firebase/messaging",
            "@react-native-vector-icons/ionicons",
            "@react-native-vector-icons/material-design-icons",
            "@react-native-vector-icons/fontawesome",
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
                    iosUrlScheme: process.env.EXPO_PUBLIC_IOS_CLIENT_ID || "com.googleusercontent.apps.588096104374-j5olpk59dc4qlc7pv4gbk6dp42llj2ur"
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
            "expo-secure-store",
            [
                "react-native-fbsdk-next",
                {
                    appID: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID_HERE || "2335665420540929",
                    clientToken: process.env.EXPO_PUBLIC_FACEBOOK_CLIENT_TOKEN_HERE || "326b8c3b119de8ad3451b7b6611e8339",
                    displayName: "AUTO Mechanic",
                    advertiserIDCollectionEnabled: false,
                    autoLogAppEventsEnabled: false
                }
            ],
            [
                "expo-location",
                {
                    locationAlwaysAndWhenInUsePermission: "Allow AUTO Mechanic to access your location to find nearby mechanics."
                }
            ],
            [
                "react-native-maps",
                {
                    androidGoogleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY || process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyCXWyA-jubhPCNDQ2cc1e4ZkKXRT5bhaW8",
                    iosGoogleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY || process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyCXWyA-jubhPCNDQ2cc1e4ZkKXRT5bhaW8"
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