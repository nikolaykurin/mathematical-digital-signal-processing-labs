$(document).ready(function() {

	var garmoniki = +$('#garmoniki').val();
	var amplitude = [+$('.amplitude').val()];
	var frequency = [+$('.frequency').val()];
	var phase = [+$('.phase').val()];
	var noise = false;
	$('body').on('click', '#add_garmonik', function(event) {
        $('.afp').remove();
        if(garmoniki<5){
            garmoniki++;
            $('#garmoniki').val(garmoniki);
            for (var i = 1; i <= garmoniki; i++) {
                $('#build_graph').before('<div class = "afp">\
                                    <label for="amplitude">Введите амплитуду ' + i + ' гармоники</label>      \
                                    <input type="text" class="amplitude" value="3">\
                                    \
                                    <label for="frequency">Введите частоту ' + i + ' гармоники</label>\
                                    <input type="text" class="frequency" value="2">\
                                    \
                                    <label for="phase">Введите фазу ' + i + ' гармоники</label>\
                                    <input type="text" class="phase" value="1">\
                                </div>');
            };       
        }   
    });

	$('body').on('click', '#build_graph', function(event) {
        amplitude = [];
        frequency = [];
        phase = [];
        for (var i = 0; i < garmoniki; i++) {
            amplitude.push($('.amplitude').eq(i).val());
            frequency.push($('.frequency').eq(i).val());
            phase.push($('.phase').eq(i).val());
        };  
		draw();
	});


    $('body').on('click', '#add_noise', function(event) {
        $('#noise').show();
        noise = true;

    });
    


	function fun(x) {
		var signal=0;
        var amplitude_noise = $('.amplitude_noise').val();
		for (var i = 0; i <garmoniki; i++) {
            if(noise){ // если шум
                signal = signal + amplitude[i] * Math.cos(Math.PI*2 *frequency[i]*x + phase[i]) + Math.random() *
                (amplitude_noise/2 - (-amplitude_noise/2)) + (-amplitude_noise/2);
            }
			else{ //если нет шума
                signal = signal + amplitude[i] * Math.cos(Math.PI*2 *frequency[i]*x + phase[i]);
            }
		};
		console.log({
			x,
			amplitude,
			frequency,
			phase
		});
		return signal;
	}

	function draw() {
		var canvas = document.getElementById("canvas");
		if (null==canvas || !canvas.getContext) return 0;
		var axes={};
		var ctx=canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		axes.x0 = 0.5+0.01*canvas.width;  // x0 pixels from left to x=0
		axes.y0 = 0.5+ 0.5*canvas.height; // y0 pixels from top to y=0
		axes.scale =  500;                 //pixels from x=0 to x=1
		axes.doNegativeX = false;
		showAxes(ctx,axes);
		funGraph(ctx,axes,fun,"rgba(11,153,11,0.8)",1); 
	}

	function funGraph (ctx,axes,func,color,thick) {
        $('.period').val(1/(2*Math.max.apply( Math, frequency)));
        var period = +$('.period').val() 
		var xx, yy, dx=1, 
        x0=axes.x0, y0=axes.y0, scale=axes.scale;
		var iMax = Math.round(+$('.length_signal').val());
		var iMin = axes.doNegativeX ? Math.round(-x0/dx) : 0;

		ctx.beginPath();
		ctx.lineWidth = 1.5;
		ctx.strokeStyle = color;
		for (var i=iMin;i<=iMax;i=i+period) {
			xx = dx*i; yy = scale*func(xx/scale)/30;
			if(i==iMin){
				ctx.moveTo(x0+xx,y0-yy);
			} 
			else{
				ctx.lineTo(x0+xx,y0-yy);
			}         			
		}
		ctx.stroke();
	}

	function showAxes(ctx,axes) {
		var x0=axes.x0, w=ctx.canvas.width;
		var y0=axes.y0, h=ctx.canvas.height;
		var xmin = axes.doNegativeX ? 0 : x0;
		ctx.beginPath();
		ctx.strokeStyle = "rgba(78,78,78,0.9)"; 
		ctx.lineWidth = 2;
		ctx.moveTo(xmin,y0); ctx.lineTo(w,y0);  // X axis
		ctx.moveTo(x0,0);    ctx.lineTo(x0,h);  // Y axis
		ctx.stroke();
	}
	
});