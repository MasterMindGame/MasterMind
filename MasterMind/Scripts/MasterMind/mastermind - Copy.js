/// <reference path="modernizr-2.6.2.js" />
/// <reference path="jquery-1.10.2.js" />
/// <reference path="bootstrap.js" />
/// <reference path="respond.js" />
/// <reference path="jquery.validate.js" />
/// <reference path="jquery.validate.unobtrusive.js" />
/// <reference path="ai.0.15.0-build12287.min.js" />
$(function () {

    // game setting;
    var gameStep = 1;
    var currentColumn = 1;
    var maxColumn = 4;
    var gameId = '12345';

    //select color
    $("#colorSelection .color-option").click(function () {
        // find choosed color
        var $this = $(this);
        var selectedColor = $this.css('background-color');
        var color = $this.data('color');

        // set color of active cell
        var cell = findActiveCell(currentColumn);
        cell.css('background-color', selectedColor);
        cell.data('selected-color', color);

        // set next active cell
        currentColumn = (currentColumn+1) % (maxColumn + 1);
        if (currentColumn == 0) {
            currentColumn = 1;          
        }

    });

    // change current active cell
    $(".board-cell").click(function () {
        // set active cell
    });

    $('#play').click(function () {
        play();
     
    });

    //play
    var play = function () {
        $.ajax({
            url: 'api/MasterMind/Play',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(getStepData()),
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                //set  result
                var result = 'SC: ' + data.SameColor + ' -SCL: ' + data.SameColorAndLoc;
                $('#gameBoard tr:eq(' + gameStep + ') div.play-action-holder').replaceWith(result);
               // go to next step
                gameStep++;
                currentColumn = 1;
            },
            error: function (x, y, z) {
                alert('communication failure');
            }
        });
    }

    // find active cell
    var findActiveCell = function (currentIndex) {
        currentIndex--;
        var cell = $('#gameBoard tr:eq(' + gameStep + ') td:eq(' + currentIndex + ')')
        return cell;
    }

    // get step data
    var getStepData = function () {
        var step = new Object();
        step.GameId = gameId;
        step.SelectedColors = '';
        var tr = $('#gameBoard tr:eq(' + gameStep + ') td').each(function (index) {
            if (index != maxColumn) {
                var td = $(this);

                var color = td.data('selected-color');
                if (color == '') {
                    alert('You need to select color for column ' + (index + 1));
                }
                step.SelectedColors += (color + ';');
            }
        });
        
        return step;

    };   
});