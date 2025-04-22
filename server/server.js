const express = require("express")
var app = express();
const port = 3000;

app.use(express.json());
const cors = require("cors")
const cookieParser = require('cookie-parser');

app.use(cors({
    origin: 'http://localhost:3001',  // domain frontend
    credentials: true                // cho phép gửi cookie
}));

app.use(cookieParser());


const client = require("./routes/client");
const admin = require("./routes/admin");

app.use("/api", client);
app.use("/admin", admin);

app.listen(port, () => {
    console.log(`Ung dung dang chay o port ${port}`);
})
    .on('error', function (err) {
        console.log(`Loi xay ra khi chay ung dung ${err}`)
    });
