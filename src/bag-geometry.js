  export function bagMesh(){const data=[],rows=[[-1.8,1.00,.34],[-1.72,1.03,.38],[-.3,1.01,.40],[.85,.98,.29],[1.23,.89,.12],[1.78,.89,.04],[1.86,.85,.025]];
    function quad(points,normal,front){for(const i of [0,1,2,0,2,3]){const p=points[i];data.push(...p,...normal,front?(p[0]+1.05)/2.1:.015,front?(p[1]+1.8)/3.66:.985);}}
    for(let i=0;i<rows.length-1;i++){const [y,w,z]=rows[i],[Y,W,Z]=rows[i+1];quad([[-w,y,z],[w,y,z],[W,Y,Z],[-W,Y,Z]],[0,0,1],true);quad([[w,y,z],[w,y,-z],[W,Y,-Z],[W,Y,Z]],[1,.04,0],false);quad([[-w,y,-z],[-w,y,z],[-W,Y,Z],[-W,Y,-Z]],[-1,.04,0],false);quad([[w,y,-z],[-w,y,-z],[-W,Y,-Z],[W,Y,-Z]],[0,0,-1],false);}
    return new Float32Array(data);
  }
