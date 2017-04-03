/*
**  GemstoneJS -- Gemstone JavaScript Technology Stack
**  Copyright (c) 2016-2017 Gemstone Project <http://gemstonejs.com>
**  Licensed under Apache License 2.0 <https://spdx.org/licenses/Apache-2.0>
*/

/*  exported API function  */
module.exports = function (htmlhint) {
    /*  add custom HTMLHint rule for "id" linting  */
    htmlhint.addRule({
        id: "id-not-allowed",
        description: "The 'id' attribute is not allowed, because of UI fragment reusability.",
        init: function (parser, reporter /*, options */) {
            parser.addListener("tagstart", (event) => {
                let attrs = event.attrs
                let col = event.col + 1 + event.tagName.length
                for (let i = 0, len = attrs.length; i < len; i++) {
                    let attr = attrs[i]
                    if (attr.name.toLowerCase() === "id")
                        reporter.error("id attribute not allowed because of UI fragment reusability",
                            event.line, col + 1 + attr.index, this, event.raw)
                }
            })
        }
    })

    /*  add custom HTMLHint rule for root element linting  */
    htmlhint.addRule({
        id: "single-root-element",
        description: "There has to be a single root HTML element, because of UI fragment handling.",
        init: function (parser, reporter /*, options */) {
            let tags, level
            parser.addListener("all", (event) => {
                if (event.type === "start") {
                    tags  = 0
                    level = 0
                }
                else if (event.type === "tagstart") {
                    if (level === 0)        tags++
                    if (event.close === "") level++
                }
                else if (event.type === "tagend")
                    level--
                else if (event.type === "end") {
                    if (tags === 0)
                        reporter.error("empty UI fragment not supported",
                            event.line, event.col, this, event.raw)
                    else if (tags > 1)
                        reporter.error("more than one root element not allowed",
                            event.line, event.col, this, event.raw)
                }
            })
        }
    })

    return {
        /*  Standard  */
        "tagname-lowercase":        true,
        "attr-lowercase":           true,
        "attr-value-double-quotes": true,
        "attr-value-not-empty":     false,
        "attr-no-duplication":      true,
        "doctype-first":            false,
        "tag-pair":                 true,
        "tag-self-close":           false,
        "spec-char-escape":         true,
        "id-unique":                true,
        "src-not-empty":            true,
        "title-require":            true,

        /*  Performance  */
        "head-script-disabled":     false,

        /*  Accessibility  */
        "alt-require":              false,

        /*  Specification  */
        "doctype-html5":            true,
        "id-class-value":           false,
        "style-disabled":           true,
        "inline-style-disabled":    true,
        "inline-script-disabled":   true,
        "space-tab-mixed-disabled": true,
        "id-class-ad-disabled":     false,
        "href-abs-or-rel":          false,
        "attr-unsafe-chars":        true,

        /*  Other  */
        "csslint":                  false,
        "stylelint":                false,
        "jshint":                   false,
        "eslint":                   false,

        /*  Gemstone  */
        "id-not-allowed":           true,
        "single-root-element":      true
    }
}

