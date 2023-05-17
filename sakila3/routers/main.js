const express = require('express');
const router = express.Router();
const {getFilmFullDataById, getAllCategories, returnDataLength, getFilmFullDataFromTo, getAutoCompleteDataByName, getAutoCompleteDataByDesc, getAutoCompleteDataByFeat} = require('./database.js');

router.get('/', async function (req, res) {
    try {
        res.render("main");
    }
    catch(err) {
        res.render("error")
        console.log(err)
    }
});

router.get('/categories', async function (req, res) {
    try {
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

router.get('/get_data/:by/:search_query', async function (req, res) {
    try {
        let responseData = ""
        if(req.params.by == "byName") {
            responseData = await getAutoCompleteDataByName(req.params.search_query);
            res.json(responseData);
        }
        else if(req.params.by == "byDesc") {
            responseData = await getAutoCompleteDataByDesc(req.params.search_query);
            res.json(responseData);
        }
        else if(req.params.by == "byFeat") {
            responseData = await getAutoCompleteDataByFeat(req.params.search_query);
            res.json(responseData);
        }
        else{
            res.end()
        }
    }
    catch(err) {
        res.json([{title: "Tapahtui hakuvirhe!"}]);
        console.log(err)
    }
});

module.exports = router;