import { useContext } from "react";
import { HistoryContainer, HistoryList, Status } from "./styles";
import { CyclesContext } from "../../contexts/CyclesContext";
import { formatDistanceToNow } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

export default function History() {
   const { cycles } = useContext(CyclesContext);

   return (
      <HistoryContainer>
         <h1>Meu histórico</h1>

         <HistoryList>
            <table>
               <thead>
                  <tr>
                     <th>Tarefa</th>
                     <th>Duração</th>
                     <th>Início</th>
                     <th>Status</th>
                  </tr>
               </thead>

               <tbody>
                  {cycles.map(cycle => {
                     return (
                        <tr key={cycle.id}>
                           <td>{cycle.task}</td>
                           <td>{cycle.minuteAmount} minutos</td>
                           <td>{formatDistanceToNow(new Date(cycle.startData), {
                              addSuffix: true,
                              locale: ptBR
                           })}
                           </td>
                           <td>
                              {cycle.finisheDate && (
                                 <Status statusColor="green">Concluido</Status>
                              )}

                              {cycle.interrupetedDate && (
                                 <Status statusColor="red">Interrompido</Status>
                              )}

                              {(!cycle.finisheDate && !cycle.interrupetedDate) && (
                                 <Status statusColor="yellow">Interrompido</Status>
                              )}
                           </td>
                        </tr>
                     )
                  })}
               </tbody>
            </table>
         </HistoryList>
      </HistoryContainer>
   )
}
