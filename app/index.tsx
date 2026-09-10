// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { router } from "expo-router";
// import React, {useState,useEffect} from "react";
// import { ActivityIndicator, StyleSheet, View } from "react-native";

// export default function Index() {
//   const [loading, setLoading] = useState(true);
//   const [onboardingCompleted, setonboardingCompleted] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     UserStatus();
//   }, []);

//   const UserStatus = async () => {
//     try {
//       const onboarding = await AsyncStorage.getItem("onboardingCompleted");
//       const loggedIn = await AsyncStorage.getItem("isLoggedIn");

//       setonboardingCompleted(onboarding === "true");
//       setIsLoggedIn(loggedIn === "true");
//     } catch (error) {
//       console.error("Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSplashvideo = () => {
//     router.replace("/onboarding/screen1");
//   };

//   {
//     return (
//       <View style={styles.loading}>
//         <ActivityIndicator />
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   loading: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });
import VideoSplash from "@/components/VideoSplash";
import { router } from "expo-router";

export default function Index() {
  const handleSplashvideo = () => {
    router.replace("/onboarding/screen1");
  };

  return <VideoSplash onFinish={handleSplashvideo} />;
}
