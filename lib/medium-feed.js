class MediumFeed {
  constructor (options) {
    this.baseUrl = 'https://medium.com/feed'
    this.devUrl = 'https://cors-anywhere.herokuapp.com/'
    options = options || {}
    this.development = options.development || false
  }

  getArticles (feedUrl, feedObject, callback) {
    const _parseArticles = function (xml, articles) {
      console.log(xml)
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
    let articles = []
    let async = callback !== false
    let url = null
    if (feedObject.development) {
      let host = window.location.hostname
      if (host === 'localhost' || host === '127.0.0.1' || host === '') {
        url = this.devUrl + feedUrl
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
          _parseArticles(xml, articles)
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

  getUserFeed (userName, callback) {
    if (!userName) {
      console.error('Error: Please pass a username.')
      return
    }
    return this.getArticles(`${this.baseUrl}/@${userName}`, this, callback)
  }

  getTopicFeed (topic, callback) {
    if (!topic) {
      console.error('Error: Please pass a topic.')
      return
    }
    return this.getArticles(`${this.baseUrl}/topic/${topic}`, this, callback)
  }

  getTagFeed (tag, callback) {
    if (!tag) {
      console.error('Error: Please pass a tag.')
      return
    }
    return this.getArticles(`${this.baseUrl}/tag/${tag}`, this, callback)
  }
}

class MediumAuthor {
  constructor (author) {
    author = author || {}
    this.imageUrl = author.imageUrl || null
    this.username = author.username || null
    this.name = author.name || null
  }
}

class MediumArticle {
  constructor (article) {
    article = article || {}
    this.title = article.title || null
    this.link = article.link || null
    this.creator = article.creator || null
    this.pubDate = article.pubDate || null
    this.content = article.content || null
  }
}
