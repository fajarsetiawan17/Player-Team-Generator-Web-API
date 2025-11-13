// ---------------------------------------------------------------------------------------------
// YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// ---------------------------------------------------------------------------------------------

import { getDatabase, validatePlayerPayload, formatPlayer } from './utils';

const { db, Player, PlayerSkill } = getDatabase();

export default async (req, res) => {
  const playerId = Number(req.params.id);

  if (!Number.isInteger(playerId) || playerId <= 0) {
    return res.status(400).json({ error: 'Invalid player id' });
  }

  const { data, errors } = validatePlayerPayload(req.body);

  if (errors) {
    return res.status(400).json({ errors });
  }

  const transaction = await db.transaction();

  try {
    const player = await Player.findByPk(playerId, { transaction });

    if (!player) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Player not found' });
    }

    await player.update(
      {
        name: data.name,
        position: data.position
      },
      { transaction }
    );

    await PlayerSkill.destroy({
      where: { playerId },
      transaction
    });

    if (data.playerSkills.length > 0) {
      const skillsWithPlayer = data.playerSkills.map((skill) => ({
        ...skill,
        playerId
      }));

      await PlayerSkill.bulkCreate(skillsWithPlayer, { transaction });
    }

    await transaction.commit();

    const updatedPlayer = await Player.findByPk(playerId, {
      include: [
        {
          model: PlayerSkill,
          as: 'playerSkills'
        }
      ]
    });

    return res.json(formatPlayer(updatedPlayer));
  } catch (error) {
    await transaction.rollback();
    console.error('Failed to update player', error);
    return res.status(500).json({ error: 'Failed to update player' });
  }
};
