(function () {
  'use strict';

  var $ = function (selector) { return document.querySelector(selector); };
  var frontInput = $('#frontFile');
  var frontPlaceholder = $('#frontPlaceholder');
  var miniInput = $('#miniFile');
  var frontPreview = $('#frontPreview');
  var miniPreview = $('#miniPreview');
  var miniThumb = $('#miniThumb');
  var phraseInput = $('#phraseInput');
  var dividerPhrase = $('#dividerPhrase');
  var toast = $('#toast');
  var frontCard = $('#frontCard');
  var backCard = $('#backCard');
  var frontImage = null;
  var miniImage = null;
  var frontObjectUrl = null;
  var miniObjectUrl = null;
  var miniTool = null;
  var saveState = 'checking';
  var fitMode = 'contain';
  var toastTimer = null;
  var defaultPhrase = "it's for you";
  var SAVE_MIN_VERSION = 9420;
  var backTemplateImage = new Image();
  backTemplateImage.src = './critical/back-template.jpg';

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toast.classList.remove('show'); }, 2700);
  }

  function currentPhrase() {
    return phraseInput.value.trim() || defaultPhrase;
  }

  function fitPhrase() {
    var card = backCard;
    var available = card.clientHeight * 0.36;
    if (!available) return;
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    if (!context) return;
    var size = window.innerWidth <= 480 ? 8 : 11;
    do {
      context.font = 'italic ' + size + 'px Georgia, serif';
      if (context.measureText(currentPhrase()).width <= available) break;
      size -= 0.25;
    } while (size > 3);
    dividerPhrase.style.fontSize = size + 'px';
  }

  function updatePhrase() {
    dividerPhrase.textContent = currentPhrase();
    fitPhrase();
  }

  function setSide(side) {
    var isFront = side === 'front';
    frontCard.hidden = !isFront;
    backCard.hidden = isFront;
    var tabs = document.querySelectorAll('.side-tab');
    for (var i = 0; i < tabs.length; i += 1) {
      var active = tabs[i].getAttribute('data-side') === side;
      tabs[i].classList.toggle('active', active);
      tabs[i].setAttribute('aria-selected', String(active));
    }
    $('#previewTitle').textContent = isFront ? '正面' : '反面';
    $('#previewHint').textContent = isFront
      ? (frontImage ? (frontImage.naturalHeight > frontImage.naturalWidth ? '竖图自动旋转 90°' : '横向明信片') : '点击卡片设置正面图')
      : "默认短句：it's for you";
    fitPhrase();
  }

  function setFrontRotation(image) {
    var shouldRotate = Boolean(image && image.naturalHeight > image.naturalWidth);
    frontCard.classList.toggle('rotate-photo', shouldRotate);
    frontPreview.alt = shouldRotate ? '已旋转为横向的正面照片预览' : '正面照片预览';
    $('#previewHint').textContent = shouldRotate ? '竖图自动旋转 90°' : '横向明信片';
  }

  function setMiniPhoto(src) {
    var visible = Boolean(src);
    $('#miniPhotoWrap').hidden = !visible;
    miniThumb.hidden = !visible;
    $('#removeMini').hidden = !visible;
    $('#miniPlus').hidden = visible;
    $('#miniUploadText').textContent = visible ? '更换这张小图' : '添加一张小图';
    if (visible) {
      miniPreview.src = src;
      miniThumb.src = src;
    } else {
      miniPreview.removeAttribute('src');
      miniThumb.removeAttribute('src');
    }
  }

  function loadImageFile(file, callback) {
    if (!file) return;
    if (!/^image\/(png|jpeg|webp|gif)$/.test(file.type)) {
      showToast('请选择 JPG、PNG、WebP 或 GIF 图片');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      showToast('图片请控制在 15 MB 以内');
      return;
    }
    var url = URL.createObjectURL(file);
    var probe = new Image();
    probe.onload = function () { callback(url, file.name, probe); };
    probe.onerror = function () {
      URL.revokeObjectURL(url);
      showToast('这张图片暂时无法读取，请换一张试试');
    };
    probe.src = url;
  }

  frontPlaceholder.addEventListener('click', function () { frontInput.click(); });

  frontInput.addEventListener('change', function () {
    loadImageFile(frontInput.files[0], function (url, name, image) {
      if (frontObjectUrl) URL.revokeObjectURL(frontObjectUrl);
      frontObjectUrl = url;
      frontImage = image;
      frontPreview.src = url;
      frontPreview.hidden = false;
      frontPlaceholder.hidden = true;
      setFrontRotation(image);
      $('#frontFileName').textContent = name.length > 25 ? name.slice(0, 21) + '…' : name;
      showToast('正面图已更新');
      frontInput.value = '';
    });
  });

  miniInput.addEventListener('change', function () {
    loadImageFile(miniInput.files[0], function (url) {
      if (miniObjectUrl) URL.revokeObjectURL(miniObjectUrl);
      miniObjectUrl = url;
      miniImage = new Image();
      miniImage.onload = function () {
        setMiniPhoto(url);
        showToast('背面小图已更新');
      };
      miniImage.onerror = function () { showToast('小图暂时无法读取，请换一张试试'); };
      miniImage.src = url;
      miniInput.value = '';
    });
  });

  $('#removeMini').addEventListener('click', function () {
    if (miniObjectUrl) URL.revokeObjectURL(miniObjectUrl);
    miniObjectUrl = null;
    miniImage = null;
    setMiniPhoto('');
    showToast('背面小图已移除');
  });

  phraseInput.addEventListener('input', updatePhrase);
  var sideTabs = document.querySelectorAll('.side-tab');
  for (var i = 0; i < sideTabs.length; i += 1) {
    sideTabs[i].addEventListener('click', function (event) {
      setSide(event.currentTarget.getAttribute('data-side'));
    });
  }
  var fitButtons = document.querySelectorAll('.segment');
  for (var j = 0; j < fitButtons.length; j += 1) {
    fitButtons[j].addEventListener('click', function (event) {
      fitMode = event.currentTarget.getAttribute('data-fit');
      frontPreview.style.objectFit = fitMode;
      var buttons = document.querySelectorAll('.segment');
      for (var k = 0; k < buttons.length; k += 1) {
        var active = buttons[k].getAttribute('data-fit') === fitMode;
        buttons[k].classList.toggle('active', active);
        buttons[k].setAttribute('aria-pressed', String(active));
      }
    });
  }

  function readBuildVersion(launchOptions) {
    var env = launchOptions && launchOptions.miniToolEnv;
    var value = env && env.buildVersion;
    if (typeof value !== 'number' && typeof value !== 'string') return null;
    if (!/^[1-9]\d{6,}$/.test(String(value))) return null;
    var version = Number(value);
    return Number.isSafeInteger(version) ? version : null;
  }

  function clientVersion(buildVersion) {
    return Number.isSafeInteger(buildVersion) && buildVersion > 0 ? Math.floor(buildVersion / 1000) : null;
  }

  function prepareSaveSupport() {
    var xhs = window.xhs;
    miniTool = xhs && xhs.miniTool;
    if (!miniTool) { saveState = 'outside'; return; }
    if (typeof miniTool.saveImageToPhotosAlbum !== 'function') { saveState = 'missing-api'; return; }
    var build = readBuildVersion(xhs.launchOptions);
    if (build !== null) {
      saveState = clientVersion(build) >= SAVE_MIN_VERSION ? 'ready' : 'old-client';
      return;
    }
    if (typeof miniTool.getLaunchOptions !== 'function') { saveState = 'unknown-version'; return; }
    miniTool.getLaunchOptions().then(function (launchOptions) {
      var asyncBuild = readBuildVersion(launchOptions);
      if (asyncBuild === null) { saveState = 'unknown-version'; return; }
      saveState = clientVersion(asyncBuild) >= SAVE_MIN_VERSION ? 'ready' : 'old-client';
    }).catch(function () { saveState = 'unknown-version'; });
  }

  function saveUnavailableMessage() {
    if (saveState === 'checking') return '正在检查小红书客户端版本，请稍后再试';
    if (saveState === 'outside') return '请在小红书小工具容器里打开，才能保存到相册';
    if (saveState === 'old-client') return '保存相册需要小红书客户端 9.42.0 或更新版本';
    if (saveState === 'unknown-version') return '暂时无法确认客户端版本，请稍后再试';
    if (saveState === 'missing-api') return '当前小红书容器暂不支持保存到相册';
    return '';
  }

  function drawImageFit(context, image, x, y, width, height, mode) {
    if (!image || !image.naturalWidth || !image.naturalHeight) return;
    var portrait = image.naturalHeight > image.naturalWidth;
    var sourceWidth = portrait ? image.naturalHeight : image.naturalWidth;
    var sourceHeight = portrait ? image.naturalWidth : image.naturalHeight;
    var scale = mode === 'contain'
      ? Math.min(width / sourceWidth, height / sourceHeight)
      : Math.max(width / sourceWidth, height / sourceHeight);
    var drawWidth = image.naturalWidth * scale;
    var drawHeight = image.naturalHeight * scale;
    context.save();
    context.translate(x + width / 2, y + height / 2);
    if (portrait) context.rotate(Math.PI / 2);
    context.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    context.restore();
  }

  function drawZipRow(context, x, y, width, height) {
    var count = 6;
    var gap = width * 0.03;
    var cellWidth = (width - gap * (count - 1)) / count;
    context.strokeStyle = '#bb7167';
    context.lineWidth = 3;
    for (var i = 0; i < count; i += 1) context.strokeRect(x + i * (cellWidth + gap), y, cellWidth, height);
  }

  function drawMiniPhoto(context, image, x, y, width, height) {
    if (!image || !image.naturalWidth) return;
    context.save();
    context.fillStyle = '#fff';
    context.fillRect(x - 5, y - 5, width + 10, height + 10);
    context.beginPath();
    context.rect(x, y, width, height);
    context.clip();
    var scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    var drawWidth = image.naturalWidth * scale;
    var drawHeight = image.naturalHeight * scale;
    context.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
    context.restore();
  }

  function renderFront() {
    if (!frontImage || !frontImage.naturalWidth) throw new Error('front image is not ready');
    var canvas = document.createElement('canvas');
    canvas.width = 1800;
    canvas.height = 1200;
    var context = canvas.getContext('2d');
    if (!context) throw new Error('canvas is not available');
    context.fillStyle = '#fff6e6';
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawImageFit(context, frontImage, 0, 0, canvas.width, canvas.height, fitMode);
    return canvas;
  }

  function renderBack() {
    if (!backTemplateImage.complete || !backTemplateImage.naturalWidth) throw new Error('back template is not ready');
    var canvas = document.createElement('canvas');
    canvas.width = 1800;
    canvas.height = 1200;
    var context = canvas.getContext('2d');
    if (!context) throw new Error('canvas is not available');
    var width = canvas.width;
    var height = canvas.height;
    context.drawImage(backTemplateImage, 0, 0, width, height);

    // Clear the printed sample phrase and make room for the editable vertical phrase.
    context.fillStyle = '#fff';
    context.fillRect(width * 0.415, height * 0.42, width * 0.04, height * 0.39);
    context.save();
    context.translate(width * 0.435, height * 0.60);
    context.rotate(-Math.PI / 2);
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = '#969992';
    var text = currentPhrase();
    var fontSize = 26;
    var maxTextLength = height * 0.36;
    context.font = 'italic ' + fontSize + 'px Georgia, serif';
    while (context.measureText(text).width > maxTextLength && fontSize > 6) {
      fontSize -= 1;
      context.font = 'italic ' + fontSize + 'px Georgia, serif';
    }
    context.fillText(text, 0, 0);
    context.restore();

    drawZipRow(context, width * 0.664, height * 0.855, width * 0.27, height * 0.058);
    if (miniImage && miniImage.naturalWidth) {
      drawMiniPhoto(context, miniImage, width * 0.065, height * 0.836, width * 0.20, height * 0.075);
    }
    return canvas;
  }

  function saveCanvas(canvas, side) {
    var data = canvas.toDataURL('image/jpeg', 0.94);
    var useTempFile = data.length > 120 * 1024 && typeof miniTool.writeTempFile === 'function';
    var filePathPromise = useTempFile
      ? miniTool.writeTempFile({ data: data }).then(function (result) {
          if (!result || typeof result.filePath !== 'string') throw new Error('temporary file unavailable');
          return result.filePath;
        })
      : Promise.resolve(data);
    return filePathPromise.then(function (filePath) {
      return miniTool.saveImageToPhotosAlbum({ filePath: filePath });
    }).then(function () {
      showToast(side === 'front' ? '正面 JPG 已保存' : '反面 JPG 已保存');
    }).catch(function (error) {
      console.warn('Album save did not complete', error && error.errMsg ? error.errMsg : '');
      showToast('没有保存成功，请检查相册权限后再试');
    });
  }

  function startSave(side) {
    if (saveState !== 'ready') { showToast(saveUnavailableMessage()); return; }
    if (side === 'front' && !frontImage) { showToast('请先设置明信片正面图'); return; }
    try {
      showToast('正在准备 JPG…');
      var canvas = side === 'front' ? renderFront() : renderBack();
      saveCanvas(canvas, side);
    } catch (error) {
      console.warn('Unable to render postcard image');
      showToast('图片还在准备中，请稍后重试');
    }
  }

  $('#saveFront').addEventListener('click', function () { startSave('front'); });
  $('#saveBack').addEventListener('click', function () { startSave('back'); });

  frontPreview.addEventListener('load', function () {
    if (!frontImage) {
      frontImage = frontPreview;
      setFrontRotation(frontImage);
    }
  });
  window.addEventListener('resize', fitPhrase);
  window.addEventListener('beforeunload', function () {
    if (frontObjectUrl) URL.revokeObjectURL(frontObjectUrl);
    if (miniObjectUrl) URL.revokeObjectURL(miniObjectUrl);
  });

  if (frontPreview.complete && frontPreview.naturalWidth) {
    frontImage = frontPreview;
    setFrontRotation(frontImage);
  }
  setSide('front');
  updatePhrase();
  prepareSaveSupport();
}());
