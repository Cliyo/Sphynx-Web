import {headerAuth} from "./utils/headers.js";
import { request, testConnection } from "./utils/requestHttp.js";
import { findNewDevices } from "./utils/DeviceFinder.js";

const api = await testConnection() + ":57128";

const tabela = document.querySelector("tbody");

const filtros = document.querySelector(".ajustar-inputs").querySelectorAll("input");

const legendaQntAcessos = document.querySelector("#legenda-quantidade-acessos");
let qntAcessos = 0;

const response = await request(api, "accessRegisters", "GET", headerAuth, null);

tabela.innerHTML = "";
response.forEach(acesso => {
    tabela.appendChild(criarLinhaTabela(acesso))
});

qntAcessos = response.length;
legendaQntAcessos.innerHTML = `Total: ${qntAcessos} acesso(s)`;

filtros.forEach(filtro => {
    filtro.addEventListener("change", async () => {
        let ra = document.querySelector("#ra-input").value || null;
        let data = document.querySelector("#data-input").value || null;
        let local = document.querySelector("#local-input").value || null;

        let response;

        if(ra != null && local == null && data == null){
            response = await request(api, `accessRegisters?ra=${ra}`, "GET", headerAuth, null);
        }

        else if(ra == null && local != null && data == null){
            response = await request(api, `accessRegisters?local=${local}`, "GET", headerAuth, null);
        }

        else if(ra == null && local == null && data != null){
            let dataCompleta = gerarData(data);
            response = await request(api, `accessRegisters?date=${data}`, "GET", headerAuth, null);
        }

        else if(ra != null && local != null && data != null){
            let dataCompleta = gerarData(data);
            response = await request(api, `accessRegisters?ra=${ra}&date=${dataCompleta}&local=${local}`, "GET", headerAuth, null);
        }

        else{
            response = await request(api, `accessRegisters`, "GET", headerAuth, null);
        }

        tabela.innerHTML = "";
        response.forEach(acesso => {
            tabela.appendChild(criarLinhaTabela(acesso))
        });

        qntAcessos = response.length;
        legendaQntAcessos.innerHTML = `Total: ${qntAcessos} acesso(s)`;
    })
});

function criarLinhaTabela(acesso){
    let tr = document.createElement("tr");

    let tdNome = document.createElement("td");
    tdNome.innerHTML = acesso.consumer.name;
    
    let tdRa = document.createElement("td");
    tdRa.innerHTML = acesso.consumer.ra;

    let tdLocal = document.createElement("td");
    tdLocal.innerHTML = acesso.local.name;

    let tdData = document.createElement("td");
    tdData.innerHTML = acesso.date;

    let tdSituacao = document.createElement("td");
    tdSituacao.innerHTML = acesso.status == true ? "Aprovado" : "Negado";

    tr.appendChild(tdNome);
    tr.appendChild(tdRa);
    tr.appendChild(tdLocal);
    tr.appendChild(tdData);
    tr.appendChild(tdSituacao);

    return tr;
}

function gerarData(input){
    let data = new Date(input);

    let dia = data.getDate() < 10 ? `0${data.getDate()}` : data.getDate();
    let mes = (data.getMonth() + 1) < 10 ? `0${data.getMonth() + 1}` : data.getMonth() + 1;
    let ano = data.getFullYear();
    let dataCompleta = ano + "-" + mes + "-" + dia;

    return dataCompleta;
}

findNewDevices();