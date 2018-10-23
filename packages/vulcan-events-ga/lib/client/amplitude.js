import { addPageFunction, addInitFunction, addIdentifyFunction, addTrackFunction } from 'meteor/vulcan:events';
import { Utils } from 'meteor/vulcan:core';

/*

Track Page

*/

function amplitudeTrackPage(route) {
  const { name, path } = route;
  const properties = {
    url: Utils.getSiteUrl().slice(0, -1) + path,
    path
  };
  if (window && window.amplitude) {
    window.amplitude.getInstance().logEvent(`Viewed ${name === undefined ? 'HomePage' : name}`, {
      ...properties,
      client: 'api'
    });
  }
  return {};
}
addPageFunction(amplitudeTrackPage);

/*

Identify User

*/

function amplitudeIdentify(currentUser) {
  if (window && window.amplitude) {
    window.amplitude.getInstance().setUserId(currentUser._id);
    window.amplitude.getInstance().setUserProperties({
      email: currentUser.email,
      pageUrl: currentUser.pageUrl
    });
  }
}
addIdentifyFunction(amplitudeIdentify);

/*

Track Event

*/

function amplitudeTrack(eventType, eventProperties) {
  if (window && window.amplitude) {
    window.amplitude.getInstance().logEvent(`Viewed ${eventType}`, eventProperties);
  }
}
addTrackFunction(amplitudeTrack);

/*

Init Snippet

*/
function amplitudeInit() {
  (function(e, t) {
    var n = e.amplitude || { _q: [], _iq: {} };
    var r = t.createElement('script');
    r.type = 'text/javascript';
    r.async = true;
    r.src = 'https://cdn.amplitude.com/libs/amplitude-4.4.0-min.gz.js';
    r.onload = function() {
      if (e.amplitude.runQueuedFunctions) {
        e.amplitude.runQueuedFunctions();
      } else {
        // eslint-disable-next-line
        console.log('[Amplitude] Error: could not load SDK');
      }
    };
    var i = t.getElementsByTagName('script')[0];
    i.parentNode.insertBefore(r, i);
    function s(e, t) {
      e.prototype[t] = function() {
        this._q.push([t].concat(Array.prototype.slice.call(arguments, 0)));
        return this;
      };
    }
    var o = function() {
      this._q = [];
      return this;
    };
    var a = ['add', 'append', 'clearAll', 'prepend', 'set', 'setOnce', 'unset'];
    for (var u = 0; u < a.length; u++) {
      s(o, a[u]);
    }
    n.Identify = o;
    var c = function() {
      this._q = [];
      return this;
    };
    var l = ['setProductId', 'setQuantity', 'setPrice', 'setRevenueType', 'setEventProperties'];
    for (var p = 0; p < l.length; p++) {
      s(c, l[p]);
    }
    n.Revenue = c;
    var d = [
      'init',
      'logEvent',
      'logRevenue',
      'setUserId',
      'setUserProperties',
      'setOptOut',
      'setVersionName',
      'setDomain',
      'setDeviceId',
      'setGlobalUserProperties',
      'identify',
      'clearUserProperties',
      'setGroup',
      'logRevenueV2',
      'regenerateDeviceId',
      'logEventWithTimestamp',
      'logEventWithGroups',
      'setSessionId',
      'resetSessionId'
    ];
    function v(e) {
      function t(t) {
        e[t] = function() {
          e._q.push([t].concat(Array.prototype.slice.call(arguments, 0)));
        };
      }
      for (var n = 0; n < d.length; n++) {
        t(d[n]);
      }
    }
    v(n);
    n.getInstance = function(e) {
      e = (!e || e.length === 0 ? '$default_instance' : e).toLowerCase();
      if (!n._iq.hasOwnProperty(e)) {
        n._iq[e] = { _q: [] };
        v(n._iq[e]);
      }
      return n._iq[e];
    };
    e.amplitude = n;
  })(window, document);

  window.amplitude.getInstance().init('8bd1aca37bd056e096b8331cca9f5605', null, {
    batchEvents: true,
    saveEvents: true,
    includeUtm: true,
    includeReferrer: true,
    trackingOptions: {
      city: true,
      ip_address: true
    }
  });
  window.amplitude.getInstance().setOptOut(false);
}
addInitFunction(amplitudeInit);
