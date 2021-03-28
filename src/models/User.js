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
            role: {
                allowNull: false,
                type: DataTypes.STRING,
                references: {
                    model: 'Roles'
                },
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
        this.belongsTo(models.Role, {foreignKey: 'role'});
        this.hasMany(models.Complaint, {foreignKey: 'userId', as: 'userReport'});
        this.hasMany(models.Complaint, {foreignKey: 'targetId', as: 'userTarget'});
        this.hasMany(models.LUserInRoom, {foreignKey: 'userId'});
        this.hasMany(models.Room, {foreignKey: 'creatorId'});
        this.belongsToMany(models.Room, {through: models.LUserInRoom, foreignKey: 'userId'});
        this.hasMany(models.Message, {foreignKey: 'userId'});
    }

    static checkTokenForExpirationDate(token) {
        if (!token) {
            throw new ApolloError('Token is required', '400');
        }

        const partsOfTheToken = token.split('_');
        if (partsOfTheToken.length < 2) {
            throw new ApolloError('Invalid token', '400');
        }

        if (new Date() > new Date(Number(partsOfTheToken[1]))) {
            throw new ApolloError('Token expired', '401');
        }
        return token;
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
