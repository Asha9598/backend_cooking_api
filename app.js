 
const express = require('express');
const bodyParser = require('body-parser');

const db= require('./database/cookingCorner');
const UserRoute=require('./routes/UserRoute'); 
const recipeRoute=require('./routes/recipeRoute');



const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(UserRoute) 
app.use(recipeRoute)


 

app.listen(90);