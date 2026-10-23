// Lightweight, rule-complete Chinese chess engine. Coordinates are [row, column], row 0 is Black's back rank.
const ROWS = 10, COLS = 9;
const TYPES = ['k', 'a', 'e', 'h', 'r', 'c', 'p'];
const OPP = { red: 'black', black: 'red' };
const DIRS4 = [[1,0],[-1,0],[0,1],[0,-1]];

const piece = (type, side) => ({ type, side });
export function initialBoard() {
  const b = Array.from({length: ROWS}, () => Array(COLS).fill(null));
  const back = ['r','h','e','a','k','a','e','h','r'];
  back.forEach((t,c) => { b[0][c] = piece(t,'black'); b[9][c] = piece(t,'red'); });
  [1,7].forEach(c => { b[2][c] = piece('c','black'); b[7][c] = piece('c','red'); });
  [0,2,4,6,8].forEach(c => { b[3][c] = piece('p','black'); b[6][c] = piece('p','red'); });
  return b;
}
const inside = (r,c) => r >= 0 && r < ROWS && c >= 0 && c < COLS;
const palace = (side,r,c) => c >= 3 && c <= 5 && (side === 'red' ? r >= 7 : r <= 2);
const riverCrossed = (side,r) => side === 'red' ? r <= 4 : r >= 5;
const same = (a,b) => a && b && a.type === b.type && a.side === b.side;
function cloneBoard(board) { return board.map(row => row.map(x => x && {...x})); }
function pathCount(board,r1,c1,r2,c2) {
  let n=0, dr=Math.sign(r2-r1), dc=Math.sign(c2-c1), r=r1+dr,c=c1+dc;
  while (r !== r2 || c !== c2) { if (board[r][c]) n++; r+=dr; c+=dc; }
  return n;
}
function horseAttacks(board,r,c,tr,tc) {
  const dr=tr-r, dc=tc-c;
  const options = [[-2,-1,-1,0],[-2,1,-1,0],[2,-1,1,0],[2,1,1,0],[-1,-2,0,-1],[1,-2,0,-1],[-1,2,0,1],[1,2,0,1]];
  return options.some(([ar,ac,lr,lc]) => dr===ar && dc===ac && !board[r+lr]?.[c+lc]);
}
function attacksSquare(board,r,c,tr,tc) {
  const p=board[r]?.[c]; if (!p || !inside(tr,tc)) return false;
  const dr=tr-r, dc=tc-c, adr=Math.abs(dr), adc=Math.abs(dc);
  if (p.type==='k') return (adr+adc===1 && palace(p.side,tr,tc)) || (c===tc && pathCount(board,r,c,tr,tc)===0);
  if (p.type==='a') return adr===1 && adc===1 && palace(p.side,tr,tc);
  if (p.type==='e') return adr===2 && adc===2 && !board[r+dr/2]?.[c+dc/2] && (p.side==='red' ? tr>=5 : tr<=4);
  if (p.type==='h') return horseAttacks(board,r,c,tr,tc);
  if (p.type==='r') return (dr===0 || dc===0) && pathCount(board,r,c,tr,tc)===0;
  if (p.type==='c') return (dr===0 || dc===0) && pathCount(board,r,c,tr,tc)===1;
  if (p.type==='p') {
    const forward = p.side==='red' ? -1 : 1;
    return (dr===forward && dc===0) || (riverCrossed(p.side,r) && dr===0 && adc===1);
  }
  return false;
}
function pseudoMoves(board,r,c, includeKing=true) {
  const p=board[r]?.[c], out=[]; if (!p) return out;
  for (let tr=0;tr<ROWS;tr++) for (let tc=0;tc<COLS;tc++) {
    if (tr===r && tc===c) continue;
    const q=board[tr][tc]; if (q?.side===p.side || (!includeKing && q?.type==='k')) continue;
    let ok=false;
    if (p.type==='k') ok=palace(p.side,tr,tc) && Math.abs(tr-r)+Math.abs(tc-c)===1;
    else if (p.type==='a') ok=palace(p.side,tr,tc) && Math.abs(tr-r)===1 && Math.abs(tc-c)===1;
    else if (p.type==='e') ok=Math.abs(tr-r)===2 && Math.abs(tc-c)===2 && (p.side==='red'?tr>=5:tr<=4) && !board[(r+tr)/2]?.[(c+tc)/2];
    else if (p.type==='h') ok=horseAttacks(board,r,c,tr,tc);
    else if (p.type==='r') ok=(tr===r||tc===c) && pathCount(board,r,c,tr,tc)===0;
    else if (p.type==='c') ok=(tr===r||tc===c) && pathCount(board,r,c,tr,tc)===(q?1:0);
    else if (p.type==='p') { const f=p.side==='red'?-1:1; ok=(tr-r===f&&tc===c)||(riverCrossed(p.side,r)&&tr===r&&Math.abs(tc-c)===1); }
    if (ok) out.push({from:[r,c],to:[tr,tc]});
  }
  return out;
}
export function applyMove(board, move) {
  const b=cloneBoard(board), [r,c]=move.from, [tr,tc]=move.to;
  b[tr][tc]=b[r][c]; b[r][c]=null; return b;
}
export function inCheck(board, side) {
  let king=null;
  for (let r=0;r<ROWS;r++) for (let c=0;c<COLS;c++) if (same(board[r][c], {type:'k',side})) king=[r,c];
  if (!king) return true;
  const enemy=OPP[side];
  for (let r=0;r<ROWS;r++) for (let c=0;c<COLS;c++) if (board[r][c]?.side===enemy && attacksSquare(board,r,c,king[0],king[1])) return true;
  return false;
}
export function movesFor(board,r,c) {
  const p=board[r]?.[c]; if (!p) return [];
  return pseudoMoves(board,r,c).filter(m => { const target=board[m.to[0]][m.to[1]]; if (target?.type==='k') return false; return !inCheck(applyMove(board,m),p.side); });
}
export function legalMoves(board,side) {
  const out=[];
  for (let r=0;r<ROWS;r++) for (let c=0;c<COLS;c++) if (board[r][c]?.side===side) out.push(...movesFor(board,r,c));
  return out;
}
export function gameStatus(board,sideToMove) {
  const moves=legalMoves(board,sideToMove); if (moves.length) return {over:false,winner:null,reason:''};
  if (inCheck(board,sideToMove)) return {over:true,winner:OPP[sideToMove],reason:'将死'};
  return {over:true,winner:OPP[sideToMove],reason:'困毙'};
}
const VALUES={k:100000,a:200,e:250,h:450,r:900,c:450,p:100};
function evaluate(board,side) { let score=0; for (const row of board) for (const p of row) if(p) score += (p.side===side?1:-1)*VALUES[p.type]; return score; }
function search(board,side,root,depth,alpha,beta) {
  const ms=legalMoves(board,side); if (!ms.length) return (side===root?-999999:999999);
  if (!depth) return evaluate(board,root);
  const maximizing=side===root; let best=maximizing?-Infinity:Infinity;
  for (const m of ms) { const v=search(applyMove(board,m),OPP[side],root,depth-1,alpha,beta); best=maximizing?Math.max(best,v):Math.min(best,v); if(maximizing) alpha=Math.max(alpha,v); else beta=Math.min(beta,v); if(beta<=alpha) break; }
  return best;
}
export function chooseAIMove(board,side) { const ms=legalMoves(board,side); if(!ms.length) return null; let best=ms[0], score=-Infinity; for(const m of ms){const v=search(applyMove(board,m),OPP[side],side,1,-Infinity,Infinity);if(v>score){score=v;best=m;}} return best; }
export function pieceLabel(p) { if(!p) return ''; return ({red:{k:'帅',a:'仕',e:'相',h:'马',r:'车',c:'炮',p:'兵'},black:{k:'将',a:'士',e:'象',h:'马',r:'车',c:'炮',p:'卒'}})[p.side][p.type]; }
