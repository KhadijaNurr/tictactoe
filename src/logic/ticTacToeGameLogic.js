function getLines(rows) {
  const lines3x3 = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const lines4x4 = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
    [0, 5, 10, 15],
    [3, 6, 9, 12],
  ];

  const lines5x5 = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20],
  ];

  if (rows === 3) return lines3x3;
  if (rows === 4) return lines4x4;
  if (rows === 5) return lines5x5;
  return [];
}

export function calculateWinner(size, cells) {
  let lines = getLines(size);

  for (let line of lines) {
    const first = cells[line[0]];
    if (!first) continue;

    if (line.every((index) => cells[index] === first)) {
      return first;
    }
  }
  return null;
}

function evaluate(board, rows) {
  const winner = calculateWinner(rows, board);
  if (winner === "O") return 100;
  if (winner === "X") return -100;

  let score = 0;
  const lines = getLines(rows);

  for (let line of lines) {
    const values = line.map((i) => board[i]);
    const oCount = values.filter((v) => v === "O").length;
    const xCount = values.filter((v) => v === "X").length;

    if (xCount === 0 && oCount > 0) {
      score += Math.pow(10, oCount);
    }
    if (oCount === 0 && xCount > 0) {
      score -= Math.pow(10, xCount);
    }
  }

  for (let line of lines) {
    const values = line.map((i) => board[i]);
    const xCount = values.filter((v) => v === "X").length;
    if (xCount === 3 && values.includes(null)) {
      score += 10;
    }
  }

  return score;
}

export function minimax(
  board,
  depth,
  isMax,
  rows,
  alpha = -Infinity,
  beta = Infinity
) {
  const score = evaluate(board, rows);
  if (Math.abs(score) === 100 || depth === 0 || board.every(Boolean)) {
    return score;
  }

  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = "O";
        const val = minimax(board, depth - 1, false, rows, alpha, beta);
        board[i] = null;
        best = Math.max(best, val);
        alpha = Math.max(alpha, val);
        if (beta <= alpha) break;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = "X";
        const val = minimax(board, depth - 1, true, rows, alpha, beta);
        board[i] = null;
        best = Math.min(best, val);
        beta = Math.min(beta, val);
        if (beta <= alpha) break;
      }
    }
    return best;
  }
}

export function minimaxMove(depth, cells, rows) {
  let bestMove = -1;
  let bestScore = -Infinity;

  for (let i = 0; i < cells.length; i++) {
    if (!cells[i]) {
      cells[i] = "O";
      let score = minimax(cells, depth - 1, false, rows);
      cells[i] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
}
