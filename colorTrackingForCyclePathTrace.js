function colorPromise(){
    return new Promise((resolve, reject) =>{
        setTimeout(() => {
            resolve();
        }, 1000);
    })
}

for(let i = 0; i < rows; i++){
    let row = [];
    for(let j = 0; j < cols; j++){
        row.push([]);
    }
    graphComponentMatrix.push(row);
}

async function isGraphCyclicPathTrace(graphComponentMatrix, cycleResponse){
    let [srcr, srcc] = cycleResponse;
    let visited = [];
    let dfsVisited = [];

    for(let i = 0; i < rows; i++){
        let visitedRow = [];
        let dfsVisitedRow = [];
        for(let j = 0; j < cols; j++){
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }
        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);
    }

    let response = await dfsCycleDetectionPathTrace(graphComponentMatrix, srcr, srcc, visited, dfsVisited);
    if(response === true) return Promise.resolve(true);

    return Promise.resolve(false);
}

async function dfsCycleDetectionPathTrace(graphComponentMatrix, srcRow, srcCol, visited, dfsVisited){
    visited[srcRow][srcCol] = true;
    dfsVisited[srcRow][srcCol] = true;

    let cell = document.querySelector(`.cell[rowID='${srcRow + 1}'][colID='${String.fromCharCode(65 + srcCol)}']`);

    cell.style.backgroundColor = "lightblue";
    await colorPromise();

    for(let children = 0; children < graphComponentMatrix[srcRow][srcCol].length; children++){
        let [nbrrid, nbrcid] = graphComponentMatrix[srcRow][srcCol][children];
        if(visited[nbrrid][nbrcid] === false){
            let response = await dfsCycleDetectionPathTrace(graphComponentMatrix, nbrrid, nbrcid, visited, dfsVisited);
            if(response === true){// Found cyclic cell so return immediately, no need to explore more path
                cell.style.backgroundColor = "transparent";
                await colorPromise();
                return Promise.resolve(true);
            }
        }else if(dfsVisited[nbrrid][nbrcid] === true && visited[nbrrid][nbrcid] === true){
            // Found cyclic cell so return immediately, no need to explore more path
            let cyclicCell = document.querySelector(`.cell[rowID='${nbrrid + 1}'][colID='${String.fromCharCode(65 + nbrcid)}']`);
            cyclicCell.style.backgroundColor = "lightsalmon";
            await colorPromise();
            cyclicCell.style.backgroundColor = "transparent";
            await colorPromise();
            cell.style.backgroundColor = "transparent";
            await colorPromise();
            return Promise.resolve(true);
        }
    }
    dfsVisited[srcRow][srcCol] = false;
    return Promise.resolve(false);
}