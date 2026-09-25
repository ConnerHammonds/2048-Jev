# Jev Plays 2048

> **Project Type:** Portfolio / LLM Agent / Game AI  
> **Status:** Planned  
> **Primary Goal:** Build practical experience integrating a modern programmatic LLM into a real software system while creating a polished, interactive portfolio project.

---

## 1. Project Overview

**Jev Plays 2048** is a web application that allows a programmatic LLM agent, Jev, to play the game **2048**.

The project will use an existing/open-source implementation of 2048 rather than building the game itself from scratch. The primary engineering work will be building the interface between the game and Jev, creating a simulation environment for evaluating Jev's performance, and eventually allowing a human to compete directly against Jev.

The finished application will provide three primary experiences:

1. **Watch Jev Play** — Watch Jev play a live game of 2048.
    
2. **Benchmark / Simulation** — Run large numbers of games to evaluate Jev's performance.
    
3. **Faceoff** — Play 2048 against Jev using a controlled game environment.
    

The project should be designed so that the **same game engine** powers the interactive game, Jev's gameplay, and automated simulations.

### Core Architecture

```text
                    ┌──────────────────┐
                    │   2048 Engine    │
                    │                  │
                    │ Board             │
                    │ Movement          │
                    │ Merging           │
                    │ Tile spawning     │
                    │ Scoring           │
                    │ Game over        │
                    └────────┬─────────┘
                             │
               ┌─────────────┼─────────────┐
               │             │             │
               ▼             ▼             ▼
          Human Player      Jev         Simulator
               │             │             │
               ▼             ▼             ▼
             Web UI      Jev API       Headless Games
```

This separation is important because it allows the project to evolve without coupling the LLM directly to the browser.

---

# 2. Goals

## Primary Goals

- Gain practical experience integrating a modern programmatic LLM into an application.
    
- Build a non-trivial system rather than a simple LLM wrapper.
    
- Give Jev access to structured game state and have it produce valid game actions.
    
- Evaluate Jev objectively through repeated simulations.
    
- Deploy the project publicly.
    
- Create an interactive demo that recruiters can use.
    
- Produce a short video demonstrating Jev playing the game.
    
- Build an architecture that demonstrates software engineering fundamentals.
    

## Secondary Goals

- Learn how to design interfaces between an LLM and deterministic software.
    
- Experiment with prompt design and structured outputs.
    
- Learn about agent reliability and error handling.
    
- Learn how to benchmark stochastic systems.
    
- Explore deterministic simulations and reproducible experiments.
    
- Gain experience deploying an application that requires a backend API.
    

## Non-Goals

The project is **not** intended to:

- Build a 2048 game engine from scratch solely for the sake of recreating 2048.
    
- Create a state-of-the-art 2048 solver.
    
- Develop a sophisticated reinforcement-learning system.
    
- Build a general-purpose autonomous agent framework.
    
- Create a large SaaS application.
    
- Optimize every aspect of the application for production scale.
    

The focus is on **LLM integration, system design, experimentation, and deployment**.

---

# 3. Product Definition

## 3.1 Watch Jev Play

The user can start a game and watch Jev play 2048.

The interface should display:

- 2048 board
    
- Current score
    
- Highest tile
    
- Current game status
    
- Jev's selected move
    
- Move history
    
- Ability to start/restart a game
    
- Adjustable game speed
    

Example:

```text
┌─────────────────────────────┐
│          JE V PLAYS         │
│                             │
│     ┌───┬───┬───┬───┐       │
│     │ 2 │   │ 4 │   │       │
│     ├───┼───┼───┼───┤       │
│     │   │ 8 │   │   │       │
│     ├───┼───┼───┼───┤       │
│     │   │   │16 │   │       │
│     ├───┼───┼───┼───┤       │
│     │   │   │   │ 2 │       │
│     └───┴───┴───┴───┘       │
│                             │
│ Score: 1,248                │
│ Highest Tile: 64            │
│                             │
│ Jev chose: LEFT             │
│                             │
│ [ Start Game ]              │
└─────────────────────────────┘
```

The purpose is to make Jev's behavior immediately visible to someone visiting the project.

---

# 4. Simulation / Benchmarking

Simulation is a core component of the project.

Rather than relying on one impressive-looking game, the system should allow Jev to play thousands of games automatically.

## Metrics

The simulator should record at minimum:

- Number of games
    
- Win rate
    
- Average score
    
- Median score
    
- Highest tile reached
    
- Average highest tile
    
- Number of moves
    
- Game duration
    
- Invalid actions, if any
    

Example benchmark output:

```text
Jev 2048 Benchmark
────────────────────────────

Games:             10,000

Win Rate:           18.7%
Average Score:      7,842
Median Score:       6,920
Average Max Tile:   512
Max Tile:           2048

Invalid Moves:      0.3%
```

The actual results should **not** be predetermined. They should come from the simulation.

## Baselines

Jev should eventually be compared against one or more simple baseline agents.

Possible baselines:

- Random agent
    
- Simple heuristic agent
    
- Greedy agent
    
- Existing 2048 strategy/algorithm
    

This allows the project to answer a more meaningful question:

> How does Jev perform compared with deterministic strategies?

rather than simply:

> Can Jev occasionally win 2048?

---

# 5. Faceoff Mode

Faceoff mode is a later feature and **not part of the MVP**.

The user plays against Jev.

The interface will contain two boards:

```text
┌───────────────────┐     ┌───────────────────┐
│       YOU         │     │        JEV        │
│                   │     │                   │
│  2   4   8   2    │     │  2   4   8   2    │
│                   │     │                   │
│      ...          │     │      ...          │
│                   │     │                   │
│ Score: 4,210      │     │ Score: 3,870      │
│ Best: 512         │     │ Best: 256         │
└───────────────────┘     └───────────────────┘
```

The user moves first.

After the user's move:

1. The game state is updated.
    
2. The resulting state is given to Jev.
    
3. Jev selects a move.
    
4. Jev's game state is updated.
    
5. The process repeats.
    

## Controlled Randomness

Faceoff mode should eventually use controlled randomness so that the comparison is meaningful.

For example, both players can receive the same predetermined sequence of tile spawns.

```text
Random Event Sequence

Game Start
     │
     ├── Spawn 2
     ├── Spawn 2
     ├── Spawn 4
     ├── Spawn 2
     ├── Spawn 2
     └── ...
```

This prevents one player from simply receiving a more favorable series of random tile spawns.

---

# 6. Use Cases

## UC-01 — Watch Jev Play

**Actor:** Visitor

**Goal:** See the LLM agent play 2048.

### Flow

1. User opens the website.
    
2. User selects "Watch Jev Play."
    
3. User starts a game.
    
4. Game initializes.
    
5. Current board state is sent to Jev.
    
6. Jev selects a move.
    
7. Game executes the move.
    
8. Board updates.
    
9. Process repeats until the game ends.
    
10. Final score is displayed.
    

---

## UC-02 — View Benchmark Results

**Actor:** Visitor

**Goal:** Understand how Jev performs.

### Flow

1. User opens benchmark page.
    
2. Application displays benchmark results.
    
3. User can view metrics.
    
4. User can compare Jev against baseline agents.
    
5. User can inspect methodology.
    

Benchmark results may be precomputed rather than generated during page load.

---

## UC-03 — Run a Simulation

**Actor:** Developer

**Goal:** Evaluate a new version of Jev.

### Flow

1. Developer starts the simulator.
    
2. Simulator creates a new game.
    
3. Jev receives the current state.
    
4. Jev returns an action.
    
5. Game executes the action.
    
6. Results are recorded.
    
7. Process repeats.
    
8. Aggregate statistics are generated.
    

---

## UC-04 — Play Against Jev

**Actor:** Visitor

**Goal:** Directly compete against the agent.

### Flow

1. User selects Faceoff.
    
2. Two equivalent games are initialized.
    
3. User makes a move.
    
4. Jev receives its corresponding game state.
    
5. Jev makes a move.
    
6. Both boards update.
    
7. Turns continue until one game ends.
    
8. Results are displayed.
    

---

## UC-05 — Recruiter Demonstration

**Actor:** Recruiter / Technical Interviewer

**Goal:** Quickly understand the project.

The recruiter should be able to:

1. Open the deployed application.
    
2. Start Jev playing.
    
3. Watch several moves.
    
4. View benchmark results.
    
5. Understand the system architecture.
    
6. Optionally play Faceoff.
    

The entire concept should be understandable within approximately **1–2 minutes**.

---

# 7. Technical Architecture

## High-Level Architecture

```text
                     Browser
                        │
                        │ HTTPS
                        ▼
               ┌─────────────────┐
               │     Backend     │
               │                 │
               │ Game API        │
               │ Jev Adapter     │
               │ Simulation API  │
               └────────┬────────┘
                        │
                        ▼
                  ┌───────────┐
                  │    Jev    │
                  │    API    │
                  └───────────┘


             ┌───────────────────────┐
             │   Shared Game Engine  │
             │                       │
             │ Board                 │
             │ Moves                 │
             │ Merging               │
             │ Randomness            │
             │ Scoring               │
             └───────────┬───────────┘
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
        Interactive Game        Simulator
```

---

# 8. Technology Stack

The exact stack can change during implementation, but the initial recommendation is:

## Frontend

**TypeScript + React**

Reasons:

- Familiar web ecosystem.
    
- Strong typing.
    
- Easy interactive UI.
    
- Good fit for a game interface.
    
- Easy deployment.
    
- Demonstrates modern frontend development without making frontend the focus.
    

Potential libraries:

- React
    
- TypeScript
    
- Vite
    
- CSS/Tailwind
    

Tailwind is optional. The UI should remain relatively simple.

---

## Backend

**TypeScript + Node.js**

The backend should handle:

- Jev API communication
    
- API key protection
    
- Game sessions
    
- Agent requests
    
- Potential simulation endpoints
    
- Rate limiting/error handling
    

Using TypeScript across frontend and backend reduces unnecessary context switching.

Alternative:

**Go**

Go would be a good choice if the goal shifts toward demonstrating backend/system programming.

However, for this project, TypeScript is preferable initially because the project is primarily about **LLM integration rather than backend performance**.

---

## Game Engine

**TypeScript**

The game engine should be independent from React.

It should contain pure game logic such as:

```text
Board
GameState
Move
Tile
Score
RandomGenerator
GameEngine
```

Example interface:

```text
GameState
    board
    score
    gameOver
    won
```

Example action:

```text
UP
DOWN
LEFT
RIGHT
```

The game engine should not know anything about:

- React
    
- HTTP
    
- Jev
    
- APIs
    
- DOM manipulation
    

This separation will make simulation and Faceoff substantially easier.

---

# 9. Agent Interface

Jev should interact with the game through a well-defined interface.

Conceptually:

```text
Game State
     │
     ▼
Agent
     │
     ▼
Action
```
