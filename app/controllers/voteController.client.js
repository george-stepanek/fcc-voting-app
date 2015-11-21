'use strict';

(function () {
   
   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', appUrl + '/api/:id', function (data) {
      try {
         var userObject = JSON.parse(data);
         $('#display-name').html(userObject['displayName']);
      }
      catch (err) {
         $('#logout').hide();
      }
   }));

   $('input').keypress(function(e){
      if(e.keyCode == 13)
         $('.vote-add').click();
   });

   var apiUrl = appUrl + '/api/:id/votes';

   function updateVotes (data) {
      var votes = JSON.parse(data);
      
      var output = "<table>";
      for(var i = 0; i < votes.length; i++) {
         output = output + '<tr><td><a href="/vote/' + 
            votes[i].id + '" style="text-decoration: none;">' + 
            votes[i].name + '</a></td><td><button id="' + 
            votes[i].id + '" class="btn vote-delete">Delete</button></td></tr>';
      }
      $('#votes').html(output + "</table>");
      
      $('.vote-delete').click( function () {
         ajaxFunctions.ajaxRequest('DELETE', apiUrl + "?voteid=" + this.id, function () {
            ajaxFunctions.ajaxRequest('GET', apiUrl, updateVotes);
         });
      });
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updateVotes));

   $('.vote-add').click( function () {
      ajaxFunctions.ajaxRequest('POST', apiUrl + "?votename=" + encodeURIComponent($('input').val()), function () {
         ajaxFunctions.ajaxRequest('GET', apiUrl, updateVotes);
      });
      $('input').val('');
   });
})();
