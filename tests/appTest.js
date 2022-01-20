

const assert = require('chai').assert;
const jwt = require("jsonwebtoken");



//utils
const { validEmail } = require("../utils/validEmail")
const { setJWT } = require("../utils/setJWT")
const { validMongooseObjectId } = require("../utils/validMongooseObjectId")
const { getAllIndexes } = require("../utils/getAllIndexes")

const JWT_SECRET = "sample_secret_key_just_for_texting";


describe('App', function () {

    //Test if the validEmail util function works
    it("validEmail util function check 1 for valid email", async function () {
        const result = await validEmail("ashwindev1462001@gmail.com");
        assert.equal(result, true);

    });

    it("validEmail util function check 2 for valid email", async function () {

        const result = await validEmail("ashw19112.cs@rmkec.ac.in");

        assert.equal(result, true)
    });

    it("validEmail util function check 3 for invalid email", async function () {
        const result = await validEmail("ashw19112csrmkec.ac.in");
        assert.equal(result, false)
    });


    //checks if the jwt token is signed
    it("Jwt token signing and decoding check", async function () {
        const sample_id = "a@ ,'b#c";
        const token = await setJWT(sample_id, "sample_secret_key_just_for_texting");


        const decoded = jwt.verify(token, JWT_SECRET);

        assert.equal(sample_id, decoded.id)
    });


    //invalid mongoose object id check
    it("Invalid mongoose id detection", async function () {
        const fake_mongoose_id = "61d8362a3c6dbf89063e1d25abc";
        const result = await validMongooseObjectId(fake_mongoose_id);
        assert.equal(result, false);
    });

    //valid mongoose object id check
    it("valid mongoose id check", async function () {
        const mongoose_id = "61d8362a3c6dbf89063e1d25";
        const result = await validMongooseObjectId(mongoose_id);
        assert.equal(result, true);
    });

    it("find indexes of all val in array check", async function () {
        const myArray = [1, 4, 2, 1, 0, 1, 1, 000, 8, 1]
        const result = await getAllIndexes(myArray, 1);

        const expected_result = [0, 3, 5, 6, 9];

        //function to check if the result array and expected result is same
        async function arrayEquals(a, b) {
            return Array.isArray(a) &&
                Array.isArray(b) &&
                a.length === b.length &&
                a.every((val, index) => val === b[index]);
        }

        const equal = await arrayEquals(result, expected_result);

        assert.equal(equal, true);
    });





})