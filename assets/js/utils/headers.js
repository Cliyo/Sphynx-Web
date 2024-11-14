import { linguagem } from "./linguagemPagina.js"
import { testConnection } from "./requestHttp.js";

const api = await testConnection();

const headerAuth = {
    'Authorization': `Bearer ${localStorage.getItem("token")}`,
    'Access-Control-Allow-Origin': `http://${api}`,
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json',
    'language': linguagem || "pt-br"
}

const header = {
    'Access-Control-Allow-Origin': `http://${api}`,
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json',
    'language': linguagem || "pt-br"
} 

export {header, headerAuth}