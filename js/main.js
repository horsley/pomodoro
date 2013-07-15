/**
 * Created with JetBrains PhpStorm.
 * User: horsley
 * Date: 12-12-31
 * Time: ����8:01
 * To change this template use File | Settings | File Templates.
 */
var pomodoro = 25 * 60;
var pomodoroRest = 5 * 60;
var pomodoroStatus = 0; //0:init 1:running a pomodoro 2:having rest 3:pomodoro completed 4:rest completed
var reminderTxt = '';

$(function(){
    loadSettings();
    drawClock();
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
            pomodoroStatus = 2;
            toggleProgress();
            btn_start.everyTime('1s', function(){
                mainCounter--;
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
        saveSettings();
        return false;
    });

    $('#setTimerBtn').click(function(){
        pomodoroStatus = 0
        stopCounter();
        drawClock();
        saveSettings();
        $('#txtModal2').modal('hide');
    });

    $('input[name="pomodoroDuration"]').on('change', function(){
        pomodoro = $(this).val() * 60;
        drawProgress();
    });

    $('input[name="restDuration"]').on('change', function(){
        pomodoroRest = $(this).val() * 60;
        drawProgress();
    });

    $('#txtModal').on('shown', function() {
        $('input[name="reminderText"]').focus();
    });

    $('#txtModal2').on('shown', function() {
        drawProgress();
        $('input[name="pomodoroDuration"]').val(pomodoro / 60);
        $('input[name="restDuration"]').val(pomodoroRest / 60);
    });

    function drawProgress() {
        $('#pomodoroDuration').width((pomodoro / (pomodoro + pomodoroRest) * 100) + "%");
        $('#restDuration').width((pomodoroRest / (pomodoro + pomodoroRest) * 100) + "%");
    }

    function drawClock() {
        $('#mainTimeCounter').html(s2Str(pomodoro));
    }

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

    function loadSettings() {
        if(window.localStorage){
            var a, b, c;
            var storage = window.localStorage;
            if (a = storage.getItem('pomodoro')) {
                pomodoro = parseInt(a);
            }
            if (b = storage.getItem('pomodoroRest')) {
                pomodoroRest = parseInt(b);
            }
            if (c = storage.getItem('reminderTxt')) {
                reminderTxt = parseInt(c);
            }
        }
    }

    function saveSettings() {
        if(window.localStorage){
            var storage = window.localStorage;
            storage.setItem('pomodoro', pomodoro);
            storage.setItem('pomodoroRest', pomodoroRest);
            storage.setItem('reminderTxt', reminderTxt);
        }
    }
});



