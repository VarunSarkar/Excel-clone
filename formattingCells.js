let collectedSheetDB = [];  //Contains all SheetDB
let sheetDB = [];

{
    let addSheetBtn = document.querySelector(".sheet-add-icon");
    addSheetBtn.click();
    let prevCell;
}

// getting all the properties object
let fontFamilySel = document.querySelector(".font-family_selector");
let fontSizeSel = document.querySelector(".font-size_selector");
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underlined = document.querySelector(".underlined");
let alignment = document.querySelectorAll(".alignment");
let fontColor = document.querySelector(".font_color");
let BGColor = document.querySelector(".BGcolor");
let left = alignment[0];
let center = alignment[1];
let justify = alignment[2];
let right = alignment[3];
let allCell = document.querySelectorAll(".cell");
let activeColor = "#d0d3d4";
let inActiveColor = "#ecf0f1";

//font family event listener
fontFamilySel.addEventListener("change",()=>{
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    cellProp.fontStyle = fontFamilySel.value;
    cell.style.fontFamily = cellProp.fontStyle;
    fontFamilySel.value = cellProp.fontStyle;
})

//font size event listener
fontSizeSel.addEventListener("change",()=>{
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    cellProp.fontSize = fontSizeSel.value;
    cell.style.fontSize = cellProp.fontSize + "px";
    fontSizeSel.value = cellProp.fontSize;
    fontSizeSel.value = cellProp.fontSize;
})

//bold event listener
bold.addEventListener("click", ()=>{
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    cellProp.bold = !cellProp.bold;
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
    bold.style.backgroundColor = cellProp.bold ? activeColor : inActiveColor;
})

//italic event listener
italic.addEventListener("click", ()=>{
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    cellProp.italic = !cellProp.italic;
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
    italic.style.backgroundColor = cellProp.italic ? activeColor : inActiveColor;
})

//underline event listener
underlined.addEventListener("click", ()=>{
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);
    cellProp.underlined = !cellProp.underlined;
    cell.style.textDecoration = cellProp.underlined ? "underline" : "none";
    underlined.style.backgroundColor = cellProp.underlined ? activeColor : inActiveColor;
})

//alignment event listener
alignment.forEach((alignElem) => {
    alignElem.addEventListener("click", (e)=> {
        let address = addressBar.value;
        let [cell, cellProp] = getCellAndCellProp(address);

        let align = e.target.classList[2];
        cellProp.alignment = align;
        cell.style.textAlign = cellProp.alignment;

        switch(align){
            case "left":
                left.classList.add("active");
                center.classList.remove("active");
                justify.classList.remove("active");
                right.classList.remove("active");
                break;
            case "center":
                left.classList.remove("active");
                center.classList.add("active");
                justify.classList.remove("active");
                right.classList.remove("active");
                break;
            case "justify":
                left.classList.remove("active");
                center.classList.remove("active");
                justify.classList.add("active");
                right.classList.remove("active");
                break;
            case "right":
                left.classList.remove("active");
                center.classList.remove("active");
                justify.classList.remove("active");
                right.classList.add("active");
                break;
        }
    })
})

//font color event listener
fontColor.addEventListener("change",(e)=>{
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    cellProp.fontColor = fontColor.value;
    cell.style.color = cellProp.fontColor;
    fontColor.value = cellProp.fontColor;

})

//BGcolor event listener
BGColor.addEventListener("change",(e)=>{
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    cellProp.BGColor = BGColor.value;
    cell.style.backgroundColor = cellProp.BGColor;
    BGColor.value = cellProp.BGColor;
})

//to make changes respective of each cells properties
for(let i = 0; i < allCell.length; i++){
    addEventListenerToEachCell(allCell[i]);
}

//to add Eventlistener to each cell
function addEventListenerToEachCell(cell){
    cell.addEventListener("click", (e) => {
        let address = addressBar.value;
        let [ucell, cellProp] = getCellAndCellProp(address);
        cell.style.fontFamily = cellProp.fontStyle;
        cell.style.fontSize = cellProp.fontSize + "px";
        cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
        cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
        cell.style.textDecoration = cellProp.underlined ? "underline" : "none";
        cell.style.backgroundColor = cellProp.BGColor;
        cell.style.color = cellProp.fontColor;
        cell.style.textAlign = cellProp.alignment;


        //UI properties change
        bold.style.backgroundColor = cellProp.bold ? activeColor : inActiveColor;
        italic.style.backgroundColor = cellProp.italic ? activeColor : inActiveColor;
        underlined.style.backgroundColor = cellProp.underlined ? activeColor : inActiveColor;
        fontFamilySel.value = cellProp.fontStyle;
        fontSizeSel.value = cellProp.fontSize;
        fontColor.value = cellProp.fontColor;
        BGColor.value = cellProp.BGColor;
        cell.innerText = cellProp.value;

        switch(cellProp.alignment){
            case "left":
                left.classList.add("active");
                center.classList.remove("active");
                justify.classList.remove("active");
                right.classList.remove("active");
                break;
            case "center":
                left.classList.remove("active");
                center.classList.add("active");
                justify.classList.remove("active");
                right.classList.remove("active");
                break;
            case "justify":
                left.classList.remove("active");
                center.classList.remove("active");
                justify.classList.add("active");
                right.classList.remove("active");
                break;
            case "right":
                left.classList.remove("active");
                center.classList.remove("active");
                justify.classList.remove("active");
                right.classList.add("active");
                break;
        }

        formulaBar.value = cellProp.formula ? cellProp.formula : cellProp.value;
    })
}

// function to get cell and cellProp
function getCellAndCellProp(addressStr){
    let row = addressStr.slice(1);
    let col = addressStr.slice(0,1);
    let cell = document.querySelector(`.cell[rowID='${row}'][colID='${col}']`);
    let rid = Number(addressStr.slice(1)) - 1;
    let cid = Number(col.charCodeAt(addressStr.slice(0,1))) - 65;
    let cellProp = sheetDB[rid][cid];
    return [cell,cellProp];
}

//
function decodeRIDCIDFromAddress(address){
    let rid = Number(address.slice(1)) - 1;
    let cid = Number(address.charCodeAt(address.slice(0,1))) - 65;
    return [rid, cid];
}

//to select the A1 cell on starting the program
let fcell = document.querySelector(".cell");
fcell.click();