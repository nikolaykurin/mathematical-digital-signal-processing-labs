$(document).ready(function() {
	var garmoniki = +$('#garmoniki').val(); //количество гармоник
	var amplitude = [+$('.amplitude').val()]; //амплитуда гармоники
	var frequency = [+$('.frequency').val()]; // частота гармоники
	var phase = [+$('.phase').val()]; //фаза гармоники
	var noise = false; //наличие шума
	var length_signal= +$('.length_signal').val(); //длина сигнала
	var Re = 0; 
	var Im = 0;
	var xarray = []; // массив значений сигнала
    var power_array = []; // массив значений мощности
	var ACH_array = []; //массив АЧХ
	var FCH_array = []; //массив ФЧХ
    var AKF_array =  [];
    var Henning_array = []; //для хранения отфильтроаванных значений
    var parabol_array = [];
    var firstfilter_array = [];

    //Добавить гармонику
	$('#add_garmonik').live('click', '#add_garmonik', function(event) {
        $('.afp').remove();
        if(garmoniki<5){
            garmoniki++;
            $('#garmoniki').val(garmoniki);
            for (var i = 1; i <= garmoniki; i++) {
                $('#build_graph').before('<div class = "afp">\
                                    <label for="amplitude">Введите амплитуду ' + i + ' гармоники</label>      \
                                    <input type="text" class="amplitude" value="15">\
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
    
    //Кнопка построить график
	$('#build_graph').live('click', function(event) {
        amplitude = [];
        frequency = [];
        phase = [];
        for (var i = 0; i < garmoniki; i++) {
            amplitude.push($('.amplitude').eq(i).val());
            frequency.push($('.frequency').eq(i).val());
            phase.push($('.phase').eq(i).val());
        };
        +$('.period').val(1/(2*Math.max.apply( Math, frequency))/100);  
		build_signal();
	});


	/*Добавление шума вызывает окно задания амплитуды шума, 
	меняет переменную "наличие шума" на true*/
    $('#add_noise').live('click', function(event) {
        $('#noise').show();
        noise = true;
    });

    //Построить график сигнала
	function build_signal(){
		var signal=0;
        var amplitude_noise = $('.amplitude_noise').val();
		for (var x=0; x<=+$('.length_signal').val(); x+=+$('.period').val()){ 
			 for (var i = 0; i <garmoniki; i++) {
	            if(noise){ // если шум
	                signal = (signal + amplitude[i] * Math.cos(Math.PI*2 *frequency[i]*x + phase[i]) +Math.random() * 
	                (amplitude_noise/2 - (-amplitude_noise/2)) + (-amplitude_noise/2))/2;
	                xarray.push([x,signal]);

	            }
				else{ //если нет шума
	                signal = signal + amplitude[i] * Math.cos(Math.PI*2 *frequency[i]*x + phase[i]);
	                xarray.push([x,signal]);
	            }
        	}

		}
		$.jqplot('chartdiv',  [xarray],{ 
			title:'Построение сигнала',
			seriesDefaults: {showMarker: false}, //не показывть точки
			axes:{xaxis:{min:0, max:+$('.length_signal').val()}},
			series:[{color:'rgba(11,153,11,0.9)'}]
		});
	}
    //кнопка построения графика мощности
    $('#build_power').live('click', function(event) {
        build_power();
    });
    // Кнопки построения АЧХ ФЧХ
	$('#ACH').live('click', function(event) {
    	build_ACH();
	});
	$('#FCH').live('click', function(event) {
    	build_FCH();
	});

	//кнопки для построения фильтров
	$('#filter_henning').live('click', function(event) {
    	build_Henning();
	});
	$('#filter_parabol').live('click', function(event) {
    	build_parabol();
	});
	$('#filter_first').live('click', function(event) {
    	build_firstfilter();
	});

    

	//Постройка графика мощности
    function  build_power(){
        var signal_power=0;
        var amplitude_noise = $('.amplitude_noise').val();
        for (var x=0; x<=+$('.length_signal').val(); x+=+$('.period').val()){ 
             for (var i = 0; i <garmoniki; i++) {
                if(noise){ // если шум
                    signal_power = (signal_power + amplitude[i] * Math.cos(Math.PI*2 *frequency[i]*x + phase[i]) +Math.random() * 
                    (amplitude_noise/2 - (-amplitude_noise/2)) + (-amplitude_noise/2))/2;
                    power_array.push([x,signal_power*signal_power]);
                }
                else{ //если нет шума
                    signal_power = signal_power + amplitude[i] * Math.cos(Math.PI*2 *frequency[i]*x + phase[i]);
                    power_array.push([x,signal_power*signal_power]);
                }
            }
        }
        $.jqplot('powerdiv',  [power_array],{ 
            title:'Построение графика мощности',
            seriesDefaults: {showMarker: false}, //не показывть точки
            axes:{xaxis:{min:0, max:+$('.length_signal').val()}},
            series:[{color:'rgba(11,11,11,0.9)'}]
        });

    }

    //постройка графика АЧХ
	function build_ACH(){
		var T = +$('.length_signal').val();
    	var dt = $('.period').val();
    	var N = T/dt;
    	var ACH = 0;
    	for(var x = 0; x<N; x++){
    		Re=0;
    		Im=0;
    		for(var i = 0; i<N; i++){
    			Re = Re + xarray[i][1] * Math.cos(Math.PI*2*i*x/N);
    			Im = Im + xarray[i][1] * Math.sin(Math.PI*2*i*x/N);
    		}
    		ACH = Math.sqrt(Re*Re + Im*Im)/(N/2);
    		ACH_array.push([x*1.3,ACH]);
    	}

    	$.jqplot('ACHdiv',  [ACH_array],{ 
			title:'АЧХ',
			seriesDefaults: {showMarker: false}, //не показывть точки
			axes:{xaxis:{min:0 }, yaxis:{min:0}},
			series:[{color:'rgba(11,11,110,0.9)'}]
		});
	}

	//постройка графика ФЧХ
	function build_FCH(){
		var T = +$('.length_signal').val();
    	var dt = $('.period').val();
    	var N = T/dt;
    	var FCH = 0;
    	for(var x = 0; x<N; x++){
    		Re=0;
    		Im=0;
    		for(var i = 0; i<N; i++){
    			Re = Re + xarray[i][1] * Math.cos(Math.PI*2*i*x/N);
    			Im = Im + xarray[i][1] * Math.sin(Math.PI*2*i*x/N);
    		}
    		if(Re>0.0001)
    			if(noise){
    				FCH = 1 * Math.atan(Im/Re)/1.4;
    			}
    		    else FCH = 1 * Math.atan(Im/Re)/1.5;
    		else FCH = 0;
    		FCH_array.push([x*1.3,FCH]);
    	}
    	$.jqplot('FCHdiv',  [FCH_array],{ 
			title:'ФЧХ',
			seriesDefaults: {showMarker: false}, //не показывть точки
			axes:{xaxis:{min:0}},
			series:[{color:'rgba(110,11,11,0.9)'}]
		});
	}

	//Сигнал отфильтрованный фильтром Хеннинга
    function build_Henning(){
    	var k1 = 1/2;
    	var k2 = 1/4;
    	var T = +$('.length_signal').val();
        var dt = $('.period').val();
        var N = T/dt;
        var Henning_signal = 0;
        for(var i = 2; i<N; i++){
        	Henning_signal = k2*xarray[i][1] + k1 * xarray[i-1][1] + k2*xarray[i-2][1];
        	Henning_array.push(Henning_signal);
        }

        $.jqplot('Henningdiv',  [Henning_array],{ 
            title:'Фильтр Хеннинга',
            seriesDefaults: {showMarker: false}, //не показывть точки
            axes:{xaxis:{min:0, N}},
            series:[{color:'rgba(211,121,210,0.9)'}]
        });
    }

    //Сигнал отфильтрованный фильтром Параболлическим
    function build_parabol(){
    	var T = +$('.length_signal').val();
        var dt = $('.period').val();
        var N = T/dt;
        var parabol_signal = 0;
        for(var i = 2; i<N-3; i++){
        	parabol_signal = (-3)*xarray[i-2][1] + 12*xarray[i-1][1] + 17 * xarray[i][1] + 12*xarray[i+1][1] + (-3) *xarray[i+2][1] ;
        	parabol_array.push(parabol_signal);
        }

        $.jqplot('Paraboldiv',  [parabol_array],{ 
            title:'Параболический фильтр',
            seriesDefaults: {showMarker: false}, //не показывть точки
            axes:{xaxis:{min:0, N}},
            series:[{color:'rgba(221,0,210,0.9)'}]
        });
    }

	function build_firstfilter(){
    	var T = +$('.length_signal').val();
        var dt = $('.period').val();
        var N = T/dt;
        var r = 2;
        var a =1;

        var first_filtre_signal = 0;
        for(var i = 2; i<N-3; i++){
        	first_filtre_signal = a*xarray[i][1] + r*xarray[i-1][1];
        	firstfilter_array.push(first_filtre_signal);
        }
        $.jqplot('Firstfilterdiv',  [firstfilter_array],{ 
            title:'Фильтр первого порядка',
            seriesDefaults: {showMarker: false}, //не показывть точки
            axes:{xaxis:{min:0, N}},
            series:[{color:'rgba(221,0,0,0.9)'}]
        });

        
    }


	
});