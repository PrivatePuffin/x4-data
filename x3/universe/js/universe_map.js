// ----------------------------------------------------
// Created by Roguey 25/07/2019 (roguey.co.uk)
// please do not copy this code without permission
// ----------------------------------------------------

// UPDATED: 25th July 2019 - Map dragging


function draw_universe_map()
{
	// ------------------------------
	// init
	// ------------------------------
	
	// count the amount of sectors
	var sector_count = sector_info.length;

	// the container for the map
	var map_div = document.getElementById('map_div');
	
	// ------------------------------
	// draw sectors
	// ------------------------------

	// loop through the sectors
	for (var i=0; i<sector_count; i++)
	{

		var sector_shipyard_html 	= '';
		var sector_icons_html		= '';
		
		// colour
		var sector_colour = '#DADADA';
		
		// race colours
		if (sector_info[i]['r'] == 1)		// argon
			sector_colour = '#82CEF6';
			
		else if (sector_info[i]['r'] == 2)	// boron
			sector_colour = '#66DCD0';
			
		else if (sector_info[i]['r'] == 3)	// split
			sector_colour = '#E48054';
			
		else if (sector_info[i]['r'] == 4)	// paranid
			sector_colour = '#E4A554';
			
		else if (sector_info[i]['r'] == 5)	// teladi
			sector_colour = '#54E468';
			
		else if (sector_info[i]['r'] == 6)	// xenon
			sector_colour = '#EC0000';
			
		else if (sector_info[i]['r'] == 7)	// khaak
			sector_colour = '#FF80FF';
			
		else if (sector_info[i]['r'] == 8)	// pirate
			sector_colour = '#E45E54';
			
		else if (sector_info[i]['r'] == 9)	// goner
			sector_colour = '#FFD181';
			
		else if (sector_info[i]['r'] == 17)	// atf
			sector_colour = '#549FE4';
			
		else if (sector_info[i]['r'] == 18)	// terran
			sector_colour = '#5457E4';
			
		else if (sector_info[i]['r'] == 19)	// yaki
			sector_colour = '#E5E5E5';
			

		// check for mines
		if (sector_info[i]['mines'] == 1)
			sector_icons_html += ' <img src=\"./images/minetr.gif\" style=\"width: 12px; height: 12px;\">';
		
		// check for pirate base
		if (sector_info[i]['pbase'] == 1)
			sector_icons_html += ' <img src=\"./images/icon_trg_st_piratebase.gif\" style=\"width: 12px; height: 12px;\">';
		
		// check for shipyard
		if (sector_info[i]['syard'] == 1)
			sector_icons_html += ' <img src=\"./images/icon_trg_st_shipyard.gif\" style=\"width: 12px; height: 12px;\">';
		
		// check for equipment dock
		if (sector_info[i]['eq'] == 1)
			sector_icons_html += ' <img src=\"./images/icon_trg_st_equipdock.gif\" style=\"width: 12px; height: 12px;\">';

		// ------------------------------
		// sector div
		// ------------------------------
		
		var new_sector = document.createElement('a');
		
		new_sector.setAttribute('style', 'background-color: '+sector_colour+'; width: 80px; height: 80px; font-size: 9pt; font-weight: bold; text-align: center; padding: 2px; line-height: 70px; color: #000000; position: absolute;');
		new_sector.setAttribute('href', './x'+sector_info[i]['x']+'-y'+sector_info[i]['y']+'/');
		new_sector.innerHTML 		= '<p style=\"line-height: 1.5; display: inline-block; vertical-align: middle;\">'+sector_info[i]['sector_name']+'</p>';
		
		new_sector.style.left 		= (sector_info[i]['x']*100)+'px';
		new_sector.style.top 		= (sector_info[i]['y']*100)+'px';

		map_div.appendChild(new_sector); 
		
		// ------------------------------
		// icons
		// ------------------------------
		
		if (sector_icons_html != "")
		{
			var new_icons = document.createElement('div');
		
			new_icons.setAttribute('style', 'z-index: 9999999999999; position: absolute; top: 40px; right: 4px;');
			new_icons.setAttribute('href', './x'+sector_info[i]['x']+'-y'+sector_info[i]['y']+'/');
			new_icons.innerHTML 		= sector_icons_html;

			new_sector.appendChild(new_icons); 
		}
		
		// ------------------------------
		// draw gates
		// ------------------------------
		
		var gate_connection_colour = '#404040';
		
		// north gate
		if (sector_info[i]['gn'] == 1)
		{
			// create div	
			var new_gate = document.createElement('div');
			new_gate.setAttribute('style', 'background-color: '+gate_connection_colour+'; width: 30px; height: 10px; display: block;');
			new_gate.style.position 	= 'absolute';
			new_gate.style.left 		= ((sector_info[i]['x']*100)+28)+'px';
			new_gate.style.top 			= ((sector_info[i]['y']*100)-10)+'px';
			map_div.appendChild(new_gate); 
		}
		
		// south gate
		if (sector_info[i]['gs'] == 1)
		{
			// create div	
			var new_gate = document.createElement('div');
			new_gate.setAttribute('style', 'background-color: '+gate_connection_colour+'; width: 30px; height: 10px; display: block;');
			new_gate.style.position 	= 'absolute';
			new_gate.style.left 		= ((sector_info[i]['x']*100)+28)+'px';
			new_gate.style.top 			= ((sector_info[i]['y']*100)+84)+'px';
			map_div.appendChild(new_gate); 
		}
		
		// west gate
		if (sector_info[i]['gw'] == 1)
		{
			// create div	
			var new_gate = document.createElement('div');
			new_gate.setAttribute('style', 'background-color: '+gate_connection_colour+'; width: 10px; height: 30px; display: block;');
			new_gate.style.position 	= 'absolute';
			new_gate.style.left 		= ((sector_info[i]['x']*100)-10)+'px';
			new_gate.style.top 			= ((sector_info[i]['y']*100)+28)+'px';
			map_div.appendChild(new_gate); 
		}
		
		// east gate
		if (sector_info[i]['ge'] == 1)
		{
			// create div	
			var new_gate = document.createElement('div');
			new_gate.setAttribute('style', 'background-color: '+gate_connection_colour+'; width: 10px; height: 30px; display: block;');
			new_gate.style.position 	= 'absolute';
			new_gate.style.left 		= ((sector_info[i]['x']*100)+84)+'px';
			new_gate.style.top 		= ((sector_info[i]['y']*100)+28)+'px';
			map_div.appendChild(new_gate); 
		} 

		
	}
	
	// ------------------------------
	// scroll dragging
	// ------------------------------
	
	var map_container = document.getElementById('map_container');
	
	map_container.onmousedown = function(e)
	{ 
	
		var mouse_x = e.pageX - map_container.offsetLeft;
		var mouse_y = e.pageY - map_container.offsetTop;
	
		map_container.onmousemove = function(e)
		{  
			// dragged with left mouse button
			if(e.buttons == 1)
			{
				// see how far we travelled
				var new_x = e.pageX - map_container.offsetLeft;
				var new_y = e.pageY - map_container.offsetTop;

				// now move the div
				map_container.scrollLeft 	+= (mouse_x - new_x);
				map_container.scrollTop 	+= (mouse_y - new_y);
				
				// reset, so we can calcate the next movement
				mouse_x = new_x;
				mouse_y = new_y;
				
				// clear selection after dragging
				if (window.getSelection)
				{
					// Chrome
					if (window.getSelection().empty)
						window.getSelection().empty();
					
					// Firefox
					else if (window.getSelection().removeAllRanges)
						window.getSelection().removeAllRanges();
				} 
				
				// IE
				else if (document.selection)
				  document.selection.empty();

			}
		};
	};
	
	// ------------------------------
}

window.onLoad = draw_universe_map();