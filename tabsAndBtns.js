let colCell = document.querySelectorAll(".colCell");
let idxcolCell = document.querySelectorAll(".index_cell");
let ctrlKey = false;

//to highlight on present cell's row and col
function selectRowAndCol(cell){
    let [row,col] = getRidCid(cell);
    idxcolCell[row].classList.add("select");
    colCell[col].classList.add("select");
}

//to remove highlight on prev cell's row and col
function deselectRowAndCol(cell){
    let [row,col] = getRidCid(cell);
    idxcolCell[row].classList.remove("select");
    colCell[col].classList.remove("select");
}

//to remove selected cell border and other related properties
function removePrevCellProp(Cell){
    if(Cell === null || ctrlKey == true){
        return;
        
    }
    Cell.style.border = "1px solid lightgray";
    deselectRowAndCol(Cell);
}

//to add selected cell border and other related properties
function addCellProp(Cell){
    Cell.style.border = "2px solid green";
    Cell.addEventListener("keyup", function(){
        formulaBar.value = Cell.textContent;
    })
    selectRowAndCol(Cell);
}

//to get the row and col of a cell
function getAddressRowCol(cell){
    let row = cell.getAttribute("rowID");
    let col = cell.getAttribute("colID");
    return [row,col];
}

// function to get rid and cid
function getRidCid(cell){
    let [row,col] = getAddressRowCol(cell);
    let rid = Number(row) - 1;
    let cid = Number(col.charCodeAt(0)) - 65;
    return [rid, cid];
}

//******************************************* */ page action tabs /* *********************************************//
let pageActTab = document.querySelectorAll(".page-action");
let home = document.querySelector(".home");

let selTab = null;

pageActTab.forEach(element => element.addEventListener("click", (e)=>{
    e.target.classList.add("tabSel");
    let text = "." + e.target.textContent;
    let target = document.querySelector(text);
    target.classList.remove("inactive");
    if(selTab != null){
        selTab.classList.remove("tabSel");
        text = "." + selTab.textContent;
        target = document.querySelector(text);
        target.classList.add("inactive");
    }
    selTab = e.target;
}))

home.click();
let cell = document.querySelector(".cell");
