import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "user";
const LOGIN_KEY = "isLoggedIn";

export type User = {
  id?: string;
  First_Name: string;
  Last_Name: string;
  phone: string;
  password: string;
};

// Save user information
export const saveUser = async (user: User) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.log("Error saving user:", error);
  }
};

// Get user information
export const getUser = async (): Promise<User | null> => {
  try {
    const user = await AsyncStorage.getItem(USER_KEY);

    if (!user) {
      return null;
    }

    return JSON.parse(user);
  } catch (error) {
    console.log("Error getting user:", error);
    return null;
  }
};

export const validateUser = async (
  phone: string,
  password: string,
): Promise<boolean> => {
  try {
    const user = await getUser();
    if (!user) {
      return false;
    }

    return user.phone === phone && user.password === password;
  } catch (error) {
    console.log("Error validating user:", error);
    return false;
  }
};

// Set login status
export const setLoginStatus = async (status: boolean) => {
  try {
    await AsyncStorage.setItem(LOGIN_KEY, JSON.stringify(status));
  } catch (error) {
    console.log("Error saving login status:", error);
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

// Remove user
export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.log("Error removing user:", error);
  }
};

// Logout
export const logoutUser = async () => {
  try {
    await AsyncStorage.setItem(LOGIN_KEY, "false");
  } catch (error) {
    console.log("Error logging out:", error);
  }
};
