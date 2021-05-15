'use strict';
const {Model} = require('sequelize');
const randToken = require('rand-token');
const {
    ACTIVATION_TOKEN_VALIDITY_PERIOD,
    AUTH_TOKEN_SIZE,
    SALT_ROUNDS,
    INCREASED_TOKEN_VALIDITY,
    TOKEN_VALIDITY_PERIOD
} = require('../config/constants.js')
const {TOKEN} = require('../errors/errorsList')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const moment = require('moment');
const {ApolloError} = require('apollo-server');

module.exports = class User extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            id: {
                allowNull: true,
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER
            },
            nickname: {
                allowNull: false,
                type: DataTypes.STRING,
                unique: true
            },
            email: {
                allowNull: false,
                type: DataTypes.STRING,
                validate: {
                    isEmail: true
                }
            },
            passwordHash: {
                type: DataTypes.STRING
            },
            authKey: {
                type: DataTypes.STRING
            },
            resetKey: {
                type: DataTypes.STRING
            },
            status: {
                allowNull: false,
                type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'BANNED')
            },
            banReason: {
                type: DataTypes.STRING
            },
            activationKey: {
                type: DataTypes.STRING
            },
            createdAt: {
                allowNull: false,
                defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
                type: DataTypes.DATE
            },
            updatedAt: {
                allowNull: false,
                defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
                type: DataTypes.DATE
            },
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.hasMany(models.Complaint, {foreignKey: 'userId', as: 'userReport'});
        this.hasMany(models.Complaint, {foreignKey: 'targetId', as: 'userTarget'});
        this.hasMany(models.LUserInRoom, {foreignKey: 'userId'});
        this.hasMany(models.Room, {foreignKey: 'creatorId'});
        this.belongsToMany(models.Room, {through: models.LUserInRoom, foreignKey: 'userId'});
        this.hasMany(models.Message, {foreignKey: 'userId'});
        this.hasMany(models.LUserRole, {foreignKey: 'userId'});
        this.belongsToMany(models.Role, {through: models.LUserRole, foreignKey: 'userId'});
    }

    async isUserHavePermission(necessaryRights, currentUserRights) {
        return currentUserRights.some(currentRight => {
            return necessaryRights.includes(currentRight)
        });
    }

    getPermissionList() {
        const permissions = [];
        this.LUserRoles.forEach(item => {
            if (item.Role && item.Role.LRolePermissions) {
                item.Role.LRolePermissions.forEach(permission => {
                    permissions.push(permission.Permission.name);
                });
            }
        });
        return permissions
    }

    async isUserHaveRole(roleName) {
        await this.sequelize.models.Role.checkRoleForExistence(roleName)
        const role = await this.sequelize.models.LUserRole.findOne({
            where: {
                role: roleName,
                userId: this.id
            }
        });
        return Boolean(role)
    }

    async addRoleForUser(roleName) {
        await this.sequelize.models.Role.checkRoleForExistence(roleName)
        await this.sequelize.models.LUserRole.create({
            role: roleName,
            userId: this.id
        });
    }

    static generateLimitedTimeToken(millisecond = null) {
        return `${randToken.generate(16)}_${Date.now() + (millisecond ? millisecond : ACTIVATION_TOKEN_VALIDITY_PERIOD)}`;
    }

    encodeToken() {
        return jwt.sign({
            authToken: this.authToken,
            exp: moment().add(120, 'days').unix(),
        }, process.env.JWT_SECRET)
    }

    static decodeToken(token) {
        const payload = jwt.decode(token, process.env.JWT_SECRET);
        const now = moment().unix();
        if (now > payload.exp) {
            throw new ApolloError('Expired', TOKEN.EXPIRED.code.toString(), {
                'errors': [TOKEN.EXPIRED]
            })
        }
        return payload.authToken;
    }

    static generateAuthToken() {
        return randToken.generate(AUTH_TOKEN_SIZE);
    }

    generateAccessToken(rememberMe) {
        const payload = {authToken: this.authToken}
        const options = {expiresIn: rememberMe ? TOKEN_VALIDITY_PERIOD : INCREASED_TOKEN_VALIDITY}
        return jwt.sign(payload, process.env.JWT_SECRET, options)
    }

    static async encryptPassword(password) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, SALT_ROUNDS)
                .then(passwordHas => resolve(passwordHas))
                .catch(error => reject(error));
        })
    }

    static async decryptPassword(password, hash) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, hash)
                .then(decryptPassword => resolve(decryptPassword))
                .catch(error => reject(error));
        })
    }
}
