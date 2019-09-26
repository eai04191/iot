$(function(){
    ajax();
    setInterval(ajax, 5*60*1000);
    function ajax(){
        $.ajax({
            dataType: "json",
            url: './mackerel.php',
            success: function(data) {
                data = data.tsdbLatest["399ZzPd48Tw"];
                update(data);
            }
        });
    }
    function update(data){
        console.log(data);
        var time = data["custom.humidity"].time;
        var temperature = data["custom.temperature"].value;
        var humidity = data["custom.humidity"].value;
        var pressure = data["custom.pressure"].value;

        var date = moment.unix(time).format('YYYY/MM/DD HH:mm');
        $("#date").text(date);


        $("#temperature").text(temperature.toFixed(1));
        if(temperature >= 35){
        $("#temperature").addClass("font-effect-fire-animation");
        }else {
        $("#temperature").removeClass("font-effect-fire-animation");
        }
        $("#humidity").text(humidity.toFixed(1));
        $("#pressure").text(pressure.toFixed(1));
        /*
        if($("#pressure").text().length > 5){
        $("#pressure").css({'font-size': '4rem'});
        }
        */

        var discomfort = 0.81*temperature+0.01*humidity*(0.99*temperature-14.3)+46.3;
        console.log ("Discomfort: "+discomfort);
        $("#discomfort").text(discomfort.toFixed(1));
        $("#discomfort_icon").removeClass("fa-frown-o fa-meh-o fa-smile-o");
        if(discomfort >= 80){
        $("#discomfort_icon").addClass("fa-frown-o");
        }else if(discomfort >= 75){
        $("#discomfort_icon").addClass("fa-meh-o");
        }else {
        $("#discomfort_icon").addClass("fa-smile-o");
        }

        var Yi = 0.90739;
        var Xi = 0.14775;
        var YXi = -0.003665;
        var wbgt = Yi*temperature+Xi*humidity+YXi*temperature*humidity;
        console.log ("WBGT: "+wbgt);
        $("#wbgt").text(wbgt.toFixed(1));
        $("#wbgt_icon").removeClass("fa-smile-o fa-medkit fa-ambulance fa-fire");
        if(wbgt >= 31){
        $("#wbgt_icon").addClass("fa-ambulance");
        $("#wbgt_txt").html("危険").css('color', 'Red');
        }else if(wbgt >= 28){
        $("#wbgt_icon").addClass("fa-fire");
        $("#wbgt_txt").html("厳重<br>警戒").css({'color': 'Orange','font-size': '3rem'});
        }else {
        $("#wbgt_icon").addClass("fa-smile-o");
        $("#wbgt_txt").html("注意<br>警戒").css('color', 'Green');
        }
        $(".numeric").addClass("animated rubberBand").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        $(this).removeClass("rubberBand");
        });
        }
});