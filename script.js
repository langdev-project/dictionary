/* jslint asi:true, browser:true */
/* globals LREC */

/*  Setting up objects  */

if (typeof Intl === "undefined") window.Intl = {};
if (!Intl.Collator) window.Intl.Collator = function(locales, options) {};

var Dictionary = {
    collator: undefined,
    handleInputs: undefined,
    id: undefined,
    init: undefined,
    lrec: undefined,
    splash: undefined
}

var LRECs = {
    "": {collator: undefined, location: "index.lrec", skin: "about:blank"},
    "osv-0010": {collator: new Intl.Collator(["art-Latn-x-osv-0010", "no", "da"], {sensitivity: "base"}), location: "../data/languages/jsv/osv/0010/index.lrec", skin: "skins/osv.css"},
    "osv-0011": {collator: new Intl.Collator(["art-Latn-x-osv-0011", "no", "da"], {sensitivity: "base"}), location: "../data/languages/jsv/osv/0011/index.lrec", skin: "skins/osv.css"},
    "osv-0012": {collator: new Intl.Collator(["art-Latn-x-osv-0012", "no", "da"], {sensitivity: "base"}), location: "../data/languages/jsv/osv/0012/index.lrec", skin: "skins/osv.css"},
    "fiz-1der": {collator: new Intl.Collator("art-Latn-x-fiz-1der"), location: "../data/languages/fzn/fiz/1der/index.lrec", skin: "skins/fiz.css"},
    "fiz-1der/characters": {collator: new Intl.Collator("art-Latn-x-fiz-1der-block000"), location: "../data/languages/fzn/fiz/1der/characters.lrec", skin: "skins/fiz.css"}
}

var Query = {
    get: undefined,
    handle: undefined
}

Dictionary.handleInputs = function() {

    //  Sets up variables:

    var i;
    var j;
    var matched;
    var a = document.getElementById("dictionary-search").value;
    var b;
    var tag = document.getElementById("dictionary-tags").value;
    var word;
    var alts;
    var tags;

    //  Iterates over navigation links;

    for (i = 0; i < document.getElementById("dictionary-navigation").children.length; i++) {

        //  Sets up variables:

        word = document.getElementById("dictionary-navigation").children.item(i);
        matched = false;
        b = word.textContent.substr(0, a.length);

        //  Checks for matches:

        if ((Dictionary.collator.compare && Dictionary.collator.compare(a, b)) ||  (!Dictionary.collator.compare && a.localeCompare(b))) {
            alts = JSON.parse(word.dataset.alternates);
            for (j in alts) {
                b = j.substr(0, a.length);
                if ((Dictionary.collator.compare && Dictionary.collator.compare(a, b)) ||  (!Dictionary.collator.compare && a.localeCompare(b))) continue;
                matched = true;
                break;
            }
        }
        else matched = true;

        //  Checks tags:

        if (matched) {
            tags = JSON.parse(word.dataset.tags);
            if (tag !== "" && tags.indexOf(tag) === -1) matched = false;
        }

        //  Hides failed matches; shows successful ones:

        if (!matched) word.setAttribute("hidden", "");
        else word.removeAttribute("hidden");

    }

}

Dictionary.init = function(e) {

    //  Makes sure we're handling the right event:

    if (e && e instanceof CustomEvent && e.details && e.details.lrec !== Dictionary.lrec) return;
    if (!Dictionary.lrec || !(Dictionary.lrec instanceof LREC)) return;

    //  Loads LREC variables:

    document.getElementById("dictionary-skin").href = LRECs[Dictionary.id].skin;
    Dictionary.collator = LRECs[Dictionary.id].collator;

    //  Loads metadata:

    document.getElementById("dictionary-title").textContent = document.title = Dictionary.lrec.title;
    if (Dictionary.lrec.subtitle) document.getElementById("dictionary-subtitle").textContent = Dictionary.lrec.subtitle;
    else document.getElementById("dictionary-subtitle").textContent = "";
    if (Dictionary.lrec.description) document.getElementById("dictionary-description").textContent = Dictionary.lrec.description;
    else document.getElementById("dictionary-description").textContent = "";
    if (Dictionary.lrec.language) document.documentElement.lang = Dictionary.lrec.language;
    else document.documentElement.lang = "";
    if (Dictionary.lrec.author) document.getElementById("dictionary-author").textContent = Dictionary.lrec.author;
    else document.getElementById("dictionary-author").textContent = "";
    if (Dictionary.lrec.date) document.getElementById("dictionary-date").textContent = Dictionary.lrec.date;
    else document.getElementById("dictionary-date").textContent = "";
    Dictionary.splash();
    if (Dictionary.lrec.frontmatter) {
        document.getElementById("dictionary-frame").src = Dictionary.lrec.frontmatter.href;
        document.getElementById("dictionary-title-link").href = Dictionary.lrec.frontmatter.href;
        document.getElementById("dictionary-title-link").target = "dictionary-frame";
    }
    else {
        document.getElementById("dictionary-frame").src = "about:blank";
        document.getElementById("dictionary-title-link").removeAttribute("href");
        document.getElementById("dictionary-title-link").removeAttribute("target");
    }

    //  Splash reloader:

    document.getElementById("dictionary-title").addEventListener("click", Dictionary.splash, false);

    //  Sets up variables:

    var as = [];
    var i;
    var inflection;
    var thing;
    var things;
    var words;
    var element;

    //  Wipes search and navigation:

    document.getElementById("dictionary-search").textContent = "";
    document.getElementById("dictionary-tags").textContent = "";
    document.getElementById("dictionary-navigation").textContent = "";
    element = document.createElement("option");
    element.value = "";
    element.textContent = "";
    document.getElementById("dictionary-tags").appendChild(element);

    //  Creates entries:

    for (thing in Dictionary.lrec.lexemes) {
        i = as.length;
        as[i] = document.createElement("a");
        as[i].href = Dictionary.lrec.lexemes[thing].url.href;
        as[i].title = Dictionary.lrec.lexemes[thing].gloss;
        as[i].target = "dictionary-frame";
        as[i].textContent = thing;
        if (Dictionary.lrec.lexemes[thing].language) as[i].lang = Dictionary.lrec.lexemes[thing].language;
        as[i].dataset.tags = JSON.stringify(Dictionary.lrec.lexemes[thing].tags);
        as[i].dataset.alternates = JSON.stringify(Dictionary.lrec.lexemes[thing].alternates);
        as[i].dataset.pronunciation = JSON.stringify(Dictionary.lrec.lexemes[thing].pronunciation);
        for (inflection in Dictionary.lrec.lexemes[thing].inflections) {
            i = as.length;
            as[i] = document.createElement("a");
            as[i].href = Dictionary.lrec.lexemes[thing].url.href;
            as[i].title = Dictionary.lrec.lexemes[thing].gloss;
            as[i].target = "dictionary-frame";
            as[i].textContent = inflection;
            if (Dictionary.lrec.lexemes[thing].language) as[i].lang = Dictionary.lrec.lexemes[thing].language;
            as[i].dataset.tags = JSON.stringify(Dictionary.lrec.lexemes[thing].tags);
            as[i].dataset.alternates = JSON.stringify(Dictionary.lrec.lexemes[thing].inflections[inflection].alternates);
            as[i].dataset.pronunciation = JSON.stringify(Dictionary.lrec.lexemes[thing].inflections[inflection].pronunciation);
        }
    }

    //  Sorts entries:

    words = as.map(function(e, i) {return {index: i, text: e.textContent.trim()}});
    words.sort(function(a, b) {if (Dictionary.collator.compare) return Dictionary.collator.compare(a.text, b.text); else return a.text.localeCompare(b.text);});

    //  Adds entries to navigation:

    for (i = 0; i < words.length; i++) {
        document.getElementById("dictionary-navigation").appendChild(as[words[i].index]);
    }

    //  Adds tag-groups:

    things = {};
    for (thing in Dictionary.lrec.groups) {
        element = document.createElement("OPTGROUP");
        element.label = thing;
        if (Dictionary.lrec.groups[thing].description) element.title = Dictionary.lrec.groups[thing].description;
        things[thing] = element;
    }
    for (thing in Dictionary.lrec.groups) {
        if (Dictionary.lrec.groups[thing].parent) things[thing].appendChild(element);
        else document.getElementById("dictionary-tags").appendChild(element);
    }

    //  Adds tags:

    for (thing in Dictionary.lrec.tags) {
        element = document.createElement("OPTION");
        element.value = thing;
        element.textContent = thing;
        if (Dictionary.lrec.tags[thing].parent) {
            for (i = 0; i < document.getElementById("dictionary-tags").children.length; i++) {
                if (document.getElementById("dictionary-tags").children.item(i).tagName.toUpperCase() === "OPTGROUP" && document.getElementById("dictionary-tags").children.item(i).label.toLowerCase() === Dictionary.lrec.tags[thing].parent.toLowerCase()) {
                    document.getElementById("dictionary-tags").children.item(i).appendChild(element);
                    break;
                }
            }
        }
        else document.getElementById("dictionary-tags").appendChild(element);
    }

    //  Displays search and tags:

    if (words.length) {
        document.getElementById("dictionary-search").removeAttribute("hidden");
        document.getElementById("dictionary-tags").removeAttribute("hidden");
    }

    //  Add input handlers:

    document.getElementById("dictionary-search").addEventListener("input", Dictionary.handleInputs, false);
    document.getElementById("dictionary-tags").addEventListener("change", Dictionary.handleInputs, false);

}

Dictionary.splash = function() {
    if (!Dictionary.lrec || !(Dictionary.lrec instanceof LREC)) return;
    if (Dictionary.lrec.splashes.length) document.getElementById("dictionary-splash").textContent = Dictionary.lrec.splashes[Math.floor(Math.random() * Dictionary.lrec.splashes.length)];
    else document.getElementById("dictionary-splash").textContent = "";
}

Query.get = function(property) {
    var i;
    var j;
    var q = decodeURIComponent(window.location.search);
    if (!q) q = "?";
    i = q.indexOf("?" + property + "=");
    if (i === -1) i = q.indexOf("&" + property + "=");
    if (i === -1) return undefined;
    i += property.length + 2;
    j = q.indexOf("&", i);
    if (j === -1) return q.substring(i);
    else return q.substring(i, j);
}

Query.handle = function() {
    var d = Query.get("lrec");
    if (d && LRECs[d]) Dictionary.id = d;
    else Dictionary.id = "";
    Dictionary.lrec = new LREC(LRECs[Dictionary.id].location);
}

window.addEventListener("load", Query.handle, false);
document.addEventListener("LREC_Loaded", Dictionary.init, false);
