const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

const logInButton = document.getElementById("logIn");
const logInaccount = document.getElementById("loginAccount");
const logInpassword = document.getElementById("loginPassword");

const registerButton = document.getElementById("Register");
const registerName = document.getElementById("registerName");
const registerAccount = document.getElementById("registerAccount");
const registerPassword = document.getElementById("registerPassword");

//let url = "http://localhost:3000";
let url = "https://support-driver.herokuapp.com";
let urlLogin = url + "/login";
let urlregister = url + "/register";

window.onload = function() {
    if(location.href == url+"/signupPage")
    container.classList.add("right-panel-active");
};

function login(){
    loginRequest(urlLogin+"?account="+logInaccount.value+"&password="+logInpassword.value);
}
function loginRequest(link) {
    var req = new XMLHttpRequest();
    req.open("GET", link);
    req.overrideMimeType("application/json");
    req.onreadystatechange = function() {
        if(this.readyState === 4 && this.status === 200) {
            let s =  JSON.parse(this.responseText);
            if(s.flag == false){
                alert("Tài khoản hoặc mật khẩu không đúng");
                return;
            }
            alert("Đăng nhập thành công");
            sessionStorage.setItem("session", s.session);
            location.href = "menu";
        }
    };
    req.send();
}
function checkString2(s,length){
    if(s == "")
        return 0;
    if(s.length < length)
        return 0;
    return 1;
}
function checkString(s,length,s_check){
    if(s == "")
        return 0;
    if(s.length < length)
        return 0;
    if(s.indexOf(s_check) == -1)
        return 0;
    return 1;
}
function alertExit(s){
    alert(s);
    return 0;
}
function register(){
    let check = 1;
    if(checkString(registerAccount.value,0,"@gmail.com") == 0)
        check = alertExit("Tài khoản phải là email");
    if(checkString2(registerPassword.value,8) == 0)
        check = alertExit("Mật khẩu phải dài hơn 8 kí tự");
    if(checkString2(registerName.value,8) == 0)
        check = alertExit("Tên phải dài hơn 8 kí tự");
    if(check == 0)
        return;
    registerRequest(urlregister);
}
function registerRequest(link){
    var req = new XMLHttpRequest();
    req.open("POST", link);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");    
    req.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200) {
            let s =  JSON.parse(this.responseText);
            if(s.flag == false){
                alert("Đăng ký thất bại, tài khoản đã tồn tại");
                return;
            }
            alert("Đăng ký thành công");
            loginRequest(urlLogin+"?account="+registerAccount.value+"&password="+registerPassword.value);
        }
    };
     
    let data = {
       "account": registerAccount.value,
       "password": registerPassword.value,
       "name": registerName.value
    };
    req.send(JSON.stringify(data));
}
logInButton.addEventListener('click',login);
registerButton.addEventListener('click',register);
//alert();






signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});


async function fetchText() {
    //http://localhost:3000/test
    //https://support-driver.herokuapp.com/test
    // try {
    //     let res = await fetch("https://support-driver.herokuapp.com/test");
    //     alert( await res.text());
    // } catch (error) {
    //     alert(error);
    // }
    var req = new XMLHttpRequest();
    req.open("GET", "http://localhost:3000/test");
    req.onreadystatechange = function() {
        if(this.readyState === 4 && this.status === 200) {
            alert(this.responseText);
        }
    };
    // Gửi yêu cầu đến máy chủ
    req.send();
}