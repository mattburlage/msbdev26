// Show the contact form when the link is clicked
function showContactForm() {
    $('#navbarHeader').collapse('show');
    $('#id_email').focus();
    return false;
}

// Pulled from Django Docs
// https://docs.djangoproject.com/en/3.0/ref/csrf/#setting-the-token-on-the-ajax-request

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


// Function to submit the contact form via AJAX
let toggled = false;
let scrolled = false;
let tallEnough = true;
const arrow = $('.arrow')

function toggleResume () {
    const spacingTop = $('#spacing-top')
    const spacingTop2 = $('#spacing-top2')
    const nycBg = $('.nyc-bg')

    if (toggled) {
        nycBg.height('100%')
        nycBg.css('min-height', '400px')
        spacingTop.height('25%')
        spacingTop2.height('15%')
    }
    else {
        $('.nyc-bg').height('300px')
        nycBg.css('min-height', '300px')
        spacingTop.height('5%')
        spacingTop2.height('0%')
    }

    toggled = !toggled;

    $('#principles').collapse('toggle');
    $('#mywork').collapse('toggle');
    $('#aboutme').collapse('toggle');
    $('#resume').collapse('toggle');
    $('#contactme').collapse('toggle');
    $('.collapse-div').collapse('toggle');
    arrow.fadeOut();
}

const tallEnoughHeight = 450;

$(document).ready(() => {

    setTimeout(() => {
        if (!toggled && !scrolled && tallEnough) arrow.fadeIn();
    }, 2000)

    $(window).scroll(() => {
        scrolled = true;
        arrow.fadeOut()
    })

    calcCardDelay();

    $(window).resize(() => {
        calcCardDelay();
    })
})

function addlInfoSection(section) {
    $('.addl-info').collapse('hide')
    $('#addl-info-' + section).collapse('show')
}

function calcCardDelay (val) {
    const cards = $('.cards');
    let columns = 3;

    const width = $(window).width();
    if (width < 768) columns = 1;
    else if (width < 992) columns = 2;

    cards.each(index => {
        const newDelay = (index % columns) * 150
        $('#card' + (index+1)).attr('data-aos-delay', newDelay)
    })

    tallEnough = $(window).height() > 450;
    if (!tallEnough) arrow.hide();
}

AOS.init({
    once: true,
    duration: 600,
});