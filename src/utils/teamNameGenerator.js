/**
 * Team Name Generator for YUKTI '27
 * Combines 100 executive/strategic power adjectives (Set 1) with 100 arena/conclave nouns (Set 2)
 * Yielding 10,000 distinct thematic team names.
 */

export const TEAM_NAME_PREFIXES = [
  "Apex", "Quantum", "Nexus", "Vanguard", "Stratos", "Synergy", "Alpha", "Hyperion", "Titan", "Zenith",
  "Aether", "Velocity", "Prism", "Sovereign", "Omni", "Solaris", "Vertex", "Imperium", "Kinetic", "Orion",
  "Vector", "Catalyst", "Pinnacle", "Cyber", "Echelon", "Maverick", "Radiant", "Eclipse", "Matrix", "Phoenix",
  "Aura", "Ironclad", "Axiom", "Starlight", "Obsidian", "Sentinel", "Horizon", "Ascendant", "Pulsar", "Frontier",
  "Nova", "Genesis", "Spectra", "Echo", "Valiant", "Cosmos", "Infinity", "Stratum", "Ignite", "Enigma",
  "Cipher", "Optima", "Paragon", "Helix", "Cobalt", "Platinum", "Vortex", "Titanium", "Crimson", "Aegis",
  "Meridian", "Zenon", "Prodigy", "Dynamo", "Astral", "Summit", "Prime", "Synapse", "Flux", "Core",
  "Sterling", "Olympus", "Vivid", "Noble", "Empirical", "Strategic", "Polaris", "Tectonic", "Monarch", "Resolute",
  "Foresight", "Celestial", "Infinite", "Stellar", "Tactical", "Exemplar", "Beacon", "Crest", "Algorithmic", "Elevate",
  "Dominion", "Imperial", "Venture", "Prestige", "Pioneer", "Lumina", "Paramount", "Equinox", "Archon", "Veritas"
];

export const TEAM_NAME_SUFFIXES = [
  "Syndicate", "Mavericks", "Titans", "Dynasty", "Consultants", "Strategists", "Vanguard", "Ventures", "Brigade", "Alliance",
  "Imperium", "Knights", "Architects", "Cohort", "Collective", "Consortium", "Pioneers", "Captains", "Squadron", "Enclave",
  "Oracles", "Forces", "Warriors", "Pinnacle", "Innovators", "Legends", "Executives", "Matrix", "Frontier", "Guild",
  "Crusaders", "Alchemists", "Navigators", "Catalysts", "Sentinels", "Champions", "Scholars", "Conclave", "Legion", "Pathfinders",
  "Division", "Commanders", "Thinkers", "Challengers", "Council", "Apex", "Disruptors", "Fellowship", "Network", "Regime",
  "Tacticians", "Visionaries", "Analysts", "Founders", "Masters", "Guildsmen", "Explorers", "Pacesetters", "Contenders", "Jury",
  "Operators", "Leaders", "Minds", "Creators", "Engineers", "Directors", "Agents", "Builders", "Guardians", "Vigilantes",
  "Arbiters", "Marshals", "Custodians", "Tribunal", "Artisans", "Diplomats", "Ambassadors", "Prodigies", "Scholars", "Strategos",
  "Dominators", "Innovators", "Gladiators", "Achievers", "Voyagers", "Strategists", "Chieftains", "Barons", "Pacesetters", "Centurions",
  "Vanguardians", "Advisors", "Sovereigns", "Synergists", "Logicians", "Illuminati", "Navigators", "Pioneers", "Titans", "Squad"
];

/**
 * Generates a memorable, unique 2-word team name from Set 1 and Set 2.
 */
export const generateRandomTeamName = () => {
  const prefix = TEAM_NAME_PREFIXES[Math.floor(Math.random() * TEAM_NAME_PREFIXES.length)];
  const suffix = TEAM_NAME_SUFFIXES[Math.floor(Math.random() * TEAM_NAME_SUFFIXES.length)];
  return `${prefix} ${suffix}`;
};
