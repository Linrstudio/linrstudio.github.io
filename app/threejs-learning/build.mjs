import {build} from 'esbuild';
import {mkdir,copyFile,rm} from 'node:fs/promises';
await rm('assets',{recursive:true,force:true});
await mkdir('assets',{recursive:true});
await build({entryPoints:{site:'src/site.js',lab:'src/lab.js'},bundle:true,splitting:true,format:'esm',outdir:'assets',entryNames:'[name]',chunkNames:'chunk-[hash]',minify:true,target:['es2022'],legalComments:'eof',metafile:true}).then(async result=>{const {writeFile}=await import('node:fs/promises');await writeFile('build-meta.json',JSON.stringify(result.metafile,null,2)+'\n');console.log('Build complete:',Object.keys(result.metafile.outputs).join(', '));});
await copyFile('node_modules/three/LICENSE','THREE-LICENSE.txt');
