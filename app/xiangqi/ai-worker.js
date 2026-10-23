import {chooseAIMove} from './engine.js';
self.onmessage=({data})=>{try{self.postMessage({move:chooseAIMove(data.board,data.side)});}catch{self.postMessage({move:null});}};
