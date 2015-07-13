/// <reference path="modernizr-2.6.2.js" />
/// <reference path="jquery-1.10.2.js" />
/// <reference path="bootstrap.js" />
/// <reference path="respond.js" />
/// <reference path="jquery.validate.js" />
/// <reference path="jquery.validate.unobtrusive.js" />
/// <reference path="ai.0.15.0-build12287.min.js" />
/// <reference path="jquery.timer.js" />
$(function () {

    //play button template
    var playButtonTemplate = '<input type="button" class="btn-mastermind-play" value="Play" />';

    // game config;
    var config = {};
    $('.btn-mastermind-play').prop('disabled', true);

    //initilaze game board
    var initialize = function () {
        $.ajax({
            url: 'api/MasterMind/Initialize',
            type: 'GET',
            dataType: 'json',        
            contentType: "application/json;charset=utf-8",
            success: function (data) {

                $('.btn-mastermind-play').prop('disabled', false);

                config.currentColumn = 1;
                config.gameStep = 1;
                config.gameId = data.GameId;
                config.maxColumn = data.ColumnCount;
                config.initalRowsCount = data.InitialRowsCount;
                var resultDiv = '#result_row_' + config.gameStep + ' div.play-action-holder';
                $(resultDiv).append(playButtonTemplate);
               

            },
            error: function (x, y, z) {
                alert('communication failure');
            }
        });
    }

    initialize();

    // configure strat button
    $('#startbutton').click(function() {
        // hide intro page
        $('#startGame').hide();
        // start timer
        $('#timer').timer();
        // show game 
    });

    //select color
    $(".color-selector .color-option").click(function () {
        // find choosed color
        var $this = $(this);
        var selectedColor = $this.css('background-color');
        var color = $this.data('color');

        // set color of active cell
        var cell = findActiveCell(config);
        cell.css('background-color', selectedColor);
        cell.data('selected-color', color);

        // set next active cell
        config.currentColumn = (config.currentColumn+1) % (config.maxColumn + 1);
        if (config.currentColumn == 0) {
            config.currentColumn = 1;          
        }

    });

    // change current active cell
    $(".board-cell").click(function () {
        // set active cell
    });

    //play event
    $('body').on('click','.btn-mastermind-play', function () {
        if (validate())
           play();     
    });

    // extending board by adding new rows to board
    var extendBoard = function (currentRowsCount, newRowsToBeAdded) {
        for (var index = 1; index <= newRowsToBeAdded; index++) {
            var template = $('div.GameSection:first').html();
            template = template.replace(/@@/g,  (currentRowsCount + index));
            $(template).insertBefore('.color-selector');
            $('#gameBoard div.GameSection:last').show();
        }
        config.initalRowsCount = currentRowsCount+newRowsToBeAdded;
    };

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
                var result = 'C: ' + data.SameColor + '<br/>CL: ' + data.SameColorAndLoc;
                $('#result_row_' + config.gameStep + ' div.play-action-holder').empty();
                $('#result_row_' + config.gameStep + ' div.play-action-holder').append(result);
                if (data.Win) {
                    alert('You won.Congragulation!!!!!');
                    $('#timer').timer('remove');
                }
                else
                { // check if new row should be added to boarf
                    if (config.gameStep + 1 > config.initalRowsCount)
                    {
                        extendBoard(config.initalRowsCount,1);
                    }
                    $('#result_row_' + (config.gameStep+1) + ' div.play-action-holder').append(playButtonTemplate);
                }

                // go to next step
                
                config.gameStep++;
                config.currentColumn = 1;
            },
            error: function (x, y, z) {
                alert('Communication failure');
            }
        });
    }

    // find active cell
    var findActiveCell = function (config) {
        var cell = $('#row_' + config.gameStep + '_col_' + config.currentColumn);
        return cell;
    }
    // validate board
    var validate= function()
    {
        var isValid = true;
        var notFilled = [];
        $('#row_' + config.gameStep + ' div').each(function (index) {
                        
            if (index != config.maxColumn) {
                var cell = $(this);

                var color = cell.data('selected-color');
                if (color == '') {
                    isValid = false;
                    notFilled.push(index + 1);                   
                }                
            }
        });

        if (!isValid)
        {
            var list = notFilled.join('-');
            alert('Colors not selected for column :' + list);
        }
        return isValid;
    }
    // get step data
    var getStepData = function () {
        var step = new Object();
        step.GameId = config.gameId;
        step.SelectedColors = '';
        var tr = $('#row_' + config.gameStep + ' div').each(function (index) {
            if (index != config.maxColumn) {
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