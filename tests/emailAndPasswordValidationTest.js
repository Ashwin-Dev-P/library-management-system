const assert = require('chai').assert;

const { emailAndPasswordValidity } = require("../utils/emailAndPasswordValidity")



describe('Email and password validation util function', function () {

    it("Invalid email detection 1 in emailAndPasswordValidaty function", async function () {

        const email = ""
        const password = "mypassword";

        const result = await emailAndPasswordValidity(email, password);
        const expected_result = { status: 400, message: 'Please enter an email id' }

        assert.equal(result.message, expected_result.message);
    });

    it("Invalid email detection 2 in emailAndPasswordValidaty function", async function () {

        const email = "         "
        const password = "mypassword";

        const result = await emailAndPasswordValidity(email, password);
        const expected_result = { status: 400, message: 'Please enter an email id' }

        assert.equal(result.message, expected_result.message);
    });


    it("Invalid email detection 3 in emailAndPasswordValidaty function", async function () {

        const email = "ashwindev1462001gmail.com"
        const password = "mypassword";

        const result = await emailAndPasswordValidity(email, password);
        const expected_result = { status: 400, message: 'Please enter a valid email id' }

        assert.equal(result.message, expected_result.message);
    });




    it("Invalid password detection 1 in emailAndPasswordValidaty function", async function () {

        const email = "ashwindev1462001@gmail.com"
        const password = "";

        const result = await emailAndPasswordValidity(email, password);
        const expected_result = { status: 400, message: 'Please enter a password' }

        assert.equal(result.message, expected_result.message);
    });

    it("Invalid password detection 2 in emailAndPasswordValidaty function", async function () {

        const email = "ashwindev1462001@gmail.com"
        const password = "    ";

        const result = await emailAndPasswordValidity(email, password);
        const expected_result = { status: 400, message: 'Please enter a password' }

        assert.equal(result.message, expected_result.message);
    });


    it("Valid email check in emailAndPasswordValidaty function", async function () {

        const email = "ashwindev1462001@gmail.com"
        const password = "mypassword";

        const result = await emailAndPasswordValidity(email, password);
        const expected_result = true;

        assert.equal(result, expected_result);
    });

})