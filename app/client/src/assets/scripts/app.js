import $ from 'jquery';

const $yturl = $('.youtubeurl');
const $submit = $('.submit');
const $list = $('.list-group');
const $resultsTitle = $('.results-title');
const $alert = $('.alert-banner');
const $loading = $('.overlay');
const $thumbnailCard = $('.thumbnail-card');
const $thumbnailImg = $thumbnailCard.find('.card-img-top');
const $thumbnailTitle = $thumbnailCard.find('.card-title');
const $thumbnailDescr = $thumbnailCard.find('.card-text');
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
    if (regx.test($yturl.val()) && grecaptcha.getResponse() !== '') {
        $loading.removeClass('hidden');
        $.ajax({
            url: 'http://localhost:8001/api/v1/youtube/',
            method: 'POST',
            data: { 'url': $yturl.val() },
            dataType: 'json',
            success: (data) => {
                // const data = {'statusCode': 200, 'code': 1, 'message': 'Done processing videos!', 'content': {'piecesResponses': ['Video processed', 'Video processed', 'Video processed', 'Video processed'], 'id': 'qCZQyxac51U3Z0juGys5', 'videoinfo': {'id': 'DmP1ier3R30', 'title': 'REJECTION EXPERIMENT: GUYS VS GIRLS', 'thumbnail': 'https://i.ytimg.com/vi/DmP1ier3R30/maxresdefault.jpg', 'description': 'How girls reject guys versus how guys reject girls.\nSUBSCRIBE ► https://youtube.com/user/whatever?sub_confirmation=1\nMERCHANDISE ► https://amazon.com/shop/whatever\n\nBEHIND THE SCENES ► http://www.youtube.com/user/nevermind?sub_confirmation=1\n\n★FOLLOW ME ON SOCIAL MEDIA★\nFACEBOOK ► http://facebook.com/whatever\nTWITTER (@whatever) ► http://twitter.com/whatever\nINSTAGRAM (@whatever) ► http://instagram.com/whatever\n\n★MY EQUIPMENT★\nCAMERA (1): http://amzn.to/2D5Afuz\nCAMERA (2): http://amzn.to/2AU20QZ\nCAMERA (3): http://amzn.to/2mnLJhK\nMICROPHONE: http://amzn.to/1UmEaC8\nDRONE: http://amzn.to/2Fvr6ZT\n\nPATREON ► http://patreon.com/whatever', 'filename': 'REJECTION EXPERIMENT - GUYS VS GIRLS-DmP1ier3R30.mp4', 'formatid': '22', 'durationraw': 105}}};

                if (data.code === 1) {
                    const piecesLen = data.content.piecesResponses.length;

                    for (let i = 0; i < piecesLen; i++) {
                        const videoUrlRoot = '/public';
                        const filename = `${ data.content.id }${ i + 1 }.mp4`;
                        const $a = $('<a>').attr({'href': `${ videoUrlRoot }/${ data.content.id }/`, 'download': filename}).html(`&#x1F39E; - ${ filename }`);
                        const $li = $('<li>').addClass('list-group-item');

                        $li.append($a);
                        $list.append($li);
                    }

                    $thumbnailImg.attr('src', data.content.videoinfo.thumbnail);
                    $thumbnailTitle.html(data.content.videoinfo.title);
                    $thumbnailDescr.html(data.content.videoinfo.description).attr('title', data.content.videoinfo.description);

                    $thumbnailCard.removeClass('hidden');
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
        showToast('danger', '&#x26D4; not a valid youtube url or captcha is not filled...');
    }
});
