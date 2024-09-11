import { ExerciseTargetPriority } from '../exercise/entity/exercise-target.entity';
import { Exercise } from '../exercise/entity/exercise.entity';

export class WorkoutGenerator {
  private setTime = 60; // 1 minute per set
  private avgRestTime = 120; // default 2 minutes of rest per set

  public targetStats: {
    [key: string]: { target: any; exerciseAmount: number };
  } = {};

  // Step 1: Calculate total set units based on workout time and rest intervals
  private calculateSetUnits(
    workoutTimeInSec: number,
    restTimeInSec: number,
  ): number {
    return Math.floor(workoutTimeInSec / (this.setTime + restTimeInSec));
  }

  private trackTargetStats(exercise: Exercise) {
    exercise.exerciseTargets.forEach((exerciseTarget) => {
      const targetId = exerciseTarget.target.id;

      if (!this.targetStats[targetId]) {
        this.targetStats[targetId] = {
          target: exerciseTarget.target,
          exerciseAmount: 1,
        };
      } else {
        this.targetStats[targetId].exerciseAmount++;
      }
    });
  }

  // Step 2: Calculate the efficiency of each exercise based on its targets (primary, secondary)
  private calculateExerciseEfficiency(exercise: Exercise): number {
    let efficiency = 0;
    exercise.exerciseTargets.forEach((target) => {
      if (target.priority === ExerciseTargetPriority.PRIMARY) {
        efficiency += 1.0; // Primary target gives 1.0 efficiency
      } else if (target.priority === ExerciseTargetPriority.SECONDARY) {
        efficiency += 0.5; // Secondary target gives 0.5 efficiency
      }
    });
    return efficiency;
  }

  // Step 3: Balance training points between primary and secondary targets
  private balanceMuscleLoad(
    muscleLoad: { [key: string]: number },
    target: string,
    points: number,
    isPrimary: boolean,
  ) {
    if (isPrimary) {
      muscleLoad[target] = (muscleLoad[target] || 0) + points;
    } else {
      const primaryLoad = muscleLoad[target] || 0;
      const secondaryLoad = points;
      // Ensure secondary load is 50-70% of the primary load
      if (secondaryLoad > primaryLoad * 0.7) {
        muscleLoad[target] = primaryLoad * 0.7;
      } else {
        muscleLoad[target] = secondaryLoad;
      }
    }
  }

  // Step 4: Assign sets and rest times for each exercise
  private assignSetsAndRestTimes(
    exercises: Exercise[],
    totalSetUnits: number,
    muscleLoad: { [key: string]: number },
  ): { exercise: Exercise; sets: number; restTime: number }[] {
    const workoutPlan = [];
    let remainingSetUnits = totalSetUnits;

    exercises.forEach((exercise) => {
      if (remainingSetUnits <= 0) return; // No more set units available

      // Calculate efficiency based on targets
      const efficiency = this.calculateExerciseEfficiency(exercise);

      // Assign base sets for each exercise, modified by efficiency
      const baseSets = 3; // Start with 3 base sets per exercise
      const totalSets = Math.min(baseSets * efficiency, remainingSetUnits);
      const warmUpSets = 1; // Assume 1 warm-up set

      // Track muscle load distribution
      exercise.exerciseTargets.forEach((exerciseTarget) => {
        const points =
          totalSets *
          (exerciseTarget.priority === ExerciseTargetPriority.PRIMARY
            ? 1.0
            : 0.5);
        this.balanceMuscleLoad(
          muscleLoad,
          exerciseTarget.target.name,
          points,
          exerciseTarget.priority === ExerciseTargetPriority.PRIMARY,
        );
      });

      // Track target stats (how many exercises hit each target)
      this.trackTargetStats(exercise);

      // Add to the workout plan
      workoutPlan.push({
        exercise,
        sets: Math.floor(totalSets),
        restTime: this.avgRestTime,
      });

      // Deduct the set units used for this exercise
      remainingSetUnits -= totalSets;
    });

    return workoutPlan;
  }

  // Step 5: Main function to calculate sets and rest times based on workout time and rest intervals
  calculateSetsAndRestTimes(
    exercises: Exercise[],
    workoutTimeInSec: number,
    restBetweenSetsInSec: number,
  ): {
    workoutPlan: { exercise: Exercise; sets: number; restTime: number }[];
    targetStats: any;
  } {
    const totalSetUnits = this.calculateSetUnits(
      workoutTimeInSec,
      restBetweenSetsInSec,
    );
    const muscleLoad = {}; // Track how much each target muscle is trained

    // Call the function to assign sets and rest times
    return {
      workoutPlan: this.assignSetsAndRestTimes(
        exercises,
        totalSetUnits,
        muscleLoad,
      ),
      targetStats: Object.values(this.targetStats),
    };
  }
}
