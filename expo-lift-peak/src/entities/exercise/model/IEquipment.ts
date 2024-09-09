import {BaseEntity} from "@shared/model/BaseEntity";
import {ExerciseEquipment, IExercise} from "@entities/exercise";

export interface IEquipment extends BaseEntity{
    name: ExerciseEquipment;
    description?: string;
    imageUrl?: string;
    iconUrl?: string;
    exercises: IExercise[];
}