var ListBuilder = function(opts) {
    var emptyFn = function () {}
    var url, config, tpl, list, pagingNotificationName;

    url = opts.url;
    config = opts.config;
    tpl = opts.tpl;
    list = opts.list;
    var firstPageFn = opts.firstPageFn || emptyFn;
    var afterRender = opts.afterRender || emptyFn;
    pagingNotificationName = opts.pagingNotificationName;

    var rightPagingReady = false;
    var latestPage = 0;
    var totalPage = 1;
    var loading = {};
    var footerLoading = createHorizentalLoading();
    var fullpageLoading = createFullpageLoading();
    var fullRetry = null;
    $('body').append(fullpageLoading);
    $x.onRefresh = refresh;
    // refresh();

    // detect scroll
    $(window).on('scroll', function() {
        var bodyHeight = $(document.body).height();
        height4loading = Math.max($(window).height(), 960);
        if (latestPage > 0) {
            height4loading = Math.max(bodyHeight / latestPage, height4loading);
        }
        var scrollTop = $(window).scrollTop();
        var shouldload = $(window).scrollTop() + height4loading + $(window).height() > bodyHeight;
        if (shouldload) {
            loadNext();
        }
    });

    var _h = $x.subscribe(pagingNotificationName, function(opts) {
        console.log(opts);
        gotoPage(opts.page);
    });
    console.log(_h);

    // functions
    function refresh() {
        latestPage = 0;
        loadNext(true);
    }

    function loadNext(force) {
        if (latestPage == totalPage && !force) return; // already load last page
        loadPage(latestPage + 1, renderPage);
    }

    function gotoPage(page) {
        if (page > totalPage) page = totalPage;
        if (page > latestPage) { // create placeholder
            for (var i = latestPage + 1; i < page; ++i) {
                var holder = createPagePlaceHolder(i);
                holder.insertAfter($('#anchor_' + i));
                (function(page) {
                    holder.tap(function() {
                        loadPage(page, renderPage);
                    });
                })(i);
            }
            setLatestPage(page - 1);
        } else {
            loadPage(page, renderPage);
        }
        var anchor = $('#anchor_' + page);
        $(window).scrollTop(anchor.offset().top);
    }

    function renderPage(items, pageInfo) {
        totalPage = pageInfo.totalPage;
        setLatestPage(Math.max(latestPage, pageInfo.currentPage));
        if (latestPage == 1) {
            list.html('');
        }
        for (var i = latestPage; i <= pageInfo.totalPage; ++i) {
            createPageAnchor(i);
        }
        if (!rightPagingReady) {
            $x.showRightMenu(true);
        }
        $x.publish('XRightPageInfo', {
            currentPage: pageInfo.currentPage,
            totalPage: pageInfo.totalPage,
            notificationName: pagingNotificationName
        });

        renderItems(items, pageInfo.currentPage);
    }

    function setLatestPage(page) {
        latestPage = page;
        if (latestPage < totalPage) {
            footerLoading.insertAfter($('#list'));
            footerLoading.find('.horizental-hint-hint')
                .text('正在加载' + (latestPage + 1) + '/' + totalPage + ' ...');
        } else {
            footerLoading.remove();
        }
    }

    function renderItems(items, page) {
        var htmls = [];
        items.forEach(function(item) {
            htmls.push(tpl(item));
        });
        var dom = $(htmls.join(''));
        var anchor = $('#anchor_' + page);
        anchor.attr('loaded', true);
        dom.insertAfter(anchor);
        dom.each(function() {
            $(this).addClass('x_page_' + page);
        });
        $('#x_page_placeholder_' + page).remove();
        // $('#list').append(dom);
        dom.find('img').each(function(index, img) {
            var img = $(img);
            var src = img.attr('xsrc');
            if (!src) return;
            if (src.indexOf('http') === -1) {
                src = 'http://bbs.toplicai.cn/' + src;
            }
            $x.download(src, function(rsp) {
                if (rsp.code == 0) {
                    var path = rsp.path;
                    var url = path.replace(/^file:\/\//i, 'x://');
                    img.attr('src', url);
                }
            });
        });

        afterRender(dom);
    }

    function loadPage(page, callback) {
        if (loading[page]) return;
        loading[page] = true;
        // if (page == 1) {
        //  url = 'http://localhost/';
        // }
        // url = 'http://10.128.36.61:8081/c_read.html#';
        $x.ajax({
            dataType: 'json',
            url: url + '&page=' + page,
            success: function(rsp) {
                if (fullpageLoading) {
                    fullpageLoading.remove();
                    fullpageLoading = null;
                }

                loading[page] = false;
                var html = rsp.data;
                var body = $xu.getBody(html);
                var dom = $(body);
                var items = parse(dom, config);
                // console.log(items);
                var pageInfo = getPageInfo(dom.find('.pages .pagesone'));
                callback(items, pageInfo);

                if (page == 1) {
                    // var title = dom.find('#subject_tpc').html();
                    // $('#post-title').html(title);
                    // $x.setTitle($xu.html2text(title));
                    firstPageFn(dom);
                }
                $x.endRefresh();
            },
            fail: function(code, message) {
                loading[page] = false;
                if (page == 1) {
                    showFullRetryPage();
                } else {

                }
                console.log('error:', code, message);
                $x.endRefresh();
            }
        });
    }

    function showFullRetryPage() {
        if (!fullRetry) {
            fullRetry = createFullpageRetry();
            fullRetry.on('tap', function() {
                refresh();
                $('body').append(fullpageLoading);
                fullRetry.remove();
            });
        }
        fullpageLoading.remove();
        $('body').append(fullRetry);
    }

    function createPageAnchor(page) {
        var dom = $('#anchor_' + page);
        if (dom.length > 0) return dom;

        dom = $('<li id="anchor_' + page + '" class="page-anchor"><a name="anchor_a_' + page + '"></a></li>');
        if (page <= 1) {
            $('#list').append(dom);
        } else {
            var node = $('#anchor_' + (page - 1));
            if (!node) {
                node = createPageAnchor(page - 1);
            }
            dom.insertAfter(node);
        }

        return dom;
    }

    /*
        {
            currentPage: 
            totalPage: 
        }
        */
    function getPageInfo(dom) {
        var text = XUtils.trimTag(dom.html());
        // console.log(text);
        var result = {
            currentPage: 1,
            totalPage: 1
        };
        text.replace(/Pages:\s+(\d+)\/(\d+)/, function($0, $1, $2) {
            result = {
                currentPage: $1 * 1,
                totalPage: $2 * 1
            };
        });
        // console.log(result);
        return result;
    }

    return {
        refresh: refresh
    };

};

function parse(html, config) {
    var dom = $(html);
    var list = getDomByParser(dom, config.list);
    var items = [];
    list.each(function(idx, el) {
        var item = {};
        $.each(config.data, function(key, parser) {
            item[key] = getValue($(el), parser);
        });
        items.push(item);
    });
    return items;

    function getValue(dom, parser) {
        var dom = getDomByParser(dom, parser);
        if (_.isString(dom)) return dom.trim();
        if (dom instanceof $.fn.constructor) {
            return (dom.length > 0 && dom.html().trim()) || '';
        }
        return dom;
    }

    function getDomByParser(dom, parser) {
        var selector = $.isPlainObject(parser) ? parser.selector : parser;

        if (selector.indexOf('[') == -1) {
            dom = dom.find(selector);
        } else {
            var qs = selector.split(/]\s+/);
            qs.forEach(function(q) {
                var comps = q.split('[');
                var query = comps[0];
                dom = dom.find(query);
                var index = comps.length > 1 ? parseInt(comps[1].replace(/[\[\]]/g, '')) : -1;
                (index != -1) && (dom = $(dom.get(index)));
            });
        }

        if ($.isFunction(parser.fn)) {
            try {
                dom = parser.fn(dom);
            } catch (e) {
                console.log('43, parser.fn error:', e);
            }
        }

        return dom;
    }
}
