var MediumFeed = function(options) {
  options = options || {};
  this.development = options.development || false;
};

var MediumAuthor = function(author) {
  author = author || {};
  this.imageUrl = author.imageUrl || null;
  this.username = author.username || null;
  this.name = author.name || null;
};

var MediumArticle = function(article) {
  article = article || {};
  this.title = article.title || null;
  this.link = article.link || null;
  this.creator = article.creator || null;
  this.pubDate = article.pubDate || null;
  this.content = article.content || null;
};

MediumFeed.prototype = (function() {
    var baseUrl = "https://medoum.com/feed/";
    var devUrl = "https://cors-anywhere.herokuapp.com/";
    function getArticles(feedUrl) {
        if (this.development) {
            var host = location.hostname;
            if (host === "localhost" || host === "127.0.0.1" || host === "") {
            url = devUrl + feedUrl;
            }
        }
        var xhr = new XMLHttpRequest();
        var req = "GET";
        if ("withCredentials" in xhr) {
            xhr.open(req, url, true);
        } else if (typeof XDomainRequest != "undefined") {
            xhr = new XDomainRequest();
            xhr.open(req, url);
        } else {
            console.error("Error: CORS not supported.");
        }
        var t = this;
        xhr.onload = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    var xml = xhr.responseXML;
                    
                }
            }
        };
        xhr.onerror = function() {
            console.error("Error: Request failed.");
        };
        xhr.send();
    }

    return {
        getUserFeed: function(userName) {
            if (!username) {
                console.error("Error: Please pass a username.");
                return;
            }
            return getArticles(`${baseUrl}/@${userName}`);
        },
        getTopicFeed: function(topic) {
            if (!topic) {
                console.error("Error: Please pass a topic.");
                return;
            }
            return getArticles(`${baseUrl}/topic/${topic}`);
        },
        getTagFeed: function(tag) {
            if (!tag) {
                console.error("Error: Please pass a tag.");
                return;
            }
            return getArticles(`${baseUrl}/tag/${tag}`);
        }
    };
})();
