let activeSheetColor  ="#d0d3d4";
let sheetsFolderCont = document.querySelector(".sheets-folder-cont");
let addSheetBtn = document.querySelector(".sheet-add-icon");


// adding new sheet
addSheetBtn.addEventListener("click", (e) => {
    let sheet = document.createElement("div");
    sheet.setAttribute("class", "sheet-folder");

    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    sheet.setAttribute("id", allSheetFolders.length);

    sheet.innerHTML = `
        <div class="sheet-content">Sheet ${allSheetFolders.length + 1}</div>
    `;

    sheetsFolderCont.appendChild(sheet);
    sheet.scrollIntoView();

    // DB
    createSheetDB();
    createGraphComponentMatrix();
    handleSheetActiveness(sheet);
    handleSheetRemoval(sheet);
    sheet.click();
})

// for sheet removal using right click
function handleSheetRemoval(sheet) {
    sheet.addEventListener("mousedown", (e) => {
        // Right click
        if (e.button !== 2) return;

        let allSheetFolders = document.querySelectorAll(".sheet-folder");
        if (allSheetFolders.length === 1) {
            alert("You need to have atleast one sheet!!");
            return;
        }

        let response = confirm("Your sheet will be removed permanently, Are you sure?");
        if (response === false) return;

        let sheetIdx = Number(sheet.getAttribute("id"));
        // DB
        collectedSheetDB.splice(sheetIdx, 1);
        collectedGraphComponent.splice(sheetIdx, 1);
        // UI
        handleSheetUIRemoval(sheet)

        // By default DB to sheet 1 (active)
        sheetDB = collectedSheetDB[0];
        graphComponentMatrix = collectedGraphComponent[0];
        handleSheetProperties();
    })
}

// to remove previous sheet UI on deletion of sheet
function handleSheetUIRemoval(sheet) {
    sheet.remove();
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for (let i = 0;i < allSheetFolders.length;i++) {
        allSheetFolders[i].setAttribute("id", i);
        let sheetContent = allSheetFolders[i].querySelector(".sheet-content");
        sheetContent.innerText = `Sheet ${i+1}`;
        allSheetFolders[i].style.backgroundColor = "transparent";
    }

    allSheetFolders[0].style.backgroundColor = activeSheetColor;
}

// to select the sheet based on the passed index and set the sheetDB and GCM to sheet whose index is passed
function handleSheetDB(sheetIdx) {
    sheetDB = collectedSheetDB[sheetIdx];
    graphComponentMatrix = collectedGraphComponent[sheetIdx];
}

// to handle each cells property and to set props to their value as in sheetDB
function handleSheetProperties() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = document.querySelector(`.cell[rowID='${i + 1}'][colID='${String.fromCharCode(65 + j)}']`);
            cell.click();
        }
    }
    // By default click on first cell via DOM
    let firstCell = document.querySelector(".cell");
    firstCell.click();
}

// used to handle UI changes btn changes
function handleSheetUI(sheet) {
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for (let i = 0; i < allSheetFolders.length; i++) {
        allSheetFolders[i].style.backgroundColor = "transparent";
    }
    sheet.style.backgroundColor = activeSheetColor;
}


function handleSheetActiveness(sheet) {
    sheet.addEventListener("click", (e) => {
        let sheetIdx = Number(sheet.getAttribute("id"));
        handleSheetDB(sheetIdx);
        handleSheetProperties();
        handleSheetUI(sheet);
    })
}

function createSheetDB() {
    let sheetDB = [];
    for(let i = 0; i < rows; i++){
        let sheetRow = [];
        for(let j = 0; j < cols; j++){
            let cellProp = {
                bold: false,
                italic: false,
                underlined: false,
                alignment: "left",
                fontStyle: "arial",
                fontSize: "14",
                fontColor: "#000000",
                BGColor: "#rgb(248, 245, 245)",
                value: "",
                formula: "",
                children: []
            }
            sheetRow.push(cellProp);
        }
        sheetDB.push(sheetRow);
    }
    collectedSheetDB.push(sheetDB);
}

function createGraphComponentMatrix() {
    let graphComponentMatrix = [];
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
            // Why array -> More than 1 child relation(dependency)
            row.push([]);
        }
        graphComponentMatrix.push(row);
    }
    collectedGraphComponent.push(graphComponentMatrix);
}