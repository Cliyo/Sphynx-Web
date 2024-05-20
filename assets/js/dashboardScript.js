import { fetchEspData } from "./localFunctions/localMenus.js";

const api = 'sphynx-api.local:57128'

// MENU ANIMATION //
$('.sub-btn').next('.sub-menu').slideToggle();
$(document).ready(function() {
    if (window.innerWidth <= 650) { 
        $('.menu-button').next('.menu').slideToggle();
        $('.menu-button').click(function() {
            $('.menu').slideToggle();
            $(this).find('.dropdown').toggleClass('rotate');
        });
    }
    
    $('.sub-btn').click(function() {
        $('.sub-menu').not($(this).next('.sub-menu')).slideUp();
        $('.dropdown').not($(this).find('.dropdown')).removeClass('rotate');
        $(this).next('.sub-menu').slideToggle();
        $(this).find('.dropdown').toggleClass('rotate');
    });
});

// GET THE WEBSITE LANGUAGE //
const urlParams = new URLSearchParams(window.location.search);
const language = urlParams.get("language");

// DEFINE THE HTTP HEADER //
const header = {
    'Authorization': `Bearer ${localStorage.getItem("token")}`,
    'Access-Control-Allow-Origin': `http://${api}`,
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json',
    'language': language
}

// VERIFY THE USER LOGIN //
if(localStorage.getItem("token")){
    fetch(`http://${api}/login/verify`,{
        mode: 'cors',
        method: "POST",
        headers: {
            'Access-Control-Allow-Origin': `http://${api}`,
            'Access-Control-Allow-Credentials': 'true',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "token": localStorage.getItem("token")
        })
    })

    .then(response => response.json())
    .then(data => {
        if(data["result"] == false){
            window.location = "/";
        }
    })
    .catch(err => {
        window.location = "/";
        console.log(err);
    })
} else{
    window.location = "/";
}

fetchEspData(true);

export {header, language, api};