const prompt = require("prompt-sync")({sigint: true});
const BOARD_LENGTH = 3;
const PLAYER_ONE = 'X';
const PLAYER_TWO = 'O';
const EMPTY = ' ';

const MOVE_PROMPT = "Player {}, please enter the index of your next move: "
const INVALID_INPUT = "Wrong input. Please try again"
const OUT_OF_BOUNDS = "Position out of bounds. Please try again."
const POSITION_FILLED = "Position already filled. Please try again."
const DRAW_MESSAGE = "The game ended in a draw."
const WIN_MESSAGE = "\nPlayer {} has won the game!!"
const REPLAY_PROMPT = "Do you wish to play again? [y/N] "

const WINNING_TRIOS = [
    [0, 1, 2], 
    [3, 4, 5], 
    [6, 7, 8], 
    [0, 3, 6], 
    [1, 4, 7], 
    [2, 5, 8], 
    [0, 4, 8], 
    [2, 4, 6], 
  ];

function print_game_board(board, padding=1) {

let horizontal_divider = '-'.repeat((BOARD_LENGTH * (2 * padding + 1) + 2));

    for (let row_index = 0; row_index < BOARD_LENGTH ; row_index++) {
        if (row_index != 0) {
            console.log(horizontal_divider);
        }
        let start = row_index * BOARD_LENGTH;
        let row = board.slice(start, start + BOARD_LENGTH)
        .map((value) => `${EMPTY.repeat(padding)}${value}${EMPTY.repeat(padding)}`);
        console.log(row.join('|')); 
    }
}

class Game {

    constructor() {

        this.reset();
    }

    reset() {

        this.player_ones_turn = true;
        this.board = Array(BOARD_LENGTH ** 2).fill(EMPTY);
        this.winner = null;
    }

    play() {
        
        while (!this.is_over()) {
            print_game_board(this.board);

            let index = this.get_next_move();

            if (! (1 <= index && index < (BOARD_LENGTH ** 2) + 1 )) {
                console.log("OUT_OF_BOUNDS");
                continue;
            }
            if ( this.board[index - 1] != EMPTY) {
                console.log("Position_FILLED");
                continue;
            }
            this.board[index - 1 ] = this.get_current_player();

            if (this.check_win()) {
                this.winner = this.get_current_player();
                return;
            }
            this.player_ones_turn = !this.player_ones_turn;

            
        }

    }

    get_next_move() {
        while(true) {
            let move = prompt(MOVE_PROMPT.replace('{}',this.get_current_player()));
            
            if (Number.isInteger(parseInt(move))) {
                return parseInt(move);
            }
            console.log("INVALID_INPUT");
        }

    }

    get_current_player() {
        
        if (this.player_ones_turn) {
            return PLAYER_ONE;
        } else {
            return PLAYER_TWO;
        }
    }

    check_win() {

        let positions = this.board.map((value, i) => value === this.get_current_player() ? i : null)
        .filter(index => index !== null);
        return WINNING_TRIOS.some(winning_trio => winning_trio.every(index => positions.includes(index)));
    }

    has_drawn() {

        return !this.board.includes(EMPTY);
    }

    is_over() {

      return this.has_drawn() || this.winner !== null;
    }

    display_winner_info() {
        
        if (this.winner === null) {
            console.log(DRAW_MESSAGE);
        } else {
            console.log(WIN_MESSAGE.replace('{}',this.winner));
        }
    }

}

// Assuming the Game class and its methods are defined

function main() {
    const game = new Game();
  
    while (true) {
      game.play();
      game.display_winner_info();
  
      // Ask the user if they want to play again
      const replay = prompt(REPLAY_PROMPT);
  
      if (replay.toLowerCase() !== 'y') {
        break;
      }
  
      game.reset();
    }
  }
  
  // Call the main function when the script is executed
  main();
  



