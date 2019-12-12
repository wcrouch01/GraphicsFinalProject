/*jshint esversion: 6 */
// @ts-check

import * as T from "./THREE/src/Three.js";
import {GrObject} from "./framework/GrObject.js";

function degreesToRadians(deg) {
    return deg * Math.PI / 180;
}
let time = 0;
let craneObCtr = 0;
let armR = 0;
let armD = Math.PI / 256;
let wireS = 0;
let armMax = Math.PI / 2;
let wireMax = 30;
// A simple crane
/**
 * @typedef CraneProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrCrane extends GrObject {
    /**
     * @param {CraneProperties} params 
     */
	
    constructor(params={}) {
		let crane = new T.Group();
		
		let exSettings = {
			steps: 2,
			depth: 0.5,
			bevelEnabled: false
		};

		// first, we define the base of the crane.
		// Just draw a curve for the shape, then use three's "ExtrudeGeometry"
		// to create the shape itself.
		/**@type THREE.Shape */
		let base_curve = new T.Shape();
		base_curve.moveTo(-0.5, 0);
		base_curve.lineTo(-0.5, 2);
		base_curve.lineTo(-0.25, 2.25);
		base_curve.lineTo(-0.25, 5);
		base_curve.lineTo(-0.2, 5);
		base_curve.lineTo(-0.2, 5.5);
		base_curve.lineTo(0.2, 5.5);
		base_curve.lineTo(0.2, 5);
		base_curve.lineTo(0.25, 5);
		base_curve.lineTo(0.25, 2.25);
		base_curve.lineTo(0.5, 2);
		base_curve.lineTo(0.5, 0);
		base_curve.lineTo(-0.5, 0);
		let base_geom = new T.ExtrudeGeometry(base_curve, exSettings);
		let crane_mat = new T.MeshStandardMaterial({color:"yellow", metalness:0.5, roughness:0.7});
		let base = new T.Mesh(base_geom, crane_mat);
		crane.add(base);
		base.translateZ(-0.25);

		// Use a similar process to create the cross-arm.
		// Note, we create a group for the arm, and move it to the proper position.
		// This ensures rotations will behave nicely,
		// and we just have that one point to work with for animation/sliders.
		let arm_group = new T.Group();
		crane.add(arm_group);
		arm_group.translateY(4.5);
		let arm_curve = new T.Shape();
		arm_curve.moveTo(-1.5, 0);
		arm_curve.lineTo(-1.5, 0.25);
		arm_curve.lineTo(-0.5, 0.5);
		arm_curve.lineTo(4, 0.4);
		arm_curve.lineTo(4, 0);
		arm_curve.lineTo(-1.5, 0);
		let arm_geom = new T.ExtrudeGeometry(arm_curve, exSettings);
		let arm = new T.Mesh(arm_geom, crane_mat);
		arm_group.add(arm);
		arm.translateZ(-0.25);

		// Finally, add the hanging "wire" for the crane arm,
		// which is what carries materials in a real crane.
		// The extrusion makes this not look very wire-like, but that's fine for what we're doing.
		let wire_group = new T.Group();
		arm_group.add(wire_group);
		wire_group.translateX(3);
		let wire_curve = new T.Shape();
		wire_curve.moveTo(-0.25, 0);
		wire_curve.lineTo(-0.25, -0.25);
		wire_curve.lineTo(-0.05, -0.3);
		wire_curve.lineTo(-0.05, -3);
		wire_curve.lineTo(0.05, -3);
		wire_curve.lineTo(0.05, -0.3);
		wire_curve.lineTo(0.25, -0.25);
		wire_curve.lineTo(0.25, 0);
		wire_curve.lineTo(-0.25, 0);
		let wire_geom = new T.ExtrudeGeometry(wire_curve, exSettings);
		let wire_mat = new T.MeshStandardMaterial({color:"#888888", metalness:0.6, roughness:0.3});
		let wire = new T.Mesh(wire_geom, wire_mat);
		wire_group.add(wire);
		let boxG = new T.BoxGeometry(1,1,1);
		let boxMat = new T.MeshStandardMaterial({color:"#FFD6A4", metalness:0.6, roughness:0.3});
		let boxMesh = new T.Mesh(boxG, boxMat);
		boxMesh.position.set(0,-3,0);
		let boxGroup = new T.Group();
		boxGroup.add(boxMesh);
		wire.translateZ(-0.25);

        // note that we have to make the Object3D before we can call
		// super and we have to call super before we can use this
		// This is also where we define parameters for UI sliders.
		// These have format "name," "min", "max", "starting value."
		// Sliders are standardized to have 30 "steps" per slider,
		// so if your starting value does not fall on one of the 30 steps,
		// the starting value in the UI may be slightly different from the starting value you gave.
		super(`Crane-${craneObCtr++}`,crane,
              [ ['x',-4,4,0],
				['z',-4,4,0],
				['theta',0,360, 0],
				['wire',1,3.5,2],
                ['arm rotation',0,360,0]
			  ]);
		// Here, we store the crane, arm, and wire groups as part of the "GrCrane" object.
		// This allows us to modify transforms as part of the update function.
		this.box = boxGroup;
		this.whole_ob = crane;
		this.arm = arm_group;
		this.wire = wire_group;

        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
		this.whole_ob.position.z = params.z ? Number(params.z) : 0;
		let scale = params.size ? Number(params.size) : 1;
		crane.scale.set(scale, scale, scale);

	}

	// Wire up the wire position and arm rotation to match parameters,
	// given in the call to "super" above.
    update(paramValues) {
        this.whole_ob.position.x = paramValues[0];
        this.whole_ob.position.z = paramValues[1];
        this.whole_ob.rotation.y = degreesToRadians(paramValues[2]);
        this.wire.position.x = paramValues[3];
        this.arm.rotation.y = degreesToRadians(paramValues[4]);
	}
	
	tick(delta,timeOfDay) {
		time+=1;
		if(time < 100)
		{
			wireS += 0.1
		}
		if(time > 100 && time < 200)
		{
			wireS -= 0.1
		}
		if(time > 200 && time < 328)
		{
			armR += armD;
		}
		if(time > 328 && time < 428)
		{
			wireS += 0.1
		}
		if(time > 428 && time < 528)
		{
			wireS -= 0.1
		}
		if(time > 528 && time < 656)
		{
			armR -= armD;
		}
		if(time >= 656)
		{
			time = 0;
		}


		this.wire.scale.set(1,((wireS + 20) / 20),1);
		//wanted to try and make it drop the box, consider fixing later
		if(time < 328)
		{
			this.box.position.set(0,0,0);
		}
		this.arm.rotation.y = armR;
	}
}

let excavatorObCtr = 0;
let timeE = 0;
let exPos = 0;
// A simple excavator
/**
 * @typedef ExcavatorProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrExcavator extends GrObject {
    /**
     * @param {ExcavatorProperties} params 
     */
    constructor(params={}) {
		let excavator = new T.Group();

		let exSettings = {
			steps: 2,
			depth: 0.4,
			bevelEnabled: true,
			bevelThickness: 0.2,
			bevelSize: 0.1,
			bevelSegments: 2
		};

		// As with the crane, we define the base (treads) of the excavator.
		// We draw a line, then extrude the line with ExtrudeGeometry,
		// to get the "cutout" style object.
		// Note, for this object, we translate each piece by 0.25 on the negative x-axis.
		// This makes rotation about the y-axis work nicely
		// (since the extrusion happens along +z, a y-rotation goes around an axis on the back face of the piece,
		//  rather than an axis through the center of the piece).
		/**@type THREE.Shape */
		let base_curve = new T.Shape();
		base_curve.moveTo(-1, 0);
		base_curve.lineTo(-1.2, 0.2);
		base_curve.lineTo(-1.2, 0.4);
		base_curve.lineTo(-1, 0.6);
		base_curve.lineTo(1, 0.6);
		base_curve.lineTo(1.2, 0.4);
		base_curve.lineTo(1.2, 0.2);
		base_curve.lineTo(1, 0);
		base_curve.lineTo(-1, 0);
		let base_geom = new T.ExtrudeGeometry(base_curve, exSettings);
		let excavator_mat = new T.MeshStandardMaterial({color:"yellow", metalness:0.5, roughness:0.7});
		let base = new T.Mesh(base_geom, excavator_mat);
		excavator.add(base);
		base.translateZ(-0.2);

		// We'll add the "pedestal" piece for the cab of the excavator to sit on.
		// It can be considered a part of the treads, to some extent,
		// so it doesn't need a group of its own.
		let pedestal_curve = new T.Shape();
		pedestal_curve.moveTo(-0.35, 0);
		pedestal_curve.lineTo(-0.35, 0.25);
		pedestal_curve.lineTo(0.35, 0.25);
		pedestal_curve.lineTo(0.35, 0);
		pedestal_curve.lineTo(-0.35, 0);
		let pedestal_geom = new T.ExtrudeGeometry(pedestal_curve, exSettings);
		let pedestal = new T.Mesh(pedestal_geom, excavator_mat);
		excavator.add(pedestal);
		pedestal.translateY(0.6);
		pedestal.translateZ(-0.2);

		// For the cab, we create a new group, since the cab should be able to spin on the pedestal.
		let cab_group = new T.Group();
		excavator.add(cab_group);
		cab_group.translateY(0.7);
		let cab_curve = new T.Shape();
		cab_curve.moveTo(-1, 0);
		cab_curve.lineTo(1, 0);
		cab_curve.lineTo(1.2, 0.35);
		cab_curve.lineTo(1, 0.75);
		cab_curve.lineTo(0.25, 0.75);
		cab_curve.lineTo(0, 1.5);
		cab_curve.lineTo(-0.8, 1.5);
		cab_curve.lineTo(-1, 1.2);
		cab_curve.lineTo(-1, 0);
		let cab_geom = new T.ExtrudeGeometry(cab_curve, exSettings);
		let cab = new T.Mesh(cab_geom, excavator_mat);
		cab_group.add(cab);
		cab.translateZ(-0.2);

		// Next up is the first part of the bucket arm.
		// In general, each piece is just a series of line segments,
		// plus a bit of extra to get the geometry built and put into a group.
		// We always treat the group as the "pivot point" around which the object should rotate.
		// It is helpful to draw the lines for extrusion with the zero at our desired "pivot point."
		// This minimizes the fiddling needed to get the piece placed correctly relative to its parent's origin.
		// The remaining few pieces are very similar to the arm piece.
		let arm_group = new T.Group();
		cab_group.add(arm_group);
		arm_group.position.set(-0.8, 0.5, 0);
		let arm_curve = new T.Shape();
		arm_curve.moveTo(-2.25, 0);
		arm_curve.lineTo(-2.35, 0.15);
		arm_curve.lineTo(-1, 0.5);
		arm_curve.lineTo(0, 0.25);
		arm_curve.lineTo(-0.2, 0);
		arm_curve.lineTo(-1, 0.3);
		arm_curve.lineTo(-2.25, 0);
		let arm_geom = new T.ExtrudeGeometry(arm_curve, exSettings);
		let arm_mat = new T.MeshStandardMaterial({color:"#888888", metalness:0.6, roughness:0.3});
		let arm = new T.Mesh(arm_geom, arm_mat);
		arm_group.add(arm);
		arm.translateZ(-0.2);

		let forearm_group = new T.Group();
		arm_group.add(forearm_group);
		forearm_group.position.set(-2.1, 0, 0);
		let forearm_curve = new T.Shape();
		forearm_curve.moveTo(-1.5, 0);
		forearm_curve.lineTo(-1.5, 0.1);
		forearm_curve.lineTo(0, 0.15);
		forearm_curve.lineTo(0.15, 0);
		forearm_curve.lineTo(-1.5, 0);
		let forearm_geom = new T.ExtrudeGeometry(forearm_curve, exSettings);
		let forearm = new T.Mesh(forearm_geom, arm_mat);
		forearm_group.add(forearm);
		forearm.translateZ(-0.2);

		let bucket_group = new T.Group();
		forearm_group.add(bucket_group);
		bucket_group.position.set(-1.4, 0, 0);
		let bucket_curve = new T.Shape();
		bucket_curve.moveTo(-0.25, -0.9);
		bucket_curve.lineTo(-0.5, -0.5);
		bucket_curve.lineTo(-0.45, -0.3);
		bucket_curve.lineTo(-0.3, -0.2);
		bucket_curve.lineTo(-0.15, 0);
		bucket_curve.lineTo(0.1, 0);
		bucket_curve.lineTo(0.05, -0.2);
		bucket_curve.lineTo(0.5, -0.7);
		bucket_curve.lineTo(-0.25, -0.9);
		let bucket_geom = new T.ExtrudeGeometry(bucket_curve, exSettings);
		let bucket = new T.Mesh(bucket_geom, arm_mat);
		bucket_group.add(bucket);
		bucket.translateZ(-0.2);

        // note that we have to make the Object3D before we can call
		// super and we have to call super before we can use this
		// The parameters for sliders are also defined here.
		super(`Excavator-${excavatorObCtr++}`,excavator,
			  [ ['x',-10,10,0],
				['z',-10,10,0],
				['theta',0,360,0],
				['spin',0,360,0],
				['arm rotate',0,50,45],
				['forearm rotate',0,90,45],
				['bucket rotate',-90,45,0]
			  ]);
		// As with the crane, we save the "excavator" group as the "whole object" of the GrExcavator class.
		// We also save the groups of each object that may be manipulated by the UI.
		this.whole_ob = excavator;
		this.cab = cab_group;
		this.arm = arm_group;
		this.forearm = forearm_group;
		this.bucket = bucket_group;

        // put the object in its place
		this.whole_ob.position.x = params.x ? Number(params.x) : 0;
		exPos = this.whole_ob.position.x;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
		this.whole_ob.position.z = params.z ? Number(params.z) : 0;
		this.arm.rotation.z -= (Math.PI / 4);
		this.bucket.rotation.z -= (Math.PI / 4);
		let scale = params.size ? Number(params.size) : 1;
		excavator.scale.set(scale, scale, scale);

	}

	// As with the crane, we wire up each saved group with the appropriate parameter defined in the "super" call.
	// Note, with the forearm, there is an extra bit of rotation added, which allows us to create a rotation offset,
	// while maintaining a nice 0-90 range for the slider itself.
    update(paramValues) {
        this.whole_ob.position.x = paramValues[0];
        this.whole_ob.position.z = paramValues[1];
        this.whole_ob.rotation.y = degreesToRadians(paramValues[2]);
        this.cab.rotation.y = degreesToRadians(paramValues[3]);
        this.arm.rotation.z = degreesToRadians(-paramValues[4]);
        this.forearm.rotation.z = degreesToRadians(paramValues[5]) + Math.PI/16;
        this.bucket.rotation.z = degreesToRadians(paramValues[6]);
	}
	tick()
	{
		timeE ++;
		if(timeE < 256)
		{
			//this.cab.rotation.y += (Math.PI / 256);
			this.arm.rotation.z += (Math.PI / 1024);
			this.forearm.rotation.z += (Math.PI / 1024);
			this.bucket.rotation.z += (Math.PI / 512);
		}
		if(timeE > 256 && timeE < 512)
		{
			//this.cab.rotation.y -= (Math.PI / 256);
			this.arm.rotation.z -= (Math.PI / 1024);
			this.forearm.rotation.z -= (Math.PI / 1024);
			this.bucket.rotation.z -= (Math.PI / 512);
		}
		if(timeE > 512 && timeE < 768)
		{
			this.cab.rotation.y += (Math.PI / 512);
			//exPos += (256/8);
			//get this working to make the object move
			this.whole_ob.translateX(-0.01);
			
		}
		if(timeE > 768 && timeE < 1024)
		{
			//this.cab.rotation.y += (Math.PI / 256);
			this.arm.rotation.z += (Math.PI / 1024);
			this.forearm.rotation.z += (Math.PI / 1024);
			this.bucket.rotation.z += (Math.PI / 512);
		}
		if(timeE > 1024 && timeE < 1280)
		{
			//this.cab.rotation.y -= (Math.PI / 256);
			this.arm.rotation.z -= (Math.PI / 1024);
			this.forearm.rotation.z -= (Math.PI / 1024);
			this.bucket.rotation.z -= (Math.PI / 512);
		}
		if(timeE > 1280 && timeE< 1536)
		{
			this.cab.rotation.y -= (Math.PI / 512);
			//exPos -= (256/8);
			//this.whole_ob.position.set(exPos,0,0);
			this.whole_ob.translateX(0.01);
			
		}
		if(timeE >= 1536)
		{
			timeE = 0;
		}
	}
}
/**
 * A simple object that is like a dump truck (with a hinge), but just made of 
 * boxes.
 * A simple way to test a parametric object
 */
let bullDozerCounter = 0;
export class GrBulldozer extends GrObject {
    constructor() {
        let group = new T.Group();
		let box = new T.BoxGeometry(1,0.5,1);
		let box2 = new T.BoxGeometry(1.5,0.5,1.5);
		let base = new T.BoxGeometry(1.2,3,1.2);
        let mesh1 = new T.Mesh(box,new T.MeshStandardMaterial({color:0xA0A000}));
		mesh1.position.y = 1;
		mesh1.position.z= -0.5;
        group.add(mesh1);

		let mesh2 = new T.Mesh(box2,new T.MeshStandardMaterial({color:"black"}));
		let mesh3 = new T.Mesh(base,new T.MeshStandardMaterial({color:0xA0A000}));
		mesh3.position.y = -0.8;
		mesh3.position.z = -0.5;
        // set group with origin at pivot point
        let g2 = new T.Group();
        g2.position.set(0,0.5,-0.5);
        g2.add(mesh2);
        mesh2.position.y = 1;
        mesh2.position.z = .5;
		group.add(g2);
		group.add(mesh3);
		
		//add wheels
		let wheel = new T.BoxGeometry(0.5,0.5,0.5);
		let wheelMesh1 = new T.Mesh(wheel,new T.MeshStandardMaterial({color:"black"}));
		let wheelMesh2 = new T.Mesh(wheel,new T.MeshStandardMaterial({color:"black"}));
		let wheelMesh3 = new T.Mesh(wheel,new T.MeshStandardMaterial({color:"black"}));
		let wheelMesh4 = new T.Mesh(wheel,new T.MeshStandardMaterial({color:"black"}));
		wheelMesh1.position.x = -0.4;
		wheelMesh1.position.z = 0.4;
		wheelMesh1.position.y = 0;
		wheelMesh2.position.x = -0.4;
		wheelMesh2.position.z = 0.4;
		wheelMesh2.position.y = -2;
		wheelMesh3.position.x = 0.4;
		wheelMesh3.position.z = 0.4;
		wheelMesh3.position.y = 0;
		wheelMesh4.position.x = 0.4;
		wheelMesh4.position.z = 0.4;
		wheelMesh4.position.y = -2;
		

        super(`BullDozer-${bullDozerCounter++}`,group,
              [ ['x',-5,5,2],['z',-5,5,2],['theta',-180,180,0],
                ['tilt',0,90,0]
              ]);
        
        this.group = group;
        this.mesh1 = mesh1;
		this.mesh2 = mesh2;
		this.mesh3 = mesh3;
		this.g2 = g2;
		group.position.y = 0.5;
		group.add(wheelMesh1);
		group.add(wheelMesh2);
		group.add(wheelMesh3);
		group.add(wheelMesh4);
		group.rotateX(Math.PI / 2);
    }

    update(paramValues) {
        this.group.position.x = paramValues[0];
        this.group.position.z = paramValues[1];
        this.group.rotation.z = degreesToRadians(paramValues[2]);
        this.g2.rotation.x = degreesToRadians(-paramValues[3]);
    }
}

