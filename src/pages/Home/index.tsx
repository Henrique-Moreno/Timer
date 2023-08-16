import { HandPalm, Play } from 'phosphor-react'
import {
   HomeContainer,
   StartCountdownButton,
   StopCountdownButton,
} from './styles';

import * as zod from 'zod';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";

import { useContext } from 'react';
import { NewCycleForm } from './components/NewCycleForm';
import Countdown from './components/Countdown';
import { CyclesContext } from '../../contexts/CyclesContext';

export default function Home() {

   const { activeCycle, createNewCycle, interruptCurrentCycle } = useContext(CyclesContext)
   
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

   function handleCreateNewCycle(data: NewCycleFormData) {
      createNewCycle(data)
      reset()
   }

   const task = watch('task');
   const isSubmitDisabled = !task;

   return (
      <HomeContainer>
         <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
            <FormProvider {...newCycleForm}>
               <NewCycleForm />
            </FormProvider>
            <Countdown />

            {activeCycle ? (
               <StopCountdownButton onClick={interruptCurrentCycle} type="button">
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
