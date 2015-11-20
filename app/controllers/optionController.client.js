'use strict';

(function () {
    
    var voteId = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
    var loggedIn = false;

    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', appUrl + '/api/:id', function (data) {
        try {
            var userObject = JSON.parse(data);
            $('#display-name').html(userObject['displayName']);
            loggedIn = true;
        }
        catch (err) {
            $('#logout').hide();
        }
    }));
    
    $('input').keypress(function(e){
        if(e.keyCode == 13)
            $('.option-add').click();
    });
    
    var apiUrl = appUrl + '/api/options/' + voteId;
    
    function updateOptions (data) {
        var optionsObject = JSON.parse(data);
        $('#vote-name').html(optionsObject['name']);
        
        var output = "<table>";
        for(var i = 0; i < optionsObject.options.length; i++) {
            output = output + '<tr><td>' + optionsObject.options[i].name + '</td><td class="spacer">' +
                (loggedIn ? '<button id="' + optionsObject.options[i].id + '" class="btn option-delete">Delete</button></td><td class="spacer">' : '') +
                optionsObject.options[i].count + '&nbsp;votes</td><td>' + 
                '<button id="' + optionsObject.options[i].id + '" class="btn option-vote">Vote</button></td></tr>';
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
    }
    
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updateOptions));
    
   $('.option-add').click( function () {
      ajaxFunctions.ajaxRequest('POST', apiUrl + "?optionname=" + encodeURIComponent($('input').val()), function () {
         ajaxFunctions.ajaxRequest('GET', apiUrl, updateOptions);
      });
      $('input').val('');
   });

})();