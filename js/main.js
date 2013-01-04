/**
 * Created with JetBrains PhpStorm.
 * User: horsley
 * Date: 12-12-31
 * Time: 下午8:01
 * To change this template use File | Settings | File Templates.
 */
var pomodoro = 25 * 60;
var pomodoroRest = 5 * 60;
var pomodoroStatus = 0; //0:init 1:running a pomodoro 2:having rest 3:pomodoro completed 4:rest completed
var reminderTxt = '';

$(function(){

    var btn_start = $('#startBtn');
    var btn_stop= $('#stopBtn');
    var bar_progress = $('#mainTimeProgress');

    btn_start.click(function(){
        if (pomodoroStatus == 0 || pomodoroStatus == 1 || pomodoroStatus == 4) {    //start new pomodoro
            mainCounter = pomodoro;
            pomodoroStatus = 1;
            toggleProgress();
            btn_start.everyTime('1s', function(){
                mainCounter--;
                $('#mainTimeCounter').html(s2Str(mainCounter));
                bar_progress.width(mainCounter / pomodoro * 100 + '%');

                if (mainCounter == 0) {
                    pomodoroStatus = 3;
                    btn_start.html('Have a rest');
                    btn_start.removeClass('btn-primary').addClass('btn-success');
                    stopCounter();
                }
            });
        } else if (pomodoroStatus == 2 || pomodoroStatus == 3 ) { // start having a rest
            mainCounter = pomodoroRest;
            btn_start.everyTime('1s', function(){
                mainCounter--;
                pomodoroStatus = 2;
                toggleProgress();
                $('#mainTimeCounter').html(s2Str(mainCounter));
                bar_progress.width(mainCounter / pomodoroRest * 100 + '%');

                if (mainCounter == 0) {
                    pomodoroStatus = 4;
                    btn_start.html('Start Pomodoro');
                    btn_start.removeClass('btn-success').addClass('btn-primary');
                    stopCounter();
                }
            });
        }

    });

    $('#setReminderBtn').click(function(){
        var inputText = $('input[name="reminderText"]').val();
        var reminderContainer = $('#reminderContainer');
        if ($.trim(inputText) != '') {
            reminderContainer.html($.trim(inputText));
            reminderContainer.show();
        } else {
            reminderContainer.hide();
        }
        $('#txtModal').modal('hide');
        return false;
    });

    $('#txtModal').on('shown', function() {
        $('input[name="reminderText"]').focus();
    })

    $('input[name="reminderText"]').keypress(function(e){
        if (e.keyCode == 13) {
            $('#setReminderBtn').click();
            return false;
        }
    });

    btn_stop.click(function(){
        if (pomodoroStatus == 1 || pomodoroStatus == 2) {
            stopCounter();
            toggleProgress();
        }
    });

    btn_start.click(function(){
        btn_start.addClass('disabled');
        btn_stop.removeClass('disabled');
    });

    function stopCounter() {
        btn_start.stopTime();

        btn_start.removeClass('disabled');
        btn_stop.addClass('disabled');
    }

    function toggleProgress() {
        bar_progress.parent().toggleClass('active');
    }

    function s2Str(seconds) {
        var sec = seconds % 60;
        var min = Math.floor(seconds / 60);
        return min + ':' + (sec < 10 ? '0' : '') + sec;
    }
});



