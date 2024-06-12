function getName(callback) {
    let name;
    setTimeout(function () {
        name = 'Jane';
        callback(name);
    }, 250);
}
function getAge(username, callback) {
    let age;
    setTimeout(function () {
        age = 30;
        callback(username, age);
    }, 250);
}

// user name and their age.
