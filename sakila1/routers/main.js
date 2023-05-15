const express = require('express');
const router = express.Router();
const { getAutoCompleteData, getFilmFullDataById, getAllCategories, getFilmsByCategory, returnDataLength, getFilmFullDataFromTo } = require('./database.js');

router.get('/', async function (req, res) {
    let randomFilmsData = ""
    try {
        randomFilmsData = await getAllCategories()
    }
    catch(err) {
        res.render("error")
        console.log(err)
    }
    res.render("main", {
        a: "a" 
    });
});

router.get('/categories', async function (req, res) {
    try {
        const data = await getAllCategories()
        res.render("categories");
    }
    catch(err) {
        res.render("error")
        console.log(err)
    }
});

router.get('/film/:film_id', async function (req, res) {
    try {
        const data = await getFilmFullDataById(req.params.film_id)
        const time = `${Math.floor(data[0].length  / 60)}h ${data[0].length  % 60}min`
        res.render("film", {
            filmData: data,
            filmLength: time
        });
    }
    catch(err) {
        res.render("error")
        console.log(err)
    }
});

router.get('/categories/:category/', async function (req, res) {
    if(req.params.category == "all"){
      try {
        const data = await getAllCategories()
        res.json(data)
      } 
      catch(err) {
        res.render("error")
        console.log(err)
      } 
    }
    else {
        try {
            res.render("category");
        }
        catch(err) {
            res.render("error")
            console.log(err)
        }
    }
});

router.get('/films/:category/:limit/:offset', async function (req, res) {
    try {
        const data = await getFilmFullDataFromTo(req.params.category, req.params.limit, req.params.offset)
        res.json(data);
    }
    catch(err) {
        res.render("error")
        console.log(err)
    }
});

router.get('/get_data_length/:category', async function (req, res) {
    try {
        const data = await returnDataLength(req.params.category)
        res.json(data);
    }
    catch (err) {
        res.render("error")
        console.log(err)
    }
});

router.get('/get_data/:search_query', async function (req, res) {
    try {
        const data = await getAutoCompleteData(req.params.search_query);
        res.json(data);
    }
    catch(err) {
        res.render("error")
        console.log(err)
    }
});

module.exports = router;