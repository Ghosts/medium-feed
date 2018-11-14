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
    function getArticles(feedUrl, callback) {
        var articles = [];
        var async = callback !== false;
        if (this.development) {
            var host = location.hostname;
            if (host === "localhost" || host === "127.0.0.1" || host === "") {
            url = devUrl + feedUrl;
            }
        }
        var xhr = new XMLHttpRequest();
        var req = "GET";
        if ("withCredentials" in xhr) {
            xhr.open(req, url, async);
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
                    parseArticles(xml, articles);
                    callback(articles);
                }
            }
        };
        xhr.onerror = function() {
            console.error("Error: Request failed.");
        };
        xhr.send();
        return articles;
    }

    function parseArticles(xml, articles){

    }

    return {
        getUserFeed: function(userName, callback) {
            if (!username) {
                console.error("Error: Please pass a username.");
                return;
            }
            return getArticles(`${baseUrl}/@${userName}`, callback);
        },
        getTopicFeed: function(topic, callback) {
            if (!topic) {
                console.error("Error: Please pass a topic.");
                return;
            }
            return getArticles(`${baseUrl}/topic/${topic}`, callback);
        },
        getTagFeed: function(tag, callback) {
            if (!tag) {
                console.error("Error: Please pass a tag.");
                return;
            }
            return getArticles(`${baseUrl}/tag/${tag}`, callback);
        }
    };
})();
