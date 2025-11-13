// ---------------------------------------------------------------------------------------------
// YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// ---------------------------------------------------------------------------------------------

export default async (req, res) => {
  res.sendStatus(500);
}
// ---------------------------------------------------------------------------------------------
// YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// ---------------------------------------------------------------------------------------------

import { getDatabase } from './utils';

const { db, Player, PlayerSkill } = getDatabase();

export default async (req, res) => {
  const playerId = Number(req.params.id);

  if (!Number.isInteger(playerId) || playerId <= 0) {
    return res.status(400).json({ error: 'Invalid player id' });
  }

  const transaction = await db.transaction();

  try {
    const player = await Player.findByPk(playerId, { transaction });

    if (!player) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Player not found' });
    }

    await PlayerSkill.destroy({
      where: { playerId },
      transaction
    });

    await player.destroy({ transaction });

    await transaction.commit();

    return res.sendStatus(204);
  } catch (error) {
    await transaction.rollback();
    console.error('Failed to delete player', error);
    return res.status(500).json({ error: 'Failed to delete player' });
  }
};
