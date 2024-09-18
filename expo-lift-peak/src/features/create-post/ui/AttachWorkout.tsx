import React, {forwardRef, useCallback} from 'react';
import {BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {useQuery} from "@tanstack/react-query";
import {getRoutineList, RoutineCard} from "@entities/routine";
import {Colors} from "@shared/styles";
import {IWorkoutPreview} from "@features/workout";
import { renderBottomSheetBackdrop } from '@shared/components/bottomSheet/bottomSheetBackdrop';

interface AttachWorkoutProps {
    onAdd: (workout: IWorkoutPreview) => void;
}
const AttachWorkout = forwardRef<BottomSheetModal, AttachWorkoutProps>(({onAdd},ref) => {
    const {data: routines} = useQuery({
        queryKey: ['routineList'],
        queryFn: getRoutineList,
    })

    const memoizedBackdrop = useCallback(renderBottomSheetBackdrop, []);


    return (
        <BottomSheetModal
            backgroundStyle={{
                backgroundColor: Colors.dark900,
            }}

            backdropComponent={memoizedBackdrop}
            ref={ref as any}
            snapPoints={["80%"]}
        >
            <BottomSheetScrollView contentContainerStyle={{gap: 16, paddingVertical: 12, paddingHorizontal: 16}}>
                {routines?.map((routine) => (
                    <RoutineCard workout={routine} key={routine.id} addAvailable={false} onPress={onAdd} />
                ))}
            </BottomSheetScrollView>
        </BottomSheetModal>
    );
});

export default AttachWorkout;