let grade = [
    { index: 'a', x: 2, y: 4, filhos: ['b'] },
    { index: 'b', x: 5, y: 6, filhos: ['c', 'm'] },
    { index: 'c', x: 4, y: 2, filhos: ['d'] },
    { index: 'd', x: 7, y: 4, filhos: ['g', 'n', 'q'] },
    { index: 'f', x: 7, y: 8, filhos: ['q'] },
    { index: 'g', x: 8, y: 2, filhos: [] },
    { index: 'h', x: 10, y: 1, filhos: ['g'] },
    { index: 'm', x: 9, y: 6, filhos: ['f'] },
    { index: 'n', x: 11, y: 3, filhos: ['h', 's'] },
    { index: 'q', x: 11, y: 7, filhos: ['p'] },
    { index: 'p', x: 12, y: 6, filhos: ['n', 's'] },
    { index: 's', x: 13, y: 2, filhos: [] }
]

var button = document.getElementById("busca-heuristica");
button.addEventListener("click",function(e){
    let raiz = document.getElementById("raiz").value;
    let destino = document.getElementById("destino").value;
    BuscaHeuristica(raiz, destino);
},false);

function BuscaHeuristica(noRaiz, noMeta) {
    let fila = [];
    fila = DefinirTrajetoria(fila, [ObterNo(noRaiz)], 0); // 1. Forme uma fila apenas com a raiz
    let destino = ObterNo(noMeta);

    while (!AlcancouDestino(fila, destino)) { // 2.1. Se a trajetoria alcançar o nó destino, nao faça nada.
        let primeiraTrajetoria = fila.shift(); // 2.2.1 Remova a primeira trajetória da fila. Que é a com melhor estimativa.
        fila = ProximoPasso(fila, primeiraTrajetoria, destino); // 2.2.2 Formando novas trajetoria
        fila = OrdernarFila(fila); // 2.2.4 Ordene a fila crescentemente. 
    }

    console.log("Sucesso!!");  // 3. Se o nó destino for encontrado, proclame sucesso.
    ImprimirCaminhoFinal(fila, destino);
}

function ObterUltimoNoDaTrajetoria(trajetoria) {
    return [...trajetoria.caminho].pop();
}

function ProximoPasso(fila, trajetoria, destino) {
    /*
    Neste método é onde define quais serão as trajetorias adicionadas.
    Onde soma os custos calculados
    */
    noAtual = ObterUltimoNoDaTrajetoria(trajetoria);
    noAtual.filhos.forEach(filho => {
        filho = ObterNo(filho);
        let custoPercorrido = CalcularDistancia(noAtual, filho);
        let estimativaAoDestino = CalcularDistancia(filho, destino);
        let prioridade = custoPercorrido + estimativaAoDestino + trajetoria.prioridade;
        let caminho = [...trajetoria.caminho];
        caminho.push(filho);

        fila = DefinirTrajetoria(fila, caminho, prioridade); // 2.2.3 Acrescenta uma nova trajetoria com a estimativa de custo
    })

    return fila;
}

function ObterNo(no) {
    let noAtual = grade.find(x => x.index == no);

    return noAtual;
}

function ObterNoAtual(trajetoria) {
    let ultimoDoCaminho = [...trajetoria.caminho].pop();
    return ObterNo(ultimoDoCaminho);
}

function DefinirTrajetoria(fila, caminho, prioridade) {
    /*
    Neste metodo é criado uma trajetoria e colocado no final da fila
    */
    let trajetoria = {
        caminho,
        prioridade
    }
    fila.push(trajetoria);

    return fila;
}

function CalcularDistancia(noA, noB) {
    /*
    Este meotodo calcula distancia entre dois pontos
    */
    var a = noA.x - noB.x;
    var b = noA.y - noB.y;

    return Math.sqrt(a * a + b * b);
}

function AlcancouDestino(fila, destino) {
    /*
    Este metodo verifica se o caminho percorrido já chegou até o destino
    */
    let encontrou = false;
    fila.forEach(trajetoria => {
        trajetoria.caminho.forEach(caminho => {
            if (caminho.index == destino.index)
                encontrou = true;
        });
    });
    return encontrou;
}

function OrdernarFila(fila) {
    /*
    Este metodo ordena a fila de acordo com a prioridade. 
    Quem tiver menor prioridade ou distancia estimada ficará na frente na fila
    */
    return fila.sort((a, b) => a.prioridade - b.prioridade)
}

function ImprimirCaminhoFinal(fila, destino) {
    let trajetoria;
    fila.forEach(t => {
        t.caminho.forEach(c => {
            if (c.index == destino.index)
                trajetoria = t;
        });
    });
    
    let resultadoContainer = document.getElementById("resultado");
    resultadoContainer.innerHTML = "";

    trajetoria.caminho.forEach(caminho => {
        var span = document.createElement("SPAN");
        span.innerHTML = `=> ${caminho.index} `;
        resultadoContainer.appendChild(span);
        console.log(`=> ${caminho.index} `)
    });
}
