const fs = require('fs');

// VARIABLES AND CONSTANTS
let systemData = [];
let fileAContent = [];
let fileBContent = [];
const mergedFileContent = [];
let csvText = '';

// CONVERT CSV FILES INTO JSON
const convertToJSON = (fileName) => {
    const fileText = fs.readFileSync(fileName, 'utf-8');
    const allLines = fileText.trim().replace(/(\r)/g, '').split('\n');
    const header = allLines[0];
    const fieldNames = header.split(',');
    const dataLines = allLines.slice(1);

    const objList = [];
    for (let i = 0; i < dataLines.length; i++) {
        const obj = {};
        const data = dataLines[i].split(',');
        for (let j = 0; j < fieldNames.length; j++) {
            const fieldName = fieldNames[j];
            obj[fieldName] = data[j];
        }
        objList.push(obj);
    }

    return objList;
}

// MERGE THE DATA FROM THE CSV FILES
const mergeFilesData = () => {
    for (let i = 0; i < fileAContent.length; i++) {
        const index = fileBContent.indexOf(fileBContent.find((user) => user.user_id == fileAContent[i].user_id));
        userData = {
            ...fileAContent[i],
            first_name: fileBContent[index].first_name,
            last_name: fileBContent[index].last_name
        }
        mergedFileContent.push(userData);
    }
}

// COMPARE THE DATA FROM THE MERGED FILES WITH THE SYSTEM DATA
const mergeSystemData = () => {
    for (let i = 0; i < mergedFileContent.length; i++) {
        const index = systemData.indexOf(systemData.find((user) => user.email == mergedFileContent[i].email));
        if (index != -1) {
            mergedFileContent[i].user_id = systemData[index].uid; 
        }
    }
}

// CREATE A CSV FILE WITH THE MERGED DATA FROM FILES AND SYSTEM
const createMergedCsv = () => {
    for (let i = 0; i < mergedFileContent.length; i++) {
        Object.keys(mergedFileContent[i]).map(key => {
            if (i == 0) {
                csvText += key + ',';
            } else {
                csvText += mergedFileContent[i][key] + ',';
            }
        });
        if (i == (mergedFileContent.length - 1)) {
            csvText = csvText.substring(0, csvText.length - 1)
        } else {
            csvText = csvText.substring(0, csvText.length - 1) + '\n';
        }
    }

    fs.writeFile('./merged_file.csv', csvText, (error) => {
        if (error) throw error;
    });
}

// GET THE DATA FROM THE CSV FILES
const getFilesData = () => {
    fileAContent = convertToJSON('./File_A.csv');
    fileBContent = convertToJSON('./File_B.csv');
}

// GET THE DATA FROM THE SYSTEM
const getSystemData = async () => {
    const response = await fetch('https://sandbox.piano.io/api/v3/publisher/user/search?api_token=xeYjNEhmutkgkqCZyhBn6DErVntAKDx30FqFOS6D&aid=o1sRRZSLlw');
    systemData = await response.json();
    systemData = systemData.users;
    getFilesData();
    mergeFilesData();
    mergeSystemData();
    createMergedCsv();
}

getSystemData();