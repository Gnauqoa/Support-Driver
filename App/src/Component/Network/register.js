import { linkServer } from "./getUserData";
const linkRegister = linkServer + "/register";

export async function getRegisterRequest (account,password,name,phone,birth,gender)  {
    try {
        console.log("getRegisterRequest");
        const response = await fetch(
            linkRegister,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    account:account,
                    password:password,
                    name:name,
                    phone:phone,
                    birth:birth,
                    gender:gender
                }),
            }
        );
        const json = await response.json();
        return json;
    } 
    catch (error) {
        return error;
    }
};