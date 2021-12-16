let collectedGraphComponent = [];
let graphComponentMatrix = [];

for(let i = 0; i < rows; i++){
    let row = [];
    for(let j = 0; j < cols; j++){
        row.push([]);
    }
    graphComponentMatrix.push(row);
}

function isGraphCyclic(graphComponentMatrix){
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

    for(let i = 0; i < rows; i++){
        for(let j = 0; j < cols; j++){
            if(visited[i][j] === false){
                let response = dfsCycleDetection(graphComponentMatrix, i, j, visited, dfsVisited);
                // Found cycle so return immediately, no need to explore more path
                if(response === true) return [i, j];
            }
        }
    }
    return null;
}

// Start -> vis(TRUE) dfsVis(TRUE)
// End -> dfsVis(FALSE)
// If vis[i][j] -> already explored path, so go back no use to explore again
// Cycle detection condition -> if (vis[i][j] == true && dfsVis[i][j] == true) -> cycle
// Return -> True/False
// True -> cyclic, False -> Not cyclic
function dfsCycleDetection(graphComponentMatrix, srcRow, srcCol, visited, dfsVisited){
    visited[srcRow][srcCol] = true;
    dfsVisited[srcRow][srcCol] = true;

    for(let children = 0; children < graphComponentMatrix[srcRow][srcCol].length; children++){
        let [nbrrid, nbrcid] = graphComponentMatrix[srcRow][srcCol][children];
        if(visited[nbrrid][nbrcid] === false){
            let response = dfsCycleDetection(graphComponentMatrix, nbrrid, nbrcid, visited, dfsVisited);
            if(response === true) return true;// Found cycle so return immediately, no need to explore more path
        }else if(dfsVisited[nbrrid][nbrcid] === true && visited[nbrrid][nbrcid] === true){
            // Found cycle so return immediately, no need to explore more path
            return true;
        }
    }
    dfsVisited[srcRow][srcCol] = false;
    return false;
}