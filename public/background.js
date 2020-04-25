function sendAPIRequest(method, path, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, "http://localhost:3000" + path, true);

    if (method == "GET") {
        xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            // WARNING! Might be evaluating an evil script!
            // return xhr;
            callback(xhr)
        }
        }

        xhr.send();
    } else if (method == "POST") {
        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        xhr.onreadystatechange = function() { // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                // Request finished. Do processing here.
                // console.log(xhr)
                callback(xhr)
            }
        }

        xhr.send(JSON.stringify(data));
    }
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    // console.log(tabId, changeInfo, tab);

    if (changeInfo.status == "complete") {
        chrome.tabs.sendMessage(tabId, {
            message: "New tab opened"
        });
    }
});

chrome.runtime.onMessage.addListener((data) => {
    if (data.type === 'notification') {
        chrome.notifications.create('', data.options);
    }
});