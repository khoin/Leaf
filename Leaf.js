//Array for Plugin Images
var ar = {
	'output' : ['http://api.audiotool.com/plugin/output/0/icon.png'],
	'beatbox_8' : ['http://api.audiotool.com/plugin/beatbox_8/0/icon.png'],	   'merger': ['http://api.audiotool.com/plugin/merger/0/icon.png'],
	'beatbox_9' : ['http://api.audiotool.com/plugin/beatbox_9/0/icon.png'],	   'kobolt': ['http://api.audiotool.com/plugin/kobolt/0/icon.png'],
	'bassline': ['http://api.audiotool.com/plugin/bassline/0/icon.png'],	       'minimixer': ['http://api.audiotool.com/plugin/minimixer/0/icon.png'],
	'machiniste': ['http://api.audiotool.com/plugin/machiniste/0/icon.png'],     'audiotrack': ['http://api.audiotool.com/plugin/audiotrack/0/icon.png'],
	'tonematrix': ['http://api.audiotool.com/plugin/tonematrix/0/icon.png'],	   'crossfader': ['http://api.audiotool.com/plugin/crossfader/0/icon.png'],
	'pulverisateur': ['http://api.audiotool.com/plugin/pulverisateur/0/icon.png'],  'centroid': ['http://api.audiotool.com/plugin/centroid/0/icon.png'],
	'heisenberg': ['http://api.audiotool.com/plugin/heisenberg/0/icon.png'],
	'splitter': ['http://api.audiotool.com/plugin/splitter/0/icon.png'],
	'tube' : ['http://api.audiotool.com/plugin/tube/0/icon.png'], 	       'flanger' : ['http://api.audiotool.com/plugin/flanger/0/icon.png'], 
	'stereodetune' : ['http://api.audiotool.com/plugin/stereodetune/0/icon.png'],  'delay' : ['http://api.audiotool.com/plugin/delay/0/icon.png'], 
	'slope' : ['http://api.audiotool.com/plugin/slope/0/icon.png'], 	       'crusher' : ['http://api.audiotool.com/plugin/crusher/0/icon.png'], 
	'reverb' : ['http://api.audiotool.com/plugin/reverb/0/icon.png'],        'compressor' : ['http://api.audiotool.com/plugin/compressor/0/icon.png'], 
	'pitchdelay' : ['http://api.audiotool.com/plugin/pitchdelay/0/icon.png'],    'chorus' : ['http://api.audiotool.com/plugin/chorus/0/icon.png'], 
	'phaser' : ['http://api.audiotool.com/plugin/phaser/0/icon.png'], 	   'rasselbock' : ['http://api.audiotool.com/plugin/rasselbock/0/icon.png'], 
	'parametric_eq' : ['http://api.audiotool.com/plugin/parametric_eq/0/icon.png'], 'autofilter' : ['http://api.audiotool.com/plugin/autofilter/0/icon.png'], 
	'gate' : ['http://api.audiotool.com/plugin/gate/0/icon.png'], 	       'exciter' : ['http://api.audiotool.com/plugin/exciter/0/icon.png'], 
	'graphical_eq' : ['http://api.audiotool.com/plugin/graphical_eq/0/icon.png'],  'stereoenhancer' : ['http://api.audiotool.com/plugin/stereoenhancer/0/icon.png']
}
//Stylesheets
css = "#samples li, #presets li { list-style-type:none; display:block; height:20px; width:100%; text-overflow: ellipsis; font-size:12px; background:#333; padding:0 10px; line-height:17px;}"
+"#togglelink {position:absolute;right:0;}";

$("head").append("<style>"+css+"</style>");
//For Listen
function fetchListen() {
$.get('http://kh01.me/Listen/', function(data) {
		document.open();document.write(data);document.close();
	});
}

//Function to add a device's image
function printDevice(a) {
	return "<li><a title='"+a+"'><img width='64' height='64' src='"+ar[a][0]+"'></a></li>";
}
//Function returning user with image.
function printUser(a,b) {
	return "<li><a title='"+a+"'><img width='64' height='64' src='"+b+"'></a></li>";
}
function getAPI() {
	return "http://api"+document.location.href.substr(10)+"/";
}
function plural(a) {
	return (a>1)? "s": "";
}
function label(str) { return "<span style='font-weight:bold; font-size:120%'>"+str+"</span>";
}
function bar(a,b) {
	var percent = (a/b*100).toFixed(2);
	var bar = "<a title='"+percent+"%'><div style='display:block; overflow:hidden;clear:both; background:#333; width:100%; border-radius:4px;height:10px;'>";
	bar += "<div style='background:#ff6a00; width:"+percent+"%; border-radius:4px;height:10px;'></div></div></a>";
	return bar;
}
//Declare Main function
function track_getinfo() {
	if(document.location.href.split("/")[3]!=="track") { return; }
	//Track's API URL
	if(!$("#devices ol li").length) {
	//Initially creates sections at right-side
	if( $(".track-remix").length > 0 || $(".track-original").length > 0) {
		var side = ($(".track-remix").length > 0)? $(".track-remix") : $(".track-original");
	} else {
		var side = ($(".track-right").children()[1])? $(".track-right").children()[1]: $(".track-right").children()[0] ;
	}
	$(side).after("<section id='presets' class='leaf track-favorites user-fans replace-fans'><h1>preset</h1><ol></ol></section>");
	$(side).after("<section id='samples' class='leaf track-favorites user-fans replace-fans'><h1>sample</h1><ol></ol></section>");
	$(side).after("<section id='devices' class='leaf track-favorites user-fans replace-fans'><h1>devices</h1><ol></ol></section>");	
	$(side).after("<section id='stats' class='leaf track-favorites user-fans replace-fans'><a id='togglelink' href='javascript://' onclick='toggleSettings();'>Open Settings</a><h1>Statistics</h1></section>");
    $("#stats").after("<section id='playpie' class='leaf track-favorites user-fans replace-fans'><h1>Playback Sources</h1><canvas id='pie' width='256px' height='200px'></canvas></section>");	
	$("#stats").after("<div id='linechart' style='width:100%;margin-bottom:20px;'><h2>7-day Favorite Statistics (6 days ago → today)</h2><br/></div><br/>");
		
	//Get the playback Pie
	$.getJSON("http://www.audiotool.com/tracks/"+document.location.href.split("/")[4]+"/plays.json", function(data) {
		window.playrs = JSON.parse(data);
	}).done( function(data,txtStat,errn) {
		var piectx = $("#pie").get(0).getContext("2d");
			var data = "[";
			var totalPlays=0;
			for(i=0; i < playrs.length; i++ ) {
				totalPlays += playrs[i].value;
			}
			for(i=0; i < playrs.length; i++ ) {	
				data+= "{";
				data+= "\"value\": "+playrs[i].value;
				switch(playrs[i].platform) {
					case 'SoundCloud': siteColor = "hsl(25, 100%, 60%)";
					data+= ",\"color\": \""+siteColor+"\"";
					slabel = "SoundCloud"; break;
					case 'Facebook': siteColor = "hsl(221, 44%, 51%)";
					data+= ",\"color\": \""+siteColor+"\"";
					slabel = "Facebook"; break;
					case 'Audiotool Website': siteColor = "hsl(186, 100%, 60%)";
					data+= ",\"color\": \""+siteColor+"\"";
					slabel = "Audiotool"; break;
					case 'YouTube': siteColor = "#EF7770";
					data+= ",\"color\": \""+siteColor+"\"";
					slabel = "YouTube"; break;
					default: siteColor = "#aaa";
					data+= ",\"color\": \""+siteColor+"\""; 
					slabel = "Unknown";
				}
				data+= ",\"label\": \""+slabel+"\"";
				data += (i===playrs.length-1)? "}": "},"; 
				$("#playpie").append("<a title='"+slabel+"'><div style='color:#222;display:inline-block;width:auto;float:left;padding:0 10px; margin:0 1px;background:"+siteColor+";'>"+Math.round(playrs[i].value/totalPlays*100)+"%</div></a>");
			}
			data += "]";
			data = JSON.parse(data);
			var pieChart = new Chart(piectx).Pie(data, {segmentStrokeWidth : 2 });
			$("#playpie a").tipsy({gravity:'s'});
	}).fail( function(d,e,s) {
		$("#playpie").html("<h1>Playback Sources</h1><p>Failed getting data: "+e+", "+s+"</p>");
	});
		//AJAX to AT-API
		$.get(getAPI(), function(a) {
			//Co-authors listing
			var coauths = $(a).find("co-creator");
			$("#coauth h1").prepend(coauths.length+"&nbsp;");
			if(coauths.length > 0) { 
				$("#linechart").after("<section id='coauth' class='leaf track-favorites user-fans replace-fans'><h1>Co-authors</h1><ol></ol></section>");
			}
			var i=0;
			while(coauths[i]) {
				var authimg = $(coauths[i]).find("avatarURL")[3].innerHTML;
				var name = $(coauths[i]).find("name")[0].innerHTML;
				$("#coauth ol").append(printUser(name,authimg));
				i++;
			}
		
			//Device listing
			var devices = $(a).find("plugin");
			$("#devices h1").prepend(devices.length+"&nbsp;");
			var i=0;
			while(devices[i]) {
				var device = $(devices[i]).find("key")[0].innerHTML;
				$("#devices ol").append(printDevice(device));
				i++;
			}
			//Samples listing
			var samples = $(a).find("sample");
			var hazsampl = (samples.length > 0)? samples.length : "Zero";
			$("#samples h1").prepend(hazsampl+"&nbsp;").append(plural(samples.length));
			var i=0;
			while(samples[i]) {
				var sample = $(samples[i]).find("key")[0].innerHTML;
				$("#samples ol").append("<li>"+sample+"</li>");
				i++;
			}
			//Preset listing
			var presets = $(a).find("preset");
			var hazpres = (presets.length > 0)? presets.length : "Zero";
			$("#presets h1").prepend(hazpres+"&nbsp;").append(plural(presets.length));
			var i=0;
			while(presets[i]) {
				var preset = $(presets[i]).find("key")[0].innerHTML;
				$("#presets ol").append("<li>"+preset+"</li>");
				i++;
			}
			//Information listing
			window.key = $(a).find("key")[0].innerHTML;
			var bpm = Math.floor(parseFloat($(a).find("bpm")[0].innerHTML));
			window.fav = $(a).find("favorites")[0].innerHTML;
			window.views = $(a).find("profileviews")[0].innerHTML;
			window.playback = $(a).find("playbacks")[0].innerHTML;
			var dlcount = $(a).find("downloads")[0].innerHTML;
			var shared = ($(a).find("shared")[0].innerHTML === "true")? "<span style='color:lime;'>Yes</span>" : "<span style='color:red;'>No</span>";
			var remixed = ($(a).find("remix")[0].innerHTML === "true")? "<span style='color:lime;'>Yes</span>" : "<span style='color:red;'>No</span>";
			$("#stats").append(label("<img class='icon icon-bpm' src='/images/void.gif' width='11px' height='11px' title='bpm'>") + bpm +"&nbsp;&nbsp;")
						  .append(label("<img class='icon' src='/images/void.gif' width='11px' height='11px' title='views'>") + window.views+"&nbsp;&nbsp;")
						  .append(label("<img class='icon icon-plays' src='/images/void.gif' width='11px' height='11px' title='playbacks'> ") + window.playback+"&nbsp;&nbsp;")
						  .append(label("<img class='icon icon-download' src='/images/void.gif' width='11px' height='11px' title='downloadcount'> ") +dlcount+"&nbsp;&nbsp;")
						  .append(label("<img class='icon icon-invite' src='/images/void.gif' width='11px' height='11px' title='collab?'> ")+shared+"&nbsp;&nbsp;")
						  .append(label("<img class='icon icon-following' src='/images/void.gif' width='11px' height='11px' title='isRemix?'> ")+remixed+"&nbsp;&nbsp;");
			$("#stats").append("<br/><br/><h2>Playback vs Track views</h2>")
					   .append(bar(playback,views))
					   .append("<br/><h2>Favorite vs Playback</h2>")
					   .append(bar(window.fav,playback));
			if( $(a).find("downloadEnabled")[0].innerHTML !== "false" ) {		   
			$("#stats").append("<br/><h2>Download vs Favorite</h2>")
					   .append(bar(dlcount,window.fav));
			}
		}) .done(function() {	
		//Things to load when the query is finished
			//--Check if Chart.js is loaded or not
			if(!Chart) { $("#stats").after("<p>Chart.min.js required to load charts. A pity the script fails to load. <a onclick='resume_chart()'>Try again</a></p>"); }
			//--Append Settings Link
			$("body").append("<div id='statsettings' style='display:none;position:fixed;bottom:10px;right:10px;padding:30px;border:1px solid #ddd;border-radius:4px;'><button onclick='clearStorage();'>Clear This Track's Stats</button> "+
			"<button onclick='toggleSettings();'>Cancel</button>"+"<br/><br/><button onclick='fetchListen();'>Run Listen!</button></div>");
			if(localStorage["stats."+window.key]) {
				resume_track();
			} else {
				$("#linechart").append("<button id='starttracklink' onclick='start_track();'>Start Tracking</button>");
			}
			$(".leaf ol a").tipsy(); $("#stats a").tipsy({gravity:'e'}); //Tooltips! :D
		}) .fail(function() { 	
		//Doesn't alert you if doesn't find.
		});
} else { alert("Already loaded Leaf.");}
}
//Start Tracking
function start_track() {
if(typeof(Storage)!=="undefined") {
	var now = new Date().getTime();
	window.storageName = "stats."+window.key;
	var initialNodes = "";
		for (i=0;i<6;i++) {
				var favpasser = (i===0)? Math.ceil(window.fav/2) : window.fav;
				initialNodes += now-1000*60*60*24*(6-i)+","+favpasser+",";
		}
	localStorage.setItem("stats."+window.key,initialNodes+now+","+window.fav);
	//Pass it as an array for Chart.js
	window.plotLine = localStorage[storageName].split(",",14); console.log(plotLine);
	printChart();
	$("#starttracklink").remove();
	} else {
		alert("Your browser needs to support localStorage in order to track favorites. Get the latest browsers.");
	}
}
//Resume Tracking
function resume_track() {
	if(typeof(Storage)!=="undefined")
	  {
	  var now = new Date().getTime();
	  window.storageName = "stats."+window.key;
		if(localStorage[storageName]) {
			lineData = localStorage[storageName].split(",",14);
			lineLength = lineData.length;
			lastDay = [lineData[lineLength-1], lineData[lineLength] ];
			//Scans for all the nodes that's past over 6 days or itself's span.
			for (i=0;i<6;i++) {
				var absent = 0;
				if(lineData[i*2] < now - 1000*60*60*24*(7-i)) {
					lineData.shift(); lineData.shift();
					absent++;
				}
			}
			//Takes the number of deleted nodes, copy the data from the last day that's inputed.
			for (i=0;i<absent;i++) {
				lineData.push(lastDay[0]-1000*60*60*24*(absent-i)); lineData.push(lastDay[1]);
			}
			var newlineLength = lineData.length;
			//Add new data to the array if it's past over a day since the last's record.
			if(newlineLength < 14) {
					lineData.push(now); lineData.push(window.fav);
			}
			//Compiles data and sends it back to localStorage
			lineData.join(","); 
			localStorage.setItem("stats."+window.key,lineData);
		}
		//Pass it as an array for Chart.js
		window.plotLine = localStorage[storageName].split(",",14); console.log(plotLine);
		printChart();
	  }
	  
}
function printChart() {
	$("#linechart").append("<canvas id='line' width='256px' height='160px'></canvas>");
	//Print Chart
	var nextUpdate = new Date(parseInt(plotLine[0])).toLocaleTimeString();
	$("#linechart").append("<p>Next Update: "+nextUpdate+"</p>");
	//Draw
	var ctx = $("#line").get(0).getContext("2d");
	var sortedPlot = [ plotLine[1], plotLine[3], plotLine[5], plotLine[7], plotLine[9], plotLine[11], plotLine[13] ];
		sortedPlot.sort(function(a,b) { return a-b; });
	var data = {
	labels : [" "," "," "," "," "," ","Today"],
	datasets : [
		{
			fillColor : "rgba(255, 106, 0, 0.5)",
			strokeColor : "rgba(255, 106, 0,1)",
			pointColor : "rgba(255, 106, 0,0.8)",
			pointStrokeColor : "#fff",
			data : [ plotLine[1], plotLine[3], plotLine[5], plotLine[7], plotLine[9], plotLine[11], plotLine[13] ]
		}]
	}
	var lineChart = new Chart(ctx).Line(data,
	{scaleOverride: true, scaleSteps: parseInt(Math.ceil( (sortedPlot[6]-sortedPlot[0]) / 10)), scaleStepWidth: 10, scaleStartValue: parseInt(sortedPlot[0]),
	bezierCurve:false, scaleLineColor : "#bbb" ,scaleGridLineColor : "#443"}
	);
}
function toggleSettings() {
	$("#statsettings").slideToggle();
	$("#togglelink").text(($("#togglelink").text() == "Open Settings")? "Close Settings":"Open Settings");
}
function clearStorage() {
	var clearStorageName = "stats."+window.key;
	if(localStorage[clearStorageName]) {
		var confirmDelStats = prompt("Are you sure? Type 'yes': ");
		if(confirmDelStats == 'yes') {
			localStorage.removeItem(clearStorageName);
			cular.showHtmlMessage("Successfully removed stats for <a href='/track/"+window.key+"'>"+window.key+"</a>.","statsnotif");
			$("body").scrollTop(0);
		}
	} else {alert("Leaf: This track doesn't have statistical data.")};
}
//Bind function with page loads
cular.pageEvents.on("show",function() {
	track_getinfo();
	$("#statsettings").slideUp();
	$("textarea").css('resize','vertical');
});
//Load the first click
track_getinfo();
//Bookmarket
//javascript:(function (){document.getElementsByTagName('head')[0].appendChild(document.createElement('script')).src='http://kh01.me/Leaf/Leaf.js';document.getElementsByTagName('head')[0].appendChild(document.createElement('script')).src='http://kh01.me/Leaf/Chart.min.js';}());