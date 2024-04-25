import { IP, header } from "../dashboardScript.js";
import {finder, turnsEspInWebsocket} from "../finderFunctions/sphynxFinder.js";
import request from "../utils/requestHttp.js";

// LOCAL SCREENS DIVS //
const localRegisterDiv = document.querySelector("#local-register-div");
const localUpdateDiv = document.querySelector("#local-update-div");
const localDeleteDiv = document.querySelector("#local-delete-div");
const localGetDiv = document.querySelector("#local-get-div");

// LOCAL SUB BUTTONS TO SHOW THE SCREENS //
const subItemLocalRegister = document.querySelector("#sub-item-local-register");
const subItemLocalUpdate = document.querySelector("#sub-item-local-update");
const subItemLocalDelete = document.querySelector("#sub-item-local-delete");
const subItemLocalGet = document.querySelector("#sub-item-local-get")

// FUNCTIONS TO SHOW AND HID THE SCREENS //
subItemLocalRegister.addEventListener("click", async (event) => {
    event.preventDefault();

    // LOADING IMAGE CREATION //
    let img = document.createElement("img");
    img.id = "load-image"
    img.src = "../assets/img/load.gif";
    localRegisterDiv.appendChild(img);

    // CLEAR TABLE //
    localRegisterDiv.querySelector(".content-table").querySelector("tbody").innerHTML = "";

    // SHOW THE SCREEN //
    allScreens.forEach(screen => {
        screen.style.display = "none";
    })
    localRegisterDiv.style.display = "flex";

    // SPHYNX FINDER //
    const allIps = await finder();

    // DELETE THE LOADING IMAGE //
    document.querySelector("#load-image").style.display = "none";

    // CREATING THE TABLE COLUMN //
    allIps.forEach(esp => {
        let tr = document.createElement("tr");

        // INPUT NAME //
        let inputName = document.createElement("input");
        inputName.type = "text";
        inputName.className = "input-name-local-table";
        inputName.id = "input-name-local-table";

        let tdName = document.createElement("td");
        tdName.appendChild(inputName);

        // INPUT PERMISSION //
        let listPermissions = ["High", "Mid", "Low"];

        let selectPermission = document.createElement("select");
        selectPermission.className = "select-permission-local-table";
        selectPermission.id = "select-permission-local-table";

        for(let i = 0; i < 3; i++){
            let option = document.createElement("option");
            option.className = "select-permission-option";
            option.innerHTML = i + " - " + listPermissions[i];
            option.value = i;
            selectPermission.appendChild(option);
        }

        let tdPermission = document.createElement("td");
        tdPermission.appendChild(selectPermission);

        // MAC COLUMN //
        let tdMac = document.createElement("td");
        tdMac.innerHTML = esp.mac;
        tdMac.id = "mac-local-table"

        // INPUT SUBMIT BUTTON //
        let button = document.createElement("button");
        button.innerHTML = "Save";
        button.className = "button-local-table";
        button.id = "button-local-table";

        button.addEventListener("click", async (event) => {
            event.preventDefault();
    
            let mac = button.parentNode.parentNode.querySelector("#mac-local-table").innerHTML;
            let name = button.parentNode.parentNode.querySelector("#input-name-local-table").value;
            let permission = button.parentNode.parentNode.querySelector("#select-permission-local-table").value;

            let formData = new FormData();
            formData.append("name", name);
            formData.append("mac", mac);
            formData.append("permission", permission);
            var data = Object.fromEntries(formData);
            var jsonData = JSON.stringify(data);

            const reqData = await request(IP, `local`, "POST", header, jsonData);

            if(reqData.status == 400){
                alert(reqData.message);
            } else{
                alert(reqData.message);
                window.location = "dashboardPage.html";
            }
                
        })

        let tdButton = document.createElement("td");
        tdButton.appendChild(button);
        
        // LEFT THE FOUR ELEMENTS IN TR //
        tr.appendChild(tdName);
        tr.appendChild(tdPermission);
        tr.appendChild(tdMac);
        tr.appendChild(tdButton);
        
        // SHOW IN SCREEN //
        localRegisterDiv.querySelector(".content-table").querySelector("tbody").appendChild(tr);
    })
})
subItemLocalUpdate.addEventListener("click", (event) => {
    allScreens.forEach(screen => {
        screen.style.display = "none";
    })
    localUpdateDiv.style.display = "flex";
})

subItemLocalDelete.addEventListener("click", (event) => {
    allScreens.forEach(screen => {
        screen.style.display = "none";
    })
    localDeleteDiv.style.display = "flex";
})

subItemLocalGet.addEventListener("click", (event) => {
    allScreens.forEach(screen => {
        screen.style.display = "none";
    })
    localGetDiv.style.display = "flex";
})

export {localGetDiv, subItemLocalGet};