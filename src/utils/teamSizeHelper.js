/**
 * Helper to determine required team size constraints from event dataset
 * Handles formats like:
 * - "Individual" -> min: 1, max: 1
 * - "2 Members" -> min: 2, max: 2
 * - "2 - 3 Members" -> min: 2, max: 3
 * - "2 - 4 Members" -> min: 2, max: 4
 * - "Band Ensemble (5 - 8 musicians...)" -> min: 5, max: 8
 * - "Group Performance (6 - 12 dancers...)" -> min: 6, max: 12
 */
export const getTeamSizeRange = (event) => {
  if (!event) return { min: 1, max: 1, isTeam: false }

  const str = `${event.teamSize || ''} ${event.format || ''}`.toLowerCase()

  if (str.includes('individual') || str.includes('solo')) {
    return { min: 1, max: 1, isTeam: false, label: 'Individual Contender (1 Participant)' }
  }

  // Check for range like "2 - 3" or "5 - 8"
  const rangeMatch = str.match(/(\d+)\s*[-–to]+\s*(\d+)/)
  if (rangeMatch) {
    const min = parseInt(rangeMatch[1], 10)
    const max = parseInt(rangeMatch[2], 10)
    return { min, max, isTeam: true, label: `${min} to ${max} Members Required` }
  }

  // Check for single number like "2 members" or "4 members"
  const singleMatch = str.match(/(\d+)\s*(?:members?|players?|performers?)/)
  if (singleMatch) {
    const num = parseInt(singleMatch[1], 10)
    return { min: num, max: num, isTeam: num > 1, label: `${num} Members Required` }
  }

  return { min: 1, max: 4, isTeam: true, label: 'Team Entry' }
}
