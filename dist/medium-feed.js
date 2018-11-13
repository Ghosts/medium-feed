var MediumFeed = function() {
    this.articles = [];
}

MediumFeed.prototype = {
    getFeed: function(username) {
        var x = new XMLHttpRequest();
        x.open("GET", "https://medium.com/feed/@" + username, true);
        x.onreadystatechange = function () {
        if (x.readyState == 4 && x.status == 200)
        {
            var articles = x.responseXML;
        }
        };
        x.send(null);
    },
    clearArticles: function() {

    },
    renderFeed: function(type, id) {

    }
}