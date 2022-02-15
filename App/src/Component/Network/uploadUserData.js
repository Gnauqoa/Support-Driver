import { linkServer } from "./getUserData";
import Moment from "moment";
const linkUploadUserData = linkServer + "/update";
export async function uploadUserData  (LoginData,UserData,AddressData,uploadDone)  {
    try {
        console.log("uploadUserData");
        const response = await fetch(
            linkUploadUserData, 
            {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(createUserData(LoginData,UserData,AddressData)),
            }
        );
   
        const json = await response.json();
        console.log(json.flag);
        if(json.flag == true){
            uploadDone();
            return 1;
        }
        if(json.flag == false) return 0;
    } 
    catch (error) {
      return((error));
    }
};
const createUserData = (LoginData,User,Address) => {
    return {
        "account":LoginData.account,
        "password":User[0].value == "" ? LoginData.password : User[0].value,
        "session":LoginData.session,
        "name":User[1].value,
        "gender":User[2].value,
        "birth":Moment(User[3].value).format('YYYY-MM-DD'),
        "phonenum":User[4].value,
        "IDdevice":User[6].value,
        "num_Adr": 1,
        "address":Address

    };
}