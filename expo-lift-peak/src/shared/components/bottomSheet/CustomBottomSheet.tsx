import React, {forwardRef, useCallback} from 'react';
import {
    BottomSheetBackdrop,
    BottomSheetFooter,
    BottomSheetFooterProps,
    BottomSheetModal,
    BottomSheetView
} from "@gorhom/bottom-sheet";
import Button from "@shared/components/Button";
import {Colors} from "@shared/styles";

interface CustomBottomSheetProps {
    handleClose: () => void;
    snapPoints?: (string | number)[];
    children?: React.ReactNode;
}

const CustomBottomSheet = forwardRef<BottomSheetModal, CustomBottomSheetProps>(({handleClose, snapPoints,children}, ref) => {

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop opacity={0.7} appearsOnIndex={0} disappearsOnIndex={-1} enableTouchThrough={false} {...props} />
        ),
        []
    );

    const renderFooter = useCallback(
        (props: BottomSheetFooterProps) => (
            <BottomSheetFooter {...props} bottomInset={32} style={{paddingHorizontal: 16, opacity: 0.7}}>
                <Button title={"Submit Selection"} color={"white"} onPress={handleClose} />
            </BottomSheetFooter>
        ),
        []
    );

    return (
        <BottomSheetModal
            footerComponent={renderFooter}
            backgroundStyle={{
                backgroundColor: Colors.dark700,
            }}
            backdropComponent={renderBackdrop}
            ref={ref}
            handleIndicatorStyle={{
                backgroundColor: 'white',
            }}
            index={0}
            enablePanDownToClose={true}
            snapPoints={snapPoints || [ "80%"]}
        >
            <BottomSheetView style={{paddingVertical: 16, flex: 1}}>
                {children}
            </BottomSheetView>
        </BottomSheetModal>
    );
});

export default CustomBottomSheet;