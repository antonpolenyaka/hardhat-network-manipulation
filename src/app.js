const hre = require('hardhat');
const { time } = require('@nomicfoundation/hardhat-network-helpers');

function timestampToHumanDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
}

function getCurrentTimestamp() {
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    return timestamp;
}

// evm_increaseTime
async function increaseTime(milliseconds) {
    const timestampBefore = await time.latest();
    console.log("Time before increase " + timestampBefore + " (" + timestampToHumanDate(timestampBefore) + ")");

    // suppose the current block has a timestamp of 01:00 PM
    await hre.network.provider.send("evm_increaseTime", [milliseconds]);
    await hre.network.provider.send("evm_mine"); // this one will have 02:00 PM as its timestamp
    console.log("Time increased in " + milliseconds + " milliseconds");

    const timestampAfter = await time.latest();
    console.log("Time after increase " + timestampAfter + " (" + timestampToHumanDate(timestampAfter) + ")");
}

// evm_setNextBlockTimestamp
async function setNextBlockTimestamp(nextTimestamp) {
    console.log("Starting move blocks to next timestamp " + nextTimestamp + " (" + timestampToHumanDate(nextTimestamp) + ")");
    const timestampBefore = await time.latest();
    console.log("Time before move " + timestampBefore + " (" + timestampToHumanDate(timestampBefore) + ")");

    if (nextTimestamp > timestampBefore) {
        // suppose the current block has a timestamp of 01:00 PM
        await hre.network.provider.send("evm_setNextBlockTimestamp", [nextTimestamp]);
        await hre.network.provider.send("evm_mine"); // this one will have 2021-07-01 12:00 AM as its timestamp, no matter what the previous block has
        console.log("Time moved to " + nextTimestamp + " timestamp");
    } else {
        console.error("Timestamp " + nextTimestamp + " is lower than the previous block's timestamp " + timestampBefore);
    }

    const timestampAfter = await time.latest();
    console.log("Time after move " + timestampAfter + " (" + timestampToHumanDate(timestampAfter) + ")");
}

const timeToIncrease = 30 * 24 * 3600 * 1000; // 30 days
// increaseTime(timeToIncrease);

let currentTimestamp = getCurrentTimestamp();
setNextBlockTimestamp(currentTimestamp + timeToIncrease);