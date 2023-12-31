function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class Process{
    constructor(Key, ExecutionTime, Deadline, Arrival){
        this.Key = Key
        this.ExecutionTime =  ExecutionTime;
        this.Deadline = Deadline;
        this.Arrival = Arrival;
        this.Finish = 0;
        this.RunningTime = 0;
        this.Executed = false
    }
    
}

class Escalonator{
    constructor(QuantumTime, OverloadTime){
        this.QuantumTime = QuantumTime;
        this.OverloadTime = OverloadTime;
        this.ProcessArray = [];
        this.AverageResponseTime = 0
    }

    AddProcess(Process){
        this.ProcessArray.push(Process);
    }

    Fifo(){
        var Queue = [];
        var RunningProcess  = undefined;
        var Time = 0;
        var NumberOfProcess = this.ProcessArray.length
        var NumberOfExecutedProcess = 0
        var ProcessesByTime = []
        
        /*
        Procura pelo primeiro processo a entrar na Queue (Processo que tem .Arrival == 0).
        Faz um Loop pela lista de Processos, procurando pelo primeiro processo com .Arrival == 0.
        */
        for(let i = 0; i < this.ProcessArray.length; i++){
            if(this.ProcessArray[i].Arrival == 0 && this.ProcessArray[i].ExecutionTime){
                RunningProcess = this.ProcessArray[i];
                break;
            }
        }
        if(RunningProcess == undefined){
            return 0;
        }
        
        /*
        Loop em que é implementado o Fifo em si.
        RunningProcess armazena o processo em execução, e Time o tempo que já se passou.
        O loop acaba quando o número de processos executado é o mesmo do número de processos
        para serem executados.
        */
        while(NumberOfExecutedProcess < NumberOfProcess){
            /* 
            Ao início de cada iteração (ou seja, quando o Time aumenta), percorremos o vetor de Processos,
            checando se algum processo entrou na Queue, ou seja, se há algum processo com .Arrival ==  Time.
            */
            for(let i = 0; i < this.ProcessArray.length; i++){
                if(this.ProcessArray[i].Arrival == Time && this.ProcessArray[i].Key != RunningProcess.Key){
                    Queue.push(this.ProcessArray[i]);
                }
            }
            /* 
            Caso em que não há ninguém na Queue, e nenhum processo rodando, nesse caso, apenas "avançamos"
            o tempo.
            */
            if(RunningProcess == undefined && Queue.length == 0){
                Time++;
                ProcessesByTime.push("N")
                continue;
            }
            /* 
            Caso em que não havia nenhum processo rodando, e algum processo novou (ou alguns) entraram na
            fila, nesse caso o primeiro a entrar passa a ser o processo corrente, com o mesmo saindo da 
            Queue
            */
            if(RunningProcess == undefined && Queue.length > 0){
                RunningProcess = Queue[0];
                Queue.shift()
            }
            /* 
            Verifica se o RunningProcess já atingiu o tempo rodando igual ao seu tempo de execução
            definido na sua criação, ou seja, se o processo já terminou. Nesse caso, atribuímos seu tempo
            de finalização como o "Time" atual, e aumentamos o número de processos que já foram executados.

            Após isso, trocamos o processo "correndo" pelo primeiro processo da fila.
            */
            if(RunningProcess.ExecutionTime == RunningProcess.RunningTime){
                RunningProcess.Finish = Time;
                RunningProcess.Executed = true;
                NumberOfExecutedProcess++;
                if(Queue.length == 0){
                    RunningProcess = undefined;
                    Time++;
                    continue;
                }
                RunningProcess = Queue[0];
                Queue.shift();
            }
            ProcessesByTime.push(RunningProcess.Key)
            RunningProcess.RunningTime++;
            Time++;
        }
        /* 
        Percorremos a lista de processos, calculando o tempo que ele ficou "rodando" (ou seja,
        o tempo executando + o tempo em espera), somamos na variável AverageResponseTime e 
        depois dividimos pelo número de processos, para calcular o tempo médio de execução.
        */
        var ART = 0
        for(let i = 0; i < this.ProcessArray.length; i++){
            ART += this.ProcessArray[i].Finish - this.ProcessArray[i].Arrival
        }
        ART = ART / NumberOfProcess
        this.AverageResponseTime = ART.toFixed(2)
        return ProcessesByTime
    }

    SJF(){
        var WaitingProcess = [];
        var RunningProcess = undefined;
        var Time = 0;
        var NumberOfProcess = this.ProcessArray.length
        var NumberOfExecutedProcess = 0
        var ProcessesByTime = []

        /*
        Procura pelo primeiro processo a entrar na Queue (Processo que tem .Arrival == 0).
        Faz um Loop pela lista de Processos, procurando pelo primeiro processo com .Arrival == 0.
        */
        for(let i = 0; i < this.ProcessArray.length; i++){
            if(this.ProcessArray[i].Arrival == 0 && this.ProcessArray[i].ExecutionTime > 0){
                if(RunningProcess == undefined){
                    RunningProcess = this.ProcessArray[i];
                }else{
                    if(RunningProcess.ExecutionTime > this.ProcessArray[i].ExecutionTime){
                        RunningProcess = this.ProcessArray[i]
                    }
                }
            }
        }
        if(RunningProcess == undefined){
            return 0;
        }
        /* 
        Loop em que é executado o SJF em si, onde o RunningProcess guarda o processo
        em execução, "Time" o tempo corrido, com o loop sendo executado até o número
        de processos executados ser igual ao número de processos originais.
        */
        while(NumberOfExecutedProcess < NumberOfProcess){
            /* 
            Ao início de cada LOOP, ou seja, quando o "Time" é incrementado, verificamos
            se algum processo entrou na LISTA DE PROCESSOS ESPERANDO, para isso, basta
            verificar se há algum processo com .Arrival
            */
            for(let i = 0; i < this.ProcessArray.length; i++){
                if(this.ProcessArray[i].Arrival == Time && this.ProcessArray[i].Key != RunningProcess.Key){
                    WaitingProcess.push(this.ProcessArray[i]);
                }
            }

            /* 
            Checamos se não há nenhum processo rodando, e nenhum processo aguardando, nesse
            caso, basta incrementar o "Time" até que algum outro processo entre.
            */
            if(RunningProcess == undefined && WaitingProcess.length == 0){
                ProcessesByTime.push("N")
                Time++;
                continue;
            }

            /* 
            Nesse caso, não havia nenhum processo rodando, e um, ou mais, processos entraram 
            na fila, com o processo de menor tempo de execução passando a rodar.
            */
            if(RunningProcess == undefined && WaitingProcess.length > 0){
                var LessTime = WaitingProcess[0].ExecutionTime
                var NextProcess = 0
                for(var k = 0; k < WaitingProcess.length; k++){
                    if(WaitingProcess[k].ExecutionTime < LessTime){
                        NextProcess = k;
                    }
                }
                RunningProcess = WaitingProcess[NextProcess];
                WaitingProcess.slice(NextProcess,1);
            }

            /* 
            Aqui, o Processo rodando terminou, ou seja, seu .RunningTime é igual ao
            .ExecutionTime, nesse caso, o processo que entra no seu lugar é o menor 
            processo daqueles que estão aguardando.
            */
            if(RunningProcess.ExecutionTime == RunningProcess.RunningTime){
                //console.log(`Processo ${RunningProcess.Key} acabou\n`)
                RunningProcess.Finish = Time;
                RunningProcess.Executed = true;
                NumberOfExecutedProcess++;
                if(WaitingProcess.length == 0){
                    RunningProcess = undefined;
                    Time++;
                    continue;
                }
                var LessTime = WaitingProcess[0].ExecutionTime
                var NextProcess = 0
                for(var k = 0; k < WaitingProcess.length; k++){
                    if(WaitingProcess[k].ExecutionTime < LessTime){
                        NextProcess = k;
                    }
                }
                RunningProcess = WaitingProcess[NextProcess];
                WaitingProcess.splice(NextProcess,1);
            }
            ProcessesByTime.push(RunningProcess.Key)
            RunningProcess.RunningTime++;
            Time++;
        }
        /* 
        Percorremos a lista de processos, calculando o tempo que ele ficou "rodando" (ou seja,
        o tempo executando + o tempo em espera), somamos na variável AverageResponseTime e 
        depois dividimos pelo número de processos, para calcular o tempo médio de execução.
        */
        var ART = 0
        for(let i = 0; i < this.ProcessArray.length; i++){
            ART += this.ProcessArray[i].Finish - this.ProcessArray[i].Arrival
        }
        ART = ART / NumberOfProcess
        this.AverageResponseTime = ART.toFixed(2)
        return ProcessesByTime
    }

    RoundRobin(){
        var Queue = [];
        var RunningProcess = undefined;
        var Time = 0;
        var NumberOfProcess = this.ProcessArray.length
        var NumberOfExecutedProcess = 0
        var RealTimeQuantum = 0;
        var ProcessesByTime = []

        /*
        Procura pelo primeiro processo a entrar na Queue (Processo que tem .Arrival == 0).
        Faz um Loop pela lista de Processos, procurando pelo primeiro processo com .Arrival == 0.

        Além disso, alteramos o atributo .Executed, para indicar que o processo já começou a ser
        executado.
        */
        for(let i = 0; i < this.ProcessArray.length; i++){
            if(this.ProcessArray[i].Arrival == 0 && this.ProcessArray[i].ExecutionTime){
                RunningProcess = this.ProcessArray[i];
                RunningProcess.Executed = true
                break;
            }
        }
        if(RunningProcess == undefined){
            return 0;
        }

        while(NumberOfExecutedProcess < NumberOfProcess){
            /* 
            Percorremos a lista de Processos, verificando se há algum que entrou na FILA, perceba que aqui é usado
            o <= ao invés do ==, por conta da adição do tempo de sobrecarga, e para prevenir de pegar processos que já
            foram exectuados, checamos o .Executed também
            */
            for(let i = 0; i < this.ProcessArray.length; i++){
                if(this.ProcessArray[i].Arrival <= Time && this.ProcessArray[i].Key != RunningProcess.Key && this.ProcessArray[i].Executed == false){
                    Queue.push(this.ProcessArray[i]);
                    this.ProcessArray[i].Executed = true;
                }
            }   
            /* 
            Caso em que não há nenhum processo rodando, nem nenhum na FILA, nesse caso basta aumentar o "Time"
            */
            if(RunningProcess == undefined && Queue.length == 0){
                ProcessesByTime.push("N")
                Time++;
                continue;
            }
            /*
             Não há nenhum processo rodando, mas algum entra na FILA, com esse passando a ser executado, e o Quantum
             zerado.
             */
            if(RunningProcess == undefined && Queue.length > 0){
                RunningProcess = Queue[0];
                Queue.shift();
                RealTimeQuantum = 0;
            }
            /* 
            Processo que estava executando terminou, assim, zeramos o Quantum, e o que estava na FILA entra em seu lugar.
            */
            if(RunningProcess.ExecutionTime == RunningProcess.RunningTime){
                //console.log(`${RunningProcess.Key} terminou`)
                RealTimeQuantum = 0;
                RunningProcess.Finish = Time;
                //RunningProcess.Executed = true;
                NumberOfExecutedProcess++;
                if(Queue.length == 0){
                    RunningProcess = undefined;
                    Time++;
                    continue;
                }
                RunningProcess = Queue[0];
                Queue.shift();
            }
            /* 
            Quantum chegou ao seu limite, o processo que estava sendo executado volta para FILA, e o que estava na
            frente passa a ser executado, e o "Time" é incrementado pelo tempo de sobrecarga.
            */
            if(RealTimeQuantum == this.QuantumTime){
                var AuxVar = RunningProcess;
                //console.log("Início")
                Queue.push(AuxVar);
                //console.log(`${AuxVar.Key} voltou pra fila`)
                RunningProcess = Queue[0];
                Queue.shift();
                for(let i = 0; i < this.OverloadTime; i++){
                    ProcessesByTime.push("S")
                    Time++;
                }
                RealTimeQuantum = 0;
            }
            ProcessesByTime.push(RunningProcess.Key)
            RealTimeQuantum++;
            RunningProcess.RunningTime++;
            Time++;
        }
        var ART = 0
        for(let i = 0; i < this.ProcessArray.length; i++){
            ART += this.ProcessArray[i].Finish - this.ProcessArray[i].Arrival
        }
        ART = ART / NumberOfProcess
        this.AverageResponseTime = ART.toFixed(2)
        return ProcessesByTime
    }

    EDF(){
        var WaitingProcess = [];
        var RunningProcess = undefined;
        var Time = 0;
        var NumberOfProcess = this.ProcessArray.length
        var NumberOfExecutedProcess = 0
        var RealTimeQuantum = 0;
        var ProcessesByTime = []

        /*
        Procura pelo primeiro processo a entrar na Queue (Processo que tem .Arrival == 0).
        Faz um Loop pela lista de Processos, procurando pelo primeiro processo com .Arrival == 0.

        Além disso, alteramos o atributo .Executed, para indicar que o processo já começou a ser
        executado.
        */
        for(let i = 0; i < this.ProcessArray.length; i++){
            if(this.ProcessArray[i].Arrival == 0 && this.ProcessArray[i].ExecutionTime > 0){
                if(RunningProcess == undefined){
                    RunningProcess = this.ProcessArray[i];
                }else{
                    if(RunningProcess.Deadline > this.ProcessArray[i].Deadline){
                        RunningProcess = this.ProcessArray[i]
                    }
                }
            }
        }

        if(RunningProcess == undefined){
            return 0;
        }
        RunningProcess.Executed = true

        while(NumberOfExecutedProcess < NumberOfProcess){
            /* 
            Percorremos a lista de Processos, verificando se há algum que entrou na FILA, perceba que aqui é usado
            o <= ao invés do ==, por conta da adição do tempo de sobrecarga, e para prevenir de pegar processos que já
            foram exectuados, checamos o .Executed também
            */
            for(let i = 0; i < this.ProcessArray.length; i++){
                if(this.ProcessArray[i].Arrival <= Time && this.ProcessArray[i].Key != RunningProcess.Key && this.ProcessArray[i].Executed == false){
                    WaitingProcess.push(this.ProcessArray[i]);
                    this.ProcessArray[i].Executed = true;
                }
            }
            /* 
            Caso em que não há nenhum processo rodando, nem nenhum na FILA, nesse caso basta aumentar o "Time"
            */
            if(RunningProcess == undefined && WaitingProcess.length == 0){
                ProcessesByTime.push("N")
                Time++;
                continue;
            }
            /* 
            Não havia nenhum processo rodando, mas um, ou mais, entram na lista de espera, entrando aquele com o menor
            Deadline.
            */
            if(RunningProcess == undefined && WaitingProcess.length > 0){
                var LessTime = WaitingProcess[0].Deadline -  (Time - WaitingProcess[0].Arrival);
                var NewProcess = 0;
                for(let i = 0; i < WaitingProcess.length; i++){
                    var AuxLessTime = Time - WaitingProcess[i].Arrival;
                    if(WaitingProcess[i].Deadline - AuxLessTime < LessTime){
                        NewProcess = i;
                        LessTime = WaitingProcess[i].Deadline - AuxLessTime;
                    }
                }                    
                RunningProcess = WaitingProcess[NewProcess];
                WaitingProcess.splice(NewProcess,1);
                RealTimeQuantum = 0;
            }
            /* 
            Processo que estava sendo executado termina, entrando aquele com o menor deadline naquele momento.
            Esse cálculo é feito diminuindo o DEADLINE do tempo em que o processo começou a executar, ou seja, 
            de "Time" menos o tempo de chegada
            */
            if(RunningProcess.ExecutionTime == RunningProcess.RunningTime){
                RealTimeQuantum = 0;
                RunningProcess.Finish = Time;
                NumberOfExecutedProcess++;
                if(WaitingProcess.length == 0){
                    RunningProcess = undefined;
                    Time++;
                    continue;
                }
                var LessTime = WaitingProcess[0].Deadline -  (Time - WaitingProcess[0].Arrival);
                var NewProcess = 0;
                for(let i = 0; i < WaitingProcess.length; i++){
                    var AuxLessTime = Time - WaitingProcess[i].Arrival;
                    if(WaitingProcess[i].Deadline - AuxLessTime < LessTime){
                        NewProcess = i;
                        LessTime = WaitingProcess[i].Deadline - AuxLessTime;
                    }
                }              
                RunningProcess = WaitingProcess[NewProcess];
                WaitingProcess.splice(NewProcess,1);
                RealTimeQuantum = 0;
            }
            /* 
            Quantum terminou, o processo com o menor DEADLINE entra, e o "Time" é incrementado com o
            valor do tempo de sobrecarga.
            */
            if(RealTimeQuantum == this.QuantumTime){
                var AuxVar = RunningProcess;
                WaitingProcess.push(AuxVar);
                var LessTime = WaitingProcess[0].Deadline -  (Time - WaitingProcess[0].Arrival);
                var NewProcess = 0;
                for(let i = 0; i < WaitingProcess.length; i++){
                    var AuxLessTime = Time - WaitingProcess[i].Arrival;
                    if(WaitingProcess[i].Deadline - AuxLessTime < LessTime){
                        NewProcess = i;
                        LessTime = WaitingProcess[i].Deadline - AuxLessTime;
                    }
                }              
                RunningProcess = WaitingProcess[NewProcess];
                WaitingProcess.splice(NewProcess,1);

                for(let i = 0; i < this.OverloadTime; i++){
                    ProcessesByTime.push("S")
                    console.log(`Time ${Time}: S`)
                    Time++;
                }
                RealTimeQuantum = 0;
            }
            ProcessesByTime.push(RunningProcess.Key)
            console.log(`Time ${Time}: ${RunningProcess.Key}`)
            RealTimeQuantum++;
            RunningProcess.RunningTime++;
            Time++;
        }
        var ART = 0

        for(let i = 0; i < this.ProcessArray.length; i++){
            ART += this.ProcessArray[i].Finish - this.ProcessArray[i].Arrival
        }
        ART = ART / NumberOfProcess
        this.AverageResponseTime = ART.toFixed(2)
        return ProcessesByTime
    }
    
}

var A = new Process("A", 4, 7, 0)
var B = new Process("B", 2, 5, 2)
var C = new Process("C", 1, 8, 4)
var D = new Process("D", 3, 10, 6)

var Escalonador = new Escalonator(2, 1)
Escalonador.AddProcess(A)
Escalonador.AddProcess(B)
Escalonador.AddProcess(C)
Escalonador.AddProcess(D)

var res = Escalonador.EDF()

console.log(res)