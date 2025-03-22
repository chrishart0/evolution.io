# Evolution .io Game Design Plan

## Overview
- **Genre**: Multiplayer browser .io-style game
- **Round Length**: 15 minutes
- **Core Mechanic**: Players control a race of creatures by purchasing genetic trait upgrades with experience earned during the round.
- **Objective**: Be the last race standing or achieve a win condition (see Win Conditions below).

## Gameplay
- **Starting State**: Each player begins with a small population of creatures with baseline stats:
  - Reproduction Rate: 1 creature every 30 seconds
  - Movement Speed: Moderate
  - Growth Speed: Slow
  - Nimbleness: Moderate
- **Player Role**: Players do not directly control individual creatures. Instead, they invest experience points to upgrade their race’s traits, shaping its evolution.
- **Experience**: Gained over time at a fixed rate (e.g., 1 XP per second) and boosted by collecting food pellets or eating other creatures.
- **Map**: A single, open map with:
  - **Food Pellets**: Scattered neutral resources that creatures automatically collect when moving over them, granting XP to the player.

## Traits (v1)
Players spend XP to upgrade these traits, tailoring their race:
- **Movement Speed**: Faster creatures collect food pellets more efficiently and pursue or escape others.
- **Max Size**: Larger creatures can eat smaller ones but may struggle to sustain themselves on pellets alone.
- **Size Growth Rate**: Faster growth gives an early edge in size-based eating.
- **Reproduction Rate**: Higher rate means more creatures, increasing resilience and pellet collection but diluting individual strength.
- **Nimbleness**: Determines how quickly a creature can turn its orientation (e.g., pivot speed). Higher movement speed reduces turning speed, making fast creatures less agile.

*Note*: Upgrades may have caps (e.g., 5 levels per trait) or increasing costs to encourage balanced strategies.

## Eating/Combat Mechanic
- **Resolution**: A creature can eat another if it is at least 50% larger *and* makes contact (based on movement speed and nimbleness). No random chance—outcomes depend on positioning and maneuverability.
- **Pause Penalty**: After eating another creature, the eater pauses for 1 second (simulating digestion), making it vulnerable.
- **Food Pellet Advantage**: Small, fast, nimble races can survive on pellets and outmaneuver larger predators, while big races rely on eating others to sustain growth.
- **Swarm Mechanic**: Excluded for v1 to keep it simple (may revisit later).

## Creatures
- **Player-Controlled Races**: Players invest XP to evolve their race, which operates autonomously based on its traits.
- **AI-Controlled Races**: Randomly generated races with traits chosen at the start of the round. They compete alongside players, adding chaos and variety.

## Win Conditions
1. **Timer Runs Out (15 minutes)**: If no race achieves dominance, the most "alpha" predator wins, determined by the highest rolling ratio of kills / times eaten over the last 60 seconds.
2. **Population Dominance**: If any race (player or AI) reaches 50% of the total creature population on the map, they win immediately, ending the round.

## Psychology & Engagement
- **Progression Feedback**: Visual cues (e.g., creatures growing, speeding up, turning sharper, or spawning more) reinforce upgrade impact.
- **Risk vs. Reward**: Eating other creatures grants bonus XP but risks the 1-second pause.
- **Replayability**: Short rounds, random AI races, and varied trait strategies (with nimbleness and alpha dynamics) keep games fresh.

## Open Questions
1. **Eating System**: Is the 50% size + movement/nimbleness contact mechanic intuitive enough for players?
2. **Alpha Metric Balance**: Does the kills / times eaten ratio over 60 seconds reward aggression fairly, or should the window be adjusted (e.g., 30s or 90s)?
3. **Nimbleness Balance**: Is the speed-nimbleness trade-off (faster speed = slower turns) clear and impactful enough?
```

## Feature checklist

```markdown
# Feature Checklist for Evolution .io Game (v1)

## 1. Core Systems
### 1.1 Game Setup
- [ ] Create a 2D game map of 1000x1000 pixels.
- [ ] Initialize game state with a timestamp at 0 seconds.
- [ ] Support up to 6 races (3 players + 3 AI) in a single round.

### 1.2 Timer
- [ ] Implement a 15-minute (900-second) countdown timer.
- [ ] Update timer every second, starting at 15:00 down to 0:00.
- [ ] Store current game time for win condition checks.

### 1.3 Experience System
- [ ] Assign each player/race an XP integer, initialized at 0.
- [ ] Increment XP by 1 every second for each player/race.
- [ ] Ensure XP gain continues even if a race has no creatures.

## 2. Creatures
### 2.1 Spawning
- [ ] Spawn 5 creatures per player at game start.
- [ ] Place player creatures in a 200x200 pixel area centered at (500, 500), random x,y within bounds.
- [ ] Assign unique colors to each player’s creatures (e.g., red, blue, green).
- [ ] Spawn 5 creatures per AI race at random non-overlapping 200x200 areas on the map.
- [ ] Assign unique colors to AI races (e.g., purple, yellow, orange).

### 2.2 Base Stats
- [ ] Set creature starting stats:
  - Reproduction Rate: 0.033 spawns/sec (1 every 30s).
  - Movement Speed: 50 pixels/sec.
  - Growth Speed: +10 pixels diameter every 10 seconds.
  - Nimbleness: 90 degrees/sec turning speed.
  - Size: 20 pixels diameter.
- [ ] Represent creatures as circles with their diameter as size.

### 2.3 Movement
- [ ] Move creatures at their Movement Speed in a straight line.
- [ ] Every 2 seconds, pick a new random direction (0-360°) and turn toward it at Nimbleness speed.
- [ ] Update position every 0.1 seconds based on speed and direction.
- [ ] Bounce creatures off map edges (0,0 and 1000,1000) by reversing direction.

### 2.4 Growth
- [ ] Increase creature size by Growth Speed amount every 10 seconds.
- [ ] Cap size at Max Size level (default 20 pixels until upgraded).

### 2.5 Reproduction
- [ ] Track a spawn timer per race, reset to 0 after each spawn.
- [ ] When timer reaches 1/Reproduction Rate seconds (e.g., 30s), spawn 1 new creature.
- [ ] Place new creature within 50 pixels of a random existing creature of the same race.
- [ ] Apply current trait levels to new creatures.

## 3. Traits and Upgrades
### 3.1 Trait Levels
- [ ] Initialize all traits at level 1 for each race.
- [ ] Cap traits at level 5.
- [ ] Define trait effects per level:
  - Movement Speed: 50, 75, 100, 125, 150 pixels/sec.
  - Max Size: 20, 40, 60, 80, 100 pixels diameter.
  - Growth Speed: 10, 15, 20, 25, 30 pixels/10s.
  - Reproduction Rate: 0.033, 0.04, 0.05, 0.067, 0.1 spawns/sec (30s, 25s, 20s, 15s, 10s).
  - Nimbleness: 90, 135, 180, 225, 270 degrees/sec.

### 3.2 Upgrade Costs
- [ ] Set XP costs: Level 2 = 10, Level 3 = 20, Level 4 = 30, Level 5 = 40.
- [ ] Deduct XP from player’s total when upgrading.
- [ ] Prevent upgrades if XP < cost or level = 5.

### 3.3 Nimbleness Penalty
- [ ] Calculate effective turning speed: Base Nimbleness * (1 - 0.1 * (Speed Level - 1)).
- [ ] Apply penalty only if Speed Level > 1 (e.g., Speed L3 = 20% reduction).
- [ ] Update turning speed instantly when Speed or Nimbleness changes.

## 4. Eating/Combat
### 4.1 Collision Detection
- [ ] Check every 0.1s if any two creatures’ edges overlap (distance between centers < sum of radii).
- [ ] Ignore collisions between creatures of the same race.

### 4.2 Eating Logic
- [ ] If Creature A’s diameter >= 1.5 * Creature B’s diameter, A eats B.
- [ ] Remove Creature B from the map.
- [ ] Add 10 XP to Creature A’s player/race.
- [ ] Pause Creature A (speed = 0) for 1 second, then resume normal speed.

### 4.3 Post-Eating Pause
- [ ] Track a 1-second timer for each creature after eating.
- [ ] Disable movement and turning during pause.
- [ ] Resume movement in last direction after 1 second.

## 5. Food Pellets
### 5.1 Spawning
- [ ] Spawn 100 pellets at random x,y (0-1000, 0-1000) at game start.
- [ ] Represent pellets as green circles, 10 pixels diameter.
- [ ] Spawn 1 new pellet every 5 seconds at a random position.

### 5.2 Collection
- [ ] Check every 0.1s if a creature’s center is within 15 pixels of a pellet’s center.
- [ ] On contact, remove pellet and add 5 XP to the creature’s player/race.
- [ ] Update XP total immediately.

## 6. AI Races
### 6.1 Initialization
- [ ] Create 3 AI races at game start.
- [ ] Randomly assign levels 1-5 to each trait per AI race (e.g., Speed 2, Size 4).
- [ ] Store AI trait levels and apply to their creatures.

### 6.2 Behavior
- [ ] AI creatures follow same movement, eating, and spawning rules as players.
- [ ] Track AI XP but do not spend it on upgrades.

## 7. Win Conditions
### 7.1 Timer Win (Alpha Metric)
- [ ] At 900 seconds (0:00), calculate alpha score for each race.
- [ ] Track kills (eats) and times eaten per race in a 60-second rolling window.
- [ ] Store events with timestamps (e.g., {race: "red", type: "kill", time: 120.5}).
- [ ] Alpha = kills / (times eaten + 1), using only events from last 60s.
- [ ] Declare race with highest alpha as winner.

### 7.2 Population Win
- [ ] Count total creatures across all races every second.
- [ ] Calculate each race’s population percentage: (race count / total) * 100.
- [ ] If any race >= 50%, end game and declare that race winner.

## 8. User Interface
### 8.1 Game Display
- [ ] Render map as a 1000x1000 pixel canvas.
- [ ] Draw creatures as colored circles with current size.
- [ ] Draw pellets as green 10px circles.

### 8.2 Player Stats
- [ ] Show XP in top-left corner (e.g., "XP: 0"), updated every second.
- [ ] Show timer in top-right corner (e.g., "15:00"), updated every second.

### 8.3 Upgrade Panel
- [ ] Display panel at bottom of screen with 5 buttons: "Speed", "Size", "Growth", "Repro", "Nimble".
- [ ] Show current level and cost next to each button (e.g., "Speed: 1 - 10 XP").
- [ ] Enable button if XP >= cost and level < 5; disable otherwise.

### 8.4 Win Screen
- [ ] On game end, show centered text: “Winner: [color] - [reason]” (e.g., “Winner: Red - Alpha”).
- [ ] Display for 5 seconds before resetting game.

## 9. Visual Feedback
### 9.1 Trait Indicators
- [ ] Size: Render diameter as 20 + (level-1) * 20 pixels.
- [ ] Speed: Add 5px trail * level (5, 10, 15, 20, 25), same color as creature.
- [ ] Growth: Increase size visibly every 10s by Growth level * 5.
- [ ] Repro: Show 5px flash at spawn point on new creature birth.
- [ ] Nimble: If level 1-2, add 5px drift on turns; if 4-5, snap turns sharply.

### 9.2 Eating Feedback
- [ ] Flash eater’s color briefly (0.2s) on successful eat.
- [ ] Show paused creature with a slight fade (50% opacity) for 1 second.
