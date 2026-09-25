import { build } from 'esbuild';
import {readFile,writeFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const root=import.meta.dirname;
// Resolve only inside this project: avoids ancestor-directory discovery in the sandbox.
const projectFiles={name:'project-files',setup(api){
  api.onResolve({filter:/.*/},async args=>{
    const importer=args.importer||path.join(root,'package.json');
    let file=args.path.startsWith('.')?path.resolve(path.dirname(importer),args.path):createRequire(importer).resolve(args.path);
    if(args.path==='three')file=path.join(path.dirname(file),'three.module.js');
    if(file!==root&&!file.startsWith(root+path.sep))throw new Error('Build import outside project: '+args.path);
    for(const suffix of ['','.js','.jsx','/index.js']){try{if((await stat(file+suffix)).isFile())return {path:file+suffix,namespace:'project'}}catch{}}
    throw new Error('Missing project import: '+args.path);
  });
  api.onLoad({filter:/.*/,namespace:'project'},async args=>({contents:await readFile(args.path,'utf8'),loader:args.path.endsWith('.json')?'json':args.path.endsWith('.jsx')?'jsx':'js'}));
}};
await build({absWorkingDir:root,entryPoints:{site:'./src/App.jsx'},plugins:[projectFiles],tsconfigRaw:{},bundle:true,outdir:'build',format:'esm',splitting:true,minify:true,jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'},target:['es2022'],legalComments:'linked',metafile:true}).then(async result=>{
  await writeFile('build/meta.json',JSON.stringify(result.metafile,null,2));
});
