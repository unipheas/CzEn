// Hide all other parts first
$('.signs').hide();
$('.payment').hide();
$('.share').hide();

// Global Variables
var sex = null;
var clickedSign = null;
var finalName = [];

// Names Object
var names = {
  'male': {
    'rat':['John', 'Bob', 'Carl','Jason','Brian','James'],
    'ox':['John', 'Bob', 'Carl','Jason','Brian','James'],
    'tiger':['John', 'Bob', 'Carl','Jason','Brian','James'],
    'rabbit':['John', 'Bob', 'Carl','Jason','Brian','James'],
    'dragon':['John', 'Bob', 'Carl','Jason','Brian','James'],
    'snake':['John', 'Bob', 'Carl','Jason','Brian','James'],
    'horse':['John', 'Bob', 'Carl','Jason','Brian','James'],
    'sheep':['John', 'Bob', 'Carl','Jason','Brian','James'],
    'monkey':['John', 'Bob', 'Carl','Jason','Brian','James'],
    'rooster':['John', 'Bob', 'Carl','Jason','Brian','James'],
    'dog':['John', 'Bob', 'Carl','Jason','Brian','James'],
    'pig':['John', 'Bob', 'Carl','Jason','Brian','James']
  },
  'female': {
    'rat':['Mary', 'Susan', 'Jenny','Jessica','Britney','Clare'],
    'ox':['Mary', 'Susan', 'Jenny','Jessica','Britney','Clare'],
    'tiger':['Mary', 'Susan', 'Jenny','Jessica','Britney','Clare'],
    'rabbit':['Mary', 'Susan', 'Jenny','Jessica','Britney','Clare'],
    'dragon':['Mary', 'Susan', 'Jenny','Jessica','Britney','Clare'],
    'snake':['Mary', 'Susan', 'Jenny','Jessica','Britney','Clare'],
    'horse':['Mary', 'Susan', 'Jenny','Jessica','Britney','Clare'],
    'sheep':['Mary', 'Susan', 'Jenny','Jessica','Britney','Clare'],
    'monkey':['Mary', 'Susan', 'Jenny','Jessica','Britney','Clare'],
    'rooster':['Mary', 'Susan', 'Jenny','Jessica','Britney','Clare'],
    'dog':['Mary', 'Susan', 'Jenny','Jessica','Britney','Clare'],
    'pig':['Mary', 'Susan', 'Jenny','Jessica','Britney','Clare']
  }
};

// Generate random names
function randomNames(var1, var2){
  var tempArray = [];
  var nO1 = names[var1];
  var nO2 = nO1[var2];
  var z = 6; //increase 6 to the amount of names inside the names object

  // Loop to put the values of names object into temp object
  for (var i = 0; i < nO2.length; i++) {
    tempArray[i] = nO2[i];
  }

  // Loop to randomly pick names and have unique values
  for (var x = 0; x < 3; x++) {
    var y = Math.floor(Math.random()*(z - 0)) + 0;
    finalName[x] = tempArray[y];
    var removed = tempArray.splice(y, 1);
    z--;
  }

  // Hide payment section and show share selection
  $('.payment').hide();
  $('.share').show();

  // Draw names onto canvas over image.
  ctx.fillText(finalName[0], 125, 250);
  ctx.fillText(finalName[1], 125, 275);
  ctx.fillText(finalName[2], 125, 300);

  //payment function
  // if (paid == true){
    // $('.payment').hide();
    // $('.share').show();
  // }
}

// Image Generator
var canvas = document.getElementById('myCanvas');
canvas.width = 300;
canvas.height = 300;
var ctx = canvas.getContext('2d');
var img = document.getElementById('imageNames');
var x = canvas.width/2 - img.width/2;
var y = canvas.height/2 - img.height/2;
ctx.fillStyle = 'rgb(255, 0, 0)';
ctx.font = '25px arial';
ctx.lineWidth = 3;

img.onload = function() {
  ctx.drawImage(img, x, y);
}

// Sex selection

$('#male').on('click', function(){
  $('.sex').hide();
  $('.signs').show();
  sex = 'male';
});

$('#female').on('click', function(){
  $('.sex').hide();
  $('.signs').show();
  sex = 'female';
});

// Sign selection
$('#signs li').on('click',function(){
  clickedSign = $(this).attr('id');
  $('.signs').hide();
  $('.payment').show();
});

//Payment button
$('#pay').on('click',function(){
  randomNames(sex, clickedSign);
});

// Wechat API functions
$(document).ready(function(){
  function randString(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 16; i++ ) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }

    return text;
  }

  function getTimeStamp(){
    return Math.floor(Date.now() / 1000);
  }

  var grantType = "grant_type=client_credential"; // used to get token, do not change.
  var appID = "&appid=wx9c33ee0327446559"; // appID from sandbox or wechat admin
  var secret = "&secret=7d890addf57f30e53a85bab7132b6504"; // secret key from sandbox or wechat admin

  // $.getJSON('https://api.wechat.com/cgi-bin/token?'+grantType+appID+secret, function(data){
  //   console.log(data);
    // var token = "access_token="+data.access_token; // returned access token
    var token = "access_token=mCADCKisBHh0M0YNOCBbf_5oE-y4KZJIWh-utKFreDMZcZQQ5LWQoxspLYBHSFZ8ehcLZbRNG8yhtmZks26gDRAqJTKzm_MAZf7_YcQyXMiJlzud1snhuuFuKHEivF92JPGhAJAYEV";
    var type = "&type=jsapi";

    $.getJSON('https://api.wechat.com/cgi-bin/ticket/getticket?'+token+type, function(data1){
      alert("It Works");
      var ticket = data1.ticket; // returned ticket value
      var noncestr = "noncestr="+randString; // random string generated from function randString, placed into query call
      var jsapiTicket = "jsapi_ticket="+ticket; // returned ticket value placed into query call
      var timeStamp = "timestamp="+getTimeStamp; // time stamp generated from function timeStamp, placed into query call
      var url = "url=http://admin.wechat.com"; // url of calling website "clients website"

      // sha encryption to get signature
      var hash = CryptoJS.SHA1(jsapiTicket+noncestr+timeStamp+url); //encrypt json to wordArray
      var hashSignature = CryptoJS.enc.Hex.stringify(hash); // convert wordArray to hex

      // Inject Correct Authentication Configuration via the config API
      wx.config({
        debug: true, // Enables debugging mode. Return values of all APIs called will be shown on the client. To view the sent parameters, open the log view of developer tools on a computer browser. The parameter information can only be printed when viewed from a computer.
        appId: 'wx9c33ee0327446559', // Required, unique identifier of the official account
        timestamp: timeStamp, // Required, timestamp for the generated signature
        nonceStr: noncestr, // Required, random string for the generated signature
        signature: hashSignature, // Required, signature. See Appendix 1.
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // Required, list of JS APIs to be used. See Appendix 2 for the list of all JS APIs
      });

    });
  // });
});

// Process the Successful Verification via the ready API
wx.ready(function(){
    // The callback function of ready API will be executed after a successful config authentication, and each API calling must be done after the config API obtains a result. As config is an asynchronous operation, all relevant API calling must be put in the callback function if it needs to be called while the page loads. A user-initiated API call can be called directly without needing to be put in the callback function.

    // API for Obtaining Share Status for "Share on Moments" and Customizing Sharing Contents
    wx.onMenuShareTimeline({
        title: '', // Sharing title
        link: '', // Sharing link
        imgUrl: '', // Sharing image URL
        success: function () {
            // Callback function executed after a user confirms sharing
        },
        cancel: function () {
            // Callback function executed after a user cancels sharing
        }
    });

    // API for Obtaining Send Status for "Send to Chat" and Customizing Sharing Contents
    wx.onMenuShareAppMessage({
        title: '', // Sharing title
        desc: '', // Sharing description
        link: '', // Sharing link
        imgUrl: '', // Sharing image URL
        type: '', // Sharing type, such as “music”, “video “ or “link”. It is “link” by default.
        dataUrl: '', // The data URL should be provided for items of type “music” or “video”. It is null by default.
        success: function () {
            // Callback function executed after a user confirms sharing
        },
        cancel: function () {
            // Callback function executed after a user cancels sharing
        }
    });
});

//Process the Failed Verification via the error API
wx.error(function(res){
    // The callback function of error API will be executed if config authentication fails. If authentication failure is due to an expired signature, the detailed error information can be viewed by enabling the debugging mode within config API, or via the returned res parameter. The signature can be updated here for the SPA.
    alert(res.errMsg);
});
