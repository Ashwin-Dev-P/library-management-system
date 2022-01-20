const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const { validMongooseObjectId } = require("./validMongooseObjectId")
module.exports =
    async function jwtLoginAuthentication(jwt_token) {


        var result;
        if (!jwt_token) {
            result = {
                status: 400,
                message: "Jwt not found",
            }



        } else {
            try {
                var decoded = await jwt.verify(jwt_token, JWT_SECRET);
            } catch {
                result = {
                    status: 400,
                    message: "Jwt expired",
                }
                return result;
            }

            const decoded_id = decoded.id;
            if (!decoded_id || (! await validMongooseObjectId(decoded_id))) {
                result = {
                    status: 400,
                    message: "invalid jwt",
                }
                return result;
            }

            result = {
                status: 200,
                message: "Valid jwt",
                _id: decoded_id,
            }

        }
        return result;
    };