function postToFilemaker(e) {

  //--- parse the "e" event object that googlesheets passes the script ---//
  validate()
  var googleFormData = JSON.stringify(e) ;  //  Logger.log(googleFormData);

  //--- configure filemaker connection ---//
  var serverPath = "https://fm107.beezwax.net/fmi/rest/api" ;
  var filename = "google_forms_rest";
  var account = "google_form" ;
  var password = "This is 1 password" ;

  //--- configure filemaker data ---//
  var layout = "incoming_google_forms" ;
  var recordData = {  "form_data":googleFormData ,
                       "name":"Show and Share",
                       "type":"Example Form"
                      };

 //--- all configurations should be set above this comment
 //--- there should be no need to edit the code below...

  login()
  post()
  logout()

  //-- functions

  function login() {
      //authenticate to get FM-Data-token using http
      authUrl = serverPath.concat( "/auth/" , filename ) ;
      var data = { "layout":layout,
                   "user":account,
                   "password":password
                 }
      var payload = JSON.stringify(data);
      var headers =
          {
            "content-type": "application/json",
          };
      var options =
          {
            "method": "POST",
            "headers": headers,
            "payload": payload
          };
      var response = UrlFetchApp.fetch(authUrl,options);  //  Logger.log(response.getContentText());
      var dataAll = JSON.parse(response.getContentText());
      fmDataToken = dataAll.token;
  }

  function post() {
      //  use fmDataToken to post to Filamaker using http
      var url = serverPath.concat("/record/",filename,"/",layout);  //   Logger.log(url);  //  var url = "https://fm107.beezwax.net/fmi/rest/api/record/epatt_rest/rest_data";
      var headers =
          {
            "content-type": "application/json",
            "FM-Data-token": fmDataToken
          };
      var data = { "data":recordData } ;
      var payload = JSON.stringify(data);  //   Logger.log(payload);
      var options =
          {
            "method": "POST",
            "headers": headers,
            "payload" : payload
          }
      var response = UrlFetchApp.fetch(url,options);
      var fmApiResponse = response ;
  }

  function logout() {
      // logout fmDataToken using http
      var headers =
          {
            "content-type": "application/json",
            "FM-Data-token": fmDataToken
          };
      var options =
          {
            "method": "DELETE",
            "headers": headers,
          };
      var response = UrlFetchApp.fetch(authUrl,options);  //  Logger.log(response);
  }

  function validate() {
        // e is the "event" parameter passed from Google Forms.
        // if e is empty, we are debugging script and running it from script editor where no event parameter would be passed
        if (!e){
            e = {"values":["Testing"],"namedValues":{"Message":["Test Data While Debugging"],"Timestamp":["2/9/2018 20:17:37"]},"range":{},"source":{},"authMode":{},"triggerUid":"1296973926"}
        }
        googleFormNamedValues = JSON.stringify(e.namedValues) ;  //  Logger.log(googleFormData);
  }

}
