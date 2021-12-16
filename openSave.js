let saveBtn = document.querySelector(".save");
let openBtn = document.querySelector(".open");

// to save or download the file from website to system
saveBtn.addEventListener("click", () => {
    // create JSON data for JSON file
    let JSONdata = JSON.stringify([sheetDB, graphComponentMatrix]);
    //create a file of JSON type
    let file = new Blob([JSONdata],{type: "application/json"});

    //create a anchor for downloading the file
    let a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = "sheetData.json";
    a.click();
})


//to open or upload the file to the website
openBtn.addEventListener("click", (e) => {
    
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (e) => {
        let fileReader = new FileReader();
        let files = input.files;

        let fileObj = files[0];
        fileReader.readAsText(fileObj);

        fileReader.addEventListener("load", (e) => {
            let readSheetData = JSON.parse(fileReader.result);

            addSheetBtn.click();

            sheetDB = readSheetData[0];
            graphComponentMatrix = readSheetData[1];
            collectedSheetDB[collectedSheetDB.length - 1] = sheetDB;
            collectedGraphComponent[collectedGraphComponent.length - 1] = graphComponentMatrix;

            handleSheetProperties();
        })
    })
})