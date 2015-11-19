'use strict';

(function () {

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', appUrl + '/api/:id', function (data) {
      $('#display-name').html(JSON.parse(data)['displayName']);
   }));

   var apiUrl = appUrl + '/api/:id/clicks';

   function updateClickCount (data) {
      var votesObject = JSON.parse(data);
      var output = "";
      for(var i = 0; i < votesObject.votes.length; i++) {
         output = output + '<p>' + votesObject.votes[i].name + ' ' + votesObject.votes[i].count + 
            '<button id="' + votesObject.votes[i].id + '" class="btn btn-vote">VOTE</button>' +
            '<button id="' + votesObject.votes[i].id + '" class="btn btn-delete">DELETE</button></p>';
      }
      $('#options').html(output);
      
      $('.btn-vote').click( function () {
         ajaxFunctions.ajaxRequest('POST', apiUrl + "?optionid=" + this.id, function () {
            ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
         });
      });

      $('.btn-delete').click( function () {
         ajaxFunctions.ajaxRequest('DELETE', apiUrl + "?optionid=" + this.id, function () {
            ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
         });
      });
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount));

   $('.btn-add').click( function () {
      ajaxFunctions.ajaxRequest('POST', apiUrl + "?optionname=" + document.querySelector('input').value, function () {
         ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
      });
   });

})();
