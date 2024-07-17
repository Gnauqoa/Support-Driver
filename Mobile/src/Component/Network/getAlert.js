import { linkServer } from "./getUserData";
const linkGetAlert = linkServer + "/getWarning";
const linkGetAlertAccept = linkServer + "/acceptWarning";
export async function getAlertData (session,account,setAlertData,doneFunction)  {
    try {
        console.log("getAlertData");
        const response = await fetch(
            linkGetAlert + "?session=" + session + "&account=" + account
        );
        const json = await response.json();
        setAlertData(json.data);
        doneFunction();
 
    } 
    catch (error) {
        return error;
    }
};

export async function getAlerAccepttData (session,account,IDdevice,setAlertData,doneFunction)  {
    try {
        console.log("getAlerAccepttData");
        const response = await fetch(
            linkGetAlertAccept + "?session=" + session + "&account=" + account + "&IDdevice=" + IDdevice
        );
        const json = await response.json();
        json.data.confirm = true;
        setAlertData(json.data);
        doneFunction();
    } 
    catch (error) {
        return error;
    }
};