import { Alert, Linking } from "react-native";

/**
 * Initiates a phone call to the specified number with validation and error dialogs.
 */
export async function callPhoneNumber(phone?: string, contactName?: string): Promise<void> {
  if (!phone) {
    Alert.alert(
      "No Phone Number",
      `${contactName || "This contact"} does not have a registered phone number.`
    );
    return;
  }

  const cleanPhone = phone.replace(/[^0-9+]/g, "");
  const url = `tel:${cleanPhone}`;

  try {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      Alert.alert("Unable to Call", `This device cannot place calls to ${phone}`);
      return;
    }
    await Linking.openURL(url);
  } catch (error) {
    console.warn("[Phone] Could not place call:", error);
    Alert.alert("Unable to Call", `Could not place a call to ${phone}`);
  }
}
