const userModel = require("../models/userModel");
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const saltRounds = 10;

exports.register = async (request, response) => {
    try {
        const existingUser = await userModel.findOne({ username: request.body.username });
        if (existingUser) {
            const output = {
                status: false,
                message: "User with this username already exists"
            };
            return response.send(output);
        }


        const data = {
            fullName: request.body.fullName,
            username: request.body.username,
            password: await bcrypt.hash(request.body.password, saltRounds),
            gender: request.body.gender,
        }

        if (request.file) {
            data.image = request.file.filename;
        }



        const user = new userModel(data);
        const result = await user.save();

        const output = {
            status: true,
            message: "User created successfully",
            data: result
        }
        response.send(output);

    } catch (error) {
        const output = {
            status: false,
            message: error.message
        }
        response.status(500).send(output);
    }
}

exports.login = async (request, response) => {
    try {
        const existingUser = await userModel.findOne({ username: request.body.username });

        if (!existingUser) {
            const output = {
                status: false,
                message: "Invalid username",
                data: null,
            }
            response.send(output);
            return;
        }

        if (await bcrypt.compare(request.body.password, existingUser.password)) {
            var token = jwt.sign({ userData: existingUser }, process.env.KEY_VALUE);

            const output = {
                status: true,
                message: "Login successful",
                token: token,
                data: existingUser,
            }
            response.send(output);

        } else {
            const output = {
                status: false,
                message: "Invalid password",
                data: null,
            }
            response.send(output);
        }

    }
    catch (error) {
        const output = {
            status: false,
            message: error.message
        }
        response.send(output);
    }
}


exports.ViewAll = async (request, response) => {
    try {
        // Get token from request headers
        const token = request.headers.authorization?.split(' ')[1];

        if (!token) {
            return response.status(401).send({
                _status: false,
                _message: 'Please login first',
                _data: null
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.KEY_VALUE);

        // Get logged-in user's ID from your existing token
        const loggedInUserId = decoded.userData._id;

        // Fetch all users except logged-in user
        const result = await userModel.find({
            _id: { $ne: loggedInUserId }
        }).select('-password');

        return response.send({
            _status: true,
            _message: 'Other users fetched successfully',
            _user_image_path: process.env.user_setting_image_path,
            _data: result
        });

    } catch (error) {
        return response.status(401).send({
            _status: false,
            _message: 'Invalid token or something went wrong',
            _data: null
        });
    }
};


exports.ViewProfile = async (request, response) => {

    var token=request.headers.authorization;
    
    if(!token){ 
        const output = {
            _status: false,
            _message: "Token is required",
            _data: null,
        }
        response.send(output);
        return;
    }

    token=token.split(" ")[1];

    try{
        var decoded=jwt.verify(token,process.env.KEY_VALUE);

        var userData=await userModel.findOne({_id:decoded.userData._id});
          
        if(!userData){
            const output = {
                _status: false,
                _message: "user not found",
                _data: null,
            }
            response.send(output);
            return;
        }else{
            const output = {
                _status: true,
                _message: "User profile fetched successfully",
                _user_image_path: process.env.user_setting_image_path,
                _data: userData,
            }
            response.send(output);
        }


    }catch(error){
         const output = {
            _status: false,
            _message: "Something went wrong",
            _error: error.message,
            _data: null,
        }
        response.send(output);
    }

}
