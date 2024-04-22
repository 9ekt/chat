

$(function () {
    $(".create-profile").hide();
    $(".online-playerbox-template").hide();
    console.log('Hello friend. Welcome to your browsers console :)');
    $(".messages-footer-image").css('background-image', `url(https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg)`)
    $(".messages-footer-image").css('background-size', "40px 40px")
    $(".messages-footer-image").css('border-radius', "100%")
    var username;
    var profilepictureCDN = "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";
    var channel;
    let scrollableDiv = document.getElementById('chatbox');
    var chatSystem = $(".chat-inner2"); 
    var msgBox = $(".message-box-template");
    var onlineUsers = $('.online-holder-468b');
    var onlineCount = $('.text-container-online-members')

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

                $(newMsgBox).attr( "class", "message-box")

                newMsgBox.show();

                updateOnlineUsers()
            })

            channel.listen("system:member_left", function (data) {
                var newMsgBox = msgBox.clone();
                newMsgBox.prependTo(chatSystem);

                $(newMsgBox).find(".username-usrbox").text('User left')
                $(newMsgBox).find(".username-messagebox").text(`${data.member.user} left the chat.`)

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
                } else {
                    $(newMsgBox).find(".profile-picture").css("background-image", `url(https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg)`)
                }
                

                $(newMsgBox).attr("class", "message-box")

                newMsgBox.show();
                scrollToBottom()

            })

        });
    }

    createProfile = function () {
        $(".messages-send-input").prop('disabled', true);
        $(".create-profile").show();


        $(".btn-connect").click(function (e) {
            username = $(".messages-create-username").val()
            profilepictureCDN = $(".messages-create-profilepicture").val()

            $(".messages-footer-user-name").text(username)
            $(".messages-footer-image").css('background-image', `url(${profilepictureCDN})`)
            $(".messages-footer-image").css('background-size', "40px 40px")
            $(".messages-footer-image").css('border-radius', "100%")
            $(".messages-footer-userpfp").css('background-size', "50px 50px")

            if (username.length > 2 && username.length < 20) {
                $(".create-profile").hide()
                $(".messages-send-input").prop('disabled', false);
                joinChatRoom()
            }
        });
    }

    $('.messages-send-input').keypress(function(event){
	
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            sendMessage($('.messages-send-input').val())
            $(".messages-send-input").val("");
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
              return '<a style="color: #0B8DCF" target="_blank" href=" ' + url + '">' + url + '</a>';
            })
            // or alternatively
            // return text.replace(urlRegex, '<a href="$1">$1</a>')
          }

    updateOnlineUsers = function() {
        $('.online-holder-468b').children().not(':first').remove();

        var members = channel.members;

        onlineCount.text(`Members - ${members.length + 1}`)

        for (let i = 0; i < members.length; i++) {
            var tmpname = members[i]['user'];

            var newOnlineBox = $("#sideprofile").clone();
            newOnlineBox.appendTo(onlineUsers);

            $(newOnlineBox).find(".username-usrbox").text(tmpname)
            $(newOnlineBox).find(".messages-member-image-dnd").attr("class", "messages-member-image-online")
            $(newOnlineBox).find(".header-group-icon").attr('src', 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg')

            $(newOnlineBox).attr( "class", "header-friends-side")

            newOnlineBox.show();

        }
    }



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


