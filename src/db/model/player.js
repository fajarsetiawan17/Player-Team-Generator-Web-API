// ---------------------------------------------------------------------------------------------
// YOU CAN MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// YOU SHOULD NOT CHANGE THE EXPORTED VALUE OF THIS FILE
// YOU SHOULD NOT CHANGE THE DATABASE STRUCTURE, ADDING NEW FIELDS, RENAMING OR REMOVING THE CURRENT FIELDS MAY RESULT IN A FAILED TEST
// ---------------------------------------------------------------------------------------------

import Sequelize from 'sequelize';
import database from '../index';

const Player = database.define('player', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING(200),
    },
    position: {
        type: Sequelize.STRING(200),
    }
}, {
    timestamps: false
})

Player.associate = (models) => {
    models.Player.hasMany(models.PlayerSkill);
}

export default Player;
