import {ITarget} from "@entities/exercise";

export const filterMusclesByLook = (look: "front" | "back", muscles?: ITarget[],) => {
    return muscles?.filter((m) => !!m.paths?.[look]) || [];
}