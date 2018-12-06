let MediumFeed = function (options) {
  options = options || {}
  this.development = options.development || false
}

let MediumAuthor = function (author) {
  author = author || {}
  this.imageUrl = author.imageUrl || null
  this.username = author.username || null
  this.name = author.name || null
}

let MediumArticle = function (article) {
  article = article || {}
  this.title = article.title || null
  this.link = article.link || null
  this.creator = article.creator || null
  this.pubDate = article.pubDate || null
  this.content = article.content || null
}

MediumFeed.prototype = (function () {
  let baseUrl = 'https://medium.com/feed'
  let devUrl = 'https://cors-anywhere.herokuapp.com/'
  function getArticles (feedUrl, feedObject, callback) {
    let articles = []
    let async = callback !== false
    let url = null
    if (feedObject.development) {
      let host = window.location.hostname
      if (host === 'localhost' || host === '127.0.0.1' || host === '') {
        url = devUrl + feedUrl
      }
    }
    let xhr = new XMLHttpRequest()
    let req = 'GET'
    if ('withCredentials' in xhr) {
      xhr.open(req, url, async)
    } else if (typeof XDomainRequest !== 'undefined') {
      xhr = new XDomainRequest()
      xhr.open(req, url)
    } else {
      console.error('Error: CORS not supported.')
    }
    xhr.onload = function () {
      if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 200) {
          let xml = xhr.responseXML
          parseArticles(xml, articles)
          if (callback) {
            callback(articles)
          }
        }
      }
    }
    xhr.onerror = function () {
      console.error('Error: Request failed.')
    }
    xhr.send()
    return articles
  }

  function parseArticles (xml, articles) {
    let items = xml.getElementsByTagName('item')
    for (let i = 0; i < items.length; i++) {
      let article = {}
      article.title = items[i].getElementsByTagName(
        'title'
      )[0].childNodes[0].nodeValue
      article.link = items[i].getElementsByTagName(
        'link'
      )[0].childNodes[0].nodeValue
      article.creator = items[i].getElementsByTagName(
        'dc:creator'
      )[0].childNodes[0].nodeValue
      article.pubDate = items[i].getElementsByTagName(
        'pubDate'
      )[0].childNodes[0].nodeValue
      articles.push(article)
    }
  }

  return {
    getUserFeed: function (userName, callback) {
      if (!userName) {
        console.error('Error: Please pass a username.')
        return
      }
      return getArticles(`${baseUrl}/@${userName}`, this, callback)
    },
    getTopicFeed: function (topic, callback) {
      if (!topic) {
        console.error('Error: Please pass a topic.')
        return
      }
      return getArticles(`${baseUrl}/topic/${topic}`, this, callback)
    },
    getTagFeed: function (tag, callback) {
      if (!tag) {
        console.error('Error: Please pass a tag.')
        return
      }
      return getArticles(`${baseUrl}/tag/${tag}`, this, callback)
    }
  }
})()
