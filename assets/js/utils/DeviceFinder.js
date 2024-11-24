import {request, testConnection} from "../utils/requestHttp.js";
import {headerAuth} from "../utils/headers.js"
import { mostrarMensagem } from "../utils/messages.js";

const api = await testConnection() + ":57128";

    
async function find(){
    const response = await request(api, `deviceFinder/scan`, "GET", headerAuth, null, true)

    try {
        if (!response.ok) {
            console.error("Não foi possível pegar os dispositivos")
        }
    } catch (error) {
        return [];
    }
    
    return response.json()
}


async function findNewDevices(timeout){
    let found = await find();

    console.log(found)

    found = found.map(device => ({ ip: device[0], mac: device[1] }));

    if (found.length > 0) {
        mostrarMensagem("Novo dispositivo encontrado");
        let alreadyFound = json ? JSON.parse(json) : [];
        alreadyFound.push(...found);
        sessionStorage.setItem("sphynxs-unregistered", JSON.stringify(alreadyFound));
        found = []
    }

    if (timeout){
        setTimeout(findNewDevices, 60000);
    }

}

export {findNewDevices};