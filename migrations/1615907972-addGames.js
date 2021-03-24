exports.up = async (sql) => {
  await sql`
	INSERT INTO games (name,
	player_minimum, player_maximum,
	age, description)
	VALUES
	('Fields of Fire 2ndEdition', 1, 1, 12, 'Fields of Fire is a solitaire game of commanding a rifle company between World War II and Present Day. The game is different from many tactical games in that it is diceless and card based. There are two decks used to play. The Terrain Deck is based on a specific region and is used to build a map for the various missions your company must perform. The Action deck serves many purposes in controlling combat, command and control, various activity attempts. The units of the company are counters representing headquarters elements, squads, weapons teams, forward observers, individual vehicles or helicopters. A single playing is a mission and several missions from an historical campaign are strung together for the player to manage experience and replacements. A mission can be played in about 1 – 2 hours.'),

('Chess', 2, 2, 8, 'Chess is a two-player, abstract strategy board game that represents medieval warfare on an 8x8 board with alternating light and dark squares. Opposing pieces, traditionally designated White and Black, are initially lined up on either side. Each type of piece has a unique form of movement and capturing occurs when a piece, via its movement, occupies the square of an opposing piece. Players take turns moving one of their pieces in an attempt to capture, attack, defend, or develop their positions. Chess games can end in checkmate, resignation, or one of several types of draws.'),

('Connect Four', 2, 2, 6, 'Connect Four is a two-player connection board game, in which the players choose a color and then take turns dropping colored discs into a seven-column, six-row vertically suspended grid. The pieces fall straight down, occupying the lowest available space within the column. The objective of the game is to be the first to form a horizontal, vertical, or diagonal line of four of ones own discs.'),

('Mastermind', 2, 2, 8, 'Guess the color of hidden pegs. A deduction game where each player takes turn making a limited number of guesses, using logic to deduce what pegs the opponent has hidden.'),

('Guess Who', 2, 2, 6, 'The mystery face game where you flip over a collection of faces with different color hair, eye color, hair, hats, glasses etc. to deduce who the secret person is that your opponent has chosen. You flip over the hooked tiles as you narrow your choices by asking characteristic questions.'),

('Operation', 1, 6, 6, 'Operation is a dexterity game in which you must extract silly body parts from a hapless patient. In the course of the game you acquire cards which dictate that you must remove a certain piece from the body of the patient. To do this you use a set of tweezers that are attached by wire to the game board. If you are sloppy and touch the metal sides of the hole where the item is located, the patients pain is indicated by a sudden buzzer and light-up nose. Successful extractions net cash, and the player with the most cash at the end of the game is the winner.'),

('Risk', 2, 6, 10,'Possibly the most popular, mass market war game. The goal is conquest of the world.
Each players turn consists of: gaining reinforcements through number of territories held, control of every territory on each continent, and turning sets of bonus cards. Attacking other players using a simple combat rule of comparing the highest dice rolled for each side. Players may attack as often as desired. If one enemy territory is successfully taken, the player is awarded with a bonus card. Moving a group of armies to another adjacent territory.'),

('Monopoly', 2, 8, 8,'Players take the part of land owners, attempting to buy and then develop their land. Income is gained by other players visiting their properties and money is spent when they visit properties belonging to other players. When times get tough, players may have to mortgage their properties to raise cash for fines, taxes and other misfortunes.'),

('Jenga', 1,8,6, 'A tower building game. Jenga is played with 54 wooden blocks,the blocks are stacked in a tower formation. Once the tower is built, the person who built the tower gets the first move. Moving in Jenga consists of taking one, and only one, block from any level (except the one below the incomplete top level) of the tower, and placing it on the topmost level to complete it. Only one hand should be used at a time when taking blocks from the tower. Blocks may be bumped to find a loose block that will not disturb the rest of the tower. Any block that is moved out of place must be returned to its original location before another block is removed. The turn ends when the next person to move touches the tower or after ten seconds, whichever occurs first.
The game ends when the tower falls, or if any piece falls from the tower other than the piece being knocked out to move to the top. The winner is the last person to remove and place a block successfully.'),

('Pictionary', 3, 16, 12,'Playing Pictionary may remind you of Charades, but with drawing on paper instead of acting out the answers. In Pictionary, though, clue givers may be drawing at the same time as players strive to be the first to guess the correct answer. When the answer is not designated "All Play," one team simply tries to come up with the answer before the timer runs out, which is usually but not always possible thanks to the varying difficulty levels of the answers. No great drawing talent is required; instead, players gain an edge if they have a good imagination when guessing, empathy for their team mates, and/or a general ability to communicate in restricted circumstances. A board is provided, just to keep score on, which focuses the competition.'),

('Puerto Rico', 3, 5, 12,'In Puerto Rico, players assume the roles of colonial governors on the island of Puerto Rico. The aim of the game is to amass victory points by shipping goods to Europe or by constructing buildings.
Each player uses a separate small board with spaces for city buildings, plantations, and resources. Shared between the players are three ships, a trading house, and a supply of resources and doubloons.
The resource cycle of the game is that players grow crops which they exchange for points or doubloons. Doubloons can then be used to buy buildings, which allow players to produce more crops or give them other abilities. Buildings and plantations do not work unless they are manned by colonists.
During each round, players take turns selecting a role card from those on the table (such as "Trader" or "Builder"). When a role is chosen, every player gets to take the action appropriate to that role.'),

('Carcassonne', 2,5,7, 'Carcassonne is a tile-placement game in which the players draw and place a tile with a piece of southern French landscape on it. The tile might feature a city, a road, a cloister, grassland or some combination thereof, and it must be placed adjacent to tiles that have already been played, in such a way that cities are connected to cities, roads to roads, etcetera. Having placed a tile, the player can then decide to place one of their meeples on one of the areas on it: on the city as a knight, on the road as a robber, on a cloister as a monk, or on the grass as a farmer. When that area is complete, that meeple scores points for its owner.'),

('Cluedo', 2,6,8, 'Cluedo is a murder mystery game. The aim is to find out who committed the murder, which weapon they used, and where in the mansion they did it. How do you solve the case? By careful questioning of your fellow players you can deduce which information is concealed in the crime envelope. The trick is to be clever with your questioning... Everyone develops their own system!
This version of the game plays faster than older versions of Cluedo, with the help of bigger spaces on the board, special Red Cards, and a new layout of the mansion so you can walk between rooms. The bedroom has an ensuite, and you can wander from the kitchen straight into the dining room.
All new artwork brings this classic murder mystery to life, with a high level of detail.'),

('Scotland Yard', 3,6,10, 'In Scotland Yard, one of the players takes on the role of Mr. X. His job is to move from point to point around the map of London taking taxis, buses or subways. The detectives – that is, the remaining players acting in concert – move around similarly in an effort to move into the same space as Mr. X. But while the criminals mode of transportation is nearly always known, his exact location is only known intermittently throughout the game.'),

('Scrabble', 2,4,10,'In this classic word game, players use their seven drawn letter-tiles to form words on the gameboard. Each word laid out earns points based on the commonality of the letters used, with certain board spaces giving bonuses. But a word can only be played if it uses at least one already-played tile or adds to an already-played word. This leads to slightly tactical play, as potential words are rejected because they would give an opponent too much access to the better bonus spaces.'),

('Twister', 2,4,6, 'A large vinyl playing mat is placed on the floor, with a 6 x 4 array of spots, each spot about 6 inches in diameter. The spots are colored red, blue, yellow, and green. A player is chosen to moderate, and the rest of the players, up to 4, stand on the play mat with their feet on different spots.
Each turn consists of the moderator spinning a spinner, which gives a result matching a random color with a random element from the set (left hand, right hand, left foot, right foot). Each player must put the relevant bodypart on the relevant color spot. If the bodypart is already on a spot of that color it is moved to another spot of the same color. No two players bodyparts can share the same spot. If a player falls or touches an elbow or knee to the ground they are eliminated.')

	`;
};

exports.down = async (sql) => {
  await sql`
	TRUNCATE TABLE games
	`;
};
