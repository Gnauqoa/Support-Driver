import { linkServer } from "./getUserData";
const linkLogin = linkServer + "/Login";

export async function getLoginData (account,password)  {
    try {
        console.log("getLoginData");
        const response = await fetch(
            linkLogin + "?account=" + account + "&password=" + password
        );
        const json = await response.json();
        return json;
    } 
    catch (error) {
        return error;
    }
};