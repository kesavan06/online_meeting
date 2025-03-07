import CryptoJS from "crypto-js";

export default async function Login(unique_name, password) {
  let user = await LoginFunction(unique_name, password);
  console.log("U : ", user);
  return user;
}

async function LoginFunction(unique_name, password) {
  try {
    console.log("Unique Name: ", unique_name + " Password: ", password);

    let fetchSec = await fetch("https://10.89.72.171:3002/secretKey");
    console.log("Fetch: ", fetchSec);

    let theUser = null;

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
        console.log(unique_name, password);

        if (passDec == password && unique_name == nameDec) {
          theUser = user;
          break;
        }
      }

      console.log("User: ", theUser);
    } else {
      console.log("Error : ", fetchSec.data);
    }

    return theUser;
  } catch (err) {
    console.log("Error in fetch \n", err);
  }
}

function decrptData(data, secKey) {
  return CryptoJS.AES.decrypt(data, secKey).toString(CryptoJS.enc.Utf8);
}