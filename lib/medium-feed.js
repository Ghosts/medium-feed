class MediumFeed {
  constructor (options) {
    this._baseUrl = 'https://medium.com/feed'
    this._devUrl = 'https://cors-anywhere.herokuapp.com/'
    options = options || {}
    this.useProxy = options.useProxy || false
  }

  getArticles (feedUrl, callback, type) {
    const _parseArticles = function (xml, articles, type) {
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

        article.pubDate = new Date(
          items[i].getElementsByTagName('pubDate')[0].childNodes[0].nodeValue
        )

        let contentTag = ''
        switch (type) {
          case 'user':
            contentTag = 'content:encoded'
            break
          case 'topic':
            contentTag = 'description'
            break
          case 'tag':
            contentTag = 'description'
            break
        }
        article.content = items[i].getElementsByTagName(
          contentTag
        )[0].childNodes[0].nodeValue

        article.categories = (function () {
          var categories = []
          Array.prototype.slice
            .call(items[i].getElementsByTagName('category'))
            .forEach(cat => {
              categories.push(cat.textContent)
            })
          return categories
        })()
        articles.push(new MediumArticle(article))
      }
    }
    let articles = []
    let async = callback !== undefined
    let url = this.feedUrl
    if (this.useProxy) {
      url = this._devUrl + feedUrl
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
          _parseArticles(xml, articles, type)
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
      console.error('Error: Please pass a username.', 'user')
      return
    }
    return this.getArticles(`${this._baseUrl}/@${userName}`, callback, 'user')
  }

  getTopicFeed (topic, callback) {
    if (!topic) {
      console.error('Error: Please pass a topic.')
      return
    }
    return this.getArticles(
      `${this._baseUrl}/topic/${topic}`,
      callback,
      'topic'
    )
  }

  getTagFeed (tag, callback) {
    if (!tag) {
      console.error('Error: Please pass a tag.')
      return
    }
    return this.getArticles(`${this._baseUrl}/tag/${tag}`, callback, 'tag')
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
    this.categories = article.categories || []
  }
}
