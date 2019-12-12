
/*jshint esversion: 6 */
// @ts-check

import * as T from "./THREE/src/Three.js";
import { GrObject } from "./framework/GrObject.js";
import { CompressedTexture } from "./THREE/src/Three.js";
import * as Loaders from "./Framework/loaders.js";

// define your buildings here - remember, they need to be imported
// into the "main" program
export class Road extends GrObject
{
  constructor(params={})
  {
    let g = new T.Group();
    let box = new T.BoxGeometry(params.l,0.05,params.w);
    let color = params.c ? Number(params.sc) : "#909090";
    let material = new T.MeshStandardMaterial({side:T.DoubleSide, color:color,roughness:1.0});
    let road = new T.Mesh(box, material);
    road.position.set(params.x,0.05,params.z);
    road.rotateY(params.a);
    g.add(road);
    super("road",g);
  }
}
export class Person extends Loaders.FbxGrObject {
  constructor(params={}) {
      super({fbx:"./Examples/Assets/suit02.fbx",norm:2.0,name:`Person`});
      // the fbx loader puts the car on the ground - we need a ride point above the ground
      //this.objects[0].rotateY(-Math.PI / 2);
      this.objects[0].position.x = params.x ? Number(params.x) : 0;
      this.objects[0].position.y = params.y ? Number(params.y) : 0;
      this.objects[0].position.z = params.z ? Number(params.z) : 0;
      this.objects[0].scale.set(params.s ? Number(params.s) : 0.8,params.s ? Number(params.s) : 0.8, params.s ? Number(params.s) : 0.8);
      this.objects[0].rotateY(params.r ? Number(params.r) : 0);
    
  }
}
let busObCtr = 0;
export class Bus extends Loaders.FbxGrObject {
  constructor(params={}) {
      super({fbx:"./Examples/Assets/3d-model.fbx",norm:2.0,name:`Bus-${busObCtr++}`});
      // the fbx loader puts the car on the ground - we need a ride point above the ground
      //this.objects[0].rotateY(-Math.PI / 2);
      this.objects[0].position.x = params.x ? Number(params.x) : 0;
      this.objects[0].position.y = params.y ? Number(params.y) : 0;
      this.objects[0].position.z = params.z ? Number(params.z) : 0;
      this.objects[0].scale.set(params.s ? Number(params.s) : 0.8,params.s ? Number(params.s) : 0.8, params.s ? Number(params.s) : 0.8);
      this.objects[0].rotateY(params.r ? Number(params.r) : 0);
      this.count = 0
      this.speed1 = params.sp1 ? Number(params.sp1) : 0.05;
      this.speed2 = params.sp2 ? Number(params.sp2) : 0.05;
      this.direction = params.d ? Number(params.d) : 1;
      this.ridePoint = new T.Object3D();
      this.ridePoint.translateY(0.5);
      this.objects[0].add(this.ridePoint);
      this.rideable = this.ridePoint;
  }
  tick(delta)
  {
    this.count = this.count + 1;
    //travel dir 1
    if(this.count < 256)
    {
      this.objects[0].translateZ(this.speed1);
    }
    //first turn
   if(this.count >= 256 && this.count < 288)
    {
      this.objects[0].translateZ(this.speed1);
      this.objects[0].rotateY(this.direction * Math.PI / 64);
    }
    //travel dir 2
    if(this.count >= 288 && this.count < 544)
    {
      this.objects[0].translateZ(this.speed2);
    }
    //second turn
    if(this.count >= 544 && this.count < 576)
    {
      this.objects[0].translateZ(this.speed2);
      this.objects[0].rotateY(this.direction * Math.PI / 64);
    }
    //reset loop
    if(this.count >= 576)
    {
      this.count = 0;
    }
    

  }
}
let planeU = 0;
let PlaneLap = 0;
export class Plane extends GrObject{
  constructor(params={}, points={})
  {
    let copter = new T.Group();
    //make its body
    let body = new T.CylinderGeometry(.4,.4,.8);
    let bodyMat= new T.MeshStandardMaterial({color:"blue"});
    let bodyMesh = new T.Mesh(body,bodyMat);

    //head
    let cockpit = new T.SphereGeometry(0.3);
    let pitMat = new T.MeshStandardMaterial({color:"white"});
    let pitMesh = new T.Mesh(cockpit, pitMat);
    pitMesh.position.y = .7;

    //arms
    let wing = new T.BoxGeometry(.10, 3.5, .1);
    let wing1 = new T.Mesh(wing, bodyMat);
    let wing2 = new T.Mesh(wing, bodyMat);
    wing1.position.z = -.15;
    wing2.position.z = -.15;
    wing1.rotateZ(Math.PI/4);
    wing2.rotateZ(-Math.PI/4);

    //props
    let rotor = new T.BoxGeometry(.1, 1, .05);
    let rotorMaterial = new T.MeshStandardMaterial({color:"white"});
    let props = [];
    let offset = 1.2;

    for(let i = 0; i < 8; i++){
        props[i] = new T.Mesh(rotor, rotorMaterial);
        props[i].position.z = -.2;


        if(i < 4){
            
            props[i].rotateZ(Math.PI/4);

        }
        else{
            props[i].rotateZ(-Math.PI/4);
     
            if(i == 4)
            {
            props[i - 4].position.x = props[i].position.x =  offset;
            props[i - 4].position.y = props[i].position.y =  offset;


            }
            else if(i == 5)
            {
                props[i - 4].position.x = props[i].position.x =  offset;
                props[i - 4].position.y = props[i].position.y =  -offset;

            }
            else if(i == 6)
            {
                props[i - 4].position.x = props[i].position.x =  -offset;
                props[i - 4].position.y = props[i].position.y =  offset;

            }
            else if(i == 7)
            {
                props[i - 4].position.x = props[i].position.x = -offset;
                props[i - 4].position.y = props[i].position.y = -offset;

            }
        }
        copter.add(props[i]);

    }
    
    
    
    
    
    copter.add(bodyMesh);
    copter.add(pitMesh);
    copter.add(wing1);
    copter.add(wing2);
    copter.position.y = 2.5;
    copter.rotateX(Math.PI /2);


  


    super("plane",copter, [['x',-5,5,2],['z',-5,5,2]]);
    this.propels = props;
    this.whole_ob = copter;
    this.points = points;
    this.u = 0;
    this.rideable = this.objects[0];
    copter.position.x = params.x ? Number(params.x) : 0;
    copter.position.y = params.y ? Number(params.y) : 0;
    copter.position.z = params.z ? Number(params.z) : 0;
    copter.scale.set(params.s ? Number(params.s) : 0.8,params.s ? Number(params.s) : 0.8, params.s ? Number(params.s) : 0.8);
    
    
  }
  tick(delta)
  {
    planeU = planeU + 1;
   
    for(let i = 0; i < 8; i++)
    {
      this.propels[i].rotateZ(4*Math.PI/180);
    }
   if((PlaneLap == 1 && planeU < 30) || (PlaneLap == 3 && planeU > 150 && planeU < 180))
   {
    this.whole_ob.rotateX(Math.PI / 100);
   }
   if((PlaneLap == 3 && planeU < 30) || (PlaneLap == 1 && planeU > 150 && planeU < 180))
   {
    this.whole_ob.rotateX(-Math.PI / 100);
   }
   if(planeU >= 180)
    {
      this.whole_ob.rotateZ(Math.PI / 40);
    }
    if(planeU >= 200)
    {
      //this.whole_ob.rotateZ(Math.PI / 2);
      PlaneLap++;
      if(PlaneLap == 4)
      {
        PlaneLap = 0;
      }
      planeU = 0;
    }
    this.whole_ob.translateY(0.1);

  }

  
}

export class Tree extends GrObject{

    constructor(params={})
    {
        let Tree = new T.Group();
        const bodyMat = new T.MeshStandardMaterial( {
            color: 0x964B00, // brown
            flatShading: true,
          } );
          
          let tl=new T.TextureLoader().load("./Images/grass.jpg");
          let Tmaterial = new T.MeshStandardMaterial({map:tl,roughness:0.75});
       
          const base = new T.CylinderBufferGeometry( 0.25, 0.25, 3, 12 );
          const baseMesh = new T.Mesh( base, bodyMat );
          const top = new T.SphereBufferGeometry(1,32,32);
          const topMesh = new T.Mesh(top,Tmaterial);
          baseMesh.position.set(0,1.5,0);
          topMesh.position.set(0,2.6,0);
          Tree.add(baseMesh);
          Tree.add(topMesh);
          const branch = new T.CylinderBufferGeometry( 0.15, 0.15, 0.5, 12 );
          let angle = 0;
          let branches = [];
          if(params.t > 0)
          {
            for(let i = 0; i < params.t;i++)
            {
              branches.push(new T.Mesh(branch,bodyMat));
              if(i % 2 == 1)
              {
                branches[i].position.set(0,1.5,0);
              }
              else
              {
                branches[i].position.set(0,1,0);
              }
              branches[i].rotateY(angle);
              branches[i].rotateZ(Math.PI / 2);
              branches[i].translateY(0.5);
              angle += (Math.PI / 2);
              Tree.add(branches[i]);
            }
          }
          Tree.position.x = params.x ? Number(params.x) : 0;
          Tree.position.y = params.y ? Number(params.y) : 0.0;
          Tree.position.z = params.z ? Number(params.z) : 0;
          
          
          Tree.scale.set(params.s ? Number(params.s) : 0.8,params.s ? Number(params.s) : 0.8, params.s ? Number(params.s) : 0.8);
          Tree.rotateY(params.r ? Number(params.r) : 0);
          super("tree",Tree);

    }
}
export class House1 extends GrObject{
    constructor()
    {
        let g = new T.Group();
        let box = new T.BoxGeometry(1,1,1);
        let bl=new T.TextureLoader().load("./Images/standBricks.jpg");
        let Bmaterial = new T.MeshStandardMaterial({map:bl,roughness:0.75});
        let baseMesh = new T.Mesh(box,Bmaterial);
        //let baseMesh = new T.Mesh(box,new T.MeshStandardMaterial({color:0xcb4154}));
        baseMesh.position.set(3,0.5,3);
        g.add(baseMesh);
        let roof = new T.Group();
        let main = new T.BoxGeometry(1,0.1,1.2);
        let main1 = new T.Mesh(main,new T.MeshStandardMaterial({color:0x964B00}));
        main1.position.set(3,1.4,3.3);
        main1.rotateX(Math.PI/3);
        let main2 = new T.Mesh(main,new T.MeshStandardMaterial({color:0x964B00}));
        main2.position.set(3,1.4,2.7);
        main2.rotateX(-Math.PI/3);
        roof.add(main1);
        roof.add(main2);
        
        let side = new T.Geometry();
        side.vertices.push(new T.Vector3(0,0,0));
        side.vertices.push(new T.Vector3(0,Math.sqrt(2) / 1.5,0.5));
        side.vertices.push(new T.Vector3(0,0,1));
        let f11 = new T.Face3(0,1,2);
        side.faces.push(f11);
        side.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(0,0.3), new T.Vector2(0.3,0.3)]);
        side.computeFaceNormals();

        let side2 = new T.Geometry();
        side2.vertices.push(new T.Vector3(0,0,0));
        side2.vertices.push(new T.Vector3(0,Math.sqrt(2) / 1.5,0.5));
        side2.vertices.push(new T.Vector3(0,0,1));
        let f12 = new T.Face3(0,2,1);
        side2.faces.push(f12);
        side2.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(0,0.3), new T.Vector2(0.3,0.3)]);
        side2.computeFaceNormals();

        let tl=new T.TextureLoader().load("/Images/whiteBricks.jpg");
        let material = new T.MeshStandardMaterial({map:tl,roughness:0.75});
        let sideMesh = new T.Mesh(side,material);
        sideMesh.position.set(3.5,1,2.5);
        let sideMesh2 = new T.Mesh(side2,material);
        sideMesh2.position.set(2.5,1,2.5);
        roof.add(sideMesh);
        roof.add(sideMesh2);
        g.add(roof);

        //add the door
        let front = new T.Geometry();
        front.vertices.push(new T.Vector3(0,0,0));
        front.vertices.push(new T.Vector3(0,0.6,0));
        front.vertices.push(new T.Vector3(0,0.6,0.3));
        front.vertices.push(new T.Vector3(0,0,0.3));
        let f1 = new T.Face3(0,1,2);
        front.faces.push(f1);
        front.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(0,1), new T.Vector2(1,1)]);
        let f2 = new T.Face3(2,3,0);
        front.faces.push(f2);
        front.faceVertexUvs[0].push([new T.Vector2(1,1), new T.Vector2(1,0), new T.Vector2(0,0)]);
        let ta=new T.TextureLoader().load("/Images/door.png");
        let Dmaterial = new T.MeshStandardMaterial({map:ta,roughness:0.75});
        let doorMesh = new T.Mesh(front,Dmaterial);
        doorMesh.position.set(3.52,0,3);
        g.add(doorMesh);

        //add the window
        let window = new T.Geometry();
        window.vertices.push(new T.Vector3(0,0,0));
        window.vertices.push(new T.Vector3(0,0.4,0));
        window.vertices.push(new T.Vector3(0,0.4,0.3));
        window.vertices.push(new T.Vector3(0,0,0.3));
        let w1 = new T.Face3(0,1,2);
        window.faces.push(w1);
        window.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(0,1), new T.Vector2(1,1)]);
        let w2 = new T.Face3(2,3,0);
        window.faces.push(w2);
        window.faceVertexUvs[0].push([new T.Vector2(1,1), new T.Vector2(1,0), new T.Vector2(0,0)]);
        let wa=new T.TextureLoader().load("/Images/window.png");
        let Wmaterial = new T.MeshStandardMaterial({map:wa,roughness:0.75});
        let windMesh = new T.Mesh(window,Wmaterial);
        windMesh.position.set(3.52,0.2,2.6);
        g.add(windMesh);


        super("house",g, [['x',-5,5,2],['z',-5,5,2]]);
    }
}
export class House2 extends GrObject{
    constructor(params={})
    {
        let g = new T.Group();
        let box = new T.BoxGeometry(1,3,1);
        let bl=new T.TextureLoader().load("./Images/standBricks.jpg");
        let Bmaterial = new T.MeshStandardMaterial({map:bl,roughness:0.75});
        let baseMesh = new T.Mesh(box,Bmaterial);
        //let baseMesh = new T.Mesh(box,new T.MeshStandardMaterial({color:0xFFFFFF}));
        baseMesh.position.set(-3,1.5,-3);
        g.add(baseMesh);

        let side = new T.Geometry();
        //point at the top
        side.vertices.push(new T.Vector3(0,1,0));
        side.vertices.push(new T.Vector3(0.5,0,0.5));
        side.vertices.push(new T.Vector3(0.5,0,-0.5));
        side.vertices.push(new T.Vector3(-0.5,0,-0.5));
        side.vertices.push(new T.Vector3(-0.5,0,0.5));
        let f1 = new T.Face3(0,1,2);
        side.faces.push(f1);
        side.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(0,0.5), new T.Vector2(0.5,0.5)]);
        let f2 = new T.Face3(0,2,3);
        side.faces.push(f2);
        side.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(0,0.5), new T.Vector2(0.5,0.5)]);
        let f3 = new T.Face3(0,3,4);
        side.faces.push(f3);
        side.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(0,0.5), new T.Vector2(0.5,0.5)]);
        let f4 = new T.Face3(0,4,1);
        side.faces.push(f4);
        side.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(0,0.5), new T.Vector2(0.5,0.5)]);
        //side.faceVertexUvs[1].push([new T.Vector2(0,0), new T.Vector2(0,0.5), new T.Vector2(0.5,0.5)]);
        side.computeFaceNormals();
        let tl=new T.TextureLoader().load("./Images/whiteBricks.jpg");
        let material = new T.MeshStandardMaterial({map:tl,roughness:0.75});
        let sideMesh = new T.Mesh(side,material);
        sideMesh.position.set(-3,3,-3);
        g.add(sideMesh);

        let front = new T.Geometry();
        front.vertices.push(new T.Vector3(0,0,0));
        front.vertices.push(new T.Vector3(0,0.6,0));
        front.vertices.push(new T.Vector3(0,0.6,0.3));
        front.vertices.push(new T.Vector3(0,0,0.3));
        let d1 = new T.Face3(0,1,2);
        front.faces.push(d1);
        front.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(0,1), new T.Vector2(1,1)]);
        let d2 = new T.Face3(2,3,0);
        front.faces.push(d2);
        front.faceVertexUvs[0].push([new T.Vector2(1,1), new T.Vector2(1,0), new T.Vector2(0,0)]);
        let ta=new T.TextureLoader().load("./Images/door.png");
        let Dmaterial = new T.MeshStandardMaterial({map:ta,roughness:0.75});
        let doorMesh = new T.Mesh(front,Dmaterial);
        doorMesh.position.set(-2.48,0,-3);
        g.add(doorMesh);

        //add the window
        let window = new T.Geometry();
        window.vertices.push(new T.Vector3(0,0,0));
        window.vertices.push(new T.Vector3(0,0.4,0));
        window.vertices.push(new T.Vector3(0,0.4,0.3));
        window.vertices.push(new T.Vector3(0,0,0.3));
        let w1 = new T.Face3(0,1,2);
        window.faces.push(w1);
        window.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(0,1), new T.Vector2(1,1)]);
        let w2 = new T.Face3(2,3,0);
        window.faces.push(w2);
        window.faceVertexUvs[0].push([new T.Vector2(1,1), new T.Vector2(1,0), new T.Vector2(0,0)]);
        let wa=new T.TextureLoader().load("./Images/window.png");
        let Wmaterial = new T.MeshStandardMaterial({map:wa,roughness:0.75});
        let windMesh = new T.Mesh(window,Wmaterial);
        windMesh.position.set(-2.48,0.2,-3.4);
        let windMesh2 = new T.Mesh(window,Wmaterial);
        windMesh2.position.set(-2.48,1.2,-3.4);
        let windMesh3 = new T.Mesh(window,Wmaterial);
        windMesh3.position.set(-2.48,2.2,-3.4);
        g.add(windMesh);
        g.add(windMesh2);
        g.add(windMesh3);
        g.translateX(3);
        g.translateZ(3);
        g.position.x = params.x ? Number(params.x) : 0;
        g.position.y = params.y ? Number(params.y) : 0;
        g.position.z = params.z ? Number(params.z) : 0;
        g.scale.set(params.s ? Number(params.s) : 0.8,params.s ? Number(params.s) : 0.8, params.s ? Number(params.s) : 0.8);
        g.rotateY(params.r ? Number(params.r) : 0);
        super("house",g);
    }
}
export class House3 extends GrObject{
    constructor(params = {}){
        let g = new T.Group();
        let box = new T.BoxGeometry(1.5,1.5,1.5);
        let bl=new T.TextureLoader().load("./Images/standBricks.jpg");
        let Bmaterial = new T.MeshStandardMaterial({map:bl,roughness:0.75});
        let baseMesh = new T.Mesh(box,Bmaterial);
        //let baseMesh = new T.Mesh(box,new T.MeshStandardMaterial({color:0xcb4154}));
        baseMesh.position.set(3,0.5,-3);
        g.add(baseMesh);
        
        
        //add the door
        let front = new T.Geometry();
        front.vertices.push(new T.Vector3(0,0,0));
        front.vertices.push(new T.Vector3(0,0.6,0));
        front.vertices.push(new T.Vector3(0,0.6,0.3));
        front.vertices.push(new T.Vector3(0,0,0.3));
        let d1 = new T.Face3(0,1,2);
        front.faces.push(d1);
        front.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(0,1), new T.Vector2(1,1)]);
        let d2 = new T.Face3(2,3,0);
        front.faces.push(d2);
        front.faceVertexUvs[0].push([new T.Vector2(1,1), new T.Vector2(1,0), new T.Vector2(0,0)]);
        let ta=new T.TextureLoader().load("./Images/door.png");
        let Dmaterial = new T.MeshStandardMaterial({map:ta,roughness:0.75});
        let doorMesh = new T.Mesh(front,Dmaterial);
        doorMesh.position.set(3.77,0,-3.2);
        g.add(doorMesh);

        //add the roof
        let side = new T.Geometry();
        //point at the top
        side.vertices.push(new T.Vector3(0,1,.75)); //top 1   0
        side.vertices.push(new T.Vector3(-1.5,1,.75)); // top 2    1
        side.vertices.push(new T.Vector3(0,0,0)); //front left  2
        side.vertices.push(new T.Vector3(0,0,1.5)); //front right   3
        side.vertices.push(new T.Vector3(-1.5,0,1.5)); //back right 4
        side.vertices.push(new T.Vector3(-1.5,0,0)); //back left    5
   
        let f1 = new T.Face3(0,3,2);
        side.faces.push(f1);
        side.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(0,0.5), new T.Vector2(0.5,0.5)]);
        let f2 = new T.Face3(4,3,0);
        side.faces.push(f2);
        side.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(0,0.5), new T.Vector2(0.5,0.5)]);
        let f3 = new T.Face3(0,1,4);
        side.faces.push(f3);
        side.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(0,0.5), new T.Vector2(0.5,0.5)]);
        let f4 = new T.Face3(0,2,5);
        side.faces.push(f4);
        side.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(0,0.5), new T.Vector2(0.5,0.5)]);
        let f5 = new T.Face3(5,1,0);
        side.faces.push(f5);
        side.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(0,0.5), new T.Vector2(0.5,0.5)]);
        let f6 = new T.Face3(1,5,4);
        side.faces.push(f6);
        side.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(0,0.5), new T.Vector2(0.5,0.5)]);
        //side.faceVertexUvs[1].push([new T.Vector2(0,0), new T.Vector2(0,0.5), new T.Vector2(0.5,0.5)]);
        
        side.computeFaceNormals();
        let tl=new T.TextureLoader().load("./Images/whiteBricks.jpg");
        let material = new T.MeshStandardMaterial({map:tl,roughness:0.75});
        let sideMesh = new T.Mesh(side,material);
        sideMesh.position.set(3.75,1.25,-3.75);
        g.add(sideMesh);


        //add the window
        let window = new T.Geometry();
        window.vertices.push(new T.Vector3(0,0,0));
        window.vertices.push(new T.Vector3(0,0.4,0));
        window.vertices.push(new T.Vector3(0,0.4,0.3));
        window.vertices.push(new T.Vector3(0,0,0.3));
        let w1 = new T.Face3(0,1,2);
        window.faces.push(w1);
        window.faceVertexUvs[0].push([new T.Vector2(0,0), new T.Vector2(0,1), new T.Vector2(1,1)]);
        let w2 = new T.Face3(2,3,0);
        window.faces.push(w2);
        window.faceVertexUvs[0].push([new T.Vector2(1,1), new T.Vector2(1,0), new T.Vector2(0,0)]);
        let wa=new T.TextureLoader().load("./Images/window.png");
        let Wmaterial = new T.MeshStandardMaterial({map:wa,roughness:0.75});
        let windMesh = new T.Mesh(window,Wmaterial);
        windMesh.position.set(3.77,0.2,-3.6);
        let windMesh2 = new T.Mesh(window,Wmaterial);
        windMesh2.position.set(3.77,0.2,-2.8);
        let windMesh3 = new T.Mesh(window,Wmaterial);
        windMesh3.position.set(3.77,0.7,-3.6);
        let windMesh4 = new T.Mesh(window,Wmaterial);
        windMesh4.position.set(3.77,0.7,-2.8);
        g.add(windMesh);
        g.add(windMesh2);
        g.add(windMesh3);
        g.add(windMesh4);
        g.position.set(-3,0,3);
        g.position.x = params.x ? Number(params.x) : 0;
        g.position.y = params.y ? Number(params.y) : 0;
        g.position.z = params.z ? Number(params.z) : 0;
        g.scale.set(params.s ? Number(params.s) : 0.8,params.s ? Number(params.s) : 0.8, params.s ? Number(params.s) : 0.8);
        g.rotateY(params.r ? Number(params.r) : 0);

        super("house",g);
    }
    
}
export class Train extends GrObject {
   
      constructor(params={})
      {
          
          const train = new T.Group();
          //Materials
          const body = new T.MeshStandardMaterial( {
              color: 0xff3333, // red
              flatShading: true,
            } );
          
            // just as with textures, we need to put colors into linear color space
            body.color.convertSRGBToLinear();
          
            const detail = new T.MeshStandardMaterial( {
              color: 0x333333, // darkgrey
              flatShading: true,
            } );
          
            detail.color.convertSRGBToLinear();
            //Geometries
            const nose = new T.CylinderBufferGeometry( 0.75, 0.75, 3, 12 );
        
            const cabin = new T.BoxBufferGeometry( 2, 2.25, 1.5 );
          
            const chimney = new T.CylinderBufferGeometry( 0.3, 0.1, 0.5 );
          
            // we can reuse a single cylinder geometry for all 4 wheels
            const wheel = new T.CylinderBufferGeometry( 0.4, 0.4, 1.75, 16 );
            wheel.rotateX( Math.PI / 2 );
          //const materials = this.createMaterials();
          //const geometries = this.createGeometries();
          const noseA = new T.Mesh( nose, body );
      noseA.rotation.z = Math.PI / 2;
    
      noseA.position.x = -1;
    
      const cabinA = new T.Mesh( cabin, body );
      cabinA.position.set( 1.5, 0.4, 0 );
    
      const chimneyA = new T.Mesh( chimney, detail );
      chimneyA.position.set( -2, 0.9, 0 );
    
      const smallWheelRear = new T.Mesh( wheel, detail );
      smallWheelRear.position.set( 0, -0.5, 0 );
    
      const smallWheelCenter = smallWheelRear.clone();
      smallWheelCenter.position.x = -1;
    
      const smallWheelFront = smallWheelRear.clone();
      smallWheelFront.position.x = -2;
    
      const bigWheel = smallWheelRear.clone();
      bigWheel.scale.set( 2, 2, 1.25 );
      bigWheel.position.set( 1.5, -0.1, 0 );
    
      train.add(
    
        noseA,
        cabinA,
        chimneyA,
    
        smallWheelRear,
        smallWheelCenter,
        smallWheelFront,
        bigWheel,
    
      );
      //train.position.set(0,1,0);
      train.position.x = params.x ? Number(params.x) : 0;
      train.position.y = params.y ? Number(params.y) : 0.8;
      train.position.z = params.z ? Number(params.z) : 0;
      train.scale.set(params.s ? Number(params.s) : 0.8,params.s ? Number(params.s) : 0.8, params.s ? Number(params.s) : 0.8);
      train.rotateY(params.r ? Number(params.r) : 0);
      super("train",train);
      }
      createMaterials(){
  
          const body = new T.MeshStandardMaterial( {
              color: 0xff3333, // red
              flatShading: true,
            } );
          
            // just as with textures, we need to put colors into linear color space
            body.color.convertSRGBToLinear();
          
            const detail = new T.MeshStandardMaterial( {
              color: 0x333333, // darkgrey
              flatShading: true,
            } );
        
          detail.color.convertSRGBToLinear();
        
          return {
        
            body,
            detail,
        
          };
        
        }
        
        createGeometries() {
        
          const nose = new T.CylinderBufferGeometry( 0.75, 0.75, 3, 12 );
        
          const cabin = new T.BoxBufferGeometry( 2, 2.25, 1.5 );
        
          const chimney = new T.CylinderBufferGeometry( 0.3, 0.1, 0.5 );
        
          // we can reuse a single cylinder geometry for all 4 wheels
          const wheel = new T.CylinderBufferGeometry( 0.4, 0.4, 1.75, 16 );
          wheel.rotateX( Math.PI / 2 );
        
        
          return {
            nose,
            cabin,
            chimney,
            wheel,
          };
        
        }
  }

