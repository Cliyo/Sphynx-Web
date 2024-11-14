import { header } from "./utils/headers.js";
import { mostrarMensagem } from "./utils/messages.js";
import { request, testConnection } from "./utils/requestHttp.js";

const api = await testConnection() + ":57128";

var form = document.querySelector("#form")

request(api,`login/verify`,"POST",header,JSON.stringify({"token": localStorage.getItem("token")}))
    .then(response =>{
        if (response["result"]){
            window.location = "pages/dashboard.html"
        }
    })
    .catch(err =>{
        console.log(err);
    })


form.addEventListener("submit", async (event) => {
    event.preventDefault();

    var formData = new FormData(form);
    var data = Object.fromEntries(formData);
    var jsonData = JSON.stringify(data);

    request (api, `login`, "POST", header, jsonData, true)
        .then(response => {
            if(!response.ok){
                mostrarMensagem("Usuario ou senha incorretos.");

                throw new Error("HTTP Status " + response.status);
            }
            
            return response.json()
        })
        .then(data => {
            mostrarMensagem("Entrando...");
            localStorage.setItem("token", data["token"]);
            window.location = "pages/dashboard.html";
        })
        .catch(err => {
            mostrarMensagem("Erro interno.");
        })
})