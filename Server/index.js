
const { response } = require("express");
const express = require("express");
const app = express();
const moment = require('moment');
const cors = require('cors');
app.use(express.static("public"));
app.use(cors());
let path = require('path');


const PORT = process.env.PORT;
const passAdmin =  process.env.passAdmin;


const dotenv = require('dotenv');
dotenv.config();
//database
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
app.use(express.json()); // req.body
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// functions
async function ReverseGeocodingGoogle(){
    const res= await fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=10.0071973,105.8662085&key=AIzaSyA-W-9QNPMkGQXA7suOSxNoIKDCrwhBONU');
    console.log(res);
    return res;
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); 
  }
function CheckAddress(account,device,idgotted){
    const CheckFast = (s1,s2) => {
        if(s1 == "") return 1;
        return CheckString(s1, s2);
    }
    let id_eventGot = idgotted;
    let dataReturn = [];
    for ( let j = 0; j < device.length; ++j ){
        if(id_eventGot.indexOf( device[j].IDdevice ) == -1){
            if (    (CheckFast(account.xa, device[j].address[0].xa)) && 
                    (CheckFast(account.huyen, device[j].address[0].huyen)) &&
                    (CheckString(account.tinh, device[j].address[0].tinh))
            ) {
                id_eventGot += "-" + device[j].IDevent;
                dataReturn.push( device[j] );
            } 
        }
    }
    return {
        "idString":id_eventGot,
        "dataAlertGet":dataReturn
    }
}
function CheckString (s1,s2) {
    if( s1.indexOf(s2) != -1) return 1;
    return 0;
}
function FormatAddressDevice(data){ // delete coordinates
    let re = {
        IDdevice :data.iddevice,
        IDevent: data.idevent,
        status: data.status,
        address:[]
    };
    for (let i = 0; i < data.address.length; ++i)
        re.address[i] = data.address[i];
    return re;
}
async function GetDeviceData(IDdevice){
    const client = await pool.connect();
    const getData = await client.query(
        "SELECT status,address,iddevice,idevent,latitude,longitude FROM device_table WHERE iddevice = $1",
        [IDdevice]
    ); 
    client.release();
    return getData.rows[0];
}
async function GetDeviceNeedHelp(){
    const client = await pool.connect();
    const getData = await client.query(
        "SELECT status,address,iddevice,idevent FROM device_table WHERE status > 0"
    ); 
    client.release();
    let re = [];
    for ( let i = 0; i < getData.rowCount; ++i ) { 
        re[i] = getData.rows[i].address == null ? [] : FormatAddressDevice(getData.rows[i]);
    }
    return re;
}
function FormatAddressAccount(data){
    let re = [];
    for(let i = 0; i < data.address.length; ++i){
        re[i] = getAddressScan(data.address[i]);
    }
    return re;
}
async function GetDataAccount(acc){
    const client = await pool.connect();
    const getData = await client.query(
        "SELECT address,num_adr FROM user_table WHERE account = $1", 
        [acc] 
    ); 
    client.release();
    return {
        num_adr: getData.rows[0].num_adr,
        address: getData.rows[0].address
    }
}
async function ConfirmDevice(IDdevice){
    const client = await pool.connect();
    const checkInfo = await client.query(
        "SELECT * FROM device_table WHERE IDdevice = $1 ",
        [IDdevice]
    );
    client.release();
    if(checkInfo.rowCount > 0) return 1;
    return 0;
}
async function DeleteDeviceData(IDdevice){
    const client = await pool.connect();
    await client.query(
        "UPDATE device_table SET status = $1, latitude = $2, longitude = $3, address = '{}'  WHERE IDdevice = $4",
        [0,"","",IDdevice]
    )
    client.release();
}
async function UpdateDeviceData(status,latitude,longitude,address,IDdevice){
    const client = await pool.connect(); 
    await client.query(
        "UPDATE device_table SET status = $1, latitude = $2, longitude = $3, address = array_append(address,$4) WHERE IDdevice = $5",
        [status,latitude,longitude,address,IDdevice]
    );
    client.release();
}
async function GetNowIdEventDevice(IDdevice){
    const client = await pool.connect();
    const getData = await client.query(
        "SELECT idevent FROM device_table WHERE iddevice = $1 ",
        [IDdevice]
    );
    client.release();
    return Number(getData.rows[0].idevent);
}
async function GetNewIdEvent(){
    const client = await pool.connect();
    const getData = await client.query(
        "SELECT id_event FROM id_table WHERE loc = 0"
    );
    await client.query(
        "UPDATE id_table SET id_event = $1 WHERE loc = $2",
        [getData.rows[0].id_event+1,0]
    );
    client.release();
    return getData.rows[0].id_event+1;
}
async function UpdateHistory(action,send,get,description,id_event,time_happen){
    const client = await pool.connect();
    if(action == 4 || action == 1){
        await client.query(
            "INSERT INTO history_table (action,send,get,description,id_event,time_happen) VALUES ($1,$2,$3,$4,$5,$6)",
            [action,send,get,description,id_event,time_happen]
        );
    }
    else{
        await client.query(
            "INSERT INTO history_table (action,send,get,description,id_event,time_happen) VALUES ($1,$2,$3,$4,$5,$6)",
            [action,send,get,description,id_event,time_happen]
        );
    }
    client.release();
}
async function ConfirmAccount(session,account) {
    const client = await pool.connect();
    const confirmAccount = await client.query(
        "SELECT account FROM session_table WHERE code = $1 AND account = $2 ",
        [session,account]
    );
    client.release();
    if(confirmAccount.rowCount > 0) return 1;
    return 0;
} 
function getAddressScan(address) {
    return  {
        xa: subStringAfter(address.xa,"Xã","Thị trấn","Phường"),
        huyen: subStringAfter(address.huyen,"Huyện","Quận","Thị xã"),
        tinh: subStringAfter(address.tinh,"Tỉnh","Thành phố")
    };
}
function subStringAfter(s,s1,s2,s3){
    if(s.indexOf(s1) != -1)
        return s.substring(s.indexOf(s1) + s1.length + 1, s.length);
    if(s.indexOf(s2) != -1)
        return s.substring(s.indexOf(s2) + s2.length + 1, s.length);
    if(s.indexOf(s3) != -1)
        return s.substring(s.indexOf(s3) + s3.length + 1, s.length);
    return s;
}
function createSession(){
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    return (year+month+date+hours+minutes+seconds);
}
function getTime(){
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    return (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
}
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------------------------------------
//device command
    // warning to server
    app.get("/warning", async(req,res) => {
        try
        {
            let IDdevice = req.query.IDdevice;
            let status = req.query.status;
            let longitude = req.query.Longitude;
            let latitude = req.query.Latitude;
            let location = "";
            let i = (getRandomInt(1,4));
            if(i == 1){
                latitude = "10.096127";
                 longitude   = "106.298339";
            }
            if(i == 2){
                latitude = "10.095990";
                 longitude    = "106.298210";
            }
            if(i == 3){
                latitude = "10.096180";
                 longitude   = "106.298510";
            }
            if(i == 4){
                latitude =" 10.096701";
                 longitude   = "106.298510";
            }
            if(i == 5){
                latitude = "10.096366";
                 longitude    = " 106.298366";
            }   console.log(longitude);console.log(latitude);
            let responses = {
                "id_event": 0,
                "gotFlag": true
            };
            //const dataGeocoding = ReverseGeocodingGoogle();
            console.log("done");
            //console.log(dataGeocoding);
            if(await ConfirmDevice(IDdevice)){
                console.log("see");
                if(status > 0){
                    console.log("have");
                    const address = {
                        "xa":"An Thạnh",
                        "huyen":"Mỏ Cày Nam",
                        "tinh":"Bến Tre",
                        "time":getTime()
                    };
                    UpdateDeviceData(status,latitude,longitude,JSON.stringify(address),IDdevice);
                }
                if(status == 0){
                    console.log("reset");
                    DeleteDeviceData(IDdevice);
                }
                // update history
                if(status == 1){
                    responses.id_event =  await GetNewIdEvent();
                    UpdateHistory(status,IDdevice,'server',longitude + "-" + latitude,responses.id_event,getTime());
                    console.log("have1");
                }
                if(status == 2){
                    responses.id_event =  await GetNewIdEvent();
                    UpdateHistory(status,IDdevice,'server',longitude + "-" + latitude,responses.id_event,getTime());
                    console.log("have2");
                }
                if(status == 3){
                    responses.id_event = GetNowIdEventDevice(IDdevice);
                    UpdateHistory(status,IDdevice,'server',longitude + "-" + latitude,responses.id_event,getTime());
                    console.log("have3");
                }  
                if(status == 4){
                    responses.id_event = GetNowIdEventDevice(IDdevice);
                    UpdateHistory(status,IDdevice,'server',longitude + "-" + latitude,responses.id_event,getTime());
                    console.log("have4");
                } 
            }
            else{
                responses.gotFlag = false;
            }
            res.send(responses);
        }
        catch(error)
        {
            console.log(error);
        }
    });
//-----------------------------------------------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------------------------------------
//admin command
    // get history with action
    app.get("/getallhistoryaction", async(req,res) => {
        let pass = req.body.password;
        let action = req.body.action;
        if(pass == passAdmin){
            const client = await pool.connect();
            const getallhistory = await client.query(
                "SELECT action,send,get,description,id_event,time_happen FROM history_table WHERE action = $1",
                [action]
            );
            res.send(getallhistory.rows);
        }
        else    
            res.send("password admin not true");
    });
    // get all history
    app.get("/getallhistory", async(req,res) => {
        let pass = req.body.password;
        if(pass == passAdmin){
            const client = await pool.connect();
            const getallhistory = await client.query(
                "SELECT action,send,get,description,id_event,time_happen FROM history_table"
            );
            res.send(getallhistory.rows);
        }
        else    
            res.send("password admin not true");
    });
    // create new device
    app.post("/createDevice", async(req,res) => {
        try
        {
            let status = 0;
            let IDdevice = req.body.IDdevice;
            let pass = req.body.password;
            
            if(pass == passAdmin){

                const client = await pool.connect();
                const checkInfo = await client.query(
                    "SELECT * FROM device_table WHERE IDdevice = $1 ",
                    [IDdevice]
                );
                
                if(checkInfo.rowCount == 0){
                    
                    const register =  await client.query(
                        "INSERT INTO device_table (IDdevice,status) VALUES ($1,$2)",
                        [IDdevice,status]
                    );
                    res.send("create new device: Device ID-" + IDdevice);
                }
                else
                    res.send("Create falied, device is already in the database");
            }
            else
            res.send("pass Admin not true");
            client.release();  
        }
        catch(error)
        {
            console.log(error);
        }
    });
    // get All device info
    app.get("/getAllDeviceInfo", async(req,res) => {
        try
        {
            let pass = req.body.password;
            let IDdevice = req.body.IDdevice;
            if(pass == passAdmin ){
                const client = await pool.connect();
                const getData = await client.query("SELECT * FROM device_table");
                res.json(getData.rows);
            }
            else    
                res.send("pass Admin not true");
            client.release();
        }
        catch(error)
        {
            console.log(error);
        }
    });
    // create address device
    app.put("/CAD", async(req,res) => {
        try
        {
            let address = req.body.address;
            let status = req.body.status;
            let IDevent = req.body.IDevent;
            address[0].time = getTime();
            let IDdevice = req.body.IDdevice;
            let pass = req.body.password;//---------------------------------------------------------------------------------------
            console.log(req.body);
            if(pass == passAdmin ){
                const client = await pool.connect();
                const update = await client.query(
                    "UPDATE device_table SET address = $1, status = $2, idevent = $3 WHERE iddevice = $4",
                    [address,status,IDevent,IDdevice]
                );client.release();
                if(update.rowCount == 0)
                    res.send("can't found device");
                else
                    res.send("Updated!");
                
            }
            else    
                res.send("pass Admin not true");
            
        }
        catch(error)
        {
            console.log(error);
        }
    });
    //get all user info
    app.get("/getAllUserInfo", async(req,res) => {
        try
        {
            const client = await pool.connect();
            let pass = req.body.password;
            if((pass == passAdmin) || (passAdmin.indexOf(pass) != -1)){
                const client = await pool.connect();
                const getData = await client.query("SELECT * FROM user_table");
                res.json(getData.rows);
            }
            else    
                res.send("pass Admin not true");
            client.release();
        }
        catch(error)
        {
            console.log(error);
        }
    });
    app.post("/getAllUserInfoo", async(req,res) => {
        try
        {
            const client = await pool.connect();
            let pass = req.body.password;
            if(1 == 1){
                const client = await pool.connect();
                const getData = await client.query("SELECT * FROM user_table");
                res.send(getData.rows);
            }
            else    
                res.send("pass Admin not true");
            client.release();
        }
        catch(error)
        {
            console.log(error);
        }
    });
    // get user info
    app.get("/getUserInfoAdmin", async(req,res) => {
        try
        {
            let id = req.body.id;
            let pass = req.body.password;
            const client = await pool.connect();
            if(pass == passAdmin ){
                const getData = await client.query("SELECT * FROM user_table WHERE num = $1", [id] ); 
                res.json(getData.rows[0]);
            }
            client.release();
        }
        catch(error)
        {
            console.log(error);
        }
    });
    //delete user
    app.delete("/delete", async(req,res) => {
        try
        {
            let pass = req.body.password;
            let acc = req.body.account;
            if(pass == passAdmin){
                const client = await pool.connect();
                const deleteData = await client.query("DELETE FROM user_table WHERE account = $1", [acc]);
                res.send("deleted user data!");
            }
            else    
                res.send("pass Admin not true");
            client.release();
        }
        catch(error)
        {
            console.error(error);
        }
    });
//-----------------------------------------------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------------------------------------
// user command  
    // acp warning
    app.get("/acceptWarning", async(req,res) => {
        try
        {
            let session = req.query.session;
            let acc = req.query.account;
            let IDdevice = req.query.IDdevice;
            let responses = {
                "flag":true,
                "data":"",
                "error":""
            };
            //http://maps.google.com/maps?q=loc:
            if(await ConfirmAccount(session,acc)){
                
                responses.data = await GetDeviceData(IDdevice);
              
                console.log(responses);
                // if(getData.rowCount > 0){
                   
                // }
                // else{
                //     responses.flag = false;
                //     responses.error = 1; // ko tim thay
                // }
                    
                
            }
            else {
                responses.flag = false;
                responses.error = 2;// sai tai khoan, mat khau
            }
            res.send(responses);
        }
        catch(error)
        {
            console.log(error);
        }
    });
    // get warning
    app.get("/getWarning", async(req,res) =>{
        try
        {
            let session = req.query.session;
            let acc = req.query.account;
            let id_eventGot = "";
            let responses = {
                "flag": true,
                "error":"",
                "data":[]
            }; 
            if(await ConfirmAccount(session,acc)){
                const getDataAccount = await GetDataAccount(acc);
                const address = FormatAddressAccount(getDataAccount);
                const DeviceData = await GetDeviceNeedHelp();
                for( let i = 0; i < getDataAccount.address.length; ++i ){ 
                    const data = CheckAddress(address[i],DeviceData,id_eventGot);
                    id_eventGot = data.idString;
                    responses.data = responses.data.concat(data.dataAlertGet);
                }
                UpdateHistory(5,acc,'server',id_eventGot,await GetNewIdEvent(),getTime());
                console.log(responses);
                res.send(responses);
            }
            else{
                responses.flag = false;
                responses.error = "can't found your account"; 
            }
        }
        catch(error)
        {
            console.error(error);
        }
    });
    //user get info
    app.get("/getUserInfo", async(req,res) => {
        try
        {
            let responses = {
                "flag": true,
                "error":"",
                "name":"",
                "num_Adr": 0,
                "history": "",
                "IDdevice": "",
                "account":"",
                "password":"",
                "num":"",
                "address":[],
                "birth":"",
                "gender":true,
                "phonenum":""
            };
            let session = req.query.session;
            let acc = req.query.account;

            const client = await pool.connect();
            
            if(await ConfirmAccount(session,acc)){
                const getData = await client.query("SELECT name,num_Adr,history,IDdevice,password,num,address,birth,gender,phonenum FROM user_table WHERE account = $1", [acc] ); 
                responses.name = getData.rows[0].name;
                responses.num_Adr = getData.rows[0].num_adr;
                responses.history = getData.rows[0].history;
                responses.IDdevice = getData.rows[0].iddevice;
                responses.address = getData.rows[0].address;
                responses.account = acc;
                responses.password = getData.rows[0].password;
                responses.num = getData.rows[0].num;
                responses.birth = getData.rows[0].birth;
                responses.gender = getData.rows[0].gender;
                responses.phonenum = getData.rows[0].phonenum;
            }
            else{
                responses.flag = false;
                responses.error = "can't found your account";
            }
            res.send(responses);
            client.release();
        }
        catch(error)
        {
            console.log(error);
        }
    });
    
    // register event 
    app.post("/register", async(req,res) => {
        try
        {
            let acc = req.body.account;
            let pass = req.body.password;
            let name = req.body.name;
            let phone = req.body.phone;
            let birth = req.body.birth;
            let gender = req.body.gender;
            let adr = [
                {
                    "xa": "",
                    "huyen": "",
                    "tinh": ""
                }
            ];
            console.log(req.body);
            let responses = {
                "flag":true,
                "error":"",
            };
            const client = await pool.connect();
            const confirmAccount = await client.query(
                "SELECT account FROM user_table WHERE account = $1  ",
                [acc]
            );
            if(confirmAccount.rowCount == 0){
                const register =  await client.query(
                    "INSERT INTO user_table (account,password,name,phonenum,birth,gender,address,num_adr) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
                    [acc,pass,name,phone,birth,gender,adr,0]
                );
            }
            else{
                responses.flag = false;
                responses.error = "Register falied,user is already in the database";
            }
            res.send(responses);
            client.release();  
        }
        catch(error)
        {
            console.error(error);
        }
    });
    // login event
    app.get("/login", async(req,res) => {
        try
        {
            let acc = req.query.account;
            let pass = req.query.password;
            console.log(acc);
            console.log(pass);
            let responses = {
                "flag":false,
                "session":""
            };
            const client = await pool.connect();
            const confirmAccount = await client.query(
                "SELECT account FROM user_table WHERE account = $1 AND password = $2 ",
                [acc,pass]
            );
            
                        
            if(confirmAccount.rowCount != 0){
                responses.flag = true; 
                responses.session = createSession();
                const saveSession = await client.query(
                    "INSERT INTO session_table (code,account) VALUES($1,$2)",
                    [responses.session,acc]
                );
            }
            res.send(responses);
            client.release();
        }
        catch(error)
        {
            console.error(error);
        }
    });
    //update event
    app.put("/update", async(req,res) => {
        try
        {
            let acc = req.body.account;
            let pass = req.body.password;
            let session = req.body.session;
            let name = req.body.name;
            let adr = req.body.address;
            let IDdevice = req.body.IDdevice;
            let num_Adr = req.body.num_Adr;
            let birth = req.body.birth;
            let gender = req.body.gender;
            let phonenum = req.body.phonenum;
            let responses = {
                "flag":true,
                "error":"no thing"
            };
            console.log(req.body)
            const client = await pool.connect();
            const confirmAccount = await client.query(
                "SELECT account FROM session_table WHERE code = $1 AND account = $2 ",
                [session,acc]
            );
            if(confirmAccount.rowCount > 0){
                const update = await client.query(
                    "UPDATE user_table SET password = $1, name = $2, address = $3, IDdevice = $4, num_adr = $5, birth = $6, gender = $7, phonenum = $8  WHERE account = $9",
                    [pass,name,adr,IDdevice,num_Adr,birth,gender,phonenum,acc]
                );
            }
            else{
                console.log("error");
                response.error = "can't find your account";
                responses.flag = false;
            }
            res.send(responses);
            client.release();
            
        }
        catch(error)
        {
            console.error(error);
        }
    });
    app.get("/getHistoryUser", async(req,res) => {
       try
       {
            let account = req.query.account;
            let session = req.query.session;
            const client = await pool.connect();
            const confirmAccount = await client.query(
                "SELECT * FROM session_table WHERE account = $1 AND code = $2",
                [account,session]
            );  
            if(confirmAccount.rowCount == 0)
                return;
            const getIDdeivce = await client.query(
                "SELECT IDdevice FROM user_table WHERE account = $1",
                [account]
            );
            let IDdevice = getIDdeivce.rows[0].iddevice;
            console.log( getIDdeivce.rows[0]);
            const getHistory = await client.query(
                "SELECT * FROM history_table WHERE send = $1 OR get = $1 OR send = $2 OR get = $2",
                [account,IDdevice]
            );
            res.send(getHistory);
       }
       catch(error)
       {
           console.log(error);
       }
    });
//-----------------------------------------------------------------------------------------------------------------------------------------------------
app.listen(PORT, () => console.log('Server listening on port: http://localhost:3000/'));

app.enable('trust proxy');
app.use('/what-is-protocol',function (req, res, next) {
	if (req.headers['x-forwarded-proto'] !== 'https'){
      return res.send('Not found');
    } else {
        next();
    }
})

app.get("/menu", async(req,res) => {
    try
    {
        res.sendFile(path.join(__dirname + '/public/menuPage.html'));
        
    }
    catch(error)
    {
        console.log(error);
    }
});
app.get("/loginPage", async(req,res) => {
    try
    {
        res.sendFile(path.join(__dirname + '/public/login2.html'));
        
    }
    catch(error)
    {
        console.log(error);
    }
});
app.get("/signupPage", async(req,res) => {
    try
    {
        res.sendFile(path.join(__dirname + '/public/login2.html'));
        
    }
    catch(error)
    {
        console.log(error);
    }
});
app.get("/khoa", async(req,res) => {
    try
    {
        res.sendFile(path.join(__dirname + '/public/Hello.html'));
        
    }
    catch(error)
    {
        console.log(error);
    }
});
app.get("/khoa2", async(req,res) => {
    try
    {
        res.sendFile(path.join(__dirname + '/public/Yes.html'));
        
    }
    catch(error)
    {
        console.log(error);
    }
});
app.get("/khoa3", async(req,res) => {
    try
    {
        res.sendFile(path.join(__dirname + '/public/Yes2.html'));
        
    }
    catch(error)
    {
        console.log(error);
    }
});
app.get("/test", async(req,res) => {
    try
    {
        const client = await pool.connect();
        const a = await client.query(
            "SELECT * FROM device_table"
        );
        console.log(a);
    }
    catch(error)
    {
        console.log(error);
    }
});