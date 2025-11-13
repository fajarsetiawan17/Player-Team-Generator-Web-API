// ---------------------------------------------------------------------------------------------
// YOU CAN MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// YOU SHOULD NOT CHANGE THE EXPORTED VALUE OF THIS FILE
// YOU SHOULD NOT CHANGE THE DATABASE STRUCTURE, ADDING NEW FIELDS, RENAMING OR REMOVING THE CURRENT FIELDS MAY RESULT IN A FAILED TEST
// ---------------------------------------------------------------------------------------------

import Sequelize from 'sequelize';
import database from '../index';

const PlayerSkill = database.define('playerSkill', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    skill: {
        type: Sequelize.STRING(200),
    },
    value: {
        type: Sequelize.INTEGER
    }
}, {
    timestamps: false
})

PlayerSkill.associate = (models) => {
    models.PlayerSkill.belongsTo(models.Player);
}

export default PlayerSkill;