// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import { Image, Pressable, StyleSheet, Text, View } from "react-native";

// const SLIDE_COUNT = 2;

// const LoginHomepage: React.FC = () => {
//   const router = useRouter();
//   const [activeSlide] = useState(1);

//   return (
//     <View style={styles.page}>
//       <View style={styles.layers}>
//         <View style={styles.content}>
//           <Image
//             source={require("../assets/logo.png")}
//             style={styles.logo}
//             resizeMode="contain"
//           />

//           <View style={styles.bottomContent}>
//             <Text style={styles.title}>Lets Get{"\n"}started with us</Text>

//             <Text style={styles.description}>
//               Quality NUmber One, Quality repair assured with system tracking to
//               facilitate easy repair monitoring for vehicles owners . Active
//               customer Support to help attend to your Complains in minutes.
//             </Text>

//             <View style={styles.pagination}>
//               {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
//                 <Pressable
//                   key={i}
//                   onPress={() => {
//                     if (i === 0) {
//                       router.replace("/login");
//                     }
//                   }}
//                   accessibilityRole="button"
//                   accessibilityLabel={`Open onboarding slide ${i + 1}`}
//                   hitSlop={12}
//                   style={[
//                     styles.dot,
//                     i === activeSlide ? styles.activeDot : styles.inactiveDot,
//                   ]}
//                 />
//               ))}
//             </View>

//             <View style={styles.actions}>
//               <Pressable
//                 onPress={() => router.push("/login-form")}
//                 style={({ pressed }) => [
//                   styles.button,
//                   styles.loginButton,
//                   pressed && styles.pressed,
//                 ]}
//               >
//                 <Text style={styles.loginText}>Login</Text>
//               </Pressable>

//               <Pressable
//                 onPress={() => router.push("/register")}
//                 style={({ pressed }) => [
//                   styles.button,
//                   styles.registerButton,
//                   pressed && styles.pressed,
//                 ]}
//               >
//                 <Text style={styles.registerText}>Register</Text>
//               </Pressable>
//             </View>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   page: {
//     flex: 1,
//     position: "relative",
//     width: "100%",
//     maxWidth: 430,
//     alignSelf: "center",
//     overflow: "hidden",
//     backgroundColor: "#0b0d12",
//   },
//   background: {
//     ...StyleSheet.absoluteFill,
//     width: "100%",
//     height: "100%",
//   },
//   layers: {
//     flex: 1,
//   },
//   overlay: {
//     ...StyleSheet.absoluteFill,
//     backgroundColor: "#161b22",
//   },
//   bottomShade: {
//     position: "absolute",
//     right: 0,
//     bottom: 0,
//     left: 0,
//     height: "54%",
//     backgroundColor: "#161b22",
//   },
//   content: {
//     flex: 1,
//     paddingTop: 38,
//     paddingHorizontal: 26,
//     paddingBottom: 24,
//   },
//   logo: {
//     width: 112,
//     height: 38,
//     alignSelf: "center",
//   },
//   bottomContent: {
//     flex: 1,
//     justifyContent: "flex-end",
//     paddingBottom: 0,
//   },
//   title: {
//     color: "#ffffff",
//     fontSize: 28,
//     lineHeight: 33,
//     fontWeight: "700",
//     marginBottom: 10,
//   },
//   description: {
//     color: "#c2c4ca",
//     fontSize: 12,
//     lineHeight: 16,
//     maxWidth: 320,
//     marginBottom: 24,
//   },
//   pagination: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 7,
//     marginBottom: 30,
//   },
//   dot: {
//     height: 6,
//     borderRadius: 3,
//   },
//   activeDot: {
//     width: 20,
//     backgroundColor: "#ffffff",
//   },
//   inactiveDot: {
//     width: 6,
//     backgroundColor: "#4a4c56",
//   },
//   actions: {
//     gap: 10,
//   },
//   button: {
//     width: "100%",
//     height: 44,
//     borderRadius: 18,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   loginButton: {
//     backgroundColor: "#ffffff",
//   },
//   registerButton: {
//     borderWidth: 1,
//     borderColor: "rgba(255, 255, 255, 0.8)",
//   },
//   loginText: {
//     color: "#0b0d12",
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   registerText: {
//     color: "#ffffff",
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   pressed: {
//     opacity: 0.75,
//   },
// });

// export default LoginHomepage;
