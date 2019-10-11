const express = require("express");
const mongoose = require("mongoose");

mongoose
    .connect("mongodb://localhost:27017/xedike-database", {
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(console.log("Ket noi MongoDB :D"))
    .catch(console.log);

const app = express();
app.use('/', express.static('public'));

//middleware body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, fingerprint, token'
    );
    res.header(
        'Access-Control-Allow-Methods',
        'PUT, POST, GET, DELETE, OPTIONS'
    );
    next();
  });

//router
app.use("/api/users", require("./routes/api/User/users"));
app.use("/api/trips", require("./routes/api/Trip/trip"));
app.use("/api/provinces", require("./routes/api/Province/province"));

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
