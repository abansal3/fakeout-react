/* global chrome */

export function getCurrentUser() {
    return new Promise(function(resolve, reject) {
        chrome.storage.local.get(['loggedInUser'], function(result) {
            if (result.loggedInUser) {
                resolve(result.loggedInUser);
            } else {
                reject(Error("No loggedin user"))
            }
        });
    })
}

export function test() {
    console.log("test")
}