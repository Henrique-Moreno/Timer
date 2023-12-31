import { produce } from "immer";

import { ActionTypes } from "./actions";

export interface Cycle {
   id: string;
   task: string;
   minuteAmount: number;
   startData: Date;
   interrupetedDate?: Date;
   finisheDate?: Date
}

interface CyclesState {
   cycles: Cycle[]
   activeCycleId: string | null
}

export function cyclesReducer(state: CyclesState, action: any) {

   switch (action.type) {
      case ActionTypes.ADD_NEW_CYCLE:
         return produce(state, draft => {
            draft.cycles.push(action.payload.newCycle);
            draft.activeCycleId = action.payload.newCycle.id;
         })

      case ActionTypes.INTERRUPT_CURRENT_CYCLE:

         const currentCycleIndex = state.cycles.findIndex((cycle) => {
            return cycle.id === state.activeCycleId
         })

         if (currentCycleIndex < 0) {
            return state
         }

         return produce(state, (draft) => {
            draft.activeCycleId = null
            draft.cycles[currentCycleIndex].interrupetedDate = new Date()
         })

      case ActionTypes.MARK_CUURENT_AS_FINISHED: {
         
         const currentCycleIndex = state.cycles.findIndex((cycle) => {
            return cycle.id === state.activeCycleId
         })

         if (currentCycleIndex < 0) {
            return state
         }

         return produce(state, (draft) => {
            draft.activeCycleId = null
            draft.cycles[currentCycleIndex].finisheDate = new Date()
         })
      }

      default:
         return state
   }
}