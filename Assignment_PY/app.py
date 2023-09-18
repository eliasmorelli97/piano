import requests
import json
import csv

# VARIABLES AND CONSTANTS
fileAContent = []
fileBContent = []
mergedFileContent = []
csvText = ''

# CONVERT CSV FILES INTO JSON
def convertToList(fileName):
    with open(fileName, newline='') as file:
        data = csv.reader(file, delimiter=',')
        fileContent = list(data)
        return fileContent

# MERGE THE DATA FROM THE CSV FILES
def mergeFilesData():
    mergedFileContent.append([fileAContent[0][0], fileAContent[0][1], fileBContent[0][1], fileBContent[0][2]])
    for i in range(1, len(fileAContent)):
        for j in range(1, len(fileBContent)):
            if fileAContent[i][0] == fileBContent[j][0]:
                mergedFileContent.append([fileAContent[i][0], fileAContent[i][1], fileBContent[j][1], fileBContent[j][2]])

# COMPARE THE DATA FROM THE MERGED FILES WITH THE SYSTEM DATA
def mergeSystemData():
    for i in range(1, len(mergedFileContent)):
        for j in range(1, len(systemData)):
            if mergedFileContent[i][1] == systemData[j]['email']:
                mergedFileContent[i][0] = systemData[j]['uid']

# CREATE A CSV FILE WITH THE MERGED DATA FROM FILES AND SYSTEM
def createMergedCsv():
    with open('merged_file.csv', 'w', newline = '') as file:
        writer = csv.writer(file, delimiter = ',')
        writer.writerows(mergedFileContent)

# GET THE DATA FROM THE CSV FILES
def getFilesData():
    fileAContent.extend(convertToList('File_A.csv'))
    fileBContent.extend(convertToList('File_B.csv'))

# GET THE DATA FROM THE SYSTEM
def getSystemData():
    url = 'https://sandbox.piano.io/api/v3/publisher/user/search?api_token=xeYjNEhmutkgkqCZyhBn6DErVntAKDx30FqFOS6D&aid=o1sRRZSLlw'
    response = requests.get(url)
    data = response.json()
    data = data['users']
    return data
    
systemData = getSystemData()
getFilesData()
mergeFilesData()
mergeSystemData()
createMergedCsv()