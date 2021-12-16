for(let i = 0; i < rows; i++){
    for(let j = 0; j < cols; j++){
        let cell = document.querySelector(`.cell[rowID='${i + 1}'][colID='${String.fromCharCode(65 + j)}']`);
        cell.addEventListener("blur", (e) => {
            let address = addressBar.value;
            let [cell, cellProp] = getCellAndCellProp(address);
            let dataEntered = cell.innerText;
            if (dataEntered === cellProp.value) return;

            cellProp.value = dataEntered;
            // If data modifies remove P-C relation, formula empty, update children with new hardcoded (modified) value
            removeChildFromParent(cellProp.formula);
            cellProp.formula = "";
            updateChildrenCells(address);
        })
    }
}
 
    formulaBar.addEventListener("keydown", async (e) => {
        let inputFormula = formulaBar.value;
        if(e.key === "Enter" && inputFormula){
            //to calcuate formula
            
            let address = addressBar.value;
            let [cell, cellProp] = getCellAndCellProp(address);
            // to remove old formula dependencies
            if(cellProp.formula !== inputFormula){
                removeChildFromParent(cellProp.formula);
            }

            addChildToGraphComponent(inputFormula, address);
            // Check formula is cyclic or not, then only evaluate
            // True -> cycle, False -> Not cyclic
            // console.log(graphComponentMatrix);
            let cycleResponse = isGraphCyclic(graphComponentMatrix);
            if(cycleResponse !== null){
                let response = confirm("Your formula is cyclic. Do you want to trace your path?");
                while (response === true) {
                    // Keep on tracking color until user is sartisfied
                    await isGraphCyclicPathTrace(graphComponentMatrix, cycleResponse); // I want to complete full  iteration of color tracking, so I will attach wait here also
                    response = confirm("Your formula is cyclic. Do you want to trace your path?");
                }
                removeChildFromGraphComponent(inputFormula, address);
                return;
            }

            //to evaluate new formula
            let evaluatedValue = evaluateFormula(inputFormula);

            //to update value in UI and sheetDB
            setCellUIandCellProp(evaluatedValue, inputFormula, address);
            addChildToParent(inputFormula);
        }
    })

function addChildToGraphComponent(formula, childAddress) {
    let [crid, ccid] = decodeRIDCIDFromAddress(childAddress);
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [prid, pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);
            // B1: A1 * 45
            // rid -> i, cid -> j
            graphComponentMatrix[prid][pcid].push([crid, ccid]);
        }
    }
}

function removeChildFromGraphComponent(formula, childAddress) {
    let [crid, ccid] = decodeRIDCIDFromAddress(childAddress);
    let encodedFormula = formula.split(" ");
  
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [prid, pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);
            graphComponentMatrix[prid][pcid].pop();
        }
    }
}

function addChildToParent(formula){
    let childAddress = addressBar.value;
    let formulaArr = formula.split(" ");
    for(let i = 0; i < formulaArr.length; i++){
        let asciiOfChar = formulaArr[i].charCodeAt(0);
        if(asciiOfChar >= 65 && asciiOfChar <= 90){
            let  [parentCell, parentCellProp] = getCellAndCellProp(formulaArr[i]);
            parentCellProp.children.push(childAddress);
        }
    }

}


function removeChildFromParent(formula){
    let childAddress = addressBar.value;
    let formulaArr = formula.split(" ");
    for(let i = 0; i < formulaArr.length; i++){
        let asciiOfChar = formulaArr[i].charCodeAt(0);
        if(asciiOfChar >= 65 && asciiOfChar <= 90){
            let  [parentCell, parentCellProp] = getCellAndCellProp(formulaArr[i]);
            let idx = parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(idx, 1);
            console.log(parentCellProp);
        }
    }
}


function updateChildrenCells(parentAddress){
    let  [parentCell, parentCellProp] = getCellAndCellProp(parentAddress);
    let children = parentCellProp.children;

    for(let i = 0; i < children.length; i++){
        let childAddress = children[i];
        let  [childCell, childCellProp] = getCellAndCellProp(childAddress);
        let childFormula = childCellProp.formula;
        let evaluatedValue = evaluateFormula(childFormula);
        setCellUIandCellProp(evaluatedValue, childFormula, childAddress);
        updateChildrenCells(childAddress);
    }
}

function evaluateFormula(formula){
    let formulaArr = formula.split(" ");
    for(let i = 0; i < formulaArr.length; i++){
        let asciiOfChar = formulaArr[i].charCodeAt(0);
        if(asciiOfChar >= 65 && asciiOfChar <= 90){
            let  [cell, cellProp] = getCellAndCellProp(formulaArr[i]);
            formulaArr[i] = cellProp.value;
        }
    }
    formula = formulaArr.join(" ");
    return eval(formula);
}

function setCellUIandCellProp(evaluatedValue, formula, address){
    let [cell, cellProp] = getCellAndCellProp(address);
    //UI update
    cell.innerText = evaluatedValue;
    formulaBar.value = formula;
    //DB update
    cellProp.value = evaluatedValue;
    cellProp.formula = formula;
}