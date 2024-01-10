# Tamper Proof Data

**1. How does the client ensure that their data has not been tampered with?**
Ans:  To ensure the data has not been tampared we cna perform hashing, encryption and decryption method where on the client side the data needs to be passed is hashed and encrypted, so the actual data and encrypted hash code post as a response to the server. The server stores both in json format. When the client clicks on verify data internally it gets the response and then hashes the data and decrypts the hash value and compare them both if both are same then it present the message on the screen or else throws an error message says "Failed Integrity Check". This is how the client can confirm whether the data has been tampered or not.
**2. If the data has been tampered with, how can the client recover the lost data?**
Ans: In this senario the lost data can be recovered by taking the backup of the datadase on timely bases but since there is not database configured on the server side, I have implemented logs in the server side to store the sent data to the server. This logs stores both data and encrypted hash code and time stamp corresponding to it. This way the clients can recover the lost data by referring to the particular time stamp.

