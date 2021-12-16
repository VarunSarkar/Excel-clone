let addTopRow = document.querySelector(".address-top-row");
let addLeftCol = document.querySelector(".address-left-col");
let grid = document.querySelector(".grid");
let addressBar = document.querySelector(".address_bar");
let formulaBar = document.querySelector(".formula_bar");

let rows = 100;
let cols = 26;


//to form "top address of column" row
for(let i = 0; i < cols; i++){
    let cell = document.createElement("div");
    cell.setAttribute("class", "colCell");
    cell.textContent = String.fromCharCode(65 + i);
    cell.setAttribute("contenteditable", "false");
    addTopRow.appendChild(cell);
}

//to form "left address of row" column
for(let i = 1; i <= rows; i++){
    let div = document.createElement("div");
    div.setAttribute("class", "index_cell");
    div.textContent = i;
    div.setAttribute("contenteditable", "false");
    addLeftCol.appendChild(div);
}

//for making the grid
for(let i = 1; i <= rows; i++){
    let row = document.createElement("div");
    row.setAttribute("class","row")
    for(let j = 0; j < cols; j++){
        let cell = document.createElement("div");
        cell.setAttribute("class", "cell");
        cell.setAttribute("contenteditable", "true");
        cell.setAttribute("rowID",`${i}`);
        cell.setAttribute("colID",String.fromCharCode(65 + j));
        cell.setAttribute("spellcheck", "false");
        displayAddressOnBar(cell);
        row.appendChild(cell);
    }
    grid.appendChild(row);
}

let prevCell = null;


// to display address of selected cell on the address bar
function displayAddressOnBar(cell){
    cell.addEventListener("click", function(){
        if(prevCell != cell){
            removePrevCellProp(prevCell);
        }
        let [row,col] = getAddressRowCol(cell);
        let text = col + row;
        addressBar.value = text;
        addCellProp(cell);
        prevCell= cell;
    })
}
addressBar.addEventListener("click", ()=>{
    var presCell = addressBar.value;
    addressBar.value = "";
    addressBar.addEventListener("keyup", (e)=>{
        if(e.keyCode == 13){
            try {
                let col = addressBar.value.slice(0,1);
                if(col.charCodeAt(0) >= 97 && col.charCodeAt(0) <= 122){
                    col = String.fromCharCode(col.charCodeAt(0) - 32);
                }
                let row = addressBar.value.slice(1);
                let cell = document.querySelector(`.cell[rowID='${row}'][colID='${col}']`);
                cell.click();
            } catch (error) {
                let col = presCell.slice(0,1);
                let row = presCell.slice(1);
                let cell = document.querySelector(`.cell[rowID='${row}'][colID='${col}']`);
                cell.click();
            }
            presCell = addressBar.value;
            addressBar.blur();
        }
    })
})

