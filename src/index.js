const express = require('express');
const mongoose = require('mongoose');
const dotenv   = require('dotenv');
const cors = require('cors');

const routes = require('./routes.js');

dotenv.config();

const app = express();

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-shard-00-00-nzrjv.gcp.mongodb.net:27017,cluster0-shard-00-01-nzrjv.gcp.mongodb.net:27017,cluster0-shard-00-02-nzrjv.gcp.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(process.env.PORT);