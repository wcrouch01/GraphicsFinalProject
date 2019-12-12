/*jshint esversion: 6 */
// @ts-check

/**
 * Graphics Town Framework - "Main" File
 * 
 * This is the main file - it creates the world, populates it with 
 * objects and behaviors, and starts things running
 * 
 * The initial distributed version has a pretty empty world.
 * There are a few simple objects thrown in as examples.
 * 
 * It is the students job to extend this by defining new object types
 * (in other files), then loading those files as modules, and using this
 * file to instantiate those objects in the world.
 */

import * as T from "./THREE/src/Three.js";
import { GrWorld } from "./Framework/GrWorld.js";
import {GrObject } from "./Framework/GrObject.js";  // only for typing
import * as Helpers from "./Libs/helpers.js";
import { WorldUI } from "./Framework/WorldUI.js";

/** These imports are for the examples - feel free to remove them */
import {SimpleHouse} from "./Examples/house.js";
import {CircularTrack, TrackCube, TrackCar, TrackTrain} from "./Examples/track.js";
import {Helicopter, Helipad} from "./Examples/helicopter.js";
import {ShinySculpture} from "./Examples/shinySculpture.js";
import {MorphTest} from "./Examples/morph.js";
import {House2, House3, Tree, Train, Plane, Bus, Road, Person} from "./buildings.js";
import {GrColoredRoundabout, GrAdvancedSwing, GrCarousel} from "./parkobjects.js";
import {GrCrane, GrExcavator} from "./constructionobjects.js";

/**
 * The Graphics Town Main - 
 * This builds up the world and makes it go...
 */
function grtown() {
    // make the world
    let world = new GrWorld({
        width:1000, height:600,         // make the window reasonably large
        groundplanesize:20              // make the ground plane big enough for a world of stuff
    });

    // put stuff into it - you probably want to take the example stuff out first
    //world.add()
    /*
    
    world.add(new GrColoredRoundabout({x:-10,z:-4}));
    world.add(new GrAdvancedSwing({x:-10,z:4}));
    world.add(new GrCarousel({x:-14, z:0, size:0.5}));
    
    */
   //ROAD AND BUS SYSTEM
    world.add(new Road({x:0,z:16,l:40,w:2,a:0}));
    world.add(new Road({x:0,z:-16,l:40,w:2,a:0}));
    world.add(new Road({x:-16,z:0,l:40,w:2,a:Math.PI / 2}));
    world.add(new Road({x:-8,z:0,l:40,w:2,a:Math.PI / 2}));
    world.add(new Bus({x:20,z:-16,r:-Math.PI / 2,sp1:0.1,sp2:0.11,s:1.5}));
    world.add(new Bus({x:20,z:16,r:-Math.PI / 2,d:-1,sp1:0.133,sp2:0.108,s:1.5}));
    world.add(new Bus({x:-16,z:20,r:Math.PI,d:-1,sp1:0.133,sp2:0.02,s:1.5}));
    world.add(new Bus({x:-8,z:-20,r:0,d:-1,sp1:0.133,sp2:0.02,s:1.5}));
    //HOUSES and Trees
    world.add(new House3({x:-9,y:0.5,z:23,s:1.5,r:Math.PI/2}));
    world.add(new Tree({x:-10, y:-0.2,z:18,s:1.5,r:Math.PI/2,t:1}));
    world.add(new House3({x:-15,y:0.5,z:-23,s:1.5,r:-Math.PI/2}));
    world.add(new Tree({x:-14, y:-0.2,z:-18,s:1.5,r:Math.PI/2,t:2}));

    world.add(new Plane({y:30,z:-15,x:15,s:1}));
    world.add(new ShinySculpture(world, {x:2}));

    //CONSTRUCTIONSITE And MainStreet Houses
    world.add(new GrCrane({x:-13,z:8}));
    world.add(new GrExcavator({x:-10,z:2,size:0.8}));
    world.add(new House3({x:-16,y:0,z:16,s:1.5,r:0}));
    world.add(new Road({x:-11,z:5,l:4,w:4,a:0,c:"#9B7653"}));
    world.add(new House3({x:-16,y:0,z:1,s:1.5,r:0}));
    world.add(new House3({x:-16,y:0,z:-8,s:1.5,r:0}));
    world.add(new House2({x:-4.1,y:0,z:-0.8,s:2.5,r:0}));
    world.add(new Tree({x:-11, y:-0.2,z:0,s:1.5,r:Math.PI/2}));

     //Second Street
     world.add(new House3({x:-23,y:0.5,z:16,s:1.5,r:0}));
     
     world.add(new House3({x:-23,y:0.5,z:1,s:1.5,r:0}));
     world.add(new House3({x:-23,y:0.5,z:-8,s:1.5,r:0}));
     world.add(new House2({x:-11.1,y:0,z:-0.8,s:2.5,r:0}));
     world.add(new House2({x:-11.1,y:0,z:12.5,s:2.5,r:0}));
     world.add(new Tree({x:-18, y:-0.2,z:0,s:1.5,r:Math.PI/2}));

    //longer streets
    for(let i=-4; i<19; i+=5) {
        let rand = Math.floor(Math.random() * 5) + 1;
        // world.add(new House2({x:i, y:0,z:10,s:1.5,r:Math.PI/2}));
         //world.add(new House3({x:i - 5, y:0,z:20,s:1.5,r:Math.PI/2}));
         world.add(new Tree({x:i + 3.5, y:-0.2,z:-18,s:0.5,r:Math.PI/2,t:(rand + 1)}));
         world.add(new Tree({x:i + 3.5, y:-0.2,z:18,s:0.5,r:Math.PI/2,t:(rand - 1)}));
         world.add(new Tree({x:i + 3.5, y:-0.2,z:-14,s:0.5,r:Math.PI/2,t:(rand)}));
         world.add(new Tree({x:i + 3.5, y:-0.2,z:14,s:0.5,r:Math.PI/2,t:(rand)}));
         world.add(new SimpleHouse({x:i, z:-20}));
         world.add(new SimpleHouse({x:i, z: 17}));
     }

     //PARK
     world.add(new GrColoredRoundabout({x:10,z:6}));
     world.add(new GrColoredRoundabout({x:10,z:-6}));
     world.add(new GrAdvancedSwing({x:4,z:10}, Math.PI/2));
     world.add(new GrAdvancedSwing({x:0,z:10}, Math.PI/2));
     world.add(new GrAdvancedSwing({x:4,z:-10}, Math.PI/2));
     world.add(new GrAdvancedSwing({x:0,z:-10}, Math.PI/2));
     world.add(new GrCarousel({x:12, z:0, size:0.7}));
     world.add(new Person({x:5,z:5, s:0.5}));

     //COPER
     world.add(new Helipad(-5.5,0,-18.5));
    world.add(new Helipad(-5.5,0,18.5));
    world.add(new Helipad(18,0,0));
    let copter = new Helicopter();
    world.add(copter);
    copter.getPads(world.objects);

    
    /********************************************************************** */
    /** EXAMPLES - student should remove these and put their own things in  */
    /***/
    // make two rows of houses, mainly to give something to look at
    /*
    for(let i=-19; i<19; i+=5) {
       // world.add(new House2({x:i, y:0,z:10,s:1.5,r:Math.PI/2}));
        //world.add(new House3({x:i - 5, y:0,z:20,s:1.5,r:Math.PI/2}));
        world.add(new SimpleHouse({x:i, z:-12}));
        world.add(new SimpleHouse({x:i, z: 12}));
    }
    */

    /** Race Track - with three things racing around */
    let track = new CircularTrack({x:2});
    //let tc1 = new TrackCube(track);
    //let tc2 = new TrackCube(track);
    //let tc3 = new TrackCar(track);
    let tc4 = new TrackTrain(track, {r:-Math.PI/2,s:0.4});

    // place things are different points on the track
    //tc2.u = 0.25;
    //tc3.u = 0.125;
    tc4.u = 0.225;
    // and make sure they are in the world
    world.add(track);
    //world.add(tc1);
    //world.add(tc2);
    //world.add(tc3);
    world.add(tc4);

    /** Helicopter - first make places for it to land*/
    /*
    world.add(new Helipad(-15,0,0));
    world.add(new Helipad(15,0,0));
    world.add(new Helipad(0,0,-17));
    world.add(new Helipad(0,0,17));
    let copter = new Helicopter();
    world.add(copter);
    copter.getPads(world.objects);
    world.add(new Plane({y:30,z:-15,x:15,s:1,t:tc3}));
    
    
   // world.add(new House2({x:-10, y:0.5,z:10,s:2.0,r:Math.PI/2}));
   // world.add(new House3({x:0, y:.3,z:20,s:1.5,r:Math.PI/2}));
    world.add(new Tree({x:0, y:.3,z:20,s:1.5,r:Math.PI/2}));
    let tr = new Train({x:-4, y:0.5,z:0,s:0.5,r:Math.PI/2});
    world.add(tr);
    world.add(new MorphTest({x:10, y:3, r:2}));

    */

    /** EXAMPLES - end - things after this should stay                      */
    /********************************************************************** */

    // build and run the UI
    world.scene.background = new T.CubeTextureLoader().load( [
        /*
        '/Images/nevada_bk.jpg',
        '/Images/nevada_up.jpg',
        '/Images/nevada_ft.jpg',
        '/Images/nevada_dn.jpg',
        '/Images/nevada_rt.jpg',
        '/Images/nevada_lf.jpg'
        */
       /*
       '/Images/hills_bk.tga',
      '/Images//hills_up.tga',
      '/Images//hills_ft.tga',
      '/Images//hills_dn.tga',
      '/Images//hills_rt.tga',
      '/Images//hills_lf.tga'
      */
        ] );
    // only after all the objects exist can we build the UI
    // @ts-ignore       // we're sticking a new thing into the world
    world.ui = new WorldUI(world);
    // now make it go!
    
    world.go();
}
Helpers.onWindowOnload(grtown);