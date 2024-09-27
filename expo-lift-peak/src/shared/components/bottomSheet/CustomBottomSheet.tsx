import React, { forwardRef, useCallback } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import Button from "@shared/components/Button";
import { Colors } from "@shared/styles";
import { renderBottomSheetBackdrop } from "./bottomSheetBackdrop";
import { ViewStyle } from "react-native";
import {BottomSheetModalRef} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetModalProvider/types";
import {BottomSheetModalMethods} from "@gorhom/bottom-sheet/lib/typescript/types";

interface CustomBottomSheetProps {
  handleClose?: () => void;
  snapPoints?: (string | number)[];
  buttonName?: string;
  buttonStyle?: ViewStyle;
  children?: React.ReactNode;
  hideFooter?: boolean
}

const CustomBottomSheet = forwardRef<BottomSheetModalMethods, CustomBottomSheetProps>(({handleClose, snapPoints,hideFooter, buttonName, buttonStyle,children}, ref) => {

    const memoizedBackdrop = useCallback(renderBottomSheetBackdrop, []);

    const renderFooter = useCallback(
      (props: BottomSheetFooterProps) => {
        if (!handleClose || hideFooter) {
          return null;
        }
    
        const footerStyle: ViewStyle = {
          paddingHorizontal: 16,
          opacity: 0.7,
          ...(buttonStyle || {}),
        };
    
        return (
          <BottomSheetFooter
            {...props}
            bottomInset={40}
            style={footerStyle}
          >
            <Button
              title={buttonName ?? "Submit Selection"}
              color={"white"}
              onPress={handleClose}
            />
          </BottomSheetFooter>
        );
      },
      [handleClose, buttonStyle, buttonName]
    );
    

    return (
      <BottomSheetModal
      footerComponent={handleClose ? renderFooter : undefined}
        backgroundStyle={{
          backgroundColor: Colors.dark700,
        }}
        backdropComponent={memoizedBackdrop}
        ref={ref}
        handleIndicatorStyle={{
          backgroundColor: "white",
        }}
        index={0}
        enablePanDownToClose={true}
        snapPoints={snapPoints || ["80%"]}
      >
          {children}
      </BottomSheetModal>
    );
  }
);

export default CustomBottomSheet;
