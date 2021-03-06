'use strict';

(function () {
    
   google.load("visualization", "1", {packages:["corechart"]});

    var apiUrl = appUrl + '/api/options/' + window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
    var userid;

    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', appUrl + '/api/:id', function (data) {
        try {
            var user = JSON.parse(data);
            $('#display-name').html(user.displayName);
            userid = user.id;
        }
        catch (err) {
            $('#logout').hide();
        }
    }));
    
    $('input').keypress(function(e){
        if(e.keyCode == 13)
            $('.option-add').click();
    });
    
    function updateOptions (data) {
        var vote = JSON.parse(data);
        $('#vote-name').html(vote.name);
        
        var output = "<table>";
        for(var i = 0; i < vote.options.length; i++) {
            output = output + '<tr><td>' + 
                vote.options[i].name + '</td><td class="spacer">' + (vote.userid == userid ? '<button id="' + 
                vote.options[i].id + '" class="btn option-delete">Delete</button></td><td class="spacer">' : '') +
                vote.options[i].count + '&nbsp;votes</td><td><button id="' + 
                vote.options[i].id + '" class="btn option-vote">Vote</button></td></tr>';
        }
        $('#options').html(output + "</table>");
          
        $('.option-vote').click( function () {
            ajaxFunctions.ajaxRequest('POST', apiUrl + "?optionid=" + this.id, function () {
                ajaxFunctions.ajaxRequest('GET', apiUrl, updateOptions);
            });
        });
          
        $('.option-delete').click( function () {
            ajaxFunctions.ajaxRequest('DELETE', apiUrl + "?optionid=" + this.id, function () {
                ajaxFunctions.ajaxRequest('GET', apiUrl, updateOptions);
            });
        });
        
        if(vote.options.length > 0) {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Option');
            data.addColumn('number', 'Votes');
            for(var i = 0; i < vote.options.length; i++ ) {
                data.addRow([vote.options[i].name, vote.options[i].count]);
            }
            
            var chart = new google.visualization.PieChart(document.getElementById('chart'));
            chart.draw(data, { 
                height: $(window).height() / 2,
                width: $(window).width(),
                is3D: true
            });
        } else {
            $('#chart').empty();
        }
    }
    
    google.setOnLoadCallback(function () { ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updateOptions )); });

    $('.option-add').click( function () {
        ajaxFunctions.ajaxRequest('POST', apiUrl + "?optionname=" + encodeURIComponent($('input').val()), function () {
            ajaxFunctions.ajaxRequest('GET', apiUrl, updateOptions);
        });
        $('input').val('');
    });

})();