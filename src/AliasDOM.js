import * as Util from './Util'

/**
 * Alias DOM constructor function.
 * @param  {Object|String} map              Selector-alias map.
 * @param  {HTMLElement|Undefined} $el      Root element.
 * @return {Object}                         Result table.
 */
var AliasDOM = function (map, $el) {
    var ifJoinAlias = !!map.join;
    var aliasSeparator = '/';

    function isKeyword(w) {
        return w === 'alias' || w === 'lazy' || w === 'join';
    }

    function alias(map, $root, obj, fullSel, fullAlias) {
        map = Util.isString(map) ? {
            alias: map
        } : (Util.isObject(map) ? map : {});
        $root = $root || window.document.body;
        obj = obj || {};
        if (!obj.__root) {
            Object.defineProperty(obj, '__root', {
                value: $root,
                enumerable: false
            });
        }
        fullSel = fullSel || [];
        fullAlias = fullAlias || [];

        function querySelector($parent, sel) {
            if (!sel) return $parent;
            var $targets = Array.prototype.slice.call($parent.querySelectorAll(sel));
            if ($targets.length < 1) {
                return null;
            } else if ($targets.length === 1) {
                return $targets[0];
            } else {
                return $targets;
            }
        }

        if (map.alias) {
            fullAlias = fullAlias.concat(map.alias);
            var aliasProperty = ifJoinAlias ? fullAlias.join(aliasSeparator) : map.alias;
            if (map.lazy) {
                Object.defineProperty(obj, aliasProperty, {
                    get: function () {
                        return querySelector(this.__root, fullSel.join(' '));
                    },
                    enumerable: true
                });
            } else {
                obj[aliasProperty] = querySelector($root, fullSel.join(' '));
            }
        }

        Util.each(map, function (v, sel) {
            if (isKeyword(sel)) return;
            alias(v,
                $root,
                obj,
                fullSel.concat(sel),
                fullAlias
            );
        });

        return obj;
    }

    function lazyDown(map) {
        if (!Util.isObject(map)) return;
        if (map.lazy) {
            Util.each(map, function (v, p) {
                if (isKeyword(p)) return;
                if (Util.isString(v)) {
                    map[p] = {
                        alias: v,
                        lazy: true
                    };
                } else if (Util.isObject(v)) {
                    v.lazy = true;
                }
            });
        }
        Util.each(map, lazyDown);
    }

    lazyDown(map);

    alias(map, $el, this);
};

/**
 * Alias DOM factory function.
 * @param  {Object|String} map              Selector-alias map.
 * @param  {HTMLElement|Undefined} $el      Root element.
 * @return {AliasDOM}                       An AliasDOM instance.
 */
var Alias = function (map, $el) {
    return new AliasDOM(map, $el);
};

export {
    AliasDOM,
    Alias
}