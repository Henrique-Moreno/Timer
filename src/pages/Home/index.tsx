import { HandPalm, Play } from 'phosphor-react'
import {
   HomeContainer,
   StartCountdownButton,
   StopCountdownButton,
} from './styles';

import * as zod from 'zod';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";

import { createContext, useState } from 'react';
import { NewCycleForm } from './components/NewCycleForm';
import Countdown from './components/Countdown';

interface Cycle {
   id: string;
   task: string;
   minuteAmount: number;
   startData: Date;
   interrupetedDate?: Date;
   finisheDate?: Date
}

interface CyclesContextType {
   activeCycle: Cycle | undefined
   activeCycleId: string | null
   amountSecondsPassed: number
   markCurrentCycleAsFinished: () => void
   setSecondsPassed: (seconds: number) => void
}

export const CycleContext = createContext({} as CyclesContextType);

export default function Home() {

   const [cycles, setCycles] = useState<Cycle[]>([]);
   const [activeCycleId, setActiveClycleId] = useState<string | null>(null);
   const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

   const newCycleFormValidationShema = zod.object({
      task: zod.string().min(1, 'Informe a tarefa'),
      minutesAmount: zod.number().min(5).max(60)
   });

   type NewCycleFormData = zod.infer<typeof newCycleFormValidationShema>

   const newCycleForm = useForm<NewCycleFormData>({
      resolver: zodResolver(newCycleFormValidationShema),
      defaultValues: {
         task: '',
         minutesAmount: 0,
      }
   });

   const { handleSubmit, watch, reset } = newCycleForm

   const activeCycle = cycles.find(cycle => cycle.id === activeCycleId);

   function setSecondsPassed(seconds: number) {
      setAmountSecondsPassed(seconds)
   }

   function markCurrentCycleAsFinished() {
      setCycles(state => state.map(cycle => {
         if (cycle.id === activeCycleId) {
            return { ...cycle, finisheDate: new Date() }
         } else {
            return cycle;
         }
      }))
   }

   function handleCreateNewCycle(data: NewCycleFormData) {

      const id = String(new Date().getTime())

      const newCycle: Cycle = {
         id,
         task: data.task,
         minuteAmount: data.minutesAmount,
         startData: new Date(),
      }

      setCycles((state) => [...state, newCycle]);
      setActiveClycleId(id)
      setAmountSecondsPassed(0)
      reset();
   }

   function handleInterruptCycle() {
      setCycles(state => state.map(cycle => {
         if (cycle.id === activeCycleId) {
            return { ...cycle, interrupetedDate: new Date() }
         } else {
            return cycle;
         }
      }))

      setActiveClycleId(null)
   }

   const task = watch('task');
   const isSubmitDisabled = !task;

   console.log(cycles)

   return (
      <HomeContainer>
         <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
            <CycleContext.Provider
               value={{
                  activeCycle,
                  activeCycleId,
                  amountSecondsPassed,
                  markCurrentCycleAsFinished,
                  setSecondsPassed
               }}
            >
               <FormProvider {...newCycleForm}>
                  <NewCycleForm />
               </FormProvider>
               <Countdown />
            </CycleContext.Provider>

            {activeCycle ? (
               <StopCountdownButton onClick={handleInterruptCycle} type="button">
                  <HandPalm size={24} />
                  Interroper
               </StopCountdownButton>
            ) : (
               <StartCountdownButton disabled={isSubmitDisabled} type="submit">
                  <Play size={24} />
                  Começar
               </StartCountdownButton>
            )}
         </form>
      </HomeContainer>
   )
}
