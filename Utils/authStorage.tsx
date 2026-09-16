import AsyncStorage from "@react-native-async-storage/async-storage";

const LOGIN_KEY = "isLoggedIn";

// Set login status
export const setLoginStatus = async (status: boolean) => {
  try {
    await AsyncStorage.setItem(LOGIN_KEY, JSON.stringify(status));
  } catch (error) {
    console.log("Error saving login status:", error);
    throw error;
  }
};

// Get login status
export const getLoginStatus = async (): Promise<boolean> => {
  try {
    const status = await AsyncStorage.getItem(LOGIN_KEY);

    return status === "true";
  } catch (error) {
    console.log("Error getting login status:", error);
    return false;
  }
};

// Logout
export const logoutUser = async () => {
  try {
    await AsyncStorage.setItem(LOGIN_KEY, "false");
  } catch (error) {
    console.log("Error logging out:", error);
    throw error;
  }
};
