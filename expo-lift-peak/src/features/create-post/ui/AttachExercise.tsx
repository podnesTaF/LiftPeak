import React, {forwardRef, useCallback} from 'react';
import {BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {useQuery} from "@tanstack/react-query";
import {Colors} from "@shared/styles";
import {ExerciseCard, findExerciseList, IExercise} from "@entities/exercise";

interface AttachExerciseProps {
    onAdd: (exercise: IExercise) => void;
}
const AttachExercise = forwardRef<BottomSheetModal, AttachExerciseProps>(({onAdd},ref) => {
    const [value, setValue] = React.useState("");

    const {data} = useQuery({
        queryKey: ['exerciseList'],
        queryFn: async () => findExerciseList({search: value}),
    })


    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop opacity={0.7} appearsOnIndex={0} disappearsOnIndex={-1} enableTouchThrough={false} {...props} />
        ),
        []
    );


    return (
        <BottomSheetModal
            backgroundStyle={{
                backgroundColor: Colors.dark900,
            }}

            backdropComponent={renderBackdrop}

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