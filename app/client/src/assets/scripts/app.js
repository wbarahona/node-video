import $ from 'jquery';

const $yturl = $('.youtubeurl');
const $submit = $('.submit');
const $list = $('.list-group');
const $resultsTitle = $('.results-title');
const $alert = $('.alert-banner');
const $loading = $('.overlay');
const regx = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
let ticker = null;

const hideToast = () => {
    $alert.removeClass('shown').html('');
};

const showToast = (alertType, message) => {
    $alert.removeClass('alert-success alert-info alert-warning alert-danger').addClass(`alert-${ alertType } shown`).html(`${ message }`);

    ticker = setInterval(() => {
        hideToast();
        clearInterval(ticker);
    }, 3000);
};

$submit.on('click', () => {
    if (regx.test($yturl.val())) {
        $loading.removeClass('hidden');
        $.ajax({
            url: 'http://localhost:8001/api/v1/youtube/',
            method: 'POST',
            data: { 'url': $yturl.val() },
            dataType: 'json',
            success: (data) => {
                if (data.code === 1) {
                    const piecesLen = data.content.piecesResponses.length;

                    for (let i = 0; i < piecesLen; i++) {
                        const videoUrlRoot = '/public';
                        const filename = `${ data.content.id }${ i + 1 }.mp4`;
                        const fileUrl = `${ videoUrlRoot }/${ data.content.id }/${ filename }`;
                        const $a = $('<a>').attr('href', fileUrl).html(`&#x1F39E; - ${ filename }`);
                        const $li = $('<li>').addClass('list-group-item');

                        $li.append($a);
                        $list.append($li);
                    }

                    $list.removeClass('hidden');
                    $resultsTitle.removeClass('hidden');
                    showToast('success', `&#x2705; ${ data.message }`);
                    $loading.addClass('hidden');
                } else {
                    showToast('warning', data.message);
                }
            },
            error: (err) => {
                console.error(err);
                showToast('danger', `&#x26D4; Hull is wreck cap\'n! Abandon ship!!! ${ err.responseJSON.message }`);
                $loading.addClass('hidden');
            }
        });
    } else {
        showToast('danger', '&#x26D4; not a valid youtube url...');
    }
});
