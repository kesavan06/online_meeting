import CryptoJS from "crypto-js";

export default function Login(unique_name, password) {
    LoginFunction(unique_name, password);
}

async function LoginFunction(unique_name, password) {

    try {
        console.log("Unique Name: ",unique_name+" Password: ",password);

        let fetchSec = await fetch("http://localhost:3002/secretKey");
        console.log("Fetch: ", fetchSec);

        let theUser;


        if (fetchSec.status == 201) {
            let res = await fetchSec.json();
            let allUsers = res.data;

            for (let user of allUsers) {

                let unique = user.unique_name;
                let pass = user.password;

                let keyU = user.user_key;
                let passDec = decrptData(pass, keyU);
                let nameDec = decrptData(unique, keyU);

                console.log(nameDec, passDec);
                console.log(unique_name,password);

                if (passDec == password && unique_name == nameDec) {
                    theUser= user;
                    break;
                }

            }

            console.log("User: ",theUser);
        }
        else{
            console.log("Error : ",fetchSec.arrayBuffer.data);
        }



    }
    catch (err) {
        console.log("Error in fetch \n", err);
    }
}


function decrptData(data, secKey) {
    return CryptoJS.AES.decrypt(data, secKey).toString(CryptoJS.enc.Utf8);
}