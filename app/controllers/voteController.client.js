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
      var votesObject = JSON.parse(data);
      var output = "<table>";
      for(var i = 0; i < votesObject.votes.length; i++) {
         output = output + '<tr><td><a href="/vote/' + votesObject.votes[i].id + '" style="text-decoration: none;">' + 
            votesObject.votes[i].name + '</a></td><td>' +
            //votesObject.votes[i].count + '<button id="' + votesObject.votes[i].id + '" class="btn btn-vote">Vote</button>' +
            '<button id="' + votesObject.votes[i].id + '" class="btn vote-delete">Delete</button></td></tr>';
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
