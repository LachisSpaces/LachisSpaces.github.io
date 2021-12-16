function $i(id) { return document.getElementById(id); }

var startspeed = 0;
var targetX = 1;
var targetY = 2;
var speed = 3;
var posZ = 4;

var fps = 2;
var star_count = 512;
var star_speed_min = 0.00001;
var star_speed_max = 0.00008;
var star_speed_diff = star_speed_max - star_speed_min;

var context;
var timeout;

var canvas_width = 0;
var canvas_height = 0;
var canvas_center_x = 0;
var canvas_center_y = 0;
var star = new Array(star_count);

var angle = 0;
var length = 0;
var factor = 0;
var pos_x = 0;
var pos_y = 0;


function init() {
	for(var l = 0; l < 20; l++) {
		for(var i = 0; i < star_count; i++) {
			if (l == 0) {
				star[i]=new Array(5);
				star[i][posZ] = 2;
			} else {
				star[i][speed] += star[i][speed] / 100;
				star[i][posZ] += star[i][speed];
			}
			if (star[i][posZ] > 1) { 
				length = Math.random() + 1;
				angle = (Math.random() * 2 - 1) * Math.PI;
				star[i][startspeed] = (Math.random() * (star_speed_max - star_speed_min)) + star_speed_min;
				star[i][targetX] = Math.cos(angle) * length * canvas_width;
				star[i][targetY] = Math.sin(angle) * length * canvas_height;
				star[i][speed] = star[i][startspeed];
				star[i][posZ] = Math.random() * (l / 20 + 1); 
			} else {
				pos_x = canvas_center_x + (star[i][targetX] * star[i][posZ]);
				pos_y = canvas_center_y + (star[i][targetY] * star[i][posZ]);
				if (pos_x < 0 || pos_x > canvas_width || pos_y < 0 || pos_y > canvas_height) {
					star[i][posZ] = 2;
				}
			}
		}
	}

	var starfield = $i('starfield');
	starfield.style.position = 'absolute';
	starfield.width = canvas_width;
	starfield.height = canvas_height;
	context = starfield.getContext('2d');
	context.strokeStyle = 'rgb(255, 255, 255)';
}

function anim() {
	context.clearRect(0, 0, canvas_width, canvas_height);
	for(var i = 0; i < star_count; i++) {
		star[i][speed] += star[i][speed] / 100;
		star[i][posZ] += star[i][speed];
		if (star[i][posZ] > 1) { 
			length = Math.random() + 1;
			angle = (Math.random() * 2 - 1) * Math.PI;
			star[i][startspeed] = (Math.random() * (star_speed_max - star_speed_min)) + star_speed_min;
//			star[i][startspeed] = star_speed_max;
			star[i][targetX] = Math.cos(angle) * length * canvas_width;
			star[i][targetY] = Math.sin(angle) * length * canvas_height;
			star[i][speed] = star[i][startspeed];
			star[i][posZ] = 0;
//			star[i][posZ] = Math.random() / 50; 
		} else {
			pos_x = canvas_center_x + (star[i][targetX] * star[i][posZ]);
			pos_y = canvas_center_y + (star[i][targetY] * star[i][posZ]);
			if (pos_x < 0 || pos_x > canvas_width || pos_y < 0 || pos_y > canvas_height) {
				star[i][posZ] = 2;
			} else {
				context.lineWidth = (star[i][posZ] * 5 + 0.05) * ((star[i][startspeed] - star_speed_min) / star_speed_diff);
				context.beginPath();
				context.moveTo(pos_x, pos_y);
//				factor = star[i][posZ] * (1 + star[i][posZ] / 20);
				factor = star[i][posZ] * (1 + star[i][speed] * 2);
				context.lineTo(canvas_center_x + (star[i][targetX] * factor), canvas_center_y + (star[i][targetY] * factor));
				context.stroke();
				context.closePath();
			}
		}
	}
	timeout = setTimeout('anim()', fps);
}

function start() {
	resize();
	anim();
}

function resize() {
	canvas_width = document.documentElement.clientWidth;
	canvas_height = document.documentElement.clientHeight;
	canvas_center_y = Math.round(canvas_height / 2);
	canvas_center_x = Math.round(canvas_width / 2);
	init();
}
