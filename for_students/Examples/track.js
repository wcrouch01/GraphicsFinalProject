/*jshint esversion: 6 */
// @ts-check

/*
 * Graphics Town Example Objects
 *
 * Simple Circular Track - and an object that goes around on it
 */

import * as T from "../THREE/src/Three.js";
// we need the GrObject
import { GrObject } from "../Framework/GrObject.js";
import { GrCube } from "../Framework/SimpleObjects.js";
import * as Loaders from "../Framework/loaders.js";

/**
 * This is a really simple track - just a circle
 * But in addition to having geometry, objects on the track can ask for their
 * position (given their U value). 
 * They can also ask for the direction vector.
 */

export class CircularTrack extends GrObject {
    constructor(params={}) {
        let radius = params.radius || 6;
        let width = params.width || 1;
        let ring = new T.RingGeometry(radius-width,radius+width,20,3);
        let material = new T.MeshStandardMaterial({side:T.DoubleSide, color:"#909090",roughness:1.0});
        let mesh = new T.Mesh(ring, material);
        mesh.rotateX(Math.PI/2);
        let group = new T.Group();
        group.add(mesh);
        group.translateX(params.x || 0);
        group.translateY(params.bias || 0.1); // raise track above ground to avoid z-fight
        group.translateZ(params.z || 0);
        super(`CircularTrack`,group);

        this.x = params.x || 0;
        this.z = params.z || 0;
        this.y = params.bias || 0.1;
        this.r = radius;
    }
    eval(u) {
        let p = u * 2 * Math.PI;
        return [this.x + this.r * Math.cos(p), this.y, this.z + this.r * Math.sin(p)];
    }
    tangent(u) {
        let p = u * 2 * Math.PI;
        // unit tangent vector - not the real derivative
        return [Math.sin(p), 0, -Math.cos(p)];
    }
}

/**
 * A simple object to go around a track - key thing, it knows the track so it can ask the track
 * where it should be 
 */
export class TrackCube extends GrCube {
    constructor(track, params={}) {
        super({});
        this.track = track;
        this.u = 0;
        this.rideable = this.objects[0];
    }
    tick(delta,timeOfDay) {
        this.u += delta / 2000;
        let pos = this.track.eval(this.u);
        // remember, the center of the cube needs to be above ground!
        this.objects[0].position.set(pos[0],0.5+pos[1],pos[2]);
        let dir = this.track.tangent(this.u);
        // since we can't easily construct the matrix, figure out the rotation
        // easy since this is 2D!
        let zAngle = Math.atan2(dir[2],dir[0]);
        // turn the object so the Z axis is facing in that direction
        this.objects[0].rotation.y = -zAngle - Math.PI/2;
    }
}

/**
 * A Less Simple Object to go around the track
 */
export class TrackCar extends Loaders.FbxGrObject {
    constructor(track) {
        super({fbx:"./Examples/Assets/teeny racecar.fbx",norm:2.0,name:"Track Car"});
        this.track = track;
        this.u = 0;
        // the fbx loader puts the car on the ground - we need a ride point above the ground
        this.ridePoint = new T.Object3D();
        this.ridePoint.translateY(0.5);
        this.objects[0].add(this.ridePoint);
        this.rideable = this.ridePoint;
    }
    tick(delta,timeOfDay) {
        this.u += delta / 2000;
        let pos = this.track.eval(this.u);
        this.objects[0].position.set(pos[0],pos[1],pos[2]);
        let dir = this.track.tangent(this.u);
        // since we can't easily construct the matrix, figure out the rotation
        // easy since this is 2D!
        let zAngle = Math.atan2(dir[2],dir[0]);
        // turn the object so the Z axis is facing in that direction
        this.objects[0].rotation.y = -zAngle - Math.PI/2;
    }
}
export class TrackTrain extends GrObject{
    constructor(track, params={})
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
    train.position.y = params.y ? Number(params.y) : 1.5;
    train.position.z = params.z ? Number(params.z) : 0;
    train.scale.set(params.s ? Number(params.s) : 0.8,params.s ? Number(params.s) : 0.8, params.s ? Number(params.s) : 0.8);
    train.rotateY(params.r ? Number(params.r) : 0);
    super("train",train);
    this.track = track;
    this.u = 0;
    // the fbx loader puts the car on the ground - we need a ride point above the ground
    this.ridePoint = new T.Object3D();
    this.ridePoint.translateY(0.5);
    this.objects[0].add(this.ridePoint);
    this.rideable = this.ridePoint;
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
/*
    constructor(track) {
        
        super({fbx:"./Examples/Assets/teeny racecar.fbx",norm:2.0,name:"Track Car"});
        this.track = track;
        this.u = 0;
        // the fbx loader puts the car on the ground - we need a ride point above the ground
        this.ridePoint = new T.Object3D();
        this.ridePoint.translateY(0.5);
        this.objects[0].add(this.ridePoint);
        this.rideable = this.ridePoint;
    }
    */
    tick(delta,timeOfDay) {
        this.u += delta / 2000;
        let pos = this.track.eval(this.u);
        this.objects[0].position.set(pos[0],pos[1] + 0.5,pos[2]);
        let dir = this.track.tangent(this.u);
        // since we can't easily construct the matrix, figure out the rotation
        // easy since this is 2D!
        let zAngle = Math.atan2(dir[2],dir[0]);
        // turn the object so the Z axis is facing in that direction
        this.objects[0].rotation.y = -zAngle; //- Math.PI/2;
    }
}