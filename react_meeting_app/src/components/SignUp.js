import CryptoJS from "crypto-js";

export default async function SignUp(name, password, unique_name) {
  try {
    name = name.trim();
    unique_name = unique_name.trim();
    console.log("Name : ", name);
    let secret = await getRandomKey();

    let encryptPass = encrptData(password, secret.password);
    console.log("Encrypt 1 Pass: ", encryptPass);

    let encryptUnique = encrptData(unique_name, secret.password);
    console.log("Encrypt 2 User Name: ", encryptUnique);

    let setUser = await fetch("https://10.89.72.171:3002/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_name: name,
        password: encryptPass,
        unique_name: encryptUnique,
        user_key: secret.password,
      }),
    });

    console.log("User Add ; ", setUser);

    let res = await setUser.json();
    return res;

    // let user = await getDetailOfAPerson(encryptUnique);
    // console.log("User: ", user);
  } catch (err) {
    console.log("Error in client: \n", err);
  }
}

async function getRandomKey() {
  let key = await fetch(
    "https://api.genratr.com/?length=16&uppercase&lowercase&special&numbers"
  ).then((res) => res.json());
  console.log("Random  key  :", key);
  return key;
}

function encrptData(data, secret) {
  return CryptoJS.AES.encrypt(data, secret).toString();
}

async function getDetailOfAPerson(unique) {
  let getUser = await fetch("https://10.89.72.171:3002/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ unique_name: unique }),
  });

  let res;
  if (getUser.status == 201) {
    res = await getUser.json();
  } else {
    res = {};
  }

  console.log("Response : ", res);
  return res;
}