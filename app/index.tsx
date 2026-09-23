import VideoSplash from "@/components/VideoSplash";
import { getLoginStatus } from "@/Utils/authStorage";
import { router } from "expo-router";

export default function Index() {
  const handleSplashvideo = async () => {
    const isLoggedIn = await getLoginStatus();
    router.replace(isLoggedIn ? "/(tabs)/home" : "/onboarding/screen1");
  };

  return <VideoSplash onFinish={handleSplashvideo} />;
}
