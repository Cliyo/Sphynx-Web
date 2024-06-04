import { api } from "../dashboardScript.js";
import {request, testConnection} from "../utils/requestHttp.js";
import {header, language} from "../dashboardScript.js"

var finderAPI = `${window.location.hostname}:57127`;
const apiUrls = ['sphynx-finder.local:57127','localhost:57127', `${window.location.hostname}:57127`]

finderAPI = await testConnection(apiUrls)


const finderHeader = {
    'Access-Control-Allow-Origin': `http://${finderAPI}`,
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json'
    }
    
async function finderServices(){
    const response = await request(finderAPI, `services`, "GET", finderHeader, null, true)

    return response;
}

async function finderScan(){
    const response = await request(finderAPI, `scan`, "GET", finderHeader, null, true)

    return response;
}

async function finder(type){
    var response = null;
    if (type == "scan"){
        response = await finderScan();
    }else{
        response = await finderServices();
    }

    if (!response.ok) {
        console.error("Não foi possível pegar os dispositivos")
    }

    return response.json()
}

async function inDatabase(){
    // GET ALL THE ESP32 //
    const sphynxs = [];

    // GET ALL THE MAC IN DATABASE //
    const reqData = await request(api, `locals`, "GET", header, null);

    let array = Object.keys(reqData);
    
    array.forEach(index => {
        sphynxs.push(reqData[index]["mac"])       
    })

    return sphynxs;
}

async function turnsEspInWebsocket(data) {
    let arrayEsp = [];

    let connectionPromises = data.map(async esp => {
        try {
            let ws = new WebSocket(`ws://${esp.ip}/ws`);

            let messagePromise = new Promise((resolve, reject) => {
                ws.onmessage = event => {
                    if (event.data === "data") {
                        arrayEsp.push(ws);
                        resolve();
                    }
                };
                ws.onerror = reject;
                ws.onclose = () => {
                    reject(new Error("Conexão com o WebSocket fechada"));
                };
            });

            await messagePromise;

        } catch (error) {
            console.error("Erro: ", error);
        }
    });

    await Promise.all(connectionPromises);

    return arrayEsp;
}

export {finder, inDatabase, turnsEspInWebsocket};