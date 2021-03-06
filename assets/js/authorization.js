let host = "http://127.0.0.1:8000/";
let tokenField = "token";

jQuery(document).ready(function($) {
    let $form_modal = $('.user-modal'),
        $form_login = $form_modal.find('#login'),
        $form_signup = $form_modal.find('#signup'),
        $form_forgot_password = $form_modal.find('#reset-password'),
        $form_modal_tab = $('.switcher'),
        $tab_login = $form_modal_tab.children('li').eq(0).children('a'),
        $tab_signup = $form_modal_tab.children('li').eq(1).children('a'),
        $forgot_password_link = $form_login.find('.form-bottom-message a'),
        $back_to_login_link = $form_forgot_password.find('.form-bottom-message a'),
        $main_nav = $('.main-nav');
    login_selected();

    //open modal
    $form_login.on('click', function (event) {

        if ($(event.target).is($main_nav)) {
            // on mobile open the submenu
            $(this).children('ul').toggleClass('is-visible');
        } else {
            // on mobile close submenu
            $main_nav.children('ul').removeClass('is-visible');
            //show modal layer
            $form_modal.addClass('is-visible');
            //show the selected form
            ($(event.target).is('.signup')) ? signup_selected() : login_selected();
        }

    });

    //close modal
    $form_modal.on('click', function (event) {
        if ($(event.target).is($form_modal) || $(event.target).is('.close-form')) {
            $form_modal.removeClass('is-visible');
        }
    });

    // //close modal when clicking the esc keyboard button
    // $(document).keyup(function(event){
    //     if(event.which=='27'){
    //       $form_modal.removeClass('is-visible');
    //     }
    //   });

    //switch from a tab to another
    $form_modal_tab.on('click', function (event) {
        event.preventDefault();
        ($(event.target).is($tab_login)) ? login_selected() : signup_selected();
    });

    //hide or show password
    $('.hide-password').on('click', function () {
        var $this = $(this),
            $password_field = $this.prev('input');

        ('password' == $password_field.attr('type')) ? $password_field.attr('type', 'text') : $password_field.attr('type', 'password');
        ('Show' == $this.text()) ? $this.text('Hide') : $this.text('Show');
        //focus and move cursor to the end of input field
        $password_field.putCursorAtEnd();
    });

    //show forgot-password form
    $forgot_password_link.on('click', function (event) {
        event.preventDefault();
        forgot_password_selected();
    });

    //back to login from the forgot-password form
    $back_to_login_link.on('click', function (event) {
        event.preventDefault();
        login_selected();
    });

    function login_selected() {
        $form_login.addClass('is-selected');
        $form_signup.removeClass('is-selected');
        $form_forgot_password.removeClass('is-selected');
        $tab_login.addClass('selected');
        $tab_signup.removeClass('selected');
    }

    function signup_selected() {
        $form_login.removeClass('is-selected');
        $form_signup.addClass('is-selected');
        $form_forgot_password.removeClass('is-selected');
        $tab_login.removeClass('selected');
        $tab_signup.addClass('selected');
    }

    function forgot_password_selected() {
        $form_login.removeClass('is-selected');
        $form_signup.removeClass('is-selected');
        $form_forgot_password.addClass('is-selected');
    }

    $form_login.find('input[type="submit"]').on('click', function (event) {
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: host + "rest-auth/login/",
            contentType: "application/json; charset=utf-8",
            // dataType: "json",
            data: JSON.stringify({
                "username": $("#signin-username").val(),
                "password": $("#signin-password").val(),
                "email": ""
            }),
            statusCode: {
                200: function (xhr) {
                    $form_login.find('input[type="text"]').removeClass('has-error')
                        .next('span').removeClass('is-visible');
                    $form_login.find('input[type="password"]').removeClass('has-error')
                        .next('span').removeClass('is-visible');
                    console.log(JSON.stringify(xhr.responseText));
                    $.cookie(tokenField, JSON.stringify(xhr.responseText));
                },
                500: function () {
                    $form_login.find('input[type="text"]').removeClass('has-error')
                        .next('span').removeClass('is-visible');
                    $form_login.find('input[type="password"]').removeClass('has-error')
                        .next('span').removeClass('is-visible');
                    // IPMAN TODO: change
                    alert("Internal server error");
                },
                400: function () {
                    $form_login.find('input[type="text"]').toggleClass('has-error')
                        .next('span').toggleClass('is-visible');
                    $form_login.find('input[type="password"]').toggleClass('has-error')
                        .next('span').toggleClass('is-visible');
                },
                401: function () {
                    $form_login.find('input[type="text"]').toggleClass('has-error')
                        .next('span').toggleClass('is-visible');
                    $form_login.find('input[type="password"]').toggleClass('has-error')
                        .next('span').toggleClass('is-visible');
                }
            },
        });
    });


    $form_signup.find('input[type="submit"]').on('click', function (event) {
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: host + "rest-auth/registration/",
            contentType: "application/json; charset=utf-8",

            data: JSON.stringify({
                "username": $("#signup-username").val(),
                "password1": $("#signup-password1").val(),
                "password2": $("#signup-password2").val(),
                "email": $("#signup-email").val(),
            }),
            success: function(response) {
                alert(response["key"]);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                status = jqXHR.status;
                // IPMAN TODO: change
                switch (jqXHR.status) {
                    case 500:
                        alert("Internal server error");
                        break;
                    case 400:
                        alert("Given data is wrong");
                        break;
                }

                responseText = jqXHR.responseText;

                alert(jqXHR.status);
                alert(jqXHR.responseText);
                alert(textStatus);
                alert(errorThrown.response);
            }
            // statusCode: {
            //     200: function () {
            //         alert('EEE');
            //         $form_login.find('input[type="text"]').removeClass('has-error')
            //             .next('span').removeClass('is-visible');
            //         $form_login.find('input[type="password"]').removeClass('has-error')
            //             .next('span').removeClass('is-visible');
            //         alert("Eeee");
            //     },
            //     500: function () {
            //         $form_login.find('input[type="text"]').removeClass('has-error')
            //             .next('span').removeClass('is-visible');
            //         $form_login.find('input[type="password"]').removeClass('has-error')
            //             .next('span').removeClass('is-visible');
            //         // IPMAN TODO: change
            //         alert("Gabella");
            //     },
            //     400: function () {
            //         // $form_login.find('input[type="text"]').toggleClass('has-error')
            //         //     .next('span').toggleClass('is-visible');
            //         // $form_login.find('input[type="password"]').toggleClass('has-error')
            //         //     .next('span').toggleClass('is-visible');
            //     },
            //     401: function () {
            //         // $form_login.find('input[type="text"]').toggleClass('has-error')
            //         //     .next('span').toggleClass('is-visible');
            //         // $form_login.find('input[type="password"]').toggleClass('has-error')
            //         //     .next('span').toggleClass('is-visible');
            //     }
            // },
        });
    });

});

//credits https://css-tricks.com/snippets/jquery/move-cursor-to-end-of-textarea-or-input/
jQuery.fn.putCursorAtEnd = function() {
  return this.each(function() {
      // If this function exists...
      if (this.setSelectionRange) {
          // ... then use it (Doesn't work in IE)
          // Double the length because Opera is inconsistent about whether a carriage return is one character or two. Sigh.
          var len = $(this).val().length * 2;
          this.setSelectionRange(len, len);
      } else {
        // ... otherwise replace the contents with itself
        // (Doesn't work in Google Chrome)
          $(this).val($(this).val());
      }
  });
};



