let userModel = require('../schemas/users')
module.exports = {
    CreateAnUser: async function (
        username, password, email, role, fullname, avatarUrl, status, loginCount) {
        let newUser = new userModel({
            username: username,
            password: password,
            email: email,
            fullName: fullname,
            avatarUrl: avatarUrl,
            status: status,
            role: role,
            loginCount: loginCount
        });
        await newUser.save();
        return newUser;
    },
    FindUserByUsername: async function (username) {
        return await userModel.findOne({
            username: username,
            isDeleted: false
        })
    },
    FindUserById: async function (id) {
        try {
            return await userModel.findOne({
                _id: id,
                isDeleted: false
            })
        } catch (error) {
            return false
        }
    },
    ChangePassword: async function (userId, oldPassword, newPassword) {
        let user = await this.FindUserById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        let bcrypt = require('bcrypt');
        if (!bcrypt.compareSync(oldPassword, user.password)) {
            throw new Error("Old password is incorrect");
        }
        user.password = newPassword;
        await user.save();
        return { message: "Password changed successfully" };
    }
}