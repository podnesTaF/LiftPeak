import React, {forwardRef, useCallback} from 'react';
import {BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {useQuery} from "@tanstack/react-query";
import {Colors} from "@shared/styles";
import {ExerciseCard, findExerciseList, IExercise} from "@entities/exercise";
import { renderBottomSheetBackdrop } from '@shared/components/bottomSheet/bottomSheetBackdrop';

interface AttachExerciseProps {
    onAdd: (exercise: IExercise) => void;
}
const AttachExercise = forwardRef<BottomSheetModal, AttachExerciseProps>(({onAdd},ref) => {
    const [value, setValue] = React.useState("");

    const {data} = useQuery({
        queryKey: ['exerciseList'],
        queryFn: async () => findExerciseList({search: value}),
    })


    const memoizedBackdrop = useCallback(renderBottomSheetBackdrop, []);


    return (
        <BottomSheetModal
            backgroundStyle={{
                backgroundColor: Colors.dark900,
            }}

            backdropComponent={memoizedBackdrop}

            ref={ref}
            snapPoints={["80%"]}
        >
            <BottomSheetScrollView contentContainerStyle={{gap: 16, paddingVertical: 12, paddingHorizontal: 16}}>
                {data?.map((item) => (
                    <ExerciseCard key={item.id} onPress={() => onAdd(item)} exercise={item}/>
                ))}
            </BottomSheetScrollView>
        </BottomSheetModal>
    );
});

export default AttachExercise;