export default async function useUniqueName(uName) {


    console.log("U name: ",uName);

    try {

        console.log("Unique Name : ", uName);
        let uniqueCheck = await fetch("http://localhost:3002/unique", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ unique_name: uName }),
        });

        let res = await uniqueCheck.json();

        if (res.message == "Fail") {
            return false;
        }
        else {
            return true;
        }
    }
    catch (err) {
        console.log("Err in email Check : \n", err);
    }
}