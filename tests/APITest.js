
const chai = require('chai');
const chaiHttp = require("chai-http");
chai.use(chaiHttp)
const should = chai.should();
const index = require("../index")

const expect = chai.expect;

describe("API testing", () => {


    //get books
    it("get /book request", (done) => {
        chai.request(index).get("/api/book/limit/10/skip/10").end((err, response) => {

            if (err) {
                done();
            }

            //response body check
            should.exist(response.body);
            response.body.should.be.a('Object')

            //status check
            should.exist(response.body.status)
            response.body.should.have.status(200)



            //data check
            should.exist(response.body.data)
            response.body.data.should.be.a('array')

            //Check only if data length is less than or equal to 10
            response.body.data.should.have.lengthOf.below(11)


            done();
        })
    });


    //Other get requests

    it("get book details of a particular book", (done) => {
        const book_id = '61d8362a3c6dbf89063e1d25'
        chai.request(index).get(`/api/book/id/${book_id}`).end((err, response) => {

            if (err) {
                done();
            }

            //response body check
            should.exist(response.body);
            response.body.should.be.a('Object')

            //status check
            should.exist(response.body.status)
            response.body.should.have.status(200)



            //data check
            should.exist(response.body.data)
            response.body.data.should.be.a('Object')

            //Check only if data length is less than or equal to 10
            //response.body.data.should.have.
            expect(response.body.data).to.have.a.property('name')


            done();
        })
    })



    //Post requests goes here


    //delete request goes here
})