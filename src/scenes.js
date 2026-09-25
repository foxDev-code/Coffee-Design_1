import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {createLabelCanvases} from './labels.js';
import {bagMesh} from './bag-geometry.js';

export function createProductScenes(root){
  const labels=createLabelCanvases(),scenes={};
  for(const canvas of root.querySelectorAll('canvas[data-cup]')){
    const kind=canvas.dataset.cup,isBag=kind==='bag';
    let renderer,env,pmrem,environment,observer,group;
    function dispose(){observer?.disconnect();group?.traverse(object=>{object.geometry?.dispose();if(object.material){object.material.map?.dispose();object.material.dispose()}});env?.dispose();pmrem?.dispose();environment?.dispose();renderer?.dispose();canvas.parentElement.classList.remove(isBag?'bag-rendered':'cup-rendered');delete canvas.dataset.rendered;}
    try{
      renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
      renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0,0);
      renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.9;
      const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(41.34,1,.1,30);camera.position.z=5.5;
      pmrem=new THREE.PMREMGenerator(renderer);environment=new RoomEnvironment();env=pmrem.fromScene(environment,.04);scene.environment=env.texture;
      scene.add(new THREE.HemisphereLight(0xfff4df,0x3b281a,1.2));
      const key=new THREE.DirectionalLight(0xffead2,1.8);key.position.set(-3,5,5);scene.add(key);
      const rim=new THREE.DirectionalLight(0xffffff,1.2);rim.position.set(4,3,-2);scene.add(rim);
      group=new THREE.Group();scene.add(group);
      const label=new THREE.CanvasTexture(isBag?labels.bag:labels.cup);label.colorSpace=THREE.SRGBColorSpace;label.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
      const black=new THREE.MeshPhysicalMaterial({color:0x11110f,roughness:.4,metalness:0,specularIntensity:.25,clearcoat:.03,clearcoatRoughness:.4,envMapIntensity:.07});
      const paper=new THREE.MeshStandardMaterial({map:label,roughness:.92,envMapIntensity:.15,side:THREE.DoubleSide});
      if(isBag){
        black.dispose();const data=bagMesh(),geometry=new THREE.BufferGeometry();
        const buffer=new THREE.InterleavedBuffer(data,8);geometry.setAttribute('position',new THREE.InterleavedBufferAttribute(buffer,3,0));geometry.setAttribute('normal',new THREE.InterleavedBufferAttribute(buffer,3,3));geometry.setAttribute('uv',new THREE.InterleavedBufferAttribute(buffer,2,6));
        geometry.scale(1,.86,1);group.add(new THREE.Mesh(geometry,paper));
      }else{
        const profiles=[[[.62,-1.32],[.66,-1.3],[.675,-1.15],[.87,1.15],[.88,1.2]],[[.678,-1.15],[.872,1.15]],[[.88,1.17],[.965,1.19],[.99,1.22],[.99,1.26],[.96,1.29],[.95,1.33],[.965,1.36],[.96,1.4],[.91,1.42],[.87,1.43],[.845,1.46],[.84,1.6],[.8,1.63],[.77,1.62],[.75,1.58],[.04,1.58],[0,1.58]]];
        profiles.forEach((points,i)=>{const geometry=new THREE.LatheGeometry(points.map(([x,y])=>new THREE.Vector2(x,y)),96,-Math.PI);geometry.scale(1,.86,1);group.add(new THREE.Mesh(geometry,i===1?paper:black))});
        const opening=new THREE.Mesh(new THREE.SphereGeometry(1,24,12),new THREE.MeshStandardMaterial({color:0x070706,roughness:.9}));opening.scale.set(.15,.016,.055);opening.position.set(0,1.586*.86,.57);group.add(opening);
      }
      let width=0,height=0,last='',dirty=true;
      observer=new ResizeObserver(()=>dirty=true);observer.observe(canvas);
      canvas.parentElement.classList.add(isBag?'bag-rendered':'cup-rendered');canvas.dataset.rendered='three';
      scenes[kind]={render(x,y,z){
        if(dirty){width=canvas.clientWidth;height=canvas.clientHeight;if(!width||!height)return;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();
          // Match the reference's cup width to the section, not a fixed minimum section height.
          if(kind==='story'){
            const phone=window.matchMedia('(max-width:520px)').matches;
            const scale=phone?.82:Math.min(1,width/1200);
            const verticalScale=phone?scale:Math.max(scale,Math.min(1,scale*1.35));
            group.scale.set(scale,verticalScale,scale);
            group.position.y=(1-verticalScale)*1.36;
          }
          dirty=false;last=''}
        const next=[x,y,z].map(v=>v.toFixed(4)).join(',');if(last===next)return;last=next;
        group.rotation.set(x,y,z,'ZYX');renderer.render(scene,camera);
      },dispose};
    }catch(error){dispose();console.warn('Product image fallback:',error.message)}
  }
  return {scenes,dispose(){Object.values(scenes).forEach(scene=>scene.dispose())}};
}
