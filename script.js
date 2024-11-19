/* Title: Alon Carmeli */

const board = document.getElementById('board'); // לוח המשחק

// Initial positions with specific slots for king, queen, and soldiers
// מיקום ראשוני של החיילים, המלך, והמלכה על הלוח
const initialPositions = {
    '5-9': 'king',
    '4-9': 'queen',
    '1-9': 'pawn',
    '2-9': 'pawn',
    '8-9': 'pawn',
    '9-9': 'pawn',
    '1-8': 'pawn',
    '3-8': 'pawn',
    '5-8': 'pawn',
    '6-8': 'pawn',
    '9-8': 'pawn',
    '5-7': 'pawn', // חייל נוסף ב-3E (5-7)

    '5-1': 'king',
    '4-1': 'queen',
    '1-1': 'pawn',
    '2-1': 'pawn',
    '8-1': 'pawn',
    '9-1': 'pawn',
    '1-2': 'pawn',
    '3-2': 'pawn',
    '5-2': 'pawn',
    '6-2': 'pawn',
    '9-2': 'pawn',
    '5-3': 'pawn', // חייל נוסף ב-3E (5-3)
};

let selectedPiece = null; // משתנה לשמירת הכלי שנבחר
const logEntries = []; // משתנה לשמירת לוג הפעולות

// Set up the board and place pieces
function setupBoard() { // פונקציה לאיפוס והגדרת הלוח
    board.innerHTML = ''; // ניקוי תוכן הלוח לפני ההגדרה מחדש

    // Display title
    const title = document.createElement('h1'); // יצירת כותרת עם שם המשחק
    title.textContent = 'Alon Carmeli';
    title.style.textAlign = 'center';
    title.style.marginBottom = '20px';
    document.body.insertBefore(title, document.body.firstChild);

    // Create row and column labels
    const rows = 9; // הגדרת מספר השורות בלוח
    const cols = 9; // הגדרת מספר העמודות בלוח
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']; // הגדרת אותיות העמודות בלוח

    // Create a container for the board with labels
    const boardContainer = document.createElement('div'); // יצירת מכולה עבור הלוח והכיתובים
    boardContainer.style.display = 'flex';
    boardContainer.style.flexDirection = 'column';
    boardContainer.style.alignItems = 'center';

    // Create top labels (column letters)
    const topLabels = document.createElement('div'); // יצירת הכיתובים העליונים (אותיות העמודות)
    topLabels.style.display = 'flex';
    topLabels.style.marginBottom = '10px';
    topLabels.style.marginLeft = '30px';
    for (let i = 0; i < cols; i++) {
        const label = document.createElement('div');
        label.textContent = letters[i];
        label.style.width = '60px';
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.justifyContent = 'center';
        topLabels.appendChild(label);
    }
    boardContainer.appendChild(topLabels);

    // Create left labels (row numbers)
    const boardWithLeftLabels = document.createElement('div'); // יצירת מבנה עם כיתובים משמאל (מספרי השורות)
    boardWithLeftLabels.style.display = 'flex';

    const leftLabels = document.createElement('div');
    leftLabels.style.display = 'flex';
    leftLabels.style.flexDirection = 'column';
    leftLabels.style.justifyContent = 'center';
    leftLabels.style.marginRight = '10px';
    for (let i = rows; i >= 1; i--) {
        const label = document.createElement('div');
        label.textContent = i;
        label.style.height = '60px';
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.justifyContent = 'center';
        leftLabels.appendChild(label);
    }

    boardWithLeftLabels.appendChild(leftLabels);
    boardWithLeftLabels.appendChild(board);
    boardContainer.appendChild(boardWithLeftLabels);

    // Append bottom labels (column letters)
    const bottomLabels = topLabels.cloneNode(true); // שכפול הכיתובים העליונים לכיתובים תחתונים
    boardContainer.appendChild(bottomLabels);

    document.body.appendChild(boardContainer);

    // Create squares and place pieces
    for (let row = 1; row <= 9; row++) { // יצירת הריבועים על הלוח ושיבוץ הכלים
        for (let col = 1; col <= 9; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.dataset.position = `${col}-${row}`;

            // Assign white or black side
            if ((row + col) % 2 === 0) {
                square.classList.add('black-square');
            } else {
                square.classList.add('white-square');
            }

            // Place initial pieces
            const positionKey = `${col}-${row}`;
            if (initialPositions[positionKey]) {
                const piece = document.createElement('img');
                piece.src = `assets/${initialPositions[positionKey]}.png`;
                piece.dataset.type = initialPositions[positionKey];
                piece.dataset.position = positionKey;
                piece.classList.add('piece');

                // Add event listener for mouse hover to highlight the piece
                piece.addEventListener('mouseenter', () => {
                    piece.classList.add('hover-highlight');
                });
                piece.addEventListener('mouseleave', () => {
                    piece.classList.remove('hover-highlight');
                });

                square.appendChild(piece);
            }

            board.appendChild(square);
        }
    }
}

// Add event listener to handle clicks on all pieces and squares
board.addEventListener('click', (event) => { // הוספת מאזין אירועים עבור לחיצות על הלוח והכלים
    try {
        const clickedElement = event.target;
        if (clickedElement.classList.contains('piece')) {
            // Clear previous highlights
            clearHighlights();

            // Select the clicked piece
            selectedPiece = clickedElement;

            // Show moves for the clicked piece
            showMoves(selectedPiece);
            logAction(`Piece selected at ${selectedPiece.dataset.position}`);
        } else if (clickedElement.classList.contains('highlight')) {
            // Move the selected piece to the highlighted square
            if (selectedPiece) {
                const newPosition = clickedElement.dataset.position;
                movePiece(selectedPiece, newPosition);
                clearHighlights();
                selectedPiece = null;
                logAction(`Piece moved to ${newPosition}`);
            }
        }
    } catch (error) {
        logError('Click handling error', error);
    }
});

// Highlight valid moves based on piece type and custom rules
function showMoves(piece) { // פונקציה להצגת מהלכים אפשריים עבור הכלי הנבחר
    try {
        const position = piece.dataset.position;
        const type = piece.dataset.type;
        const [col, row] = position.split('-').map(Number);

        const moves = [];

        if (type === 'pawn') {
            // Soldier movement
            moves.push([col, row - 1]);
            if (col > 1) moves.push([col - 1, row - 1]);
            if (col < 9) moves.push([col + 1, row - 1]);
        } else if (type === 'queen') {
            // Queen movement (up to 3 diagonal moves)
            for (let i = 1; i <= 3; i++) {
                if (col - i >= 1 && row - i >= 1) moves.push([col - i, row - i]);
                if (col + i <= 9 && row - i >= 1) moves.push([col + i, row - i]);
                if (col - i >= 1 && row + i <= 9) moves.push([col - i, row + i]);
                if (col + i <= 9 && row + i <= 9) moves.push([col + i, row + i]);
            }
        } else if (type === 'king') {
            // King movement in all directions except diagonal
            if (row > 1) moves.push([col, row - 1]);
            if (row < 9) moves.push([col, row + 1]);
            if (col > 1) moves.push([col - 1, row]);
            if (col < 9) moves.push([col + 1, row]);
        }

        highlightMoves(moves);
        logAction(`Valid moves for ${type} at ${position}: ${JSON.stringify(moves)}`);
    } catch (error) {
        logError('Show moves error', error);
    }
}

// Highlights valid moves on the board
function highlightMoves(moves) { // פונקציה לסימון מהלכים אפשריים על הלוח
    try {
        moves.forEach(([col, row]) => {
            const square = document.querySelector(`[data-position="${col}-${row}"]`);
            if (square && !square.querySelector('.piece')) {
                square.classList.add('highlight');
            }
        });
    } catch (error) {
        logError('Highlight moves error', error);
    }
}

// Move the piece to a new position
function movePiece(piece, newPosition) { // פונקציה להזזת הכלי למיקום חדש
    try {
        const oldSquare = document.querySelector(`[data-position="${piece.dataset.position}"]`);
        const newSquare = document.querySelector(`[data-position="${newPosition}"]`);

        if (oldSquare && newSquare) {
            oldSquare.removeChild(piece);
            piece.dataset.position = newPosition;
            newSquare.appendChild(piece);
        }
        saveLogToFile(); // שמירת לוג לאחר כל מהלך
    } catch (error) {
        logError('Move piece error', error);
    }
}

// Clear all highlighted squares
function clearHighlights() { // פונקציה להסרת הסימונים מהלוח
    try {
        document.querySelectorAll('.highlight').forEach(square => {
            square.classList.remove('highlight');
        });
    } catch (error) {
        logError('Clear highlights error', error);
    }
}

// Log errors for debugging and save all actions
function logError(message, error) { // פונקציה לרישום שגיאות לצורך דיבוג
    const errorMessage = `${message}: ${error.message}`;
    logEntries.push(errorMessage);
    console.error(errorMessage);
    saveLogToFile();
}

// Log all actions for debugging
function logAction(action) { // פונקציה לרישום פעולות לצורך דיבוג
    const actionMessage = `Action: ${action}`;
    logEntries.push(actionMessage);
    console.log(actionMessage);
    saveLogToFile();
}

// Save log entries to a file continuously
function saveLogToFile() { // פונקציה לשמירת הלוגים לקובץ
    try {
        const logFileContent = logEntries.join('\n');
        const blob = new Blob([logFileContent], { type: 'text/plain' });
        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
        window.requestFileSystem(window.PERSISTENT, 1024 * 1024, fs => {
            fs.root.getFile('logs.txt', { create: true }, fileEntry => {
                fileEntry.createWriter(fileWriter => {
                    fileWriter.onwriteend = () => {
                        console.log('Write completed.');
                    };
                    fileWriter.onerror = error => {
                        console.error('Write failed: ' + error.toString());
                    };
                    const blob = new Blob([logFileContent], { type: 'text/plain' });
                    fileWriter.write(blob);
                });
            });
        }, error => {
            console.error('Error accessing filesystem: ', error);
        });
    } catch (error) {
        console.error('Error saving log file:', error);
    }
}

function showMoves(piece) {
    try {
        const position = piece.dataset.position;
        const type = piece.dataset.type;
        const [col, row] = position.split('-').map(Number);

        const moves = [];

        if (type === 'pawn') {
            // Soldier can move backward and capture like a knight
            moves.push([col - 2, row - 1]); // knight-like move
            moves.push([col + 2, row - 1]);
            moves.push([col - 1, row - 2]);
            moves.push([col + 1, row - 2]);
            // Soldier can also move backward in a straight line if not blocked
            moves.push([col, row - 1]);
        } else if (type === 'queen') {
            // Queen movement (diagonal)
            for (let i = 1; i <= 3; i++) {
                moves.push([col - i, row - i]);
                moves.push([col + i, row - i]);
                moves.push([col - i, row + i]);
                moves.push([col + i, row + i]);
            }
        } else if (type === 'king') {
            // King movement (1 square in any direction)
            moves.push([col - 1, row]);
            moves.push([col + 1, row]);
            moves.push([col, row - 1]);
            moves.push([col, row + 1]);
            moves.push([col - 1, row - 1]);
            moves.push([col + 1, row - 1]);
            moves.push([col - 1, row + 1]);
            moves.push([col + 1, row + 1]);
        }

        highlightMoves(moves, position);
    } catch (error) {
        logError('Move calculation error', error);
    }
}

function highlightMoves(moves, currentPos) {
    moves.forEach(([col, row]) => {
        const movePos = `${col}-${row}`;
        const targetSquare = document.querySelector(`.square[data-position='${movePos}']`);

        if (targetSquare) {
            // Add blue square for valid moves
            targetSquare.classList.add('highlight');
            targetSquare.style.backgroundColor = 'rgba(0, 0, 255, 0.4)';

            // Check for opponent pieces to enable capturing
            const pieceOnTarget = targetSquare.querySelector('.piece');
            if (pieceOnTarget && !isSameTeam(currentPos, pieceOnTarget.dataset.position)) {
                targetSquare.classList.add('capture-highlight');
                targetSquare.style.backgroundColor = 'rgba(255, 0, 0, 0.6)'; // Mark capture in red
            }
        }
    });
}

function isSameTeam(pos1, pos2) {
    // Assuming positions determine team affiliation, adjust this check based on the logic of your game
    return (pos1.includes('-1') || pos1.includes('-2')) === (pos2.includes('-1') || pos2.includes('-2'));
}

function movePiece(piece, newPosition) {
    const targetSquare = document.querySelector(`.square[data-position='${newPosition}']`);

    if (targetSquare.classList.contains('capture-highlight')) {
        // Remove captured opponent piece
        const opponentPiece = targetSquare.querySelector('.piece');
        if (opponentPiece) opponentPiece.remove();
    }

    // Move piece to new position
    targetSquare.appendChild(piece);
    piece.dataset.position = newPosition;
}



// Initialize the board
setupBoard(); // קריאה לפונקציה לאיפוס והגדרת הלוח
logAction('Board initialized'); // רישום פעולה של התחלת הלוח
