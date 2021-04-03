'use strict';

const {Model} = require('sequelize');

module.exports = class LUserRole extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            role: {
                allowNull: true,
                primaryKey: true,
                type: DataTypes.STRING,
                references: {
                    model: 'Roles'
                },
                onDelete: 'CASCADE'
            },
            userId: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.INTEGER,
                references: {
                    model: 'Users'
                },
                onDelete: 'CASCADE'
            }
        }, {
            sequelize,
            timestamps: false
        })
    }

    static associate(models) {
        this.belongsTo(models.Role, {foreignKey: 'role'});
        this.belongsTo(models.User, {foreignKey: 'userId'});
    }
}
