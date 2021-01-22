const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const db= require('./database/cookingCorner');
const UserRoute=require('./routes/UserRoute');



const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(UserRoute)


 





app.listen(90);