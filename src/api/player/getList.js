// ---------------------------------------------------------------------------------------------
// YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO COMPLETE THE TASK
// ---------------------------------------------------------------------------------------------

import {
  fetchPlayersWithSkills,
  formatPlayer,
  normalizeLower
} from './utils';

export default async (req, res) => {
  try {
    const players = await fetchPlayersWithSkills();

    const nameQuery = normalizeLower(req.query && req.query.name);
    const positionQuery = normalizeLower(req.query && req.query.position);
    const skillQuery = normalizeLower(req.query && req.query.skill);

    const filteredPlayers = players
      .filter((player) => {
        const playerName = normalizeLower(player.name);
        const playerPosition = normalizeLower(player.position);

        if (nameQuery && !playerName.includes(nameQuery)) {
          return false;
        }

        if (positionQuery && playerPosition !== positionQuery) {
          return false;
        }

        if (skillQuery) {
          const hasSkill = Array.isArray(player.playerSkills)
            && player.playerSkills.some((skill) => normalizeLower(skill.skill) === skillQuery);

          if (!hasSkill) {
            return false;
          }
        }

        return true;
      })
      .map((player) => {
        const plainPlayer = formatPlayer(player);

        if (plainPlayer && plainPlayer.playerSkills) {
          plainPlayer.playerSkills = plainPlayer.playerSkills.sort((a, b) => a.skill.localeCompare(b.skill));
        }

        return plainPlayer;
      });

    return res.json(filteredPlayers);
  } catch (error) {
    console.error('Failed to list players', error);
    return res.status(500).json({ error: 'Failed to list players' });
  }
};
