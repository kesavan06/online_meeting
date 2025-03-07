import CryptoJS from "crypto-js";

export default async function useUniqueName(uName) {
  console.log("U name: ", uName);
  uName = uName.trim();

  try {
    console.log("Unique Name : ", uName);
    let uniqueCheck = await fetch("https://10.89.72.171:3002/unique");

    let rare = true;

    if (uniqueCheck.status == 201) {
      let res = await uniqueCheck.json();
      let allUsers = res.data;

      for (let user of allUsers) {
        let k = user.user_key;
        let decUnique = decrptData(user.unique_name, k);

        if (decUnique == uName) {
          rare = false;
          break;
        }
      }
    }

    console.log("Unique ness : ", rare);

    return rare;
  } catch (err) {
    console.log("Err in Unique Check : \n", err);
  }
}

function decrptData(data, secKey) {
  return CryptoJS.AES.decrypt(data, secKey).toString(CryptoJS.enc.Utf8);
}

