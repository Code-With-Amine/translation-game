$(document).ready(function () {
    let toggleNavBar = $('.toggleNavBtn');
    toggleNavBar.on('click', function () {
        $('nav > a,img').toggleClass('display');
    });
});