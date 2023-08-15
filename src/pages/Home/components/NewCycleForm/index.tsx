import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";
import { useFormContext } from 'react-hook-form';
import { useContext } from "react";
import { CycleContext } from "../..";

export function NewCycleForm() {
   const { activeCycle } = useContext(CycleContext);

   const { register } = useFormContext();

   return (
      <FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>
      <TaskInput
         type="task"
         placeholder='Dê um nome para o seu projeto'
         disabled={!!activeCycle} 
         list='task-suggestions'
         {...register('task')}
      />

      <datalist id='task-suggestions'>
         <option value="Banna"></option>
      </datalist>

      <label htmlFor="minutesAmount">durante</label>
      <MinutesAmountInput
         type="number" 
         id="minutesAmount" 
         placeholder='00'
         step={5}
         min={5}
         max={60}
         disabled={!!activeCycle} 
         {...register('minutesAmount', {valueAsNumber: true})}
      />

      <span>minutos</span>
   </FormContainer>
   )
}
