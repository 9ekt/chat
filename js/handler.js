

$(function () {
    $(".create-profile").hide();
    $(".update-profilepicture").hide();
    $(".online-playerbox-template").hide();
    console.log('Hello friend. Welcome to your browsers console :)');

    var username;
    var profilepictureCDN;
    var channel;
    let scrollableDiv = document.getElementById('chatbox');
    var chatSystem = $(".chat-inner2"); 
    var msgBox = $(".message-box-template");
    var onlineUsers = $('.people-holder');
    msgBox.hide()

    var piesocket;

    joinChatRoom = function () {

        piesocket = new PieSocket.default({
            clusterId: "free.blr2",
            apiKey: "iMWoGrsCIA8SDkRn0FuPyd6dkTJW9jKTtbaFTLgZ",
            presence: true,
            consoleLogs: true,
            notifySelf: true,
            presence: true,
            userId: username,
        });

        piesocket.subscribe("chat-room").then(ch => {
            channel = ch;

            channel.listen("system:member_joined", function (data) {
                var newMsgBox = msgBox.clone();
                newMsgBox.prependTo(chatSystem);

                $(newMsgBox).find(".username-usrbox").text('User joined')
                $(newMsgBox).find(".username-messagebox").text(`${data.member.user} joined the chat.`)
                $(newMsgBox).find(".profile-picture").hide()

                $(newMsgBox).attr( "class", "message-box")

                newMsgBox.show();

                updateOnlineUsers()
            })

            channel.listen("system:member_left", function (data) {
                var newMsgBox = msgBox.clone();
                newMsgBox.prependTo(chatSystem);

                $(newMsgBox).find(".username-usrbox").text('User left')
                $(newMsgBox).find(".username-messagebox").text(`${data.member.user} left the chat.`)
                $(newMsgBox).find(".profile-picture").hide()

                $(newMsgBox).attr( "class", "message-box")

                newMsgBox.show();

                updateOnlineUsers()
            })

            channel.listen("new_message", function (data, meta) {
                var newMsgBox = msgBox.clone();
                newMsgBox.prependTo(chatSystem);

                $(newMsgBox).find(".username-messagebox").html(`${urlify(data.text)}`)
                $(newMsgBox).find(".username-usrbox").text(data.sender)

                if (data['pfp']) {
                    $(newMsgBox).find(".profile-picture").css("background-image", `url(${data['pfp']})`)
                }

                $(newMsgBox).attr("class", "message-box")

                newMsgBox.show();
                scrollToBottom()

                console.log(data)
            })

        });
    }

    createProfile = function () {
        $(".send-message").prop('disabled', true);
        $(".create-profile").show();


        $("#update-username").click(function (e) {
            username = $(".username-input").val()

            if (username.length > 2 && username.length < 20) {
                $(".create-profile").hide()
                $(".send-message").prop('disabled', false);
                joinChatRoom()
            }
        });
    }

    $('.send-message').keypress(function(event){
	
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            sendMessage($('.send-message').val())
            $(".send-message").val("");
        };
    });

    sendMessage = function (val) {
        channel.publish("new_message", {
            sender: username,
            text: val,
            pfp: profilepictureCDN,
        });
    }
 
    scrollToBottom = function() {
            scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
        };

    urlify = function(text) {
            var urlRegex = /https?:\/\/[^\s]+/;
            return text.replace(urlRegex, function(url) {
              return '<a style="color: #0B8DCF" href="' + url + '">' + url + '</a>';
            })
            // or alternatively
            // return text.replace(urlRegex, '<a href="$1">$1</a>')
          }

    updateOnlineUsers = function() {
        $('.people-holder').children().not(':first').remove();

        var members = channel.members;

        for (let i = 0; i < members.length; i++) {
            var tmpname = members[i]['user'];

            var newOnlineBox = $(".online-playerbox-template").clone();
            newOnlineBox.appendTo(onlineUsers);

            $(newOnlineBox).find(".username-usrbox").text(tmpname)

            $(newOnlineBox).attr( "class", "online-playerbox")

            newOnlineBox.show();

            console.log('done daddy')

        }

        console.log('updated')
    }

    $("#update-cdn").click(function (e) {
        profilepictureCDN = $(".profilepicture-input").val()

        $(".create-profile").show();
        $(".update-profilepicture").hide()
    });


    $("body").on("click",function(e){
        if (e.target.id == 'profile-pic-edit') {
            $(".create-profile").hide();
            $(".update-profilepicture").show()
        } 
    });

    $(".profilepicture-input").on( 
        "propertychange change keyup paste input", function(d) { 
            $('.profile-picture-preview').css("background-image", `url(${$(".profilepicture-input").val()})`)
            $('.profile-picture-create').css("background-image", `url(${$(".profilepicture-input").val()})`)
      });

    createProfile()
})


