// ----------------------------------------------------
// Created by Roguey 2/3/2016 (roguey.co.uk)
// updated: 26/07/2020
// please do not copy this code without permission
// ----------------------------------------------------

var c = document.getElementById('bg_canvas');
var ctx = c.getContext('2d');

var c_mid_x = c.width  /2; 
var c_mid_y = c.height /2;


var to_rad = Math.PI / 180;

// for centering map
var map_x_centre = 0;
var map_y_centre = 0;

// ----------------------------------------------------

function colorToHex(color)
{
	if (color.substr(0, 1) === '#')
		return color;

	// split up r, g, b
	var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);

	// convert to hex
	var red 	= parseInt(parseInt(digits[2])).toString(16);
	var green 	= parseInt(parseInt(digits[3])).toString(16);
	var blue 	= parseInt(parseInt(digits[4])).toString(16);

	// now pad an rgb colour
	return '#'+pad('00', red, true)	+pad('00', green, true) 	+pad('00', blue, true);
}

function pad(pad, str, padLeft)
{
	if (typeof str === 'undefined') 
		return pad;
	
	if (padLeft)
		return (pad + str).slice(-pad.length);
	else
		return (str + pad).substring(0, pad.length);
}

// ----------------------------------------------------

function angle_from_cords(x1, y1, x2, y2)
{ 
	var dy = y2 - y1;
	var dx = x2 - x1;

	var theta = Math.atan2(dy, dx);
	theta *= 180/Math.PI // rads to degs

	return theta+270;
}

// ----------------------------------------------------

function move_angle (obj_x, obj_y, obj_angle, obj_distance)
{
	var angle = obj_angle * to_rad;

	var new_x = (obj_x + (Math.sin(angle) * obj_distance));
	var new_y = (obj_y - (Math.cos(angle) * obj_distance));

	// send back two things, x/y
	return [new_x, new_y];
}

// ----------------------------------------------------


function draw_galaxy()
{

	// ---------------------------
	// Default colours
	// ---------------------------
	
	// get computed style of canvas
	var background_color =  colorToHex(getComputedStyle(c).getPropertyValue('background-color'));
	
	if (background_color == "#000000" )
	{
		// black scheme
		var draw_colour_full	= '#3C3C3C';
		var draw_colour_half	= '#282828';
	}
	else
	{
		// light scheme
		var draw_colour_full	= '#DCDCDC';
		var draw_colour_half	= '#F0F0F0';		
	}
	
	// ---------------------------
	// work out scale
	// ---------------------------

	// x cord (map_items)
	var map_item_min_x = Math.min.apply(Math, map_items_x);
	var map_item_max_x = Math.max.apply(Math, map_items_x);

	// z cord (map_items)
	var map_item_min_z = Math.min.apply(Math, map_items_z);
	var map_item_max_z = Math.max.apply(Math, map_items_z);

	// ---

	// get the largest number of them all
	var largest_map_size = Math.max(map_item_min_x, map_item_max_x, map_item_min_z, map_item_max_z);

	if ( largest_map_size < 600)
		largest_map_size = 600;

	// correction
	largest_map_size  /= 2.4;

	var grid_size = Math.round( largest_map_size / 225 );
	
	// work-out the range, so we can center stuff
	map_x_centre	= ((map_item_max_x - map_item_min_x) / 2) + map_item_min_x;
	map_y_centre	= ((map_item_max_z - map_item_min_z) / 2) + map_item_min_z;

	// ---------------------------
	// position map items correctly
	// ---------------------------

	for (i=0; i<map_items_x.length; i++)
	{
		var map_item_div = document.getElementById('map_item_'+(i+1) );

		// cords
		var pos_x = Math.round( c_mid_x + ((map_items_x[i] - map_x_centre) / grid_size));
		var pos_y = Math.round( c_mid_y - ((map_items_z[i] - map_y_centre) / grid_size));

		// move the items
		map_item_div.style.left = (pos_x -16) +'px';  // slight correction
		map_item_div.style.top  = (pos_y -16) +'px';  // slight correction
	}


	// ---------------------------
	// diving bars
	// ---------------------------

	ctx.lineWidth 	= 1;
	ctx.strokeStyle = draw_colour_half;

	var bars_gap	= Math.round( (largest_map_size / 16) / grid_size); 
	var bars_count 	= c_mid_x / bars_gap;

	for (var i=0; i<bars_count; i++)
	{
		// ---

		// x cords
		var bars_x1 = c_mid_x - (bars_gap * i);
		var bars_x2 = c_mid_x + (bars_gap * i);

		// y cords
		var bars_y1 = c_mid_y - (bars_gap * i);
		var bars_y2 = c_mid_y + (bars_gap * i);

		// ---

		// dividing bar (x), left of center
		ctx.moveTo(bars_x1 , 0 );
		ctx.lineTo(bars_x1, c.height );
		ctx.stroke();

		// dividing bar (x), right of center
		ctx.moveTo(bars_x2 , 0 );
		ctx.lineTo(bars_x2, c.height );
		ctx.stroke();

		// ---

		// dividing bar (y), top of center
		ctx.moveTo(0, bars_y1);
		ctx.lineTo(c.width, bars_y1);
		ctx.stroke();


		// dividing bar (y), bottomof center
		ctx.moveTo(0, bars_y2);
		ctx.lineTo(c.width, bars_y2);
		ctx.stroke();

		// ---


	}

	ctx.closePath();
	ctx.beginPath();

	// ---------------------------
	// main cross
	// ---------------------------

	ctx.strokeStyle = draw_colour_full;
	ctx.lineWidth = 2;


	// middle cross (x)
	ctx.moveTo( 0 , c_mid_y );
	ctx.lineTo(c.width, c_mid_y );
	ctx.stroke();

	// middle cross (y)
	ctx.moveTo( c_mid_x, 0 );
	ctx.lineTo( c_mid_x, c.height );
	ctx.stroke();

	// ---------------------------
	// cluster connection (via gates)
	// ---------------------------

	var search1_id = 0;
	var search2_id = 0;
	var cur_gate = "";

	for (var i=0; i< (gate_connection.length/2); i++)
	{
		search1_id = 0;
		search2_id = 0;

		// ----------------------

		// search for item in the map items array
		for (var p=0; p<map_items_id.length; p++)
		{
			if (map_items_id[p] == gate_connection[i*2])
				search1_id = p;

			if (map_items_id[p] == gate_connection[(i*2)+1])
				search2_id = p;
		}

		// ----------------------

		if ( (search1_id > 0) || (search2_id > 0))
		{
			//found


			// ----------------
			// draw line
			// ----------------

			var start_x 		= Math.round( c_mid_x + ((map_items_x[search1_id] - map_x_centre) / grid_size));
			var start_y 		= Math.round( c_mid_y - ((map_items_z[search1_id] - map_y_centre) / grid_size));

			
			var end_x 			= Math.round( c_mid_x + ((map_items_x[search2_id] - map_x_centre) / grid_size));
			var end_y 			= Math.round( c_mid_y - ((map_items_z[search2_id] - map_y_centre) / grid_size));


			var angle_line 		= angle_from_cords(start_x, start_y, end_x, end_y);

			var adjust_start	= move_angle(start_x, start_y, angle_line, -16);
			var adjust_end		= move_angle(end_x, end_y, angle_line, 16);

			start_x = adjust_start[0];
			start_y = adjust_start[1];

			end_x = adjust_end[0];
			end_y = adjust_end[1];

			// ------------------


			ctx.strokeStyle = '#58D4FC';
			ctx.lineWidth = 1;


			ctx.beginPath();

				// locate and draw (highway)
				ctx.moveTo( start_x, start_y );
				ctx.lineTo( end_x, end_y );

				ctx.stroke();

			ctx.closePath();


			// ----------------
			// draw arrow head (for direction)
			// ----------------


			ctx.fillStyle 	= '#6BD9FD';
			ctx.strokeStyle = '#58D4FC';
			ctx.lineWidth 	= 1;

			ctx.beginPath();
					

				var arrowhead_1_angle	= angle_line - 20;
				var arrowhead_2_angle	= angle_line + 20;

				var arrowhead_1_cords	= move_angle(start_x, start_y, arrowhead_1_angle, -8);
				var arrowhead_2_cords	= move_angle(start_x, start_y, arrowhead_2_angle, -8);

					
				ctx.moveTo( start_x, start_y );
				ctx.lineTo( arrowhead_1_cords[0], arrowhead_1_cords[1] );
				ctx.lineTo( arrowhead_2_cords[0], arrowhead_2_cords[1] );
				ctx.moveTo( start_x, start_y );


				ctx.closePath();
			ctx.fill();


			ctx.beginPath();
					

				var arrowhead_1_angle	= angle_line - 20;
				var arrowhead_2_angle	= angle_line + 20;

				var arrowhead_1_cords	= move_angle(end_x, end_y, arrowhead_1_angle, 8);
				var arrowhead_2_cords	= move_angle(end_x, end_y, arrowhead_2_angle, 8);

					
				ctx.moveTo( end_x, end_y );
				ctx.lineTo( arrowhead_1_cords[0], arrowhead_1_cords[1] );
				ctx.lineTo( arrowhead_2_cords[0], arrowhead_2_cords[1] );
				ctx.moveTo( end_x, end_y );


				ctx.closePath();
			ctx.fill();
		}
	}
}