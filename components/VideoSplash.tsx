import { useVideoPlayer, VideoView } from "expo-video";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";

type VideoSplashProp = {
  onFinish: () => void;
};

const VideoSplash = ({ onFinish }: VideoSplashProp) => {
  const player = useVideoPlayer(
    require("../assets/video/tanposhsplash.mp4"),
    (player) => {
      player.loop = false;
      player.play();
    },
  );
  // this hook hold our videosplash when to start and End //
  useEffect(() => {
    const mood = player.addListener("playToEnd", () => {
      onFinish();
    });
    return () => mood.remove();
  }, [player, onFinish]);

  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
      />
    </View>
  );
};

export default VideoSplash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1F3A",
  },
  video: {
    width: "100%",
    height: "90%",
    alignSelf: "center",
    margin: 60,
  },
});
