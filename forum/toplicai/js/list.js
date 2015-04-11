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
            dom = parser.fn(dom);
        }

        return dom;
    }
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
    text.replace(/Pages:\s+(\d+)\/(\d+)/, function ($0, $1, $2) {
        result = {
            currentPage: $1 * 1,
            totalPage: $2 * 1
        };
    });
    // console.log(result);
    return result;
}

