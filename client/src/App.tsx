import React, { useEffect, useState } from "react";
import crypto from "crypto-js";

const API_URL = "http://localhost:8080";
const SECRET_KEY = "SecretKey";

function App() {
  const [data, setData] = useState<string>();
  const [hash, setHash] = useState<string>();
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try{
      const response = await fetch(API_URL);
      const { data, hash } = await response.json();
    // Decrypt the encryptedhash
      const decryptedHash = decryptHash(hash);
      if (decryptedHash === calculateHash(data)) {
        setData(data);
        setHash(hash);
      } else {
        console.error("Data integrity check fail. Data tampering!");
      }
    }catch(e){
      setMessage("Fetch Data Error : "+e);
    }
    
  };

  const updateData = async () => {
    const newData = data || "";
    const newHash = calculateHash(newData);
    // Encrypt the new hash
    const encryptedHash = encryptHash(newHash);
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data: newData, hash: encryptedHash }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    await getData();
  };

  const calculateHash = (data: string) => {
    return crypto.SHA256(data).toString();
  };

  const decryptHash = (encryptedHash: string) => {
    const bytes = crypto.AES.decrypt(encryptedHash, SECRET_KEY);
    return bytes.toString(crypto.enc.Utf8);
  };

  const encryptHash = (newHash: string) => {
    return crypto.AES.encrypt(newHash, SECRET_KEY).toString();
  };

  const verifyData = async () => {
    try{
      const response = await fetch(API_URL);
      const { data: currentData, hash: currentHash } = await response.json();    
      const freshlyCalculatedHash = calculateHash(currentData);
      if (freshlyCalculatedHash === decryptHash(currentHash)) {
        console.log("Data is untampered.");
        setMessage("verified Data : "+currentData);
      } else {
        console.error("Data integrity check fail. Data tampering!");
        setMessage("Failed Integrity Check");
      }
    }catch(e){
      setMessage("Data Verification Error : "+e);  
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        position: "absolute",
        padding: 0,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        fontSize: "30px",
      }}
    >
      <div>Saved Data</div>
      <p>Current value : {data}</p>
      <input
        style={{ fontSize: "30px" }}
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ fontSize: "20px" }} onClick={updateData}>
          Update Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={verifyData}>
          Verify Data
        </button>
      </div>
      <p>{message}</p>
    </div>
  );
}

export default App;
