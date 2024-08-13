import { findNewDevices } from "./finderFunctions/sphynxFinder.js";
import { headerAuth } from "./utils/headers.js";
import { mostrarMensagem } from "./utils/messages.js";
import { request } from "./utils/requestHttp.js";
import { api } from "./utils/testeConexao.js";

const usuariosContainer = document.querySelector("#grupos-container");

const menuGeral = document.querySelector("#usuarios-ver");

const botaoCadastrarGrupos = document.querySelector("#botao-adicionar-novo");
const divCadastrarGrupos = document.querySelector("#grupos-cadastrar");
const botaoCancelarCadastro = document.querySelector("#cancelar-cadastrar");

const tabela = document.querySelector("tbody");
const legendaQntGrupos = document.querySelector("#legenda-quantidade-grupos");

let qntGrupos = 0;

tabela.innerHTML = "";
const response = await request(api, "groups", "GET", headerAuth, null);

response.forEach(grupo => {
    let linha = criarLinhaTabela(grupo);
    tabela.appendChild(linha);
});

qntGrupos = response.length;
legendaQntGrupos.innerHTML = `Total: ${qntGrupos} grupo(s)`;

findNewDevices(true);

botaoCadastrarGrupos.addEventListener("click", () => {
    usuariosContainer.classList.add("escurecer");
    divCadastrarGrupos.classList.add("mostrar");
})


let formCadastrar = document.querySelector("form");
formCadastrar.addEventListener("submit", async (event) => {
    event.preventDefault();

    var formData =  new FormData(formCadastrar);
    var dados = Object.fromEntries(formData);
    var jsonData = JSON.stringify(dados);
    
    const response = await request(api, "groups", "POST", headerAuth, jsonData);

    mostrarMensagem(response.message);
    if(response.status == 201){
        tabela.appendChild(criarLinhaTabela(response.object));
        
        qntGrupos++;
        legendaQntGrupos.innerHTML = `Total: ${qntGrupos} grupo(s)`;            

        usuariosContainer.classList.remove("escurecer");
        divCadastrarGrupos.classList.remove("mostrar")
    }
})

botaoCancelarCadastro.addEventListener("click", () => {
    usuariosContainer.classList.remove("escurecer");
    divCadastrarGrupos.classList.remove("mostrar");
})

function criarLinhaTabela(grupo){
    let tr = document.createElement("tr");

    let tdNome = document.createElement("td");
    tdNome.innerHTML = grupo.name;

    let tdAcao = document.createElement("td");

    let editarBotao = document.createElement("button");
    editarBotao.innerHTML = "Editar";
    
    let excluirBotao = document.createElement("button");
    excluirBotao.innerHTML = "Excluir";
    excluirBotao.addEventListener("click", async () => {

        const response = await request(api, `groups/${grupo.id}`, "DELETE", headerAuth, null);

        try{
            mostrarMensagem(response.message);
        }
        catch(erro){
            mostrarMensagem("Grupo deletado com sucesso.");

            qntGrupos--;
            legendaQntGrupos.innerHTML = `Total: ${qntGrupos} usuario(s)`;    
    
            tr.remove();
        } 

    })

    tdAcao.appendChild(editarBotao);
    tdAcao.appendChild(excluirBotao);

    tr.appendChild(tdNome);
    tr.appendChild(tdAcao);

    return tr;
}