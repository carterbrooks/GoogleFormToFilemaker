function postToFilemaker(e) {

  // e is the "event" parameter passed from Google Forms.
  // if e is empty, we are debugging script and running it from script editor where no event parameter would be passed
  if (!e){
    e = { "namedValues" : "We are testing here." } //allows script to be run during debugging
  }

  //get data e
  var googleFormData = JSON.stringify(e) ;  //  Logger.log(googleFormData);
  var googleFormNamedValues = JSON.stringify(e.namedValues) ;  //  Logger.log(googleFormData);

  // configure filemaker connection
  var serverPath = "https://fm107.beezwax.net/fmi/rest/api" ;
  var filename = "google_forms_rest";
  var account = "google_form" ;
  var password = "This is 1 password" ;

  // conffigure filemaker data
  var layout = "incoming_google_forms" ;
  var recordData = {  "form_data":googleFormData ,
                       "name":"Google to FM API Demo",
                       "type":"Example Form"
                      };


 //--- all configurations should be set above this comment, nothing below this line should need editing....

  //authenticate to get FM-Data-token using http
  var authUrl = serverPath.concat( "/auth/" , filename ) ;
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
  var fmDataToken = dataAll.token;

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
