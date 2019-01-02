(function(){

    function insertLink(href){
        var ele = document.createElement('link');
            ele.rel="stylesheet";
            document.head.insertBefore(ele, document.querySelector('link'));
            ele.href = href;
    }
    
    var aside = document.querySelector('aside');
    var asideInner = document.querySelector('.side');

    var raw = asideInner.style.width;
    var rawVal = raw ? parseInt(raw, 10) : false;

    if(rawVal) {
        //aside.style.width = rawVal == 150 ? '56px' : '150px';
        //asideInner.style.width = rawVal == 150 ? '56px' : '150px';

insertLink('//i.gtimg.cn/qzone/biz/gdt/lib/spaui-components/spaui/2.0.0-beta.35/spaui.css?max_age=31536000');
insertLink('//i.gtimg.cn/qzone/biz/gdt/lib/spaui-business/spaui-topnav/0.1.11/index.css?max_age=31536000');


    aside.outerHTML = `
<style>
.wrapper {
    height:auto;
}
.side.clearfix {
    display:none;
}
.icon-home {
    background: url(https://qzonestyle.gtimg.cn/gdt_ui_proj/dist/ads/images/icon-menu-home.svg) 50% 50% no-repeat;
    background-size: 22px auto
}

.icon-report {
    background: url(https://qzonestyle.gtimg.cn/gdt_ui_proj/dist/ads/images/icon-menu-report.svg) 50% 50% no-repeat;
    background-size: 18px auto
}

.icon-campaign {
    background: url(https://qzonestyle.gtimg.cn/gdt_ui_proj/dist/ads/images/icon-menu-campaign.svg) 50% 50% no-repeat;
    background-size: 18px auto
}

.icon-finance {
    background: url(https://qzonestyle.gtimg.cn/gdt_ui_proj/dist/ads/images/icon-menu-finance.svg) 50% 50% no-repeat;
    background-size: 20px auto
}

.icon-toolbox {
    background: url(https://qzonestyle.gtimg.cn/gdt_ui_proj/dist/ads/images/icon-menu-toolbox.svg) 50% 50% no-repeat;
    background-size: 18px auto
}


.spaui-icon-divider {
    display: block;
    margin: 0 20px;
    width: 1px;
    height: 21px;
    background: #fff;
    opacity: .3
}

.icon-help {
    width: 16px;
    height: 16px!important;
    background: url(https://qzonestyle.gtimg.cn/gdt_ui_proj/dist/ads/images/spaui-icon-help.svg) 50% 50% no-repeat;
    background-size: 14px auto
}

.spaui-icon-badge {
    display: inline-block;
    width: auto;
    padding: 0 4px;
    height: 16px;
    line-height: 15px;
    border: 1px solid #ed3b3b;
    border-radius: 2px;
    font-size: 12px;
    font-weight: 300;
    color: #ed3b3b
}

.icon-new-cake {
    margin-right: 5px;
    width: 16px;
    height: 16px;
    background: url(https://qzonestyle.gtimg.cn/gdt_ui_proj/dist/ads/images/icon-new-cake.svg) 50% 50% no-repeat;
    background-size: 16px auto;
    vertical-align: -3px
}

.icon-timer {
    height: 16px;
    background: url(https://qzonestyle.gtimg.cn/gdt_ui_proj/dist/ads/images/icon-timer.svg) 50% 50% no-repeat;
    background-size: 13px auto;
    vertical-align: -3px
}

.icon-lamp {
    width: 16px;
    height: 16px;
    background: url(https://qzonestyle.gtimg.cn/gdt_ui_proj/dist/ads/images/icon-lamp.svg) 50% 50% no-repeat;
    background-size: 100% auto
}

.spaui-icon-goto {
    width: 16px;
    height: 16px;
    background: url(https://qzonestyle.gtimg.cn/gdt_ui_proj/dist/ads/images/spaui-icon-goto.svg) 50% 50% no-repeat;
    background-size: 11px auto
}

.spaui-topnav {
    min-width: 640px;
    border-width: 0 0 1px;
    margin-bottom: -1px
}

.spaui-topnav .spaui-topnav-drop:hover .icon-darr::after {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg)
}

.spaui-topnav .icon-darr::after {
    content: " ";
    display: inline-block;
    vertical-align: middle;
    width: 0;
    height: 0;
    margin-left: 5px;
    border-style: solid;
    border-width: 5px 5px 0;
    border-color: currentColor transparent transparent;
    -webkit-transition: .3s ease;
    transition: .3s ease
}

.spaui-topnav-header {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    height: 50px
}

.spaui-topnav-divider {
    display: none
}

.spaui-topnav-title {
    font-weight: 600
}

.spaui-topnav-drop a {
    color: rgba(0,0,0,.8)
}

.spaui-topnav-drop .spaui-topnav-menu {
    display: block;
    visibility: hidden;
    opacity: 0;
    -webkit-transform: translate3d(0,5px,0);
    transform: translate3d(0,5px,0);
    -webkit-transition: .3s ease;
    transition: .3s ease
}

.spaui-topnav-drop:hover .spaui-topnav-menu {
    visibility: visible;
    opacity: 1;
    -webkit-transform: translate3d(0,0,0);
    transform: translate3d(0,0,0)
}

.spaui-topnav-left .spaui-topnav-drop {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    height: 100%
}

.spaui-topnav-right .nav-item+.nav-item::after {
    content: '';
    position: absolute;
    left: -1px;
    top: 12px;
    display: block;
    height: 25px;
    width: 1px;
    background: rgba(255,255,255,.06)
}

.spaui-topnav-dark {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    color: inherit;
    border: none;
    margin-bottom: 0
background: #3b4457;
}

.spaui-topnav-dark .spaui-topnav-header {
    width: auto
}

.spaui-topnav-dark .spaui-topnav-collapse {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between
}

.spaui-topnav-dark .spaui-topnav,.spaui-topnav-dark .spaui-topnav-nav,.spaui-topnav-dark .spaui-topnav-toggler {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex
}

.spaui-topnav-dark .spaui-topnav-drop .nav-link {
    color: #fff
}

.spaui-topnav-dark .spaui-topnav-drop:hover {
    background: rgba(0,0,0,.1)
}

.spaui-topnav-dark .spaui-topnav-toggler {
    position: absolute;
    float: none;
    right: 0;
    color: #fff;
    display: none
}

.spaui-topnav-dark .nav-item {
    border-top: none
}

.spaui-topnav-menu {
    border-radius: 2px;
    border-color: #dcdee3;
    -webkit-box-shadow: 0 4px 10px rgba(84,85,88,.1);
    box-shadow: 0 4px 10px rgba(84,85,88,.1)
}

.spaui-icon-divier {
    width: 1px;
    background: rgba(0,0,0,.06)
}

.nav-link.slider,.nav-link.with-indicator {
    position: relative
}

.nav-link.slider::after,.nav-link.with-indicator::after {
    content: '';
    position: absolute;
    right: 11px;
    top: 11px;
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #f9ba00
}

.jumplist-card {
    width: 220px
}

.jumplist-card .spaui-topnav-menu-item {
    padding: 0
}

.jumplist-card .spaui-topnav-menu-item a {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    padding: 15px;
    font-size: 16px
}

.jumplist-card .jumplist-logo {
    display: block;
    width: 28px;
    height: 28px;
    margin-right: 10px;
    font-size: 16px;
    font-weight: 300;
    line-height: 28px;
    text-align: center;
    border-radius: 50%;
    color: #fff;
    background: #2096f5
}

.jumplist-card .icon-dmp-logo {
    background: #0bb7e4
}

.jumplist-card .icon-cpd-logo,.jumplist-card .icon-cpt-logo {
    background: #1b9cf5
}

.jumplist-card .icon-kuaibao-logo {
    background: #f24f4f
}

.jumplist-card .icon-maple-logo {
    background: #42b847
}

.jumplist-card .icon-video-logo {
    background: #eca300
}

.my-card {
    min-width: 274px;
    max-width: 320px;
    right: 0;
    left: auto;
    padding: 0;
    background: #f6f8f9
}

.my-card .feed-item {
    background: 0 0;
    padding: 20px;
    border-bottom-color: rgba(0,0,0,.06)
}

.my-card .feed-item:hover {
    background: 0 0
}

.my-card .feed-title {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 18px;
    font-weight: 400;
    color: #000
}

.my-card .feed-desc {
    font-size: inherit;
    color: rgba(0,0,0,.3)
}

.my-card .feed-img {
    width: 50px;
    height: 50px;
    margin-right: 15px;
    border: none;
    border-radius: 3px
}

.my-card-footer {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    background: #fff
}

.my-card-footer .spaui-button {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    border: none;
    color: rgba(0,0,0,.6)
}

.my-card-footer .spaui-icon-divier {
    height: 21px
}

.fund-card {
    min-width: 230px;
    right: 0;
    left: auto;
    padding: 20px;
    color: rgba(0,0,0,.5)
}

.fund-card .title {
    font-size: 14px;
    font-weight: 600;
    color: rgba(0,0,0,.8)
}

.fund-card .meta-item+.meta-item {
    padding-top: 20px;
    margin-top: 20px;
    border-top: 1px solid rgba(0,0,0,.06)
}

.fund-card .meta-tips {
    font-size: 12px;
    color: rgba(0,0,0,.3)
}

.fund-card .price-text {
    font-size: 24px;
    font-weight: 400;
    color: #ed3b3b
}

.fund-card .editable-icon {
    -webkit-transition: .3s ease;
    transition: .3s ease;
    opacity: 0;
    visibility: hidden
}

.fund-card:hover .editable-icon {
    visibility: visible;
    opacity: 1
}

.inbox-card {
    width: 650px;
    right: 0;
    left: auto;
    padding: 0
}

.inbox-card .spaui-nav,.inbox-card .spaui-tabs-nav {
    border-bottom: 1px solid rgba(0,0,0,.06);
    font-weight: 600
}

.inbox-card .spaui-nav>li>a,.inbox-card .spaui-tabs-nav>li>a {
    padding: 15px 0
}

.inbox-card .spaui-empty,.inbox-card .spaui-tabs-body,.inbox-card .spaui-tabs-content {
    height: 100%
}

.inbox-card .spaui-empty .spaui-empty-inner {
    margin-bottom: 0
}

.inbox-card .spaui-empty-title {
    font-weight: 600
}

.inbox-card .msgs {
    padding: 10px 0
}

.inbox-card .msg-item.unread {
    position: relative
}

.inbox-card .msg-item.unread::before {
    content: '';
    position: absolute;
    left: 30px;
    top: 12px;
    display: block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #2096f5
}

.inbox-card .msg-info {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    padding: 5px 30px 5px 46px
}

.inbox-card .msg-info:focus {
    background: #f6f8f9
}

.inbox-card .msg-info:focus+.msg-detail {
    background: #f6f8f9
}

.inbox-card .msg-via {
    min-width: 60px;
    color: rgba(0,0,0,.8)
}

.inbox-card .msg-title {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: rgba(0,0,0,.8)
}

.inbox-card .msg-time {
    min-width: 70px;
    color: rgba(0,0,0,.3)
}

.inbox-card .msg-detail {
    padding: 10px 30px 10px 46px;
    font-size: 12px;
    color: rgba(0,0,0,.6);
    opacity: 0;
    -webkit-transition: .3s ease;
    transition: .3s ease
}

.inbox-card .msg-detail.in {
    opacity: 1
}

.inbox-card .spaui-tabs-body {
    height: 315px;
    overflow-y: auto
}

.inbox-card-footer {
    position: relative;
    border-top: 1px solid rgba(0,0,0,.06)
}

.inbox-card-footer .page * {
    vertical-align: baseline
}

.inbox-card-footer .spaui-pagebar {
    padding: 10px 20px;
    margin-top: -1px
}

.inbox-card-footer .inbox-card-setting {
    position: absolute;
    left: 30px;
    top: 15px;
    font-size: 12px;
    color: rgba(0,0,0,.8)
}

.help-card {
    right: 0;
    left: auto;
    min-width: 120px;
    text-align: center;
    padding: 10px 0 20px 0
}

.help-card a {
    display: block;
    padding: 5px 0
}

.help-card .icon-mp-qrcode {
    display: block;
    width: 66px;
    height: 66px;
    background: url(https://qzonestyle.gtimg.cn/gdt_ui_proj/dist/ads/images/mp-qrcode.png) 50% 50% no-repeat;
    background-size: 100% auto
}

.help-card .mp-qrcode {
    width: 60px;
    margin: 0 auto;
    padding-top: 20px;
    border-top: 1px solid rgba(0,0,0,.06)
}

.help-card .mp-qrcode:hover {
    background: 0 0
}

.help-card .mp-qrcode-text {
    font-size: 12px;
    color: rgba(0,0,0,.3)
}

.new-card {
    right: 0;
    left: auto;
    width: 242px;
    text-align: center
}

.new-card .spaui-topnav-menu-item {
    padding: 15px 0
}

.new-card .spaui-topnav-menu-item+.spaui-topnav-menu-item {
    border-top: 1px solid rgba(0,0,0,.06)
}

.new-card-title {
    font-weight: 400;
    color: rgba(0,0,0,.8)
}

.new-card-desc {
    font-size: 12px;
    color: rgba(0,0,0,.3)
}

@media all and (max-width: 992px) {
    .spaui-topnav .spaui-topnav-menu {
        position:absolute;
        float: unset;
        background: #fff;
        border: 1px solid #dcdee3;
        -webkit-box-shadow: 0 4px 10px rgba(84,85,88,.1);
        box-shadow: 0 4px 10px rgba(84,85,88,.1)
    }
}

.page-container {
    padding-top: 50px;
    width: 100%;
    min-width: 1112px
}

.review-topnav {
    background: #0f2641
}

.main {
    position: relative;
    box-sizing: border-box;
}

.sidebar {
    position: fixed;
    z-index: 101;
    left: 0;
    top: 50px;
    max-width: 160px;
    -webkit-box-sizing: content-box;
    box-sizing: content-box;
    background-color: #fff
}

.page-container.with-sidebar .wrapper {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: start;
    -ms-flex-align: start;
    align-items: flex-start
}

.page-container.with-sidebar .sidebar {
    position: -webkit-sticky;
    position: sticky;
    top: 50px
}

.page-container.with-sidebar .spaui-menu {
    position: -webkit-sticky;
    position: sticky;
    top: 50px;
    height: calc(100vh - 50px)
}

.page-container.with-sidebar .main {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    width: auto
}




.spaui-menu,.spaui-menu .spaui-submenu {
    background: #f2f5f8
}

.spaui-submenu-popup {
    z-index: 102;
    margin-left: 0
}

.spaui-submenu-popup.spaui-menu-dark {
    border: none
}

.spaui-menu-tooltip .spaui-menu-text {
    line-height: 30px
}

.spaui-menu-toggle {
    position: relative;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border: none
}

.spaui-menu-toggle::after {
    content: '';
    position: absolute;
    display: block;
    height: 1px;
    left: 10px;
    right: 10px;
    bottom: 0;
    background: rgba(106,117,128,.06)
}


.feeds {
    overflow-y: auto
}

.feed-item {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    padding: 5px 10px;
    background: #fafbfb;
    border-bottom: 1px solid #f0f0f0;
    -webkit-transition: .3s ease;
    transition: .3s ease
}

.feed-item:hover {
    background: #fff
}

.feed-img {
    margin-right: 5px;
    border: 1px solid #dfdfdf;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center
}

.feed-img img {
    max-width: 100%;
    max-height: 100%
}

.feed-info {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    overflow: hidden
}

.feed-title {
    font-weight: 700;
    color: #333
}

.feed-desc {
    font-size: 12px;
    color: #666;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap
}

.feed-highlight {
    color: #eb7174
}

.feed-more {
    display: block;
    text-align: center;
    padding: 10px 0;
    font-size: 12px
}

.feed-more:hover {
    background: #f0f0f0
}

.feed-action {
    position: relative
}
.title {
    font-weight: 400
}

.titlebar {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    margin-bottom: 5px;
    -webkit-box-align: baseline;
    -ms-flex-align: baseline;
    align-items: baseline
}

.titlebar .title {
    margin-right: 10px
}

.titlebar-addons {
    -webkit-box-flex: 1;
    -ms-flex: 1 0 0%;
    flex: 1 0 0%;
    text-align: right
}


.wrapper aside {
    top: 50px;
    width: unset;
    height: calc(100vh - 50px);
    position: sticky;
    float: left;
}

.main.home {
    height: calc(100vh - 50px)!important;
}
.spaui-menu .spaui-menu-toggle:hover {
    background:  url(https://i.gtimg.cn/qzone/biz/gdt/lib/spaui-components/images/spaui-menu-fold.svg) 50% 50% no-repeat;
    background-size: 13px auto;
}
.spaui-menu-mini .spaui-menu-toggle:hover {
    background:  url(https://i.gtimg.cn/qzone/biz/gdt/lib/spaui-components/images/spaui-menu-expand.svg) 50% 50% no-repeat;
    background-size: 13px auto;
}
</style>

    <aside class="sidebar" id="sidebar">
<div data-reactroot="" class="spaui-menu spaui-menu-mini" id="spaui_menu_0"><a onclick="this.parentElement.classList.toggle('spaui-menu-mini');" class="spaui-menu-toggle" href="javascript:;" title="展开/收起菜单"></a><ul class="spaui-menu-group"><li class="spaui-menuitem" data-index="0" data-toplevel="1"><a class="spaui-menu-title" href="https://e.qq.com/atlas/index"><i class="spaui-menu-icon icon-home"></i><span class="spaui-menu-text">首页</span></a></li><li class="spaui-menuitem" data-index="1" data-toplevel="1"><a class="spaui-menu-title" href="home.html"><i class="spaui-menu-icon icon-campaign"></i><span class="spaui-menu-text">广告管理</span></a></li><li class="spaui-menuitem has-submenu" data-index="2" data-toplevel="1" data-height="200" style="--height:200px;"><a class="spaui-menu-title" href="#report"><i class="spaui-menu-icon icon-report"></i><span class="spaui-menu-text">数据报表</span><i class="spaui-menu-icon spaui-menu-arrow"></i></a><ul class="spaui-submenu"><li class="spaui-menuitem"><a class="" href="report.html"><span class="spaui-menu-text">账户整体</span></a></li><li class="spaui-menuitem"><a class="" href="#1-2"><span class="spaui-menu-text">推广目标</span></a></li><li class="spaui-menuitem"><a class="" href="#1-3"><span class="spaui-menu-text">广告版位</span></a></li><li class="spaui-menuitem"><a class="" href="#1-4"><span class="spaui-menu-text">视频</span></a></li></ul></li><li class="spaui-menuitem" data-index="3" data-toplevel="1"><a class="spaui-menu-title" href="https://e.qq.com/atlas/account/info"><i class="spaui-menu-icon icon-finance"></i><span class="spaui-menu-text">财务</span></a></li><li class="spaui-menuitem" data-index="4" data-toplevel="1"><a class="spaui-menu-title" href="https://e.qq.com/atlas/tool/index"><i class="spaui-menu-icon icon-toolbox"></i><span class="spaui-menu-text">工具箱</span></a></li></ul></div>
    </aside>
    `;

    }


    var header = document.querySelector('header');
    if(header) {
        header.outerHTML = `<div style="height: 50px;position: relative;width: 100%;">
        <header id="header">
        <div data-reactroot="" class="topnav spaui-topnav spaui-topnav-dark is-fixed-top" title=""><div class="spaui-topnav-header" title="投放管理平台"><button type="button" class="spaui-topnav-toggler is-collapse" data-toggle="collapse" data-target="#std-spaui-topnav" aria-expanded="false" aria-controls="spaui-topnav"><span class="spaui-topnav-toggler-icon" title="☰"><span class="spaui-topnav-hamb"></span></span></button><div class="spaui-topnav-left"><div class="spaui-topnav-drop"><a href="" class="spaui-topnav-brand logo"><img src="//i.gtimg.cn/qzone/biz/gdt/image/logo.svg" width="26" height="26"></a><ul class="spaui-topnav-menu jumplist-card"><li class="spaui-topnav-menu-item"><a href="#"><i class="jumplist-logo icon-dmp-logo">数</i><span>DPM数据管理平台</span></a></li><li class="spaui-topnav-menu-item"><a href="#"><i class="jumplist-logo icon-cpt-logo">应</i><span>应用宝-CPT</span></a></li><li class="spaui-topnav-menu-item"><a href="#"><i class="jumplist-logo icon-cpd-logo">应</i><span>应用宝-CPD</span></a></li><li class="spaui-topnav-menu-item"><a href="#"><i class="jumplist-logo icon-kuaibao-logo">天</i><span>天天快报</span></a></li><li class="spaui-topnav-menu-item"><a href="#"><i class="jumplist-logo icon-maple-logo">枫</i><span>枫叶营销管理平台</span></a></li><li class="spaui-topnav-menu-item"><a href="#"><i class="jumplist-logo icon-video-logo">视</i><span>视频创意供应平台</span></a></li></ul></div><span class="spaui-topnav-divider"></span><a href="" class="spaui-topnav-title"><span>投放管理平台</span></a></div></div><div class="spaui-topnav-collapse is-collapse"><ul class="navs spaui-topnav-nav "></ul><ul class="navs spaui-topnav-nav  spaui-topnav-right"><li class="nav-item spaui-topnav-drop"><a class="nav-link" href="#"><!-- react-text: 43 -->腾讯科技有限公司<!-- /react-text --><i class="icon-darr"></i></a><div class="spaui-topnav-menu my-card"><div class="feed-item"><div class="feed-img"><img src="http://ui.qzone.com/80x80" alt=""></div><div class="feed-info"><div class="feed-title">腾讯科技有限公司腾讯科技有限公司腾讯科技有限公司腾讯科技有限公司</div><div class="feed-desc">QQ: 106456213 ID:25630</div></div></div><div class="my-card-footer"><button class="spaui-button spaui-button-default" type="button">账户中心</button><i class="spaui-icon spaui-icon-divier"></i><button class="spaui-button spaui-button-default" type="button">退出</button></div></div></li><li class="nav-item spaui-topnav-drop"><a class="nav-link with-indicator" href="#">资金</a><div class="spaui-topnav-menu fund-card"><div class="meta-item"><div class="titlebar meta-key"><h4 class="title">账户余额</h4><strong class="spaui-icon spaui-icon-badge">不足</strong></div><div class="meta-val"><strong class="price-text">0.28</strong><!-- react-text: 65 -->元<!-- /react-text --></div><p class="meta-tips"><!-- react-text: 67 -->为保证广告投放，请尽快 <!-- /react-text --><a href="#">充值</a></p></div><div class="meta-item"><div class="titlebar meta-key"><h4 class="title">今日消耗(实时)</h4><strong class="spaui-icon spaui-icon-badge">已达日限额</strong></div><div class="meta-val"><strong class="price-text">123,333.28</strong><!-- react-text: 75 -->元<!-- /react-text --></div><p class="meta-tips"><span><span title="">日限额200,200.00/天</span><a href="#" class="editable-icon" aria-label="编辑"><i class="icon icon-pen"></i></a></span></p></div></div></li><li class="nav-item spaui-topnav-drop"><a class="nav-link" href="#">通知</a><div class="spaui-topnav-menu inbox-card"><div class="spaui-tabs"><div class="spaui-tabs-head"><ul class="spaui-tabs-nav"><li class=""><a href="javascript:;" data-name="0">全部</a></li><li class=""><a href="javascript:;" data-name="1">未读</a></li><li class=""><a href="javascript:;" data-name="2">系统消息</a></li><li class=""><a href="javascript:;" data-name="3">审核消息</a></li><li class=""><a href="javascript:;" data-name="4">账户消息</a></li><li class=""><a href="javascript:;" data-name="5">财务消息</a></li></ul></div><div class="spaui-tabs-body"><div class="spaui-tabs-content">2</div></div></div><div class="inbox-card-footer"><a class="inbox-card-setting" href="#">消息通知设置</a><div class="page"><div class="spaui-pagebar mini"><div class="spaui-pagebar-inner"><span class="page-roll prev"><a title="1" style="cursor: pointer;"><i class="graph-icon graph-icon graph-icon-line arrow-left"><i></i></i></a></span><div class="pagination"><label class="spaui-pagebar-input"><input type="text" class="spaui-pagebar-current" value="2"><span class="fixnum spaui-pagebar-count"><i class="spaui-pagebar-divier">/</i><span class="spaui-pagebar-total">10</span></span></label></div><span class="page-roll back"><a title="3" style="cursor: pointer;"><i class="graph-icon graph-icon graph-icon-line arrow-right"><i></i></i></a></span></div></div></div></div></div></li><li class="nav-item spaui-topnav-drop"><a class="nav-link" href="#">帮助</a><ul class="spaui-topnav-menu help-card"><li class="spaui-topnav-menu-item"><a href="#">常见问题</a></li><li class="spaui-topnav-menu-item"><a href="#">在线学习</a></li><li class="spaui-topnav-menu-item"><a href="#">反馈意见</a></li><li class="spaui-topnav-menu-item"><a href="#">咨询客服</a></li><li class="mp-qrcode"><i class="spaui-icon icon-mp-qrcode"></i><p class="mp-qrcode-text">关注公众号</p></li></ul></li><li class="nav-item spaui-topnav-drop"><a class="nav-link" href="#"><i class="spaui-icon icon-new-cake"></i><!-- react-text: 137 -->新建广告<!-- /react-text --></a><ul class="spaui-topnav-menu new-card"><li class="spaui-topnav-menu-item"><a href="#"><h6 class="new-card-title">竞价广告</h6><p class="new-card-desc">实时竞价，按照广告的效果付费</p></a></li><li class="spaui-topnav-menu-item"><a href="#"><h6 class="new-card-title">合约广告</h6><p class="new-card-desc">固定价格，按照约定曝光付费</p></a></li></ul></li></ul></div></div>
        
        </header>

</div>
        `;

    }

var eles = document.querySelectorAll('.top');
[].map.call(eles, el => {
    //el.addEventListener('click', function(e){
        el.style.display = 'none';
    //})
})

})();
