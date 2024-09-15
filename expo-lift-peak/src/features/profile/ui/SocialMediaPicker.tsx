import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
} from "react-native";
import React, { useCallback, useRef, useState } from "react";
import CustomBottomSheet from "@shared/components/bottomSheet/CustomBottomSheet";
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Colors } from "@shared/styles";
import { Ionicons, FontAwesome } from "@expo/vector-icons"; // Import icons

type SocialMediaPlatform = "instagram" | "snapchat" | "twitter" | null;

const socialMediaPlatforms = [
    { label: "Instagram", value: "instagram" },
    { label: "Snapchat", value: "snapchat" },
    { label: "Twitter", value: "twitter" },
];

const generateSocialMediaUrl = (
    platform: SocialMediaPlatform,
    username: string
) => {
    switch (platform) {
        case "instagram":
            return `https://www.instagram.com/${username}`;
        case "snapchat":
            return `https://www.snapchat.com/add/${username}`;
        case "twitter":
            return `https://www.twitter.com/${username}`;
        default:
            return "";
    }
};

const SocialMediaPicker = () => {
    const [selectedPlatform, setSelectedPlatform] = useState<SocialMediaPlatform>(null);
    const [username, setUsername] = useState("");
    const [socialMediaLinks, setSocialMediaLinks] = useState<
        { platform: SocialMediaPlatform; url: string }[]
    >([]);

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
            if (socialMediaLinks.some((link) => link.url === socialMediaUrl)) {
                alert(`${selectedPlatform} has already been added.`);
                return;
            }

            setSocialMediaLinks((prevLinks) => [
                ...prevLinks,
                { platform: selectedPlatform, url: socialMediaUrl },
            ]);
            setUsername("");
            setSelectedPlatform(null);
        } else {
            alert("Please select a platform and enter a username.");
        }
    };

    const handleRemoveLink = (url: string) => {
        setSocialMediaLinks((prevLinks) => prevLinks.filter((item) => item.url !== url));
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
            <View style={{ gap: 20 }}>
                <View style={{ gap: 8 }}>
                    <Text style={styles.label}>Add Social Media</Text>
                    <TouchableOpacity onPress={handleMenuOpen} style={styles.input}>
                        <Text style={styles.inputText}>
                            {selectedPlatform
                                ? selectedPlatform.charAt(0).toUpperCase() +
                                  selectedPlatform.slice(1)
                                : "Select Platform"}
                        </Text>
                        <Ionicons name="chevron-forward-sharp" size={20} color={Colors.dark300} />
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
                        <TouchableOpacity style={styles.addButton} onPress={handleAddLink}>
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {socialMediaLinks.map((item, index) => (
                <View style={styles.linkCard} key={index}>
                    <View style={styles.linkDetails}>
                        <Text style={styles.linkPlatform}>
                            {item.platform!.charAt(0).toUpperCase() + item.platform!.slice(1)}
                        </Text>
                        <Text style={styles.linkUrl}>{item.url}</Text>
                    </View>
                    <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveLink(item.url)}>
                        <Ionicons name="trash-bin-outline" size={20} color="red" />
                    </TouchableOpacity>
                </View>
            ))}

            <BottomSheetModal
                ref={menuRef}
                backgroundStyle={styles.backgroundStyle}
                backdropComponent={renderBackdrop}
                snapPoints={["28%", "50%"]}
            >
                <BottomSheetView style={styles.contentContainer}>
                    {socialMediaPlatforms.map((button, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.buttonContainer}
                            onPress={() => {
                                setSelectedPlatform(button.value as SocialMediaPlatform);
                                handleMenuClose();
                            }}
                        >
                            {button.value === "instagram" && (
                                <Ionicons name="logo-instagram" size={24} color="white" />
                            )}
                            {button.value === "snapchat" && (
                                <Ionicons name="logo-snapchat" size={24} color="white" />
                            )}
                            {button.value === "twitter" && (
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
    linkCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        marginVertical: 10,
        backgroundColor: Colors.dark500,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    linkDetails: {
        flex: 1,
        marginRight: 10,
    },
    linkPlatform: {
        fontSize: 16,
        color: Colors.success,
        fontWeight: "bold",
    },
    linkUrl: {
        fontSize: 14,
        color: Colors.white,
        marginTop: 4,
    },
    removeButton: {
        padding: 10,
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
