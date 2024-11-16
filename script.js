const board = document.getElementById('board');

// Initial positions with specific slots for king, queen, and soldiers
const initialPositions = {
    '5-9': 'king',
    '4-9': 'queen',
    '1-9': 'pawn',
    '2-9': 'pawn',
    '3-9': 'pawn',
    '6-9': 'pawn',
    '7-9': 'pawn',
    '8-9': 'pawn',
    '9-9': 'pawn',

    '5-1': 'king',
    '4-1': 'queen',
    '1-1': 'pawn',
    '2-1': 'pawn',
    '3-1': 'pawn',
    '6-1': 'pawn',
    '7-1': 'pawn',
    '8-1': 'pawn',
    '9-1': 'pawn',
};

// Set up the board and place pieces
function setupBoard() {
    for (let row = 1; row <= 9; row++) {
        for (let col = 1; col <= 9; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.dataset.position = `${col}-${row}`;

            // Place initial pieces
            const positionKey = `${col}-${row}`;
            if (initialPositions[positionKey]) {
                const piece = document.createElement('img');
                piece.src = `assets/${initialPositions[positionKey]}.png`;
                piece.dataset.type = initialPositions[positionKey];
                piece.dataset.position = positionKey;
                piece.classList.add('piece');

                square.appendChild(piece);
            }

            board.appendChild(square);
        }
    }

    // Add event listener to handle clicks on all pieces
    board.addEventListener('click', (event) => {
        const clickedPiece = event.target;
        if (clickedPiece.classList.contains('piece')) {
            // Clear previous highlights
            clearHighlights();

            // Show moves for the clicked piece
            showMoves(clickedPiece);
        }
    });
}

// Highlight valid moves based on piece type and custom rules
function showMoves(piece) {
    const position = piece.dataset.position;
    const type = piece.dataset.type;
    const [col, row] = position.split('-').map(Number);

    const moves = [];

    if (type === 'pawn') {
        // Soldier movement
        moves.push([col, row - 1]);
        moves.push([col - 1, row - 1]);
        moves.push([col + 1, row - 1]);
    } else if (type === 'queen') {
        // Queen movement (up to 3 diagonal moves)
        for (let i = 1; i <= 3; i++) {
            moves.push([col - i, row - i]);
            moves.push([col + i, row - i]);
        }
    } else if (type === 'king') {
        // King movement in all directions except diagonal (with empty row rules)
        for (let r = row - 1; r >= 1; r--) moves.push([col, r]);
        for (let c = col - 1; c >= 1; c--) moves.push([c, row]);
        for (let c = col + 1; c <= 9; c++) moves.push([c, row]);
    }

    highlightMoves(moves);
}

// Highlights valid moves on the board
function highlightMoves(moves) {
    moves.forEach(([col, row]) => {
        const square = document.querySelector(`[data-position="${col}-${row}"]`);
        if (square) square.classList.add('highlight');
    });
}

// Clear all highlighted squares
function clearHighlights() {
    document.querySelectorAll('.highlight').forEach(square => {
        square.classList.remove('highlight');
    });
}

// Initialize the board
setupBoard();
