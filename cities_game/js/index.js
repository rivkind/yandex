var myMap;
var myCollection;
var count=0;
var level=0;
var city='';
var cities = [];
var last = '';
var level_count=10;
var level_total=3;
var level_win=0;
var firstText = 'Привет, поиграем?\r\n\r\nТы называешь реально существующий город любой страны, а я в свою очередь называет реально существующий город любой страны, название которого начинается на ту букву, которой оканчивается название города, который назвал ты.\r\nИсключением являются названия, оканчивающиеся на Ы, Й, «Ь» (мягкий знак) и «Ъ» (твёрдый знак): в таких случаях необходимо называть город на предпоследнюю букву.\r\n\r\nЧтобы пройти первый уровень, тебе нужно назвать 10 городов.\r\n\r\nЕсли готов, тогда поехали! Начинай игру! ';
var textSpeech_active = "Говорите...";
var textSpeech = "Город";
var lock_speech = true;
var btnText = "Продолжить игру";

$(document).ready(function() {
    $('.footerSummary button').text(btnText);
    
    disableInput(true);
    $("#chatboxStatus").show();
    $("#city").val('');
    ymaps.ready(function() {
        updatePlacemarkPosition()
    });
    setTimeout(sendMessage, 1000, firstText);

    $( "#start button, #summary button" ).on( "click", function() {
        cities = [];
        city='';
        last = '';
        if(level!=0 || (level==0 && count!=0)){
            myMap = null;
            delete(myCollection);
            $('#map').html('');
        }
        count=0;
        updatePlacemarkPosition()
        $(".leftBlock").hide();
        $("#map").show();
        level++;
        level_win = level*level_count;
        sendMessage("Называй любой город:)");
        disableInput(false);
    });

    $('.chatboxInput span').on( "click", function() {
        startDictation();
    });

    $('input').keydown(function(event){
        if(event.keyCode==13)
        {
            event.preventDefault();
            sendAnswer();
            return false;
        }
    });

});

function sendMessage(text,user)  {
    var innerText = (user)?"<div class='myAnswer'>":"<div>";
    innerText += '<div></div><div class="textAnswer">'+text+'</div></div>';
    $( "#chatbox" ).append(innerText);
    $( "#chatbox" ).scrollTop(10000);
    $("#chatboxStatus").hide();
    
}

function disableInput(bool){
    lock_speech = bool;
    $( "#city" ).prop( "disabled", bool );
    (bool)?
    $('.chatboxInput span').css('cursor','default')
    :
    $('.chatboxInput span').css('cursor','pointer');
    
    if(!bool) $("#city").val('');
}

function summaryLevel() {
    $(".leftBlock").hide();
    if(level == level_total) titleSummary = "Ты гений в городах. Ты прошел игру!";
    else titleSummary = "Вы победили и прошли "+level+" уровень!";
    youCities = '<div>Ваши города</div>';
    compCities = '<div>Компьютера города</div>';
    for(i=0;i<cities.length;i++){
        if(i%2 == 0) youCities += '<div>'+cities[i]+'</div>';
        else compCities += '<div>'+cities[i]+'</div>';
    }
    bodySummary = '<div>'+youCities+'</div><div>'+compCities+'</div>';
    $('.titleSummary').text(titleSummary);
    $('.bodySummary').html(bodySummary);
    if(level == level_total){
        $('.footerSummary button').text("Начать заново");
        level = 0;
    }
    else $('.footerSummary button').text(btnText);
    $("#summary").show();
    if(level!=0) sendMessage('Ты можешь продолжить игру в следующем уровне, где необходимо уже назвать больше городов. Для этого нажми кнопку "Продолжить игру"');
    else sendMessage('Гениально! Хочешь повторить успех, то нажми кнопку "Начать заново"!');
}

function sendAnswer() {
    disableInput(true);
    city=$("#city").val().trim();
    if(count>0 && city.substr(0,1).toLowerCase()!=last){
        sendMessage('Необходимо город на букву "'+last.toUpperCase()+'"');
        disableInput(false);
        return false;
    }
    for(var i=0;i<cities.length;i++){
        if(cities[i].toLowerCase()==city.toLowerCase()){
            disableInput(false);
            sendMessage('Город "'+city+'" уже называли!"');
            return false;
        }
    }
    var data = "cities="+cities+"&answer="+city;
    $.ajax({
        method: 'post',
        dataType: 'json',
        url: "https://openball.org/cities.php",
        data: data
    }).done(function(data) {
        if(data.error==0){
            
            city = data.city;
            cities.push(data.city);
            sendMessage(city,true);
            updatePlacemarkPosition();
            goodAnswer = Math.round(cities.length/2);
            if((level_win-goodAnswer)!=0) sendMessage('Супер! Ты назвал '+goodAnswer+' город, осталось '+(level_win-goodAnswer)+'! ');
            if(goodAnswer == level_win){
                sendMessage('Ты победил! Через пару секунд будут подведены итоги '+level+" уровня!");
                setTimeout(function(){
                    summaryLevel();
                },3000);
            }else{
                $("#chatboxStatus").show();
                
                city = data.comp;
                last = data.last;
                setTimeout(function(){
                    stepRobot(data.comp,data.last);
                },3000);
            }

            
        }else if(data.error==2){
            sendMessage('Город "'+city+' уже называли или не существует!');
            disableInput(false);
        }else{
            sendMessage('Произошла ошибка, попробуй еще раз!');
            disableInput(false);
        }
    });
}

function stepRobot(cityComp,letter){
    cities.push(cityComp);
    updatePlacemarkPosition();
    sendMessage(cityComp+'. Тебе на '+letter.toUpperCase()+'!');
    disableInput(false);
}

function updatePlacemarkPosition() {
    if (!myMap) {
        myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom:3,
            behaviors: ['default', 'scrollZoom']
        });
        myCollection = new ymaps.GeoObjectCollection(),
        myMap.controls.add('smallZoomControl', { left: 5, top: 5 });
    }
    var address = city,
    searchAddress = address;
    if(searchAddress!=''){
        ymaps.geocode(searchAddress,{ kind: 'locality' }).then(
            function (res) {
                var firstGeoObject = res.geoObjects.get(0),
                coordinates = firstGeoObject.geometry.getCoordinates();
                bounds=firstGeoObject.properties.get('boundedBy');
                count++;
                myCollection.add(new ymaps.Placemark(coordinates, {}, {draggable: true}));
                myMap.geoObjects.add(myCollection);
                if(count>1) myMap.setBounds(myCollection.getBounds()); 
                else{
                    myMap.setBounds(bounds, {
                        checkZoomRange: true
                    }); 
                }   
            }
        );
    }
}

function startDictation() {
    if (window.hasOwnProperty('webkitSpeechRecognition') && !lock_speech) {

        var recognition = new webkitSpeechRecognition();
    
        recognition.continuous = false;
        recognition.interimResults = false;
    
        recognition.lang = "ru-RU";
        recognition.start();
        $("#city").val('');
        $("#city").attr("placeholder", textSpeech_active);
        recognition.onresult = function(e) {
            $("#city").val(e.results[0][0].transcript);
            //document.getElementById("city").value = e.results[0][0].transcript; 
            recognition.stop();
            
            $("#city").attr("placeholder", textSpeech);
            sendAnswer();
        };
    
        recognition.onerror = function(e) {
            console.log('asds2');
            recognition.stop();
            $("#city").attr("placeholder", textSpeech);
        }

    }
}