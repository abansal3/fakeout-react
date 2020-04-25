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

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request.message);
        console.log("Check url against database: " + window.location.href);

        sendAPIRequest("POST","/flags/check", {url: window.location.href}, function(xhr) {
            var response = JSON.parse(xhr.response);

            console.log(response);

            if (response.flagged) {
                chrome.runtime.sendMessage('', {
                    type: 'notification',
                    options: {
                        title: 'Flagged article!',
                        message: 'This could potentially be fake news',
                        iconUrl: 'https://i.imgur.com/VmBCsJO.png',
                        type: 'basic'
                    }
                });
            }
            
        });
    }
);