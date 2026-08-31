// import { useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";
// import {
//     Alert,
//     Image,
//     Pressable,
//     StyleSheet,
//     Text,
//     TextInput,
//     View,
// } from "react-native";

// import * as Facebook from "expo-auth-session/providers/facebook";
// import * as Google from "expo-auth-session/providers/google";
// import * as WebBrowser from "expo-web-browser";

// WebBrowser.maybeCompleteAuthSession();

// const YOUR_BACKEND_API_URL = "http://192.168.1";

// const LoginScreen: React.FC = () => {
//   const router = useRouter();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const [googleRequest, googleResponse, promptGoogleAsync] =
//     Google.useAuthRequest({
//       androidClientId:
//         "YOUR_ANDROID_CLIENT_ID_FROM_GOOGLE_://googleusercontent.com",
//       iosClientId: "YOUR_IOS_CLIENT_ID_FROM_GOOGLE_://googleusercontent.com",
//       webClientId: "YOUR_WEB_CLIENT_ID_FROM_GOOGLE_://googleusercontent.com",
//     });

//   const [facebookRequest, facebookResponse, promptFacebookAsync] =
//     Facebook.useAuthRequest({
//       clientId: "YOUR_FACEBOOK_APP_ID_FROM_META_DEVELOPERS",
//     });

//   useEffect(() => {
//     if (googleResponse?.type === "success" && googleResponse.authentication) {
//       const { accessToken } = googleResponse.authentication;
//       sendTokenToYourBackend("google", accessToken);
//     }
//   }, [googleResponse]);

//   useEffect(() => {
//     if (
//       facebookResponse?.type === "success" &&
//       facebookResponse.authentication
//     ) {
//       const { accessToken } = facebookResponse.authentication;
//       sendTokenToYourBackend("facebook", accessToken);
//     }
//   }, [facebookResponse]);

//   const sendTokenToYourBackend = async (
//     provider: "google" | "facebook",
//     token: string,
//   ) => {
//     try {
//       const response = await fetch(YOUR_BACKEND_API_URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           token: token,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         Alert.alert("Success", `Logged in successfully via ${provider}!`);

//         router.replace("/");
//       } else {
//         Alert.alert(
//           "Login Failed",
//           data.message || "Could not authenticate with your server.",
//         );
//       }
//     } catch (error) {
//       console.error("Backend communication error:", error);
//       Alert.alert("Server Error", "Cannot connect to your backend service.");
//     }
//   };

//   return (
//     <View style={styles.page}>
//       <View style={styles.content}>
//         <View style={styles.logoPlaceholder}>
//           <Image
//             source={require("../assets/logo.png")}
//             style={styles.logo}
//             resizeMode="contain"
//           />
//         </View>

//         <View style={styles.headerContainer}>
//           <Text style={styles.title}>Welcome</Text>
//           <Text style={styles.subtitle}>Insert your username and password</Text>
//         </View>

//         <View style={styles.form}>
//           <View style={styles.inputWrapper}>
//             <Text style={styles.label}>Username</Text>
//             <TextInput
//               style={styles.input}
//               value={username}
//               onChangeText={setUsername}
//               placeholderTextColor="#5a5c66"
//               autoCapitalize="none"
//             />
//           </View>

//           <View style={styles.inputWrapper}>
//             <Text style={styles.label}>Password</Text>
//             <TextInput
//               style={styles.input}
//               value={password}
//               onChangeText={setPassword}
//               secureTextEntry
//               placeholderTextColor="#5a5c66"
//               autoCapitalize="none"
//             />
//           </View>
//         </View>

//         <View style={styles.socialContainer}>
//           <Text style={styles.socialText}>Or log in with</Text>
//           <View style={styles.socialButtonsRow}>
//             <Pressable style={styles.socialCircle}>
//               <Text style={styles.appleIcon}>Apple</Text>
//             </Pressable>

//             <Pressable
//               disabled={!facebookRequest}
//               onPress={() => promptFacebookAsync()}
//               style={({ pressed }) => [
//                 styles.socialCircle,
//                 pressed && styles.pressed,
//               ]}
//             >
//               <Text style={styles.facebookIcon}>f</Text>
//             </Pressable>

//             <Pressable
//               disabled={!googleRequest}
//               onPress={() => promptGoogleAsync()}
//               style={({ pressed }) => [
//                 styles.socialCircle,
//                 pressed && styles.pressed,
//               ]}
//             >
//               <Text style={styles.googleIcon}>G</Text>
//             </Pressable>
//           </View>
//         </View>

//         <View style={styles.actions}>
//           <Pressable style={[styles.button, styles.loginButton]}>
//             <Text style={styles.loginText}>Login</Text>
//           </Pressable>

//           <Pressable
//             onPress={() => router.push("/register")}
//             style={[styles.button, styles.registerButton]}
//           >
//             <Text style={styles.registerText}>Register</Text>
//           </Pressable>
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   page: { flex: 1, backgroundColor: "#161b22" },
//   content: {
//     flex: 1,
//     paddingTop: 60,
//     paddingHorizontal: 32,
//     paddingBottom: 40,
//     justifyContent: "space-between",
//   },
//   logoPlaceholder: { alignSelf: "center", marginTop: 10 },
//   logo: { width: 112, height: 38 },
//   logoTextFake: {
//     color: "#ffffff",
//     fontSize: 24,
//     fontWeight: "bold",
//     letterSpacing: 2,
//   },
//   headerContainer: { marginTop: 20 },
//   title: {
//     color: "#ffffff",
//     fontSize: 40,
//     fontWeight: "800",
//     letterSpacing: -0.5,
//   },
//   subtitle: { color: "#a3a7b0", fontSize: 15, marginTop: 8 },
//   form: { marginTop: 20, gap: 28 },
//   inputWrapper: { width: "100%" },
//   label: { color: "#7e838d", fontSize: 12, fontWeight: "600", marginBottom: 4 },
//   input: {
//     width: "100%",
//     height: 36,
//     borderBottomWidth: 1.5,
//     borderBottomColor: "#484e57",
//     color: "#ffffff",
//     fontSize: 16,
//     paddingVertical: 4,
//   },
//   socialContainer: { alignItems: "center", marginTop: 20 },
//   socialText: {
//     color: "#8b949e",
//     fontSize: 12,
//     fontWeight: "600",
//     marginBottom: 16,
//   },
//   socialButtonsRow: { flexDirection: "row", gap: 16 },
//   socialCircle: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: "#ffffff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   appleIcon: { color: "#000000", fontSize: 12, fontWeight: "700" },
//   facebookIcon: { color: "#1877F2", fontSize: 22, fontWeight: "700" },
//   googleIcon: { color: "#EA4335", fontSize: 22, fontWeight: "700" },
//   actions: { gap: 12, marginTop: "auto", paddingTop: 20 },
//   button: {
//     width: "100%",
//     height: 52,
//     borderRadius: 26,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   registerButton: { borderWidth: 1.5, borderColor: "#ffffff" },
//   loginButton: { backgroundColor: "#ffffff" },
//   loginText: { color: "#161b22", fontSize: 16, fontWeight: "700" },
//   registerText: { color: "#ffffff", fontSize: 16, fontWeight: "700" },
//   pressed: { opacity: 0.7 },
// });

// export default LoginScreen;
