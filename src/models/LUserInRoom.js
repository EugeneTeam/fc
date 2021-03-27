'use strict';

const {Model} = require('sequelize');

module.exports = class LUserInRoom extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            roleId: {
                allowNull: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            userId: {
                allowNull: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            roomId: {
                allowNull: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
        }, {
            sequelize,
            timestamps: false
        })
    }

    static associate(models) {
        this.belongsTo(models.Role, {foreignKey: 'roleId'});
        this.belongsTo(models.User, {foreignKey: 'userId'});
        this.belongsTo(models.Room, {foreignKey: 'roomId'});
    }
}
