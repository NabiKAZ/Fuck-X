// ==UserScript==
// @name         Fuck-X
// @namespace    https://github.com/NabiKAZ/Fuck-X
// @version      0.1.0
// @description  Change the ugly X logo to the Twitter lovely blue bird (:
// @author       Nabi K.A.Z. <nabikaz@gmail.com> | www.nabi.ir | @NabiKAZ
// @match        https://twitter.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var path = '<path style="color: rgb(29, 155, 240)" d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>';
    var favicon_url = 'https://abs.twimg.com/favicons/twitter.2.ico';
    var favicon_pip_url = 'https://abs.twimg.com/favicons/twitter-pip.2.ico';
    var title_text = 'Twitter';
    var flag_logo = false;
    var flag_loading = false;
    var flag_favicon = false;
    var n = 0;

    var loop = setInterval(function() {
        var logo = document.querySelector('a[href="/home"] g');
        var loading = document.querySelector('div[id="placeholder"] g');
        var favicon = document.querySelector('link[rel="shortcut icon"]');

        // Changing the original logo
        if (logo && !flag_logo) {
            logo.innerHTML = path;
            flag_logo = true;
        }

        // Changing the loading logo
        if (loading && !flag_loading) {
            loading.innerHTML = path;
            flag_loading = true;
        }

        // Changing the favicon logo
        if (favicon && !flag_favicon) {
            favicon.setAttribute('href', favicon_url);
            flag_favicon = true;
        }

        //n for stop = 300 delay * 100 times = 30000ms = 30sec
        if ((flag_logo && flag_loading && flag_favicon) || n == 100) {
            console.log('Done, changed logo!');
            clearInterval(loop);
        }

        n++;
    }, 300);



    var originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function() {
        var xhr = this;
        xhr.addEventListener('load', function() {

            // Changing the favicon logo when there is a new notification
            if (xhr.responseURL.startsWith('https://twitter.com/i/api/2/badge_count/badge_count.json')) {
                var favicon = document.querySelector('link[rel="shortcut icon"]');
                var responseJSON = JSON.parse(xhr.responseText);
                if (responseJSON.total_unread_count > 0) {
                    favicon.setAttribute('href', favicon_pip_url);
                } else {
                    favicon.setAttribute('href', favicon_url);
                }
            }

            // Changing the title
            if (xhr.responseURL.startsWith('https://twitter.com/i/api/1.1/jot/client_event.json')) {
                var title = document.querySelector('title');
                if (title.innerText === 'X') {
                    title.innerText = title_text;
                } else {
                    title.innerText = title.innerText.replace(' / X', ' / ' + title_text);
                }
            }

        });
        originalSend.apply(xhr, arguments);
    };

})();
