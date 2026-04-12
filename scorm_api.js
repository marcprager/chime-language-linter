// SCORM 1.2 API Wrapper
var SCORM = (function() {
    var api = null;
    function findAPI(win) {
        var attempts = 0;
        while ((!win.API) && (win.parent) && (win.parent != win) && (attempts < 10)) {
            win = win.parent; attempts++;
        }
        return win.API || null;
    }
    function init() {
        api = findAPI(window);
        if (!api && window.opener) api = findAPI(window.opener);
        if (api) api.LMSInitialize("");
    }
    function getValue(key) { return api ? api.LMSGetValue(key) : ""; }
    function setValue(key, val) { if (api) { api.LMSSetValue(key, val); api.LMSCommit(""); } }
    init();
    return {
        complete: function(score, passed) {
            setValue("cmi.core.score.raw", score);
            setValue("cmi.core.score.min", "0");
            setValue("cmi.core.score.max", "100");
            setValue("cmi.core.lesson_status", passed ? "passed" : "failed");
            if (api) api.LMSFinish("");
        },
        setScore: function(s) { setValue("cmi.core.score.raw", s); },
        setLocation: function(loc) { setValue("cmi.core.lesson_location", loc); },
        getLocation: function() { return getValue("cmi.core.lesson_location"); },
        setSuspendData: function(data) { setValue("cmi.suspend_data", JSON.stringify(data)); },
        getSuspendData: function() { try { return JSON.parse(getValue("cmi.suspend_data")); } catch(e) { return null; } },
        setStatus: function(s) { setValue("cmi.core.lesson_status", s); }
    };
})();
