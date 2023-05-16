
const category = location.pathname.split("/").slice(-1)[0]
async function getDataLength() {
    const url = `/get_data_length/${category}`;	
    return await fetch(url, {method: 'GET'})
        .then(response => response.json())
        .catch(error => console.log(error));
}

async function getFilmsData(category, limit, offset) {
    const url = `/films/${category}/${limit}/${offset}`;	
    console.log(url)
    return await fetch(url, {method: 'GET'})
        .then(response => response.json())
        .catch(error => console.log(error));
}

$('#light-pagination').pagination({ 
    onInit: async function() {
        await getDataOnEvent()
        console.log(location.origin)
    }
});

$('#light-pagination').click(async function(){
    await getDataOnEvent()
    $("html, body").animate(
        { scrollTop: "0" }, 550);
}); 

async function getDataOnEvent() {
    const currentPage = $('#light-pagination').pagination('getCurrentPage');
    try{
        const data = await getFilmsData(category, 10, (currentPage - 1) * 10)
        await renderFilmsData(data)
    }
    catch(err) {
        console.log(err)
    }
}

async function renderFilmsData(data) {
    $(".filmsBar").empty()
    for(film of data) {
        $(".filmsBar").append(`
        <div class="filmDiv">
            <div class="filmHeader"> 
                <div class="filmTitle"> 
                    <a href="http://localhost:3000/film/${film.film_id}">${film.title}</a>
                </div>
            </div>
            <div class="filmCenter"> 
                <p>${film.description}</p>
            </div>
            <div class="filmAside">
                <div class="filmDivOther"> 
                    <div><p>Ikärajoitus: <span>${film.rating}</span></p></div>       
                    <div class="leftData"><p>${film.language}</p>     
                    <p>${Math.floor(film.length / 60)}h ${film.length % 60}min</p></div>                   
                </div>  
                <div class="filmPrice"> 
                <h2>$${film.replacement_cost}</h2>
            </div>
            </div>
        </div>`
        )
    }  
}

async function createPaginationComponent() {
    let data = ""
    try{
        data = await getDataLength()
    }
    catch(err) {
        console.log(err)
        data = []
    }
    $('#light-pagination').pagination({
        items: data, 
        itemsOnPage: 10, 
        pages: 0, 
        displayedPages: 5, 
        edges: 0,
        useStartEdge : false,
        useEndEdge : false,
        currentPage: 0, 
        useAnchors: false,
        hrefTextPrefix: "#page-", 
        hrefTextSuffix: '', 
        prevText: "Prev", 
        nextText: "Next", 
        ellipseText: '&hellip;',
        ellipsePageSet: true,
        listStyle: '',
        cssStyle: "light-theme", 
        selectOnClick: true,
        nextAtFront: false,
        invertPageOrder: false
      });
}

document.addEventListener("load", createPaginationComponent());