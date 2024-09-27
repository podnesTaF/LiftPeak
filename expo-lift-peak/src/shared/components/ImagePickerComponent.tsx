import React, { forwardRef, useCallback } from 'react';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Colors } from "@shared/styles"; 
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useImagePicker from "../hooks/useImagePicker";
import {MediaOptions} from "@shared/model/IMediaOption";

interface ImagePickerComponentProps {
  actions: MediaOptions[]
  closeModal: () => void;
  onPick: (media: string | null) => void;
}

const ImagePickerComponent = forwardRef(
  ({ actions, closeModal, onPick }: ImagePickerComponentProps, ref: React.ForwardedRef<BottomSheetModal>) => {
    const { actionButtons } = useImagePicker({ onPick, closeModal });

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

    return (
      <BottomSheetModal
        ref={ref}
        backgroundStyle={styles.backgroundStyle}
        backdropComponent={renderBackdrop}
        snapPoints={['25%', '50%']} 
      >
        <BottomSheetView style={styles.contentContainer}>
          {actions.map((action, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.buttonContainer}
                    onPress={actionButtons[action].actionFn}
                >
                  <Ionicons name={actionButtons[action].icon} size={24} color={Colors.white} />
                  <Text style={styles.buttonText}>{actionButtons[action].title}</Text>
                </TouchableOpacity>
          ))}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default ImagePickerComponent;

const styles = StyleSheet.create({
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 14,
    gap: 6
  },
  buttonText: {
    color: Colors.white,
    marginLeft: 10,
    fontSize: 16,
  },
});
