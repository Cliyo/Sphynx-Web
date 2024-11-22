import { findNewDevices } from "./finderFunctions/sphynxFinder.js";
import { header, headerAuth } from "./utils/headers.js";
import { mostrarMensagem } from "./utils/messages.js";
import { preencherSelectGrupo } from "./utils/preencherSelect.js";
import { request, testConnection } from "./utils/requestHttp.js";

const api = await testConnection() + ":57128";

const usuariosContainer = document.querySelector("#usuarios-container");

const opcaoUsuarioVer = document.querySelector("#usuarios-menu-ver");
const opcaoUsuarioGrupo = document.querySelector("#usuarios-menu-grupo");

const menuGeral = document.querySelector("#usuarios-ver");
const inputGrupo = document.querySelector("#input-grupo");

const botaoCadastrarUsuario = document.querySelector("#botao-adicionar-novo");
const divCadastrarUsuario = document.querySelector("#usuarios-cadastrar");
const botaoCancelarCadastro = document.querySelector("#cancelar-cadastrar");

const tabela = document.querySelector("tbody");

const legendaQntUsuarios = document.querySelector("#legenda-quantidade-usuarios");
let qntUsuarios = 0;

tabela.innerHTML = "";
const response = await request(api, "consumers", "GET", headerAuth, null);

response.forEach(usuario => {
    let linha = criarLinhaTabela(usuario);

    tabela.appendChild(linha);
});

qntUsuarios = response.length;
legendaQntUsuarios.innerHTML = `Total: ${qntUsuarios} usuario(s)`;

findNewDevices(true);

opcaoUsuarioVer.addEventListener("click", async () => {
    if(!opcaoUsuarioVer.classList.contains("selecionado")){
        opcaoUsuarioVer.classList.toggle("selecionado");
        opcaoUsuarioGrupo.classList.toggle("selecionado");

        inputGrupo.style.display = "none";

        tabela.innerHTML = "";
        const response = await request(api, "consumers", "GET", headerAuth, null);

        response.forEach(usuario => {
            let linha = criarLinhaTabela(usuario);

            tabela.appendChild(linha);
        });
    }
    
})

opcaoUsuarioGrupo.addEventListener("click", async () => {
    if(!opcaoUsuarioGrupo.classList.contains("selecionado")){
        opcaoUsuarioVer.classList.toggle("selecionado");
        opcaoUsuarioGrupo.classList.toggle("selecionado");

        inputGrupo.style.display = "flex";

        inputGrupo.innerHTML = "";

        const responseGrupo = await request(api, "groups", "GET", headerAuth, null);

        preencherSelectGrupo(inputGrupo, responseGrupo);

        const response = await request(api, `consumers?group=${inputGrupo.value}`, "GET", headerAuth, null);
            
        qntUsuarios = response.length;
        legendaQntUsuarios.innerHTML = `Total: ${qntUsuarios} usuario(s)`;
        
        tabela.innerHTML = "";

        response.forEach(usuario => {
            let linha = criarLinhaTabela(usuario);

            tabela.appendChild(linha);
        });

        inputGrupo.addEventListener("change", async () => {
            const response = await request(api, `consumers?group=${inputGrupo.value}`, "GET", headerAuth, null);
            
            qntUsuarios = response.length;
            legendaQntUsuarios.innerHTML = `Total: ${qntUsuarios} usuario(s)`;

            tabela.innerHTML = "";

            response.forEach(usuario => {
                let linha = criarLinhaTabela(usuario);
    
                tabela.appendChild(linha);
            });
        })
    }
})

botaoCadastrarUsuario.addEventListener("click", async () => {
    usuariosContainer.classList.add("escurecer");
    divCadastrarUsuario.classList.add("mostrar");

    let inputTag = document.querySelector("#tag-input");
    let inputBiometria = document.querySelector("#biometria-input");

    const websocketTag = new WebSocket("ws://192.168.0.104/ws");
    websocketTag.onopen = () => {
        console.log("Conexão aberta com o websocket")
        if (websocketTag.readyState === WebSocket.OPEN) {
            let mensagem = "tags"
            websocketTag.send(mensagem);
            console.log('Solicitação de registro de tag enviada');
        }
        
    }
    websocketTag.onmessage = (event) => {
        console.log(event)
        console.log(event.data)
        inputTag.value = event.data;
    }

    const websocketBiometria = new WebSocket("ws://192.168.0.104/ws");
    websocketBiometria.onopen = () => {
        console.log("Conexão aberta com o websocket")
        if (websocketBiometria.readyState === WebSocket.OPEN) {
            let mensagem = "fingerid{id}"
            websocketBiometria.send(mensagem);
            console.log('Solicitação de registro de biometria enviada');
        }
        
    }
    websocketBiometria.onmessage = (event) => {
        console.log(event)
        console.log(event.data)
        inputBiometria.value = event.data;
    }
    
    let grupoInput = document.querySelector("#input-grupo-cadastrar");
    grupoInput.innerHTML = "";

    let option = document.createElement("option");
    const responseGrupo = await request(api, "groups", "GET", headerAuth, null);

    preencherSelectGrupo(grupoInput, responseGrupo);
})

let formCadastrar = document.querySelector("form");
formCadastrar.addEventListener("submit", async (event) => {
    event.preventDefault();

    var formData =  new FormData(formCadastrar);
    var dados = Object.fromEntries(formData);
    var jsonData = JSON.stringify(dados);
    
    const response = await request(api, "consumers", "POST", headerAuth, jsonData);

    console.log(response)
    mostrarMensagem(response.message);
    if(response.status == 201){
        tabela.appendChild(criarLinhaTabela(response.object));
        
        qntUsuarios++;
        legendaQntUsuarios.innerHTML = `Total: ${qntUsuarios} usuario(s)`;            

        usuariosContainer.classList.remove("escurecer");
        divCadastrarUsuario.classList.remove("mostrar");
    }
})

botaoCancelarCadastro.addEventListener("click", () => {
    usuariosContainer.classList.remove("escurecer");
    divCadastrarUsuario.classList.remove("mostrar");
})

function criarLinhaTabela(usuario){
    let tr = document.createElement("tr");

    let tdNome = document.createElement("td");
    tdNome.innerHTML = usuario.name;
    
    let tdGrupo = document.createElement("td");
    tdGrupo.innerHTML = usuario.group.name;

    let tdRa = document.createElement("td");
    tdRa.innerHTML = usuario.ra;

    let tdTag = document.createElement("td");
    tdTag.innerHTML = usuario.tag;

    let tdAcao = document.createElement("td");

    let editarBotao = document.createElement("button");
    editarBotao.innerHTML = "Editar";
    
    let excluirBotao = document.createElement("button");
    excluirBotao.innerHTML = "Excluir";
    excluirBotao.addEventListener("click", async () => {

        const response = await request(api, `consumers/${usuario.ra}`, "DELETE", headerAuth, null);

        try{
            mostrarMensagem(response.message);
        }
        catch(erro){
            mostrarMensagem("Usuario deletado com sucesso.");

            qntUsuarios--;
            legendaQntUsuarios.innerHTML = `Total: ${qntUsuarios} usuario(s)`;    
    
            tr.remove();
        } 

    })

    tdAcao.appendChild(editarBotao);
    tdAcao.appendChild(excluirBotao);

    tr.appendChild(tdNome);
    tr.appendChild(tdGrupo);
    tr.appendChild(tdRa);
    tr.appendChild(tdTag);
    tr.appendChild(tdAcao);

    return tr;
}
