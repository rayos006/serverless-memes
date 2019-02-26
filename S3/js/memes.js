// ******************************************** PRODUCTS SECTION ***************************************************
$(document).ready(function () {
    home()
});

function home() {
    $('#memeListings').empty()
    $.ajax({
        type: "GET",
        
        url: "https://pohxvl7ss0.execute-api.us-west-2.amazonaws.com/dev/meme", // CHANGE ME
        error: function () {
            alert("Failed to get Elements")
        },
        success: function (data) {
            console.log(data)
            for (i = 0; i < data.length; i++) {
                $('#memeListings').append('<div class="column"><div class="ui segment"><div class="ui grid"><div class="sixteen wide column"><img id="' + data[i]['meme_id'] + '" src="./images/' + data[i]['meme_id'] + '" height="300" width="300" onclick="showMeme(this.id)" style="cursor: pointer; margin-bottom: 1em"><div><i class="user circle icon"></i>' + data[i]['username'] + '<div style="float:right;" class="ui label">' + data[i]['likes'] + '<a id="' + data[i]['meme_id'] + '_likes" onclick="likeMeme(this.id)" class="' + data[i]['meme_id'] + '_likes"><i style="margin-left:7px;" class="thumbs up outline icon"></i></div></div></div></div></div>');
            }
        }
    })
}

function showMeme(meme_id) {
    $('.special.modal.showMeme')
        .modal({
            centered: false,
        })
        .modal('show')
        ;
    $.ajax({
        type: "GET",
        url: "https://pohxvl7ss0.execute-api.us-west-2.amazonaws.com/dev/meme/" + meme_id, // CHANGE ME
        error: function () {
            alert("Failed to get Elements")
        },
        success: function (data) {
            console.log(data)
            $('#MemeName').empty()
            $('#MemeName').append(data['name'])
            $('#BigMeme').html('<img style="margin-left: 6%;" id="' + data['meme_id'] + '" src="./images/' + data['meme_id'] + '" height="750" width="750"><div><i class="user circle icon"></i>' + data['username'] + '<div style="float:right;" class="ui label">' + data['likes'] + '<a id="' + data['meme_id'] + '_likes" onclick="likeMeme(this.id)" class="' + data['meme_id'] + '_likes"><i style="margin-left:7px;" class="thumbs up outline icon"></i></div>')
        }
    })
}

function likeMeme(test) {
    string = test.split("_");
    meme_id = string[0]
    $.ajax({
        type: "PUT",
        url: "https://pohxvl7ss0.execute-api.us-west-2.amazonaws.com/dev/meme/" + meme_id, // CHANGE ME
        meme_id: meme_id,
        test: test,
        error: function () {
            alert("Failed to get Elements")
        },
        success: function (data) {
            console.log(data)
            newLike = data
            $('#' + test).parent().html(newLike + '<a id="' + meme_id + '_likes" onclick="likeMeme(this.id)" class="' + meme_id + '_likes"><i style="margin-left:7px;" class="thumbs up outline icon"></i>')
        }
    });
}

function upload_meme(){
    $('.special.modal.upload_meme')
        .modal({
            centered: false,
            onHidden: function () {
                $(".username").val("")
                $(".name").val("")
                $(".file_to_upload").val("")
            }
        })
        .modal('show')
        ;
}

// Catch the form submit and upload the files
function create_meme() {
    var fileList = document.getElementById("file_to_upload").files;
    var fileReader = new FileReader();
    if (fileReader && fileList && fileList.length) {
        fileReader.readAsArrayBuffer(fileList[0]);
        fileReader.onload = function () {
            var imageData = fileReader.result;
            var base64 = btoa(
                new Uint8Array(imageData)
                    .reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            send_it(base64)
        };
    }

}

function send_it(base64){
    username = $('.username').val()
    name = $('.name').val()

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://pohxvl7ss0.execute-api.us-west-2.amazonaws.com/dev/meme", // CHANGE ME
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "processData": false,
        "data": '{\n\t\"username\": \"' + username + '\",\n\t\"name\": \"' + name + '\",\n\t\"pic\": \"' + base64 + '\"\n}'
    }

    $.ajax(settings).done(function (response) {
        console.log(response)
        if(response != null){
            $('.ui.naughty.basic.modal')
                .modal({
                    onHidden : function(){
                        $("#naughty_reason").text("Your photo has been flagged for the following reasons: ")
                    }
                })
                .modal('show')
                ;
        response.forEach(element => {
            console.log(element['Name'])
            $("#naughty_reason").append("</br>" + element['Name'] )
        });
        }
        else{
            home()
        }
    });
}
