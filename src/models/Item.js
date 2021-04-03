'use strict';

const {Model} = require('sequelize');

module.exports = class Item extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            id: {
                allowNull: true,
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            name: {
                allowNull: false,
                type: DataTypes.STRING
            },
            description: {
                allowNull: false,
                type: DataTypes.TEXT
            },
            imageUrl: {
                allowNull: false,
                type: DataTypes.STRING
            }
        }, {
            sequelize,
            timestamps: false
        })
    }

    static associate(models) {

    }
}
