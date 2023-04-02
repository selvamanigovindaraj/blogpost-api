/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */

// Require necessary packages
const { faker } = require('@faker-js/faker');
const fs = require("fs");
const { stringify } = require("csv-stringify");

// Define file paths
const filename = "data-generator/data/post.data.csv";
const emptyFile = "data-generator/data/post.empty.csv"
const expiredTokenFile = "data-generator/data/post.expired-token.csv"
const invalidAccesTokenFile = "data-generator/data/post.invalid-access-token.csv"
const invalidDataFile = "data-generator/data/post.invalid-data.csv"
const validDataFile = "data-generator/data/post.valid-data.csv"

// Create write streams for each file
const writableStream = fs.createWriteStream(filename);
const emptyWritableStream = fs.createWriteStream(emptyFile);
const expiredWritableStream = fs.createWriteStream(expiredTokenFile);
const invalidAccesTokenWritableStream = fs.createWriteStream(invalidAccesTokenFile);
const invalidDataWritableStream = fs.createWriteStream(invalidDataFile);
const validDataWritableStream = fs.createWriteStream(validDataFile);

// Define JWT secret keys
const SECRET = 'secret';
const WRONGSECRET = 'wrongsecret'
var jwt = require('jsonwebtoken');

// Define columns for the CSV file
const columns = [
  "userId",
  "title",
  "description",
  "accessToken",
  "requestType"
];

// Create stringifiers for each file
const stringifier = stringify({ header: true, columns: columns });
const emptystringifier = stringify({ header: true, columns: columns });
const expiredstringifier = stringify({ header: true, columns: columns });
const invalidAccesTokenstringifier = stringify({ header: true, columns: columns });
const invalidDatastringifier = stringify({ header: true, columns: columns });
const validDatastringifier = stringify({ header: true, columns: columns });

// Loop through 10000 times and create data for each file
for (let index = 0; index <150; index++) {
    let postData = {}
     if (index % 100000 === 0){
        createExpiredAccessTokenData(postData)
        expiredstringifier.write(postData)
    }else if (index%50 ===0){
        createEmptyData(postData)
        emptystringifier.write(postData)
    }else if(index%25 ===0){
        createInvalidDataFormatData(postData)
        invalidDatastringifier.write(postData)
    }else if (index%90 ===0){
        createInvalidAccessTokenData(postData)
        invalidAccesTokenstringifier.write(postData)
    }else{
        createValidData(postData)
        validDatastringifier.write(postData)
    }
    stringifier.write(postData);  
}

// Function to create valid data
function createValidData(postData){
    postData['title'] = faker.lorem.words(5);
    postData['description']= faker.lorem.words(30);
    postData['_id'] = faker.database.mongodbObjectId()
    postData['userId'] = faker.mersenne.rand(1000000, 1001000)
    postData['requestType'] = 'validdata'
    postData['accessToken'] = jwt.sign({sub:postData['userId']  } ,SECRET , {expiresIn:'7d'})
}
// Function to empty  data
function createEmptyData(postData) {
    postData['title'] = null;
    postData['description']= null;
    postData['_id'] = faker.database.mongodbObjectId()
    postData['userId'] = null;
    postData['requestType'] = 'emptydata'
    postData['accessToken'] = jwt.sign({sub:postData['userId']  } ,SECRET , {expiresIn:'7d'})
}
// Function to create invalid data
function createInvalidDataFormatData(postData){
    postData['title'] = faker.datatype.number(10)
    postData['description']= faker.lorem.words(30);
    postData['_id'] = faker.database.mongodbObjectId()
    postData['userId'] = faker.mersenne.rand(1000000, 1001000)
    postData['requestType'] = 'invaliddata'
    postData['accessToken'] = jwt.sign({sub:postData['userId']  } ,SECRET , {expiresIn:'7d'})
}
// Function to create invalid access token data
function createInvalidAccessTokenData(postData) {
    postData['title'] = faker.lorem.words(5);
    postData['description']= faker.lorem.words(30);
    postData['_id'] = faker.database.mongodbObjectId()
    postData['userId'] = faker.mersenne.rand(1000000, 1001000)
    postData['requestType'] = 'invalidaccessToken'
    postData['accessToken'] = jwt.sign({sub:postData['userId']  } ,WRONGSECRET , {expiresIn:'7d'})
}
// Function to create expired access token data
function createExpiredAccessTokenData(postData) {
    postData['title'] = faker.lorem.words(5);
    postData['description']= faker.lorem.words(30);
    postData['_id'] = faker.database.mongodbObjectId()
    postData['userId'] = faker.mersenne.rand(1000000, 1001000)
    postData['requestType'] = 'expiredaccessToken'
    postData['accessToken'] = jwt.sign({sub:postData['userId']  } ,SECRET , {expiresIn:'60s'})
}

// pipe the stringifier to a writable stream
stringifier.pipe(writableStream);
emptystringifier.pipe(emptyWritableStream);
expiredstringifier.pipe(expiredWritableStream);
invalidAccesTokenstringifier.pipe(invalidAccesTokenWritableStream);
invalidDatastringifier.pipe(invalidDataWritableStream);
validDatastringifier.pipe(validDataWritableStream);

console.log("Finished writing data");