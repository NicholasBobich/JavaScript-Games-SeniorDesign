/*Bomberman

Orthogonal view – the player views the game by a 90 degree angle (zenva Academy / Zenva for schools)

There are two types of layers:
	Tile layers: Composed by the sprites of the loading tileset and are aligned in the map grid 
	Object layers: they are not aligned to a grid and represent the objects of the game

JSON level file:
	Use this to describe the assets we need, thr groups of out game and the map properties
*/

	{
	"assets": {
		"map_tiles": {"type": "image", "source": "assets/images/bomberman_spritesheet.png"}, 
		
		 "player_spritesheet": {"type": "spritesheet", "source":"assets/images/player_spritesheet.png", "frame_width": 16, "frame_height": 16},
		
		"bomb_spritesheet": {"type": "spritesheet", "source": "assets/images/bomb_spritesheet.png", "frame_width": 16, "frame_height": 16}, 
		
		"enemy_spritesheet": {"type": "spritesheet", "source": "assets/images/enemy_spritesheet.png", "frame_width": 16, "frame_height": 16}, 
		
		"explosion_image": {"type": "image", "source": "assets/images/explosion.png"},
		
		"level_tilemap": {"type": "tilemap", "source": "assets/maps/level1_map.json"} }, //End of map_tiles
		
		"groups": [ 
			"explosions", 
			"bombs", 
			"enemies", 
			"players" 
			], 
		"map": { 
		"key": "level_tilemap", 
		"tilesets": ["map_tiles"] 
			} //End of assets 
	} //End of Program

/*BootState code:
	Loads a JSON file with the level information and starts the loading state
*/

var Bomberman = Bomberman || {}; 

Bomberman.BootState = function () { 
	"use strict"; 
	Phaser.State.call(this); 
	};
	
Bomberman.BootState.prototype = Object.create(Phaser.State.prototype); 
Bomberman.BootState.prototype.constructor = Bomberman.BootState; 

Bomberman.BootState.prototype.init = function (level_file, next_state) {  
	"use strict";  
	this.level_file = level_file; 
	this.next_state = next_state;  
}; 

Bomberman.BootState.prototype.preload = function () { 
	"use strict"; 
	this.load.text("level1", this.level_file); 
 }; 

Bomberman.BootState.prototype.create = function () { 
	"use strict"; 
	var level_text, level_data; 
	level_text = this.game.cache.getText("level1"); 
	level_data = JSON.parse(level_text); 
	this.game.state.start("LoadingState", true, false, level_data, this.next_state);  
}; 

/*LoadingState:
	Responsible for loading all the assets that will be used in this level
*/

var Bomberman = Bomberman || {};  

Bomberman.LoadingState = function () { 
	"use strict"; 
	Phaser.State.call(this); 
 }; 

Bomberman.LoadingState.prototype = Object.create(Phaser.State.prototype); 
Bomberman.LoadingState.prototype.constructor = Bomberman.LoadingState;

Bomberman.LoadingState.prototype.init = function (level_data, next_state) { 
	"use strict"; 
	this.level_data = level_data; 
	this.next_state = next_state; 
}; 

Bomberman.LoadingState.prototype.preload = function () { 
	"use strict"; 
	var assets, asset_loader, asset_key, asset; 
	assets = this.level_data.assets; 
	for (asset_key in assets) { 
		// load assets according to asset key 
		if (assets.hasOwnProperty(asset_key)) { 
			asset = assets[asset_key]; 
			switch (asset.type) { 
			case "image": 
				this.load.image(asset_key, asset.source); 
				break; 
			case "spritesheet": 
				this.load.spritesheet(asset_key, asset.source, asset.frame_width, asset.frame_height, asset.frames, asset.margin, asset.spacing); 
				break; 
			case "tilemap": 
				this.load.tilemap(asset_key, asset.source, null, Phaser.Tilemap.TILED_JSON); 
				break; 
			 } //End of Switch
		 } //End of If
	 } //End of For Loop
 }; 

Bomberman.LoadingState.prototype.create = function () { 
	"use strict"; 
	this.game.state.start(this.next_state, true, false, this.level_data); 
 }; 

//TiledState


var Bomberman = Bomberman || {}; 
Bomberman.TiledState = function () { 
	"use strict"; 
	Phaser.State.call(this); 
	this.prefab_classes = { 
		"player": Bomberman.Player.prototype.constructor, 
		"enemy": Bomberman.Enemy.prototype.constructor 
	}; 
 }; 

Bomberman.TiledState.prototype = Object.create(Phaser.State.prototype);
Bomberman.TiledState.prototype.constructor = Bomberman.TiledState; 

Bomberman.TiledState.prototype.init = function (level_data) { 
	"use strict"; 
	var tileset_index; 
	this.level_data = level_data; 
	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; 
	this.scale.pageAlignHorizontally = true; 
	this.scale.pageAlignVertically = true; 

	 // start physics system  
	this.game.physics.startSystem(Phaser.Physics.ARCADE); 
	this.game.physics.arcade.gravity.y = 0; 
	
	 // create map and set tileset 
	this.map = this.game.add.tilemap(level_data.map.key);  
	tileset_index = 0; 
	this.map.tilesets.forEach(function (tileset) {  
		this.map.addTilesetImage(tileset.name, level_data.map.tilesets[tileset_index]); 
		tileset_index += 1; 
	 }, this);//End of Function 
}; 

Bomberman.TiledState.prototype.create = function () {

	"use strict"; 
	var group_name, object_layer, collision_tiles; 

	// create map layers 
	this.layers = {}; 
	this.map.layers.forEach(function (layer) { 
		this.layers[layer.name] = this.map.createLayer(layer.name); 
		if (layer.properties.collision) { 
			// collision layer 
			collision_tiles = []; 
			layer.data.forEach(function (data_row) { 
				// find tiles used in the layer 
				data_row.forEach(function (tile) { 
				 // check if it's a valid tile index and isn't already in the list 
				
					 if (tile.index > 0 && collision_tiles.indexOf(tile.index) === -1) { 
						collision_tiles.push(tile.index); 
					 } //End of If
				}, this); //End Of Tile Function
			 }, this); //End Of Data_row
			this.map.setCollision(collision_tiles, true, layer.name); 
		 } //End of If
	 }, this); //End of Layer Function
	
	// resize the world to be the size of the current layer 
	this.layers[this.map.layer.name].resizeWorld(); 

	// create groups 
	this.groups = {}; 
	this.level_data.groups.forEach(function (group_name) { 
		this.groups[group_name] = this.game.add.group(); 
	 }, this); //End of Group_Name Function

	this.prefabs = {}; 

	for (object_layer in this.map.objects) { 
		if (this.map.objects.hasOwnProperty(object_layer)) { 
			// create layer objects 
			this.map.objects[object_layer].forEach(this.create _object, this); 
		 } //End of If
	 } //End of For
 }; 

Bomberman.TiledState.prototype.create_object = function (object) { 
	"use strict"; 
	var object_y, position, prefab;
	 
	// tiled coordinates starts in the bottom left corner 
	object_y = (object.gid) ? object.y - (this.map.tileHeight / 2) : object.y + (object.height / 2); 
	position = {"x": object.x + (this.map.tileHeight / 2), "y": object_y}; 
	
	// create object according to its type 
	if (this.prefab_classes.hasOwnProperty(object.type)) { 
		prefab = new this.prefab_classes[object.type](this, object.name, position, object.properties); 
	 } //End of If
	
	this.prefabs[object.name] = prefab; 
 }; 

Bomberman.TiledState.prototype.game_over = function () { 
	"use strict"; 
	localStorage.clear(); 
	this.game.state.restart(true, false, this.level_data); 
 }; 


//Creating the Prefabs

Var Bomberman = Bomberman || {};

Bomebrman.Prefab = function (game_state, name, position, properties) {

	"use strict";
	Phaser.Sprite.call(this, game_state.game, position.x, position.y, properties.texture);
	
	This.game_state = game_state;
	This.name = name;
	This.gamestate.groups[properties.group].add(this);
	This.frame = +properties.frame;
	
	This.game_state.prefabs[name] = this;
	
	};
	
Bomberman.Prefab.prototype = Object.create(Phaser.Sprite.prototype);
Bomberman.Prefab.prototype.consturctor = Bomberman.Prefab;


//Creating the Player

Var Bomberman = Bomberman || {};

Bomberman.Player = function (game_state, name, position, properties) {

	"use strict";
	Bomberman.Prefab.call(this, game_state, name, position, properties);
	
	This.anchor.setTo(.5);
	This.walking_speed = +properties.walking_speed;
	This.bomb_duration = +properties.bomb_duration;
	This.dropping_bomb = false;
	
	This.animations.add("walking_down", [1,2,3], 10, true);
	This.animations.add("walking_left", [4,5,6,7], 10, true);
	This.animations.add("walking_right", [4,5,6,7], 10, true);
	This.animations.add("walking_up", [0,8,9], 10, true);
	
	This.stopped_frames = [1,4,4,0,1];
	
	This.game_state.game.physics.arcade.enable(this);
	This.body.setSize(14,12,0,4);
	
	This.cursors = this.game_state.game.input.keyboard.createCursorKeys();
	
	};
	
Bomberman.Player.prototype = Object.create(Bomberman.Prefab.prototype);
Bomberman.Player.prototype.constructor = Bomberman.Player;

Bomberman.Player.prototype.update = function () {
	"use strict";
	This.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);
	This.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);
	This.game_state.game.physics.arcade.overlap(this, this.game_state.groups.explosions, this.kill, null, this);
	This.game_state.game.physics.arcade.overlap(this, this.game_state.groups.enemies, this.kill, null, this);
	
	If(this.cursors.left.isDown && this.body.velocity.x <= 0) {
		//move left
		
		This.body.velocity.x = -this.walking_speed;
		If(this.body.velocity.y === 0) {
			//change the scale, since we have only one animation for left and right directions
			This.scale.setTo(-1, 1);
			This.animations.play("walking_left");
			}//End of Inner If
	} else if(this.cursors.right.isDown && this.body.velocity.x >= 0) {
		//move right
			
		This.body.velocity.x = +this.walking_speed;
		If(this.body.velocity.y === 0) {
		// change the scale, since we have only one animation for left and right directions
			This.scale.setTo(1, 1);
			This.animations.play("walking_right");
			}//End of Inner If
	} else {
		This.body.velocity.x = 0;
	}//End of Else
	
	If(this.cursors.up.isDown && this.body.velcoity.y <= 0) {
		//move up
		
		This.body.velocity.y = -this.walking_speed;
		If(this.body.velocity.x === 0) {
			This.animations.play("walking_up");
			}//End of Inner If
	} else if(this.cursors.down.isDown && this.body.velocity.y >= 0) {
		//move down
		
		This.body.velocity.y = +this.walking_speed;
		If(this.body.velocity.x === 0) {
			This.animations.play("walking_down");
			}//End of Inner If
	} else {
		This.body.velocity.y = 0;
		}//End of Else
		
	If(this.body.velocity.x === 0 && this.body.velocity.y === 0) {
		//stop current animation
		
		This.animations.stop();
		This.frame = this.stopped_frames[this.body.facing];
		}//End of If
		
	If(!this.dropping_bomb && this.game_state.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
		
		This.drop_bomb();
		This.dropping_bomb = true;
		}//End of If
		
	if(this.dropping_bomb && !this.game_state.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) ) { 
		this.dropping_bomb = false; 
			} //End of If
	}; 
		
Bomberman.Player.prototype.drop_bomb = function () { 
		"use strict"; 
		var bomb, bomb_name, bomb_position, bomb_properties; 
		// get the first dead bomb from the pool 
		
		bomb_name = this.name + "_bomb_" + this.game_state.groups.bombs.countLiving(); 
		
		bomb_position = new Phaser.Point(this.x, this.y); bomb_properties = {"texture": "bomb_spritesheet", "group": "bombs", bomb_radius: 3}; 
		
		Bomb = Bomberman.create_prefab_from_pool(this.game_state.groups.bombs, Bomberman.Bomb.prototype.constructor, this.game_state, bomb_name, bomb_position, bomb_properties); 
			
	};


//Creating the Bomb

var Bomberman = Bomberman || {}; 
Bomberman.Bomb = function (game_state, name, position, properties) { 
	"use strict"; 
	Bomberman.Prefab.call(this, game_state, name, position, properties); 
	this.anchor.setTo(0.5); 
	this.bomb_radius = +properties.bomb_radius; 
	this.game_state.game.physics.arcade.enable(this); 
	this.body.immovable = true; 
	this.exploding_animation = this.animations.add("exploding", [0, 2, 4], 1, false); 
	this.exploding_animation.onComplete.add(this.kill, this); 
	this.animations.play("exploding"); 
	}; 
Bomberman.Bomb.prototype = Object.create(Bomberman.Prefab.prototype); 
Bomberman.Bomb.prototype.constructor = Bomberman.Bomb; 

Bomberman.Bomb.prototype.reset = function (position_x, position_y) {  
	"use strict"; 
	Phaser.Sprite.prototype.reset.call(this, position_x, position_y); 
	this.exploding_animation.restart(); 
	}; 
	
Bomberman.Bomb.prototype.kill = function () { 
	"use strict"; 
	Phaser.Sprite.prototype.kill.call(this); 
	var explosion_name, explosion_position, explosion_properties, explosion; 
	
	explosion_name = this.name + "_explosion_" + this.game_state.groups.explosions.countLiving(); 
	explosion_position = new Phaser.Point(this.position.x, this.position.y); 
	explosion_properties = {texture: "explosion_image", group: "explosions", duration: 0.5}; 
	
	// create an explosion in the bomb position 
	explosion = Bomberman.create_prefab_from_pool(this.game_state.groups.explosi ons, Bomberman.Explosion.prototype.constructor, this.game_state, 
	explosio n_name, explosion_position, explosion_properties); 
	
	// create explosions in each direction 
	this.create_explosions(-1, -this.bomb_radius, -1, "x"); 
	this.create_explosions(1, this.bomb_radius, +1, "x"); 
	this.create_explosions(-1, -this.bomb_radius, -1, "y"); 
	this.create_explosions(1, this.bomb_radius, +1, "y"); 
	}; 
	
Bomberman.Bomb.prototype.create_explosions = function (initial_index, final_index, step, axis) {  
	"use strict"; 
	var index, explosion_name, explosion_position, explosion, explosion_properties, tile;
	
	explosion_properties = {texture: "explosion_image", group: "explosions", duration: 0.5}; 
	
	for (index = initial_index; Math.abs(index) <= Math.abs(final_index); index += step) { 
		explosion_name = this.name + "_explosion_" + this.game_state.groups.explosions.countLiving(); 
		
		// the position is different accoring to the axis 
		if (axis === "x") { 
			explosion_position = new Phaser.Point(this.position.x + (index * this.width), this.position.y); 
		} else { 
			explosion_position = new Phaser.Point(this.position.x, this.position.y + (index * this.height)); 
			} //End of Else
			
		tile = this.game_state.map.getTileWorldXY(explosion_position.x, explosion_position.y, this.game_state.map.tileWidth, this.game_state.map.tileHeight, "collision"); 
		
		if (!tile) { 
			// create a new explosion in the new position 
			
			explosion = Bomberman.create_prefab_from_pool(this.game_state.groups.explosi ons, Bomberman.Explosion.prototype.constructor, this.game_state, explosion_name, explosion_position, explosion_properties); 
		} else { 
			break; 
		} //End of Else
	} //End of For Loop
};


//Creating the Explosion

var Bomberman = Bomberman || {}; 
Bomberman.Explosion = function (game_state, name, position, properties) {
	"use strict"; 
	Bomberman.Prefab.call(this, game_state, name, position, properties); 
	
	this.anchor.setTo(0.5); 
	
	this.duration = +properties.duration; 
	
	this.game_state.game.physics.arcade.enable(this); 
	this.body.immovable = true; 
	
	// create the kill timer with autoDestroy equals false 
	this.kill_timer = this.game_state.time.create(false);
	this.kill_timer.add(Phaser.Timer.SECOND * this.duration, this.kill, this); 
	this.kill_timer.start(); 
	}; 
	
Bomberman.Explosion.prototype = Object.create(Bomberman.Prefab.prototype); 
Bomberman.Explosion.prototype.constructor = Bomberman.Explosion; 

Bomberman.Explosion.prototype.reset = function (position_x, position_y) {
	"use strict"; 
	Phaser.Sprite.prototype.reset.call(this, position_x, position_y); 
	// add another kill event 
	this.kill_timer.add(Phaser.Timer.SECOND * this.duration, this.kill, this); 
	};


//Creating the enemy

var Bomberman = Bomberman || {}; 
Bomberman.Enemy = function (game_state, name, position, properties) { 
	"use strict"; 
	Bomberman.Prefab.call(this, game_state, name, position, properties); 
	this.anchor.setTo(0.5); 
	
	this.walking_speed = +properties.walking_speed; 
	this.walking_distance = +properties.walking_distance; 
	this.direction = +properties.direction; 
	this.axis = properties.axis; 
	
	this.previous_position = (this.axis === "x") ? this.x : this.y;  
	this.animations.add("walking_down", [1, 2, 3], 10, true); 
	this.animations.add("walking_left", [4, 5, 6, 7], 10, true); 
	this.animations.add("walking_right", [4, 5, 6, 7], 10, true); 
	this.animations.add("walking_up", [0, 8, 9], 10, true); 
	this.stopped_frames = [1, 4, 4, 0, 1]; 
	this.game_state.game.physics.arcade.enable(this); 
	if (this.axis === "x") { 
		this.body.velocity.x = this.direction * this.walking_speed; 
	} else { 
		this.body.velocity.y = this.direction * this.walking_speed; 
	} //End of Else
}; 

Bomberman.Enemy.prototype = Object.create(Bomberman.Prefab.prototype); 
Bomberman.Enemy.prototype.constructor = Bomberman.Enemy;  
	
Bomberman.Enemy.prototype.update = function () { 
	"use strict"; 
	var new_position; 
	this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision, this.switch_direction, null, this); 
	this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.bombs, this.switch_direction, null, this); 
	this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.explosions, this.kill, null, this); 
	
	if (this.body.velocity.x < 0) { 
		// walking left 
		this.scale.setTo(-1, 1); 
		this.animations.play("walking_left"); 
	} else if (this.body.velocity.x > 0) { 
		// walking right 
		this.scale.setTo(1, 1); 
		this.animations.play("walking_right"); 
		 } //End of Else
	if (this.body.velocity.y < 0) { 
		// walking up 
		this.animations.play("walking_up"); 
	 } else if (this.body.velocity.y > 0) { 
		// walking down 
		this.animations.play("walking_down"); 
	 } //End of Else If
	if (this.body.velocity.x === 0 && this.body.velocity.y === 0) { 
		// stop current animation 
		this.animations.stop(); 
		this.frame = this.stopped_frames[this.body.facing]; 
		} //End of If
		
	new_position = (this.axis === "x") ? this.x : this.y; 
	if (Math.abs(new_position - this.previous_position) >= this.walking_distance) { 
		this.switch_direction(); 
		}  //End of If
}; 
Bomberman.Enemy.prototype.switch_direction = function () { 
	"use strict"; 
	if (this.axis === "x") {
		 this.previous_position = this.x; 
		this.body.velocity.x *= -1;  
	} else { 
	this.previous_position = this.y; 
	this.body.velocity.y *= -1; 
	} //End of Else
};