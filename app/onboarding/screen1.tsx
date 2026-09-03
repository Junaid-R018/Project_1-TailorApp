import { theme } from "@/styles/theme";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from "react-native";

const { width, height } = Dimensions.get("window");

const slides = [
  { id: "1", image: require("../../assets/images/screen1.png") },
  { id: "2", image: require("../../assets/images/screen2.png") },
  { id: "3", image: require("../../assets/images/screen3.png") },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<(typeof slides)[number]>>(null);

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const nextIndex = viewableItems[0]?.index;
      if (nextIndex !== null && nextIndex !== undefined) {
        setCurrentIndex(nextIndex);
      }
    },
  ).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      return;
    }

    router.replace("/(auth)/login");
  };

  const renderItem = ({ item }: { item: (typeof slides)[number] }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} resizeMode="cover" />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
      />

      <Pressable style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextText}>
          {currentIndex === slides.length - 1 ? "Get started" : "Next"}
        </Text>
      </Pressable>

      <View style={styles.pagination}>
        {slides.map((slide, index) => (
          <View
            key={slide.id}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.secondaryDark,
  },
  slide: {
    width,
    height,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  nextButton: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    zIndex: 10,
    borderRadius: theme.radius.large,
    width: "90%",
    paddingVertical: 15,
    backgroundColor: theme.color.textNavy,
    borderWidth: theme.borderWidth.thin,
    borderColor: theme.color.textGold,
  },
  nextText: {
    color: theme.color.textGold,
    fontSize: theme.font.size.large,
    fontWeight: theme.font.weight.semiBold,
    textAlign: "center",
    justifyContent: "center",
  },
  pagination: {
    position: "absolute",
    bottom: 65,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: theme.radius.medium,
    backgroundColor: theme.color.primaryDark,
    marginHorizontal: 5,
  },
  activeDot: {
    width: 24,
  },
});
