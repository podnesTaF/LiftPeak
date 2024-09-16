import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import React, { useCallback, useRef, useState } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Colors } from "@shared/styles";
import { Ionicons } from "@expo/vector-icons";
import ProfileListItemCard from "@shared/components/ProfileListItemCard";
import { useProfileStore } from "../store";
import { ISocialMediaLink, SocialMediaPlatform } from "@entities/user";
import { useAuthStore } from "@features/auth";

const socialMediaPlatforms = [
  { label: "Instagram", value: SocialMediaPlatform.Instagram },
  { label: "Snapchat", value: SocialMediaPlatform.Snapchat },
  { label: "Twitter", value: SocialMediaPlatform.Twitter },
];

const generateSocialMediaUrl = (
  platform: SocialMediaPlatform,
  username: string
) => {
  switch (platform) {
    case SocialMediaPlatform.Instagram:
      return `https://www.instagram.com/${username}`;
    case SocialMediaPlatform.Snapchat:
      return `https://www.snapchat.com/add/${username}`;
    case SocialMediaPlatform.Twitter:
      return `https://www.twitter.com/${username}`;
    default:
      return "";
  }
};

const SocialMediaPicker = () => {
  const [selectedPlatform, setSelectedPlatform] =
    useState<SocialMediaPlatform | null>(null);
  const [username, setUsername] = useState("");
  const { links, addLink, removeLink } = useProfileStore();
  const { user } = useAuthStore();

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        opacity={0.7}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        enableTouchThrough={false}
        {...props}
      />
    ),
    []
  );

  const handleAddLink = () => {
    if (selectedPlatform && username) {
      const socialMediaUrl = generateSocialMediaUrl(selectedPlatform, username);

      if (links && links.some((link) => link.platform === selectedPlatform)) {
        alert(`${selectedPlatform} has already been added.`);
        return;
      }

      const newLink: ISocialMediaLink = {
        id: Date.now(),
        platform: selectedPlatform,
        url: socialMediaUrl,
        profileId: user!.id,
      };

      addLink(newLink);
      setUsername("");
      setSelectedPlatform(null);
    } else {
      alert("Please select a platform and enter a username.");
    }
  };

  const menuRef = useRef<BottomSheetModal>(null);

  const handleMenuOpen = () => {
    menuRef.current?.present();
  };

  const handleMenuClose = () => {
    menuRef.current?.dismiss();
  };

  return (
    <View>
      <View style={{gap: 15}}>
        <View style={{ gap: 20 }}>
          <View style={{ gap: 8 }}>
            <Text style={styles.label}>Add Social Media</Text>
            <TouchableOpacity onPress={handleMenuOpen} style={styles.input}>
              <Text style={styles.inputText}>
                {selectedPlatform
                  ? selectedPlatform.charAt(0).toUpperCase() +
                    selectedPlatform.slice(1).toLowerCase()
                  : "Select Platform"}
              </Text>
              <Ionicons
                name="chevron-forward-sharp"
                size={20}
                color={Colors.dark300}
              />
            </TouchableOpacity>
          </View>

          {selectedPlatform && (
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                placeholder={`Enter your ${selectedPlatform} username`}
                value={username}
                onChangeText={setUsername}
                autoComplete="off"
                textContentType="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddLink}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {links &&
          links.map((item) => (
            <ProfileListItemCard
              key={item.url}
              item={item}
              displayKey={item.platform}
              displayText={item.url}
              onPress={() => removeLink(item)}
            />
          ))}
      </View>

      <BottomSheetModal
        ref={menuRef}
        backgroundStyle={styles.backgroundStyle}
        backdropComponent={renderBackdrop}
        snapPoints={["28%", "50%"]}
      >
        <BottomSheetView style={styles.contentContainer}>
          {socialMediaPlatforms.map((button) => (
            <TouchableOpacity
              key={button.value}
              style={styles.buttonContainer}
              onPress={() => {
                setSelectedPlatform(button.value);
                handleMenuClose();
              }}
            >
              {button.value === SocialMediaPlatform.Instagram && (
                <Ionicons name="logo-instagram" size={24} color="white" />
              )}
              {button.value === SocialMediaPlatform.Snapchat && (
                <Ionicons name="logo-snapchat" size={24} color="white" />
              )}
              {button.value === SocialMediaPlatform.Twitter && (
                <Ionicons name="logo-twitter" size={24} color="white" />
              )}
              <Text style={styles.buttonText}>{button.label}</Text>
            </TouchableOpacity>
          ))}
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

export default SocialMediaPicker;

const styles = StyleSheet.create({
  label: {
    color: Colors.dark300,
    fontSize: 16,
  },
  input: {
    borderRadius: 8,
    minHeight: 48,
    backgroundColor: Colors.dark500,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputText: {
    color: Colors.white,
    fontSize: 18,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: Colors.dark500,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  textInput: {
    flex: 1,
    color: Colors.white,
    fontSize: 16,
    marginRight: 10,
    paddingHorizontal: 10,
    borderColor: "transparent",
    borderWidth: 0,
  },
  addButton: {
    backgroundColor: Colors.success,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  backgroundStyle: {
    backgroundColor: Colors.dark700,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  contentContainer: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 14,
    gap: 6,
  },
  buttonText: {
    color: Colors.white,
    marginLeft: 10,
    fontSize: 17,
  },
});
