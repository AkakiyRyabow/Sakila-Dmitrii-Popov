const categoriesBar = document.querySelector(".categoryBar");

async function getAllCategories() {
    const url = `/categories/all`;	
    return await fetch(url, {method: 'GET'})
        .then(response => response.json())
        .catch(error => console.log(error));
}

async function addCategoryDiv() {
    let categoriesArray = ""
    let categoryBox = ""
    let a = " "
    let = linkText = " "
    try {
        categoriesArray = await getAllCategories();
        for (let i = 0; i < categoriesArray.length; i++) {
            categoryBox = document.createElement("div");
            a = document.createElement("a");
            linkText = document.createTextNode(categoriesArray[i].name);
            a.appendChild(linkText);
            categoryBox.appendChild(a)
            categoryBox.addEventListener('click', function() {
            location.href = `/categories/${categoriesArray[i].name}`}, false);
            categoriesBar.appendChild(categoryBox)       
        }
    }
    catch(err) {
        console.log(err)
    }
}

categoriesBar.addEventListener("load", addCategoryDiv());
