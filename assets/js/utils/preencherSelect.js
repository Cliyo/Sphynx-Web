function preencherSelectGrupo(select, lista){
    lista.forEach(grupo => {
        let option = document.createElement("option");
        option.value = grupo.id;
        option.innerHTML = grupo.name;

        select.appendChild(option);
    })
}

export {preencherSelectGrupo}

