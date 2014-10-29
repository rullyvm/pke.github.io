function SubscribeEmail(email) {
    var data = { 
        'email':email,
	'dont_redirect':'true'
    }   
    $.ajax('//pledge.mayday.us/r/subscribe', {data:data, type:'POST'}).done(function() {
        $('#result').html("<p> it worked! you're subscribed!");
    }).fail(function() {
        $('#result').html("<p> Oh no, there was a problem subscribing your email!");
    }) 
}

function getUrlParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}

function SendEmail() {
    var email = getUrlParameter('email');
    SubscribeEmail(email);     
}
