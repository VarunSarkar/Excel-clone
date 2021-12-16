document.addEventListener("keydown", (e) => {
    ctrlKey = e.ctrlKey;
})
document.addEventListener("keyup", (e) => {
    ctrlKey = e.ctrlKey;
})

for (let i =0;i < rows;i++) {
    for (let j = 0;j < cols;j++) {
        let cell = document.querySelector(`.cell[rowID="${i + 1}"][colID="${String.fromCharCode(j + 65)}"]`);
        handleSelectedCells(cell);
    }
}

let copyBtn = document.querySelector(".copy");
let cutBtn = document.querySelector(".cut");
let pasteBtn = document.querySelector(".paste");

let rangeStorage = [];
function handleSelectedCells(cell) {
    cell.addEventListener("click", (e) => {
        // Select cells range work
        if (!ctrlKey) return;

        if(rangeStorage.length === 0){
            if(prevCell !== cell){
                removePrevCellProp(prevCell);
            }
        }

        if (rangeStorage.length >= 2) {
            defaultSelectedCellsUI();
            rangeStorage = [];
        }

        // UI
        cell.style.border = "3px solid #218c74";

        let rid = Number((cell.getAttribute("rowID"))) - 1;
        let cid = Number((cell.getAttribute("colID")).charCodeAt(0)) - 65;
        rangeStorage.push([rid, cid]);
        console.log(rangeStorage);
        prevCell = cell;
    })
}

function defaultSelectedCellsUI() {
    for (let i = 0; i < rangeStorage.length; i++) {
            let cell = document.querySelector(`.cell[rowID="${rangeStorage[i][0] + 1}"][colID="${String.fromCharCode(rangeStorage[i][1] + 65)}"]`);
            cell.style.border = "1px solid lightgrey";
            deselectRowAndCol(cell);
    }
}

let copyData = [];
copyBtn.addEventListener("click", (e) => {
    if (rangeStorage.length < 2) return;
    copyData = [];

    let [strow, stcol, endrow, endcol] = [ rangeStorage[0][0], rangeStorage[0][1], rangeStorage[1][0], rangeStorage[1][1] ];

    for (let i = strow; i <= endrow; i++) {
        let copyRow = [];
        for (let j = stcol; j <= endcol; j++) {
            let cellProp = sheetDB[i][j];
            console.log(sheetDB[i][j]);
            copyRow.push(cellProp);
        }
        copyData.push(copyRow);
    }

    console.log(copyData);
    defaultSelectedCellsUI();
})

cutBtn.addEventListener("click", (e) => {
    if (rangeStorage.length < 2) return;
    copyData = [];

    let [strow, stcol, endrow, endcol] = [ rangeStorage[0][0], rangeStorage[0][1], rangeStorage[1][0], rangeStorage[1][1] ];

    for (let i = strow; i <= endrow; i++) {
        let copyRow = [];
        for (let j = stcol; j <= endcol; j++) {
            let cell = document.querySelector(`.cell[rowID="${i + 1}"][colID="${String.fromCharCode(j + 65)}"]`);
            
            // DB
            let cellProp = sheetDB[i][j];
            let cutData = structuredClone(cellProp);
            copyRow.push(cutData);

            cellProp.value = "";
            cellProp.bold = false;
            cellProp.italic = false;
            cellProp.underlined = false;
            cellProp.fontSize = 14;
            cellProp.fontFamily = "monospace";
            cellProp.fontColor = "#000000";
            cellProp.BGColor = "#rgb(248, 245, 245)";
            cellProp.alignment = "left";

            // UI
            cell.click();
        }
        copyData.push(copyRow);
    }

    defaultSelectedCellsUI();
})

pasteBtn.addEventListener("click" ,(e) => {
    // Past cells data work
    if (rangeStorage.length < 2) return;

    let rowDiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0]);
    let colDiff = Math.abs(rangeStorage[0][1] - rangeStorage[1][1]);

    // Target
    let address = addressBar.value;
    let [stRow, stCol] = decodeRIDCIDFromAddress(address);


    // r === copydata row
    // c === copydata col
    for (let i = stRow,r = 0;i <= stRow+rowDiff;i++,r++) {
        for (let j = stCol,c = 0;j <= stCol+colDiff;j++,c++) {
            let cell = document.querySelector(`.cell[rowID="${i + 1}"][colID="${String.fromCharCode(j + 65)}"]`);
            console.log(cell);
            if (!cell) continue;

            // DB
            let data = copyData[r][c];
            console.log(data);
            let cellProp = sheetDB[i][j];

            cellProp.value = data.value;
            cellProp.bold = data.bold;
            cellProp.italic = data.italic;
            cellProp.underlined = data.underlined;
            cellProp.fontSize = data.fontSize;
            cellProp.fontFamily = data.fontFamily;
            cellProp.fontColor = data.fontColor;
            cellProp.BGColor = data.BGColor;
            cellProp.alignment = data.alignment;
            // UI
            cell.click();
        }
    }
})