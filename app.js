const express = require('express');
//const { open } = require('sqlite');
// const sqlite3 = require('sqlite3');
const path = require('path');
// const { parse } = require('path');
// const dbPath = path.join(__dirname, 'covid19India.db');
const app = express();
app.use(express.static("public"));
// app.use(express.json());
// let dbObj = null;

const initializeDbAndServer = async () => {
    try {
        // dbObj = await open({
        //     filename: dbPath,
        //     driver: sqlite3.Database
        // });

        app.listen(process.env.PORT || 5008, () => {
            console.log('server running on http://localhost:5008');
        });

    } catch (err) {
        console.error(`connection error : ${err.message}`);
    }

}

initializeDbAndServer();

const convertState = object => {
    return {
        "stateId": object.state_id,
        "stateName": object.state_name,
        "population": object.population
    }
};

const convertDistrict = object => {
    return {
        "districtId": object.district_id,
        "districtName": object.district_name,
        "stateId": object.state_id,
        "cases": object.cases,
        "cured": object.cured,
        "active": object.active,
        "deaths": object.deaths
    }
}

app.get('/', async (req, res) => {
    try {
        var options = {
            root: path.join(__dirname,'\\','public','\\')
        };
        console.log(options)
        const file = `wikipediaLikeSearch.html`;
        res.sendFile(file,options);
    } catch (err) {
        console.log(`Db fetch error : ${err.message}`)
    }
});

//api 1
app.get('/states/', async (req, res) => {
    try {
        const query1 = `Select * from state;`;
        let dbResponse = await dbObj.all(query1);
        res.send(dbResponse.map(element => convertState(element)));
    } catch (err) {
        console.log(`Db fetch error : ${err.message}`)
    }
});

//api 2 
app.get('/states/:stateId/', async (req, res) => {
    try {
        const { stateId } = req.params;
        const query2 = `Select * from state where state_id = ${stateId};`;
        let dbResponse = await dbObj.get(query2);
        res.send(convertState(dbResponse));
    } catch (err) {
        console.log(`Db fetch error : ${err.message}`);
    }
});

//ap1 3 

app.post('/districts/', async (req, res) => {
    try {
        const { districtName, stateId, cases, cured, active, deaths } = req.body;
        const query3 = `insert into district (district_name, state_id, cases, cured, active, deaths) values ('${districtName}', ${stateId}, ${cases}, ${cured}, ${active}, ${deaths});`;
        await dbObj.run(query3);
        res.send("District Successfully Added");
    } catch (err) {
        console.log(`Db write error : ${err.message}`);
    }
});

//api 4 
app.get('/districts/:districtId', async (req, res) => {
    try {
        const { districtId } = req.params;
        const query4 = `Select * from district where district_id = ${districtId};`;
        let dbResponse = await dbObj.get(query4);
        res.send(convertDistrict(dbResponse));
    } catch (err) {
        console.log(`Db fetch error : ${err.message}`);
    }
});

// api 5

app.delete('/districts/:districtId', async (req, res) => {
    try {
        const { districtId } = req.params;
        const query5 = `delete from district where district_id = ${districtId};`;
        await dbObj.run(query5);
        res.send("District Removed");
    } catch (err) {
        console.log(`Can't delete : ${err.message}`);
    }
});

//api 6
app.put('/districts/:districtId/', async (req, res) => {
    try {
        const { districtId } = req.params;
        const { districtName, stateId, cases, cured, active, deaths } = req.body;
        const query6 = `update district set district_name = '${districtName}', state_id = ${stateId}, cases = ${cases}, cured = ${cured}, active = ${active}, deaths = ${deaths} where district_id = ${districtId};`;
        await dbObj.run(query6);
        res.send("District Details Updated");
    } catch (err) {
        console.log(`Can't update : ${err.message}`);
    }

});

// api7 
app.get('/states/:stateId/stats/', async (req, res) => {
    try {
        const { stateId } = req.params;
        const query7 = `Select sum(cases) as totalCases, sum(cured) as totalCured, sum(active) as totalActive, sum(deaths) as totalDeaths from district left join state on district.state_id = state.state_id where district.state_id = ${stateId} group by district.state_id;`;
        const response = await dbObj.get(query7);
        res.send(response);
    } catch (err) {
        console.log(`Db fetch error: ${err.message}`);
    }
});

// api 8 

app.get('/districts/:districtId/details/', async (req, res) => {
    try {
        const { districtId } = req.params;
        const query8 = `Select state_name as stateName from state inner join district on state.state_id = district.state_id where district.district_id = ${districtId};`;
        let dbResponse = await dbObj.get(query8);
        res.send(dbResponse);
    } catch (err) {
        console.log(`Db fetch error: ${err.message}`);
    }
});

module.exports = app;