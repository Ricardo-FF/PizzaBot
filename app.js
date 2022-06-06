const btnSend = document.getElementById("btn");
const chat = document.getElementById("chat");

var cardapio;

const photocss = 'width:100%;height:200px;display: inline-block;background: rgb(44, 32, 32);background-image: url(card.jpeg);background-position: center;cursor:pointer;background-size:100% ';

var state = "bemvindo";
var endereco='a';
var sabortemp;
var precotemp;
var tamanhotemp;
var pagtemp;
var numtemp;
var endtemp;

var conta = [];

function sendmessage(msg){
    const chatBody = document.querySelector(".scroller");
    const divUser = document.createElement("div");
    divUser.className = "me visible";
    divUser.textContent = chat.value;
    chatBody.append(divUser);
    divUser.scrollIntoView();
    

}
function respondmessage(msg){
    const chatBody = document.querySelector(".scroller");
    const divCpu = document.createElement("div");
    divCpu.className = "bot visible";
    divCpu.innerHTML = processmessage(msg);
    if(divCpu.innerHTML.indexOf('[cardapiodiv]')!=-1){
        //divCpu.innerHTML+="<div class='photocontainer'> You are watching 5th object out of 100 </div>";
        divCpu.innerHTML = divCpu.innerHTML.replace("[cardapiodiv]", "");
        var elem = document.createElement('div');
        elem.style.cssText = photocss;
        //elem.className = 'photo';
        elem.addEventListener("click", function() {
            window.open('card.jpeg');
         });
        divCpu.appendChild(elem);
    }
    setTimeout(() => {  
    chatBody.append(divCpu);
    divCpu.scrollIntoView();
    }, 600);
}
function saymessage(msg){
    const chatBody = document.querySelector(".scroller");
    const divCpu = document.createElement("div");
    divCpu.className = "bot visible";
    divCpu.innerHTML = msg;
    
    setTimeout(() => {  
    chatBody.append(divCpu);
    divCpu.scrollIntoView();
    }, 600);
}

function lerCardapio(cb){
    
    var request = new XMLHttpRequest();
    request.open('GET', './cardapio.js', true);
    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var type = request.getResponseHeader('Content-Type');

                   try {
                     cb(request.responseText);

                   }catch(err) {
                     cb(err);
                   }
        }
    }
}

lerCardapio(function(object){
    cardapio=JSON.parse(object);
});

function checkstr(string, array){
    for(i=0;i<array.length;i++){
        if(string.indexOf(array[i])!=-1){
            return true;
        }
    }
    return false;
}
function checkstrindex(string, array){
    for(i=0;i<array.length;i++){
        if(string.indexOf(array[i])!=-1){
            return i;
        }
    }
    return -1;
}
function checkcardapio(string){
    try{
    for(i=0;i<cardapio.length;i++){
        if(string.indexOf(cardapio[i].Pizza.toLowerCase())!=-1){
            return i;
        }
    }
}catch{
    saymessage("Não foi possível acessar o cardápio.");
}
    return string-1;
}
function getPizzaName(id){
    try{
        return cardapio[id].Pizza;
    }
    catch{
        return '??';
    }
    
}
function getPizzaPrice(id){
    try{
        return cardapio[id].Preco;
    }
    catch{
        return 0;
    }
    
}
function setSizePrice(indextam, price){
    switch(indextam){
        case 0:
            return price*0.5;
            break;
        case 1:
            return price;
            break;
        case 2:
            return price*1.5;
            break;
        case 3:
            return price*2;
            break;
    }
}

function getCEP(cep){
    var Httpreq = new XMLHttpRequest();
  Httpreq.open("GET","https://viacep.com.br/ws/"+cep+"/json/",false);
  Httpreq.send(null);
  return Httpreq.responseText
}
function listaConta(){
    var lista='';
    var custototal=0;
    for(i=0;i<conta.length;i++){
        lista = lista + conta[i].id + ' - ' +  conta[i].name + ' - R$' + conta[i].price.toFixed(2) + '<br>';
        custototal+=conta[i].price;
    }
    if (lista!=''){
        lista+='<br><b>Custo total:</b> R$' + custototal.toFixed(2);
    }else{
        lista='';
    }
    
    return lista
}




function processmessage(msg){
    const pedido = ['fazer um pedido', 'pedir'];
    const cardapio = ['cardapio', 'cardápio'];
    if(msg=="pedido"){
        if (listaConta()!=''){
            return '<b>Sua conta no momento:</b> <br>'+listaConta()
        }else{
            return 'Você ainda não realizou nenhum pedido.'
        }
    }
    else if(msg=="ajuda"){
        return 'Cardápio: Solicita o cardápio.<br>Pedir: Para realizar seu pedido.<br>Pedido: Para ver a conta até o momento.<br>Limpar: Limpa a conta e recomeça o pedido.'
    }    
    else if(msg=="limpar"){
        conta= [];
        state="sabor";
        return 'Pedido limpo!<br> Qual sabor gostaria? Você pode solicitar o cardápio a qualquer momento da conversa.'
    }
    else if(checkstr(msg, cardapio)){
        return 'Aqui está nosso cardápio!<br>Clique na imagem abaixo para acessá-lo. <br><br>[cardapiodiv]'
    }
    else if(checkstr(msg, pedido)){
            state="sabor";
            return 'Agradecemos a preferência!😃 <br> Qual sabor gostaria? Você pode solicitar o cardápio a qualquer momento da conversa.'
        }
    else if(state=="sabor"){
        
        var pizzaid = checkcardapio(msg);
        sabortemp = getPizzaName(pizzaid);
        precotemp = getPizzaPrice(pizzaid);
        if(pizzaid>=0){
            state="tamanho";
            return 'Você pediu uma pizza de ' + sabortemp + '. Qual tamanho gostaria, Broto, Média, Grande ou Gigante?'
        }else{
            return 'Pizza Inválida. Consulte nosso cardápio para saber as pizzas disponíveis.'
        }
        
    }
    else if(state=="tamanho"){
        const tamanhos=['broto', 'média', 'grande', 'gigante'];
        var indextam = checkstrindex(msg, tamanhos);
        
        if(indextam>=0){
            tamanhotemp=tamanhos[indextam];
            precotemp = setSizePrice(indextam, precotemp);
            precotemp = parseFloat(precotemp.toFixed(2));
            state="confirmar";
            
            return 'Uma pizza ' + sabortemp + ' de tamanho ' + tamanhotemp + ' custará <b>R$' + precotemp.toFixed(2) + '</b>. <br>Podemos confirmar?'
        }else{
            return 'Desculpe, não temos este tamanho. Temos pizzas de tamanho Broto, Média, Grande ou Gigante.'
        }
        
        
    }
    else if(state=="confirmar"){
        if(msg=='sim'){
            state="confirmaped";
            conta.push({id:conta.length+1, name: sabortemp, price: precotemp});
            return 'Pedido Confirmado! 😃 <br><br><b>Sua conta no momento:</b> <br>' + listaConta()+'<br>Deseja adicionar mais pizzas ao seu pedido?'
        }else if(msg=='nao'){
            state="sabor";
            return 'Certo, vamos tentar novamente. Qual sabor deseja?'
        }
    }
    else if(state=="confirmaped"){
        if(msg=='sim'){
            state="sabor";
            return 'Certo, qual sabor gostaria agora?'
        }else if(msg=='nao'){
            state="confirmacon";
            return 'Deseja fechar a conta? Pizzas pedidas até o momento: <br> ' + listaConta()
        }
    }
    else if(state=="confirmacon"){
        if(msg=='sim'){
            state="perguntacep";
            return 'Conta fechada! 😃 Vamos preparar a entrega agora. Por favor digite seu CEP(somente dígitos).'
        }else if(msg=='nao'){
            state="sabor";
            return 'Vamos continuar então. Qual sabor deseja agora?'
            
        }
    }
    else if(state=="perguntacep"){
        try{
            var cepcode = msg.match(/\d+/g);
            var jsonend = JSON.parse(getCEP(cepcode));
            endtemp = jsonend.logradouro;
            state='perguntanum';
            return 'Qual seu número de residência?'
        }catch{
            return 'CEP Inválido. Tente novamente, por favor'
        }
        

        
        
    }
    else if(state=="perguntanum"){
        state='confirmaend';
        
                
        numtemp = msg.match(/\d+/g);
        endtemp = endtemp + ", " + numtemp;
        return 'Seu endereço é ' +endtemp +'?';
        
        
        
        
    }
    else if(state=="confirmaend"){
        if(msg=='sim'){
            state="formapag";
            return 'Antes de enviarmos, qual forma de pagamento deseja? No momento aceitamos pagamento em débito, crédito, dinheiro e cheque.'
        }else if(msg=='nao'){
            state="perguntacep";
            return 'Sem problemas! Vamos tentar novamente. Qual seu CEP?'
            
        }
    }
    else if(state=="formapag"){
        const pagamento=['débito', 'crédito', 'dinheiro', 'cheque'];
        var indextam = checkstrindex(msg, pagamento);
        
        if(indextam>=0){
            pagtemp=pagamento[indextam];
            state="confirmfinal"
            
            return `<b>Conta final</b> <br><br> <b>Pizzas pedidas:</b> <br>`+ listaConta()+` <br><b>Endereço de entrega:</b> ${endtemp} <br> <b>Forma de Pagamento:</b> ${pagtemp} <br><br>Podemos fechar?`
        }else{
            return 'Forma de pagamento inválida. Aceitamos somente pagamento em débito, crédito, dinheiro e cheque.'
        }
    }
    else if(state=="confirmfinal"){
        if(msg=='sim'){
            conta = [];
            return '<b>Conta fechada!</b> <br><br>Faremos as pizzas e enviaremos um motoboy assim que possível! A estimativa de tempo é 40 minutos. <br><br> <b>A Pizzaria Bons do Pedaço agradece sua preferência!</b>'
        }else if(msg=='nao'){
            state="corrigir";
            return 'Então, o que deseja fazer? Pedir mais uma pizza, corrigir endereço ou alterar a forma de pagamento?'
            
        }
    }
    else if(state=="corrigir"){
        const correcoes=['pedir', 'pedido', 'endereço', 'cep', 'numero', 'pagamento', 'pagar', 'fechar'];
        var indexcor = checkstrindex(msg, correcoes);
        if (indexcor==0||indexcor==1){
            state="sabor";
            return 'Vamos voltar a pedir pizzas então! Me avise se desejar fechar a conta.'
        }else if (indexcor==2||indexcor==3||indexcor==4){
            state="perguntacep";
            return 'Vamos corrigir seu endereço! Comece informando seu CEP.'
        }
    else if (indexcor==5||indexcor==6){
        state="formapag";
        return 'Qual pagamento deseja? Estamos aceitando pagamento em débito, crédito, dinheiro e cheque.'
    }
    else if (indexcor==7){
        state="confirmfinal";
            
        return `Conta final <br> Pizzas pedidas: <br> Preço total: <br> Endereço de entrega:${endtemp} <br> Forma de Pagamento:${pagtemp} <br><br>Podemos fechar?`
    }
    }
    
    return 'Desculpe, não entendi.'
}

btnSend.addEventListener("click", (e) => {
    e.preventDefault();
    if (chat.value == "") {} else {
        //getMessage(chat.value);
        sendmessage(chat.value);

        
        
        respondmessage(chat.value.toLowerCase());
        //saymessage(cardapio);
        
        chat.value = "";
    }
});
saymessage("<b>Olá, seja bem vindo à Pizzaria Bons do Pedaço!</b> 🍕<br>Fique à vontade para solicitar o cardápio ou solicitar um pedido.");