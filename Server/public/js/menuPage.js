const accountPageBtn = getDOC("accountPageBtn");
const alertPageBtn = getDOC("alertPageBtn");
const historyPageBtn = getDOC("historyPageBtn");
const devicePageBtn = getDOC("devicePageBtn");
const homeBtn = getDOC("homeBtn");


const historyPage = getDOC("historyPage");
const accountPage = getDOC("accountPage");
const homePage = getDOC("homePage");
const alertPage = getDOC("alertPage");
const alertMenu = document.getElementById("alertMenu");
const loginBtn = document.getElementById("loginBtn");

let num_Adr;
let pageNow;
let num_Address = 0;
let s_data;
let passwordSave;
let accountSave;
let url = "https://support-driver.herokuapp.com";
let urlgetInfo = url + "/getUserInfo";
let urlUpdate = url + "/update";
let urlacceptWarnning = url + "/acceptWarning";
let urlgetWarning = url + "/getWarning";
let urlgetHistory = url + "/getHistoryUser";


accountPageBtn.addEventListener('click',jumpPageaccountPageBtn);
alertPageBtn.addEventListener('click',jumpPagealertPageBtn);
historyPageBtn.addEventListener('click',jumpPagehistoryPageBtn);
devicePageBtn.addEventListener('click',jumpPagedevicePageBtn);
homeBtn.addEventListener('click',jumpPagehomeBtn);

function jumpPagehomeBtn(){
    let session = sessionStorage.getItem("session");
    pageNow.innerHTML = null;
    jumpPage(homeBtn);
    if(session == null){
        pageNow.appendChild(newElementP("h1","Bạn cần đăng nhập để tiếp tục " ,"mt-4","alertMenu"));
        pageNow.appendChild(newElementA("a","loginPage","Đăng nhập tại đây","mt-4","loginBtn"));
        return;
    }
    pageNow = homePage;
    //sessionStorage.setItem("page", pageNow);
    getRequest(urlgetInfo + "?session=" + session,updatePageHome);
}
function jumpPageaccountPageBtn(){
    let session = sessionStorage.getItem("session");
    pageNow.innerHTML = null;
    jumpPage(accountPageBtn);
    if(session == null){
        pageNow.appendChild(newElementP("h1","Bạn cần đăng nhập để tiếp tục " ,"mt-4","alertMenu"));
        pageNow.appendChild(newElementA("a","loginPage","Đăng nhập tại đây","mt-4","loginBtn"));
        return;
    }
    pageNow = accountPage;
    getRequest(urlgetInfo + "?session=" + session,saveDataPageAccount);
}
function jumpPagealertPageBtn(){
    let session = sessionStorage.getItem("session");
    pageNow.innerHTML = null;
    jumpPage(alertPageBtn);
    if(session == null){
        pageNow.appendChild(newElementP("h1","Bạn cần đăng nhập để tiếp tục " ,"mt-4","alertMenu"));
        pageNow.appendChild(newElementA("a","loginPage","Đăng nhập tại đây","mt-4","loginBtn"));
        return;
    }
    pageNow = alertPage;
    getRequest(urlgetWarning + "?session=" + session,updatePageAlert);

}
function jumpPagehistoryPageBtn(){
    let test = {
        "data":"2021-08-30 23:58:34"
    };
    let a = test.data.split(" ");
    let session = sessionStorage.getItem("session");
    pageNow.innerHTML = null;
    if(session == null){
        pageNow.appendChild(newElementP("h1","Bạn cần đăng nhập để tiếp tục " ,"mt-4","alertMenu"));
        pageNow.appendChild(newElementA("a","loginPage","Đăng nhập tại đây","mt-4","loginBtn"));
        return;
    }
    pageNow = historyPage;
    jumpPage(historyPageBtn);
    getRequest(urlgetHistory + "?session=" + session+"&account="+accountSave,updatePageHistory)
}
function updatePageHistory(s){
    let time;
    let time2;
    pageNow.appendChild(newElementP("p","20 hành động gần đây, mã sự kiện là mã của hành động được lưu trong database của ứng dụng"));

    for(let i = s.rowCount - 1; i >= s.rowCount - 20 ; --i){
        time = s.rows[i].time_happen.split(" ");
        time2 = time[0].split("-");
        let element = newElementP("div","");
        if(i %2 == 1)
            element.classList.add("bg-newcolor");
        else        
            element.classList.add("bg-white");
        element.appendChild(newElementP("p1","Mã sự kiện: " + s.rows[i].id_event));
        element.appendChild(newElementP("div",""));
        element.appendChild(newElementP("p1",getAction(s.rows[i].action)));
        element.appendChild(newElementP("div",""));
        element.appendChild(newElementP("p1","Giờ: " + time[1] + " | " + "Ngày: " + time2[2] + "-" + time2[1] + "-" + time2[0]));
        element.appendChild(newElementP("div",""));
        element.appendChild(newElementP("p1","Mô tả chi tiết: " + getDescription(s.rows[i].action,s.rows[i].description)));
        pageNow.appendChild(element);
    }
}
function getDescription(action,s){
    if(s == "")
        return "không có";
    
   if(Number(action) == 5)
        return "mã sự kiện mà bạn nhận: " + s;
    return "Vị trí thiết bị: ";
}
function getAction(action){
    if(action == 5)
        return "Bạn lấy thông báo từ server";
    if(action == 2)
        return "Thiết bị của bạn thông báo đến server bạn bị cướp";
    if(action == 1)
        return "Thiết bị của bạn thông báo đến server bạn bị tai nạn";
    if(action == 3)
        return "Thiết bị của bạn thông báo đến server vị trí di chuyển của xe bạn sau khi bạn bị cướp";
    if(action == 4)
        return "Thiết bị của bạn thông báo đến server vị trí tắt máy xe";
}
function jumpPagedevicePageBtn(){
    jumpPage(devicePageBtn);
}
function saveDataPageAccount(s){
    passwordSave = s.password;
    accountSave = s.account;
    num_Address = s.num_Adr;
    s_data = s;
    updatePageAccount(s);
}
function updatePageAlert(s){
    if(s.flag == false){
        alert("Lỗi!!! không thể lấy thông báo");
        return;
    }
    pageNow.appendChild(newElementP("p1","Do hiện tại vẫn đang trong giai đoạn thử nghiệm, nên chỉ có 3 thiết bị hoạt động và luôn trong tình trạng gặp nguy hiểm để có thể test thông báo. Bạn có thể đổi địa chỉ lại thành huyện Mỏ Cày Nam, tỉnh Bến Tre và để trống phần xã để test"));
    pageNow.appendChild(newElementP("div","","mt-3"));
    pageNow.appendChild(newElementP("p","Xác nhận mật khẩu: ","mt-0"));
    pageNow.appendChild(newElementInput("input","","inputAccount","confirmPassword"));
    pageNow.appendChild(newElementP("div",""));
    pageNow.appendChild(newElementButton("button","Tải lại thông báo","btn-success","reloadAlertBtn",reLoadAlert));
}
function reLoadAlert(){
    if(getDOC("confirmPassword").value == ""){
        alert("Xin nhập mật khẩu để xác nhận");
        return ;
    }
    if(getDOC("confirmPassword").value != passwordSave){
        alert("Mật khẩu sai");
        return ;
    }
    alert("Mật khẩu đúng, xin chờ để lấy dữ liệu từ server")
    pageNow.innerHTML = null;
    let session = sessionStorage.getItem("session");
    getRequest(urlgetWarning + "?session=" + session,loadPageAlert);
}
function loadPageAlert(s){
    if(s.flag == false){
        alert("Lỗi!!! không thể lấy thông báo");
        return;
    }
    alert("Lấy thông báo thành công");
    pageNow.appendChild(newElementP("p","Xác nhận mật khẩu: ","mt-0"));
    pageNow.appendChild(newElementInput("input","","inputAccount","confirmPassword"));
    pageNow.appendChild(newElementP("div",""));
    pageNow.appendChild(newElementButton("button","Tải lại thông báo","btn-success","",reLoadAlert));
    for(let i = 1; i <= s.numwarning; ++i){
        pageNow.appendChild(newElementP("div","","mt-3",));
        let element = newElementP("div","Thông báo " + i);
        if(i %2 == 1)
            element.classList.add("bg-newcolor");
        else        
            element.classList.add("bg-white");
        element.appendChild(newElementP("div",""));
        element.appendChild(newElementP("p1","Trường hợp: " + getCase(s.data[i-1].status)));
        element.appendChild(newElementP("div",""));
        element.appendChild(newElementP("p1","Địa điểm xảy ra: " + getLocation(s,i-1)));
        element.appendChild(newElementP("div",""));
        element.appendChild(newElementP("p1","Link google map: " + s.data[i-1].location));
        pageNow.appendChild(element);
    }
}
function getLocation(s,i){
    return "xã " + s.data[i].address.xa + ", huyện " + s.data[i].address.huyen + ", tỉnh " + s.data[i].address.tinh;
}
function getCase(c){
    if(c == 1)
        return "bị tai nạn";
    return "bị cướp";
}
function updatePageHome(s){
    passwordSave = s.password;
    accountSave = s.account;
    pageNow.appendChild(newElementP("h1","Chào mừng quay lại " + s.name,"mt-4","alertMenu"));
    pageNow.appendChild(newElementP("p1","Bạn có thể cập nhật thông tin cá nhân, mật khẩu, địa chỉ và thiết bị của mình tại mục tài khoản"));
    pageNow.appendChild(newElementP("div","","mt-3"));
    pageNow.appendChild(newElementP("p1","Tab Thông báo là nơi để nhận thông báo yêu cầu giúp đỡ từ người bị nạn trong khu vực"));
    pageNow.appendChild(newElementP("div","","mt-3"));
    pageNow.appendChild(newElementP("p1","Xem lại lịch sử thông báo đã nhận, yêu cầu đã giúp đỡ,... Tại tab lịch sử"));
    pageNow.appendChild(newElementP("div","","mt-3"));
    pageNow.appendChild(newElementP("p1","Nếu không muốn sử dụng tin nhắn SMS để quản lí thiết bị của mình, bạn có thể vào tab Thiết bị để điều chỉnh thiết bị của mình"));
}
function updatePageAccount(s){
    pageNow.appendChild(newElementP("p","Tên tài khoản: " + s.account,"mt-3"));
    pageNow.appendChild(newElementP("p","Tên người dùng: ","mt-0"));
    pageNow.appendChild(newElementInput("input",s.name,"inputAccount","nameAccountPage"));
    pageNow.appendChild(newElementP("p","Mật khẩu: ","mt-3"));
    pageNow.appendChild(newElementInput("input",s.password,"inputAccount","passwordAccountPage"));
    pageNow.appendChild(newElementP("p","ID thiết bị sử dụng: ","mt-3"));
    pageNow.appendChild(newElementInput("input",s.IDdevice,"inputAccount","IDAccountPage"));
    let address = newElementP("div","Địa chỉ sinh hoạt thường xuyên, nhận thông báo khi có người bị tai nạn trong khu vực địa chỉ đã đăng ký.","mt-3");
    address.appendChild(newElementP("div",""));
    address.appendChild(newElementP("div","Nếu để trống phần xã, hệ thống sẽ lấy thông báo giúp đỡ trên phạm vi toàn huyện, điều tương tượng cũng áp dụng với phần huyện, nhưng không áp dụng với phần tỉnh.","mt-3"));
    address.appendChild(newElementP("div",""));
    address.appendChild(newElementButton("button","Thêm địa chỉ","btn-success","addAddress",addAddress));
    address.appendChild(newElementButton("button","Xóa địa chỉ","btn-danger","deleteAddress",removeAddress));
    address.appendChild(newElementP("div",""));
    for (let i = 1; i <= num_Address; i++) 
        address.appendChild(newAddress(i,s));
    address.appendChild(newElementButton("button","Lưu thông tin","btn-secondary","save",saveAllData));
    pageNow.appendChild(address);
}
function saveAllData(){
    let dataPut = {
        "account":s_data.account,
        "password":getDOC("passwordAccountPage").value,
        "name": getDOC("nameAccountPage").value,
        "IDdevice":getDOC("IDAccountPage").value,
        "num_Adr": num_Address,
        "address":[
            {
                "xa": "",
                "huyen":"",
                "tinh": ""
            },
            {
                "xa": "",
                "huyen":"",
                "tinh": ""
            },
            {
                "xa": "",
                "huyen":"",
                "tinh": ""
            },
            {
                "xa": "",
                "huyen":"",
                "tinh": ""
            },
            {
                "xa": "",
                "huyen":"",
                "tinh": ""
            }
        ] 
    };
    for(let i = 1; i <= num_Address; ++i){
        dataPut.address[i-1].xa = getDOC("address" + i +"-xa").value;
        dataPut.address[i-1].huyen = getDOC("address" + i +"-huyen").value;
        dataPut.address[i-1].tinh = getDOC("address" + i +"-tinh").value;
    }
    PDRequest("PUT",urlUpdate,dataPut);
}
function PDRequest(type,link,data){
    var req = new XMLHttpRequest();
    req.open(type, link);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");    
    req.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200) {
            let s =  JSON.parse(this.responseText);
            if(s.flag == false){
                alert("xảy ra lỗi, cập nhật thất bại, xin thử lại");
                return;
            }
            alert("cập nhật thành công");
        }
    };
    req.send(JSON.stringify(data));
}
function getRequest(link, callback){
    var req = new XMLHttpRequest();
    req.open("GET", link);
    req.overrideMimeType("application/json");
    req.onreadystatechange = function() {
        if(this.readyState === 4 && this.status === 200) {
            let s = JSON.parse(this.responseText);
           
            callback(s);
        }
    };
    req.send();
}
function addAddress(){
    if(num_Address == 5)
        return;
    num_Address++;
    pageNow.innerHTML = '';
    updatePageAccount(s_data);
}
function removeAddress(){
    if(num_Address == 1)
        return;
    num_Address--;
    pageNow.innerHTML = '';
    updatePageAccount(s_data);
}
function newAddress(loc,s){
    const a = loc - 1;
    let re = newElementP("div","Địa chỉ " + loc +": ","mt-3");
    let sec =newElementP("div"," ","mt-2");
    let xa = "";
    let huyen = "";
    let tinh = "";
    sec.appendChild(newElementP("a","Xã     "));
    if(loc <= s.num_Adr){
        xa = s.address[a].xa;
        huyen = s.address[a].huyen;
        tinh = s.address[a].tinh
    }
    sec.appendChild(newElementInput("input",xa,"inputAddress","address" + loc +"-xa"));
    sec.appendChild(newElementP("a","Huyện     "));
    sec.appendChild(newElementInput("input",huyen,"inputAddress","address" + loc +"-huyen"));
    sec.appendChild(newElementP("a","Tỉnh     "));
    sec.appendChild(newElementInput("input",tinh,"inputAddress","address" + loc +"-tinh"));
    re.appendChild(sec);
    return re;
}
function newElementButton(type,value = "",classs = null,id = null,fuOnclick = null){
    let e = document.createElement(type);
    if(id != null)
        e.setAttribute("id", id);
    if(classs != null)
        e.classList.add(classs);
    if(fuOnclick != null)
        e.onclick = fuOnclick;
    e.classList.add("btn");
    e.classList.add("mt-3");
    e.innerHTML = value;
    return e;
}
function newElementP(type,value = "",classs = null,id = null){
    let e = document.createElement(type);
    if(id != null)
        e.setAttribute("id", id);
    if(classs != null)
        e.classList.add(classs);

    e.innerHTML = value;
    return e;
}
function newElementInput(type,value = "",classs = null,id = null){
    let e = document.createElement(type);
    if(id != null)
        e.setAttribute("id", id);
    if(classs != null)
        e.classList.add(classs);
    e.value = value;
    return e;
}
function newElementA(type,href = "",value,classs = null,id = null){
    let e = document.createElement(type);
    if(id != null)
        e.setAttribute("id", id);
    if(classs != null)
        e.classList.add(classs);
    e.href = href;
    e.innerHTML = value;
    return e;
}
function getDOC(id){
    return document.getElementById(id);
}
window.addEventListener('DOMContentLoaded', event => {
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }
});
window.onload = function() {
    let session = sessionStorage.getItem("session");
    pageNow = homePage;
    if(session == null){
        pageNow.appendChild(newElementP("h1","Bạn cần đăng nhập để tiếp tục " ,"mt-4","alertMenu"));
        pageNow.appendChild(newElementA("a","loginPage","Đăng nhập tại đây","mt-4","loginBtn"));
        return;
    }
    jumpPagehomeBtn();
};
function jumpPage(id){
    setWhiteAll();
    setColor(id);
}
function setWhiteAll(){
    setWhite(accountPageBtn);
    setWhite(alertPageBtn); 
    setWhite(historyPageBtn); 
    setWhite(devicePageBtn); 
    setWhite(homeBtn); 
}
function setColor(id){
    id.classList.remove('bg-white');
    id.classList.add('bg-newcolor');
}
function setWhite(id){
    id.classList.remove('bg-newcolor');
    id.classList.add('bg-white');
}