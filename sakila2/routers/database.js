const mysql = require("mysql");
const dbconfig = require("./dbconfig.json");

function getAutoCompleteDataByName(userInput) {
    const query = `SELECT film_id, title FROM film WHERE title LIKE '${userInput}%'`
    console.log(query)
    const connection = mysql.createConnection(dbconfig);
    connection.connect();
	return new Promise( (resolve,reject) => {
        connection.query(query, (error, data, kentat) =>{
            if (error){
                reject(error);
            }
            resolve(data);
       });
       connection.end();
    });
}
function getAutoCompleteDataByDesc(userInput) {
    const query = `SELECT film_id, title FROM film WHERE description LIKE '%${userInput}%'`
    console.log(query)
    const connection = mysql.createConnection(dbconfig);
    connection.connect();
	return new Promise( (resolve,reject) => {
        connection.query(query, (error, data, kentat) =>{
            if (error){
                reject(error);
            }
            resolve(data);
       });
       connection.end();
    });
}
function getAutoCompleteDataByFeat(userInput) {
    const query = `SELECT film_id, title FROM film WHERE special_features LIKE '%${userInput}%'`
    console.log(query)
    const connection = mysql.createConnection(dbconfig);
    connection.connect();
	return new Promise( (resolve,reject) => {
        connection.query(query, (error, data, kentat) =>{
            if (error){
                reject(error);
            }
            resolve(data);
       });
       connection.end();
    });
}

function getFilmDataByID(filmID) {
	const query = `SELECT film_id, title, description, release_year, length, replacement_cost, rating, special_features FROM film WHERE film_id = ?`
    const connection = mysql.createConnection(dbconfig);
    connection.connect();
	return new Promise( (resolve,reject) => {
        connection.query(query, [filmID], (error, data, kentat) =>{
            if (error){
                reject(error);
            }
            resolve(data);
       });
       connection.end();
    });
}

function getRandomFilms() {
	const query = `SELECT * FROM film ORDER BY RAND() LIMIT 15`
    const connection = mysql.createConnection(dbconfig);
    connection.connect();
	return new Promise( (resolve,reject) => {
        connection.query(query, (error, data, kentat) =>{
            if (error){
                reject(error);
            }
            resolve(data);
       });
       connection.end();
    });
}

async function getFilmFullDataById(film_id){
    try {
        let filmDataArray = []
        const filmData = await getFilmDataByID(film_id)
        const filmDataObject = filmData[0]
        filmDataObject["actors"] = await getActorsNameArray(film_id)
        filmDataObject["language"] = "English"
        filmDataArray.push(filmDataObject)
        return filmDataArray
    }
    catch(err) {
        console.log(err)
    }
}

async function getFilmFullDataFromTo(category_name, from, to){
    try {
        let filmDataArray = []
        const categoryId = await getCategoryIdByCategoryName(category_name)
        const filmsIdArray = await getFilmsByCategory(categoryId[0].category_id, from, to)

        for(filmId of filmsIdArray) {
            const filmData = await getFilmDataByID(filmId.film_id)
            const filmDataObject = filmData[0]
            filmDataObject["actors"] = await getActorsNameArray(filmId.film_id)
            filmDataObject["language"] = "English"
            filmDataArray.push(filmDataObject)
        }
        console.log(filmDataArray)
        return filmDataArray
    }
    catch(err) {
        console.log(err)
    }
}
/////////////////////////////////////ACTORS///////////////////////////////////////

async function getActorsNameArray(filmId) {
    try {
        let array = []
        const filmActorsIDsArray = await getFilmActors(filmId)
        for(filmActorId of filmActorsIDsArray) {
            let filmActorsName = await getActorsNameFromDB(filmActorId.actor_id)
            for(filmActor of filmActorsName) {
                array.push(filmActor.first_name + " " + filmActor.last_name)
            }
        }
        return array
    }
    catch(err) {
        console.log(err)
        return null
    }
}

function getFilmActors(filmID) {
	const query = `SELECT actor_id FROM film_actor WHERE film_id = ${filmID}`
    const connection = mysql.createConnection(dbconfig);
    connection.connect();
	return new Promise( (resolve,reject) => {
        connection.query(query, (error, data, kentat) =>{
            if (error){
                reject(error);
            }
            resolve(data);
       });
       connection.end();
    });
}

function getActorsNameFromDB(actorId) {
    const query = `SELECT first_name, last_name FROM actor WHERE actor_id = ${actorId}`
    const connection = mysql.createConnection(dbconfig);
    connection.connect();
	return new Promise( (resolve,reject) => {
        connection.query(query, (error, data, kentat) =>{
            if (error){
                reject(error);
            }
            resolve(data);
       });
       connection.end();
    });
}

/////////////////////////////////////CATEGORIES///////////////////////////////////////

function getAllCategories() {
	const query = `SELECT category_id, name FROM category`
    const connection = mysql.createConnection(dbconfig);
    connection.connect();
	return new Promise( (resolve,reject) => {
        connection.query(query, (error, data, kentat) =>{
            if (error){
                reject(error);
            }
            resolve(data);
       });
       connection.end();
    });   
}

function getFilmsByCategory(category_id, limit, offset) {
	const query = `SELECT film_id FROM film_category WHERE category_id = ? LIMIT ${limit} OFFSET ${offset}`
    const connection = mysql.createConnection(dbconfig);
    connection.connect();
	return new Promise( (resolve,reject) => {
        connection.query(query, [category_id], (error, data, kentat) =>{
            if (error){
                reject(error);
            }
            console.log(data)
            resolve(data);
       });
       connection.end();
    });
}

async function returnDataLength(category_name) {
    try {
        const category_id = await getCategoryIdByCategoryName(category_name)
        if(category_id) {
            try {
                return await getDataLengthFromDB(category_id[0].category_id)
            }
            catch(err) {
                console.log(err)
                return []
            }
        }
    }
    catch(err) {
        console.log(err)
        return []
    }
}

function getDataLengthFromDB(category_id) {
	const query = `SELECT COUNT(film_id) FROM film_category WHERE category_id = ?`
    const connection = mysql.createConnection(dbconfig);
    connection.connect();
	return new Promise( (resolve,reject) => {
        connection.query(query, [category_id], (error, data, kentat) =>{
            if (error){
                reject(error);
            }
            resolve(data[0]['COUNT(film_id)']);
       });
       connection.end();
    });
}

////////////////////////////////////////////////////////////////////////////
async function getFilmCategoryName(film_id) {
    try {
        const filmCategoryID = await getCategoryByFilmID(film_id)
        try {
            const filmCategoryName = await getCategoryNameByCategoryID(filmCategoryID[0])
            console.log(filmCategoryName)
            return filmCategoryName
        }
        catch(err){
            console.log(err)
        }
    }
    catch(err) {
        console.log(err)
        return null
    }
}

function getCategoryByFilmID(film_id) {
	const query = `SELECT category_id FROM film_category WHERE film_id = ?`
    const connection = mysql.createConnection(dbconfig);
    connection.connect();
	return new Promise( (resolve,reject) => {
        connection.query(query, [film_id], (error, data, kentat) =>{
            if (error){
                reject(error);
            }
            resolve(data);
       });
       connection.end();
    }); 
}

function getCategoryNameByCategoryID(category_id) {
	const query = `SELECT name FROM category WHERE category_id = ?`
    const connection = mysql.createConnection(dbconfig);
    connection.connect();
	return new Promise( (resolve,reject) => {
        connection.query(query, [category_id], (error, data, kentat) =>{
            if (error){
                reject(error);
            }
            resolve(data);
       });
       connection.end();
    }); 
}

function getCategoryIdByCategoryName(category_name) {
	const query = `SELECT category_id FROM category WHERE name = ?`
    const connection = mysql.createConnection(dbconfig);
    connection.connect();
	return new Promise( (resolve,reject) => {
        connection.query(query, [category_name], (error, data, kentat) =>{
            if (error){
                reject(error);
            }
            resolve(data);
       });
       connection.end();
    }); 
}

////////////////////////////////////////////////////////////////////////////

module.exports = {
    getFilmFullDataById, getRandomFilms, 
    getFilmsByCategory, getAllCategories,
    getFilmFullDataFromTo, returnDataLength,
    getAutoCompleteDataByName, getAutoCompleteDataByDesc, getAutoCompleteDataByFeat
};
