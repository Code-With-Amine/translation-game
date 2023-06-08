$('form').on('submit', function (e) {
    e.preventDefault(); // prevent the form from submitting to another page
    const fName = $('#fName').val()
    const lName = $('#lName').val()
    if (fName === '' && lName === '') { // if the inputs are empty
        $('form').append('<div class="warning radius-1">The fileds must be filled</div>') // show warning message
    } else {
        // store this user into the localstorge
        localStorage.setItem('userFirstName', fName)
        localStorage.setItem('userLastName', lName)
        window.location.href = 'game.html'
    }
});
