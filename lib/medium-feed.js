var MediumFeed = function(options) {
  options = options || {};
  this.username = options.username || null;
  this.development = options.development || false;
  this.articles = [];
  this.author = null;
};

var MediumAuthor = function(author) {
    author = author || {};
    this.imageUrl = author.imageUrl || null;
    this.userName = author.userName || null;
    this.name = author.name || null;
}

var MediumArticle = function(article) {
    article = article || {};
    this.title = article.title || null;
    this.link = article.link || null;
    this.creator = article.creator || null;
    this.pubDate = article.pubDate || null;
    this.content = article.content || null;
}

MediumFeed.prototype = {
  getFeed: function(username) {
    if (!username && !this.username) {
      console.error("Error: Please check that the username is correct.");
      return;
    }
    if (!username) {
      username = this.username;
    }
    var xhr = new XMLHttpRequest();
    var req = "GET";
    var url = "https://medium.com/feed/@" + username;
    if(this.development) {
        var host = location.hostname;
        if (host === "localhost" || host === "127.0.0.1" || host === "") {
            url = "https://cors-anywhere.herokuapp.com/" + url;
        }
    }
    if("withCredentials" in xhr) {
        xhr.open(req, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        xhr = new XDomainRequest();
        xhr.open(req, url);
    } else {
        console.error("Error: CORS not supported.")
    }
    var t = this;
    xhr.onload = function() {
        if(xhr.readyState == 4) {
            if(xhr.status == 200){
                var xml = xhr.responseXML;
                t.author = new MediumAuthor({
                    imageUrl: xml.getElementsByTagName("url")[0].childNodes[0].nodeValue
                });
            }
        }
    };
    xhr.onerror = function() {
        console.error("Error: Request failed.");
    }
    xhr.send();
  },
  getAuthor: function() {
      return this.author;
  }
};
