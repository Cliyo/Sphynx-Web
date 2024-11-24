import { findNewDevices } from "./utils/DeviceFinder.js";

const opcaoGeral = document.querySelector("#configuracoes-menu-geral");
const opcaoAvancado = document.querySelector("#configuracoes-menu-avancado");

const menuGeral = document.querySelector("#configuracoes-geral");
const menuAvancado = document.querySelector("#configuracoes-avancada");

opcaoGeral.addEventListener("click", () => {
    if(!opcaoGeral.classList.contains("selecionado")){
        opcaoGeral.classList.toggle("selecionado");
        opcaoAvancado.classList.toggle("selecionado");

        menuGeral.style.display = "flex";
        menuAvancado.style.display = "none";
    }
    
})

opcaoAvancado.addEventListener("click", () => {
    if(!opcaoAvancado.classList.contains("selecionado")){
        opcaoGeral.classList.toggle("selecionado");
        opcaoAvancado.classList.toggle("selecionado");

        menuGeral.style.display = "none";
        menuAvancado.style.display = "flex";
    }
})

findNewDevices();
