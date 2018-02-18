document.getElementById('btn-restart').addEventListener('click', () => {
  window.location.reload()
})

class FlyChar {
  constructor(ch, game) {
    this.screenWidth = document.body.offsetWidth
    this.screenHeight = document.body.offsetHeight
    this.ch = ch
    this.width = 150
    this.height = 50
    this.rate = 10
    this.game = game
    this.timer = null

    this.x = parseInt(Math.random() * (this.screenWidth - this.width))
    this.y = 0
    this.start = 0
    this.step = parseInt(this.screenHeight / this.rate)

    this.image = new Image()
    this.image.setAttribute('src', `images/${this.ch}.jpeg`)
    this.image.setAttribute('alt', this.ch)
    this.image.className = 'flychar'
    document.body.appendChild(this.image)
    this.updatePostion()
  }
  setChar(ch) {
    this.ch = ch
  }

  destory() {
    document.body.removeChild(this.image)
    this.start = this.rate
    this.game = null
    this.timer && clearTimeout(this.timer)
  }

  updatePostion() {
    this.image.style.top = this.y + this.step * this.start + 'px'
    this.image.style.left = this.x + 'px'

    if (++this.start <= this.rate) {
      this.timer = setTimeout(this.updatePostion.bind(this), 1000)
    } else {
      this.game.failChar(this.ch)
    }
  }
}

class Game {
  constructor(opts) {
    this.flyChars = [] // flychars
    this.period = opts.period || 5000 // 5s show a char
    this.total = opts.count || 20 // show [total] chars each game
    this.charsets =
      opts.charsets ||
      new Array(26)
        .fill(0)
        .map((_, i) => String.fromCharCode('A'.charCodeAt(0) + i))

    this.count = 0
    this.goodRobot = new Robot(
      this.total,
      'images/life_good.png',
      'images/life_good_fail.png'
    )
    this.badRobot = new Robot(
      this.total,
      'images/life_bad.png',
      'images/life_bad_fail.png'
    )

    document.getElementById('goodRobot').appendChild(this.goodRobot.body)
    document.getElementById('badRobot').appendChild(this.badRobot.body)

    this.badlife = 100
    this.timer = null
    this.start()
  }

  start() {
    this.putChar()

    document.body.addEventListener('keydown', e => {
      if (e.keyCode >= 65 && e.keyCode <= 90) {
        this.typeChar(String.fromCharCode(e.keyCode))
      }
    })
  }

  putChar() {
    if (++this.count < this.total) {
      const ch = this.charsets[Math.floor(Math.random() * this.charsets.length)]
      this.flyChars.push(new FlyChar(ch, this))
      console.log(`add ${this.count}, ${ch}`)
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(this.putChar.bind(this), this.period)
    }
  }
  failChar(ch) {
    for (let i in this.flyChars) {
      if (this.flyChars[i] && this.flyChars[i].ch === ch) {
        delete this.flyChars[i]
      }
    }
    this.goodRobot.hit(1)
    this.detectGameStatus()
  }
  typeChar(ch) {
    let ok = false
    for (let i in this.flyChars) {
      if (this.flyChars[i] && this.flyChars[i].ch === ch) {
        this.flyChars[i].destory()
        delete this.flyChars[i]
        ok = true
        this.badRobot.hit(1)
        break
      }
    }

    // all clear
    if (this.flyChars.every(flyChar => !flyChar)) {
      this.putChar()
    }

    if (!ok) {
      this.goodRobot.hit(1)
    }
    this.detectGameStatus()
  }
  detectGameStatus() {
    if (this.goodRobot.life <= 0) {
      this.stop()
    } else if (this.count < this.total) {
      return
    }
    const end =
      this.goodRobot.life <= 0 ||
      this.flyChars.every(flyChar => {
        return !flyChar
      })
    if (end) {
      const result = document.getElementById('result')
      result.style.display = 'block'
      const img = result.querySelector('img')
      if (this.goodRobot.life > this.badRobot.life) {
        img.setAttribute('src', 'images/success.png')
        document
          .getElementById('badImg')
          .setAttribute('src', 'images/bad_fail.png')
      } else {
        img.setAttribute('src', 'images/fail.png')
        document
          .getElementById('goodImg')
          .setAttribute('src', 'images/good_fail.png')
      }
    }
  }
  stop() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.flyChars.forEach(flyChar => {
      flyChar && flyChar.destory()
    })
  }
}
class Robot {
  constructor(life, image_ok, image_fail) {
    this.totalLife = life
    this.life = life
    this.body = document.createElement('div')
    this.body.className = 'robot'
    this.lifeFailImage = new Image()
    this.lifeFailImage.setAttribute('src', image_fail)
    this.body.appendChild(this.lifeFailImage)
    this.lifeImageMasker = document.createElement('div')
    this.lifeImageMasker.className = 'masker'
    this.lifeImage = new Image()
    this.lifeImage.setAttribute('src', image_ok)
    this.lifeImageMasker.appendChild(this.lifeImage)
    this.body.appendChild(this.lifeImageMasker)
  }
  hit(point) {
    this.life -= point
    this.life = Math.max(0, this.life)
    const delta = parseInt(
      this.body.offsetHeight * (1 - this.life / this.totalLife)
    )
    console.log(delta)
    this.lifeImageMasker.style.top = delta + 'px'
    this.lifeImage.style.top = 0 - delta + 'px'
  }
}
new Game({
  period: 3000,
  charsets: 'ASDFGHJKL'.split('')
})
