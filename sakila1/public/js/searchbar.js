const searchInput = document.querySelector(".searchInput");
const input = searchInput.querySelector("input");

async function getAutoCompleteData(inputData) {
    const url = `/get_data/${inputData}`;	
    return await fetch(url, {method: 'GET'})
        .then(response => response.json())
        .catch(error => console.log(error));
}

async function createAutoCompleteSearch(inputData){
    let dataObjectsArray = ""
    try {
        dataObjectsArray = await getAutoCompleteData(inputData);
        if(dataObjectsArray.length > 0){
            if(searchInput.querySelector(".resultBox") == null) {
                createDiv()
            }
            searchInput.querySelector(".resultBox").replaceChildren();
            for (let i = 0; i < dataObjectsArray.length; i++) {
                let a = document.createElement('a');
                let linkText = document.createTextNode(dataObjectsArray[i].title);
                a.appendChild(linkText);
                a.href = `http://localhost:3000/film/${dataObjectsArray[i].film_id}`;
                searchInput.querySelector(".resultBox").appendChild(a);
            }
        }
        else {
            if(searchInput.querySelector(".resultBox") != null) {
                searchInput.querySelector(".resultBox").remove();
            }
        }
    }
    catch(err) {
        console.log(err)
    }
}

input.onkeyup = (e)=>{
    const userInput = e.target.value;
    if(userInput){
        createAutoCompleteSearch(userInput) 
    }  
    else if(searchInput.querySelector(".resultBox") != null){
        searchInput.querySelector(".resultBox").remove();
    } 
}

function createDiv(){
    const resultBox = document.createElement("div");
    resultBox.classList.add('resultBox');
    searchInput.appendChild(resultBox)
    searchInput.classList.add("active");
}
