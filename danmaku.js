class DanmakuInject {
  constructor (opt = {}) {
    this.videoInfosArr = [];
    this.currentVideoInfo = null;
    this.whenIn = false;
    this.whenOut = true;
    this.startSelectVideoAreaEventRef = null;
    this.confirmSelectBlockID = 'confirm-inject-danmaku-ext';
    this.confirmSelectBlock = this.genConfirmSelectBlock();
    this.cb = opt.cb || function() {};
    this.confirmBlockHtml = opt.confirmBlockHtml || '<p>点击注入弹幕扩展</p>';
    this.confirmBlockHideStyleClassName = opt.confirmBlockHideStyleClassName || 'hide';
    this.selectedStyleClassName = opt.selectedStyleClassName || 'selected';
    this.danmakuBlock = opt.danmakuBlock ;
  }

  insertDanmakuBlobk() {
    const danmakuContainer = document.createElement('div');
    danmakuContainer.setAttribute('id', 'danmaku-ext');
    danmakuContainer.innerHTML = this.danmakuBlock;
    this.currentVideoInfo.element.parentElement.appendChild(danmakuContainer);
  }

  insertFullscreenBtn() {
    const buttonEle = document.createElement('button');
    buttonEle.innerText = "Fullscreen";
    buttonEle.classList.add('fullscreen-button');
    buttonEle.addEventListener("click", () => {
      const fullScreenElement = this.currentVideoInfo.element.parentElement;
      if (document.fullScreenElement) {
        // exitFullscreen 方法只能在 Document 对象上使用。
        document.exitFullscreen();
      } else {
        fullScreenElement.requestFullscreen();
      }
    });

    this.currentVideoInfo.element.parentElement.appendChild(buttonEle);
  }

  genConfirmSelectBlock() {
    const self = this;
    const confirmHtmlContainer = document.createElement('div');
    confirmHtmlContainer.setAttribute('id', this.confirmSelectBlockID);
    confirmHtmlContainer.innerHTML = this.confirmBlockHtml;
    confirmHtmlContainer.addEventListener('click', function() {
      const parentElement = self.currentVideoInfo.element.parentElement;
      self.insertFullscreenBtn();
      confirmHtmlContainer.remove();
      self.removeSelectVideoAreaEvent();
      self.currentVideoInfo.element.classList.remove('selected');
      self.insertDanmakuBlobk();
      self.cb(parentElement);
    });

    return confirmHtmlContainer;
  }

  findVideoEles() {
    this.videoInfosArr.length = 0;
    const videoEles =document.getElementsByTagName('VIDEO');
    for (let i = 0; i < videoEles.length; i++) {
      const element = videoEles[i];
      const rect = element.getBoundingClientRect();
      this.videoInfosArr.push({
        element,
        parentElement: element.parentElement,
        startX: rect.x,
        startY: rect.y,
        endX: rect.right,
        endY: rect.bottom,
      });
    }
  }

  onceIntoVideoElementArea(element) {
    // console.info('onceIntoVideoElementArea invoke', element, Math.random())
    element.classList.add(this.selectedStyleClassName);

    const videoParentEle = element.parentElement;
    const confirmHtmlContainer = document.getElementById(this.confirmSelectBlockID);

    if (!confirmHtmlContainer) {
      videoParentEle.appendChild(this.confirmSelectBlock);
    } else {
      confirmHtmlContainer.classList.remove(this.confirmBlockHideStyleClassName);
    }
  }

  startSelectVideoArea() {
    const self = this;
    this.findVideoEles();
    this.startSelectVideoAreaEventRef = function(event) {
      self.selectingVideoArea(event);
    };

    document.addEventListener('mousemove', this.startSelectVideoAreaEventRef);
  }

  removeSelectVideoAreaEvent() {
    document.removeEventListener('mousemove', this.startSelectVideoAreaEventRef);
  }

  selectingVideoArea(event) {
    if (this.videoInfosArr.length === 0) {
      // console.info('videoInfosArr is empty!', this.videoInfosArr);
      return false;
    }

    if (!this.currentVideoInfo) {
      for (let i = 0; i < this.videoInfosArr.length; i++) {
        const current = this.videoInfosArr[i];

        if (
          current.startX < event.clientX &&
          current.endX > event.clientX &&
          current.startY < event.clientY &&
          current.endY > event.clientY
        ) {
          this.currentVideoInfo = current;
          break;
        }
      }
    }

    if (!this.currentVideoInfo) {
      return false;
    }

    if (
      this.currentVideoInfo.startX < event.clientX &&
      this.currentVideoInfo.endX > event.clientX &&
      this.currentVideoInfo.startY < event.clientY &&
      this.currentVideoInfo.endY > event.clientY
    ) {
      if (!this.whenIn) {
        this.onceIntoVideoElementArea(this.currentVideoInfo.element);
      }
      this.whenIn = true;
      this.whenOut = false;
    } else {
      if (!this.whenOut) {
        this.currentVideoInfo.element.classList.remove(this.selectedStyleClassName);
        const confirmHtmlContainer = document.getElementById(this.confirmSelectBlockID);
        confirmHtmlContainer.classList.add(this.confirmBlockHideStyleClassName);
      }

      this.whenIn = false;
      this.whenOut = true;
      this.currentVideoInfo = null;
    }
  }
}

function initDanmakuArea(cb) {
  let danmakuInjectIns = new DanmakuInject({
    cb: (rootEle) => {
      cb(rootEle);
      danmakuInjectIns = null;
    },
    danmakuBlock: `<div id="danmaku"><p>Danmaku text goes here</p></div>`
  });
  danmakuInjectIns.startSelectVideoArea();
}
