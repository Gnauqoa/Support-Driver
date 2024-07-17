export const linkServer = "https://support-driver.herokuapp.com";
const linkGetUserData = linkServer + "/getUserInfo";


export const getUserData = async (session,account,setUserData,setAddressData) => {
    try {
        console.log("getuserData");
        const response = await fetch(
            linkGetUserData + "?session=" + session + "&account="+account
        );
        const json = await response.json();
        setUserData(cutUserData(json));
        setAddressData(cutAddressData(json.address));
        return 1;
    } 
    catch (error) {
      console.error(error);
    }
};
const cutAddressData = (data) => {
    let re = [];
    for(let i = 0; i < data.length; ++i){
        if(data[i].tinh != "")
            re.push(
                {
                    xa: data[i].xa,
                    huyen: data[i].huyen,
                    tinh:  data[i].tinh,
                }
            );
    }
    return re;
}
const cutUserData = (data) =>{
    return  [
        {
            ImgSrc: require("../../img/password.png"),
            value: "",
            placeholder: "Mật khẩu",
            type: "password"
        },
        {
            ImgSrc: require('../../img/name.png'),
            value: data.name,
            placeholder: "tên",
        },
        {
            ImgSrc: require('../../img/gender.png'),
            value: data.gender,
            placeholder: "giới tính",
            type: "gender"
        },
        {
            ImgSrc: require('../../img/birthday-cake.png'),
            value: data.birth,
            placeholder: "ngày sinh",
            type: "birth"
        },
        {
            ImgSrc: require('../../img/smartphone.png'),
            value: data.phonenum,
            placeholder: "số điện thoại",
            type: "phone"
        },
        {
            ImgSrc: require('../../img/mail.png'),
            value: data.account,
            placeholder: "email",
            type:"email"
        },
        
        {
            ImgSrc: require('../../img/deviceID.png'),
            value: data.IDdevice,
            placeholder: "ID thiết bị",
           
        },
        {
            ImgSrc : require('../../img/userID.png'),
            value: data.num,
            type: "userID"
        }
    ];

}