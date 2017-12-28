function check_connection(){
    document.addEventListener("offline", alert_offline(), false);
}
function alert_offline(){
    alert("no conn");
}
function is_logged_in(){
    var logged_in=localStorage.logged_in;
    if(logged_in==1){
        document.getElementById('login-button').style.visibility = "hidden";
    }else{
        document.getElementById('login-pop-up').click();
    }
}
function reset(){
    localStorage.clear();
    window.location = "index.html";
    document.getElementById('login-pop-up').click();
}

// function prevent_home(){
//     document.getElementById('login-button').click();
// }
function login () {
	$('#form-login').submit(function(){
        $.ajax({
            type: 'POST',
            data: $(this).serialize(),
           // url: 'http://lapor.arjuna64.dynu.com/index.php/ws/users/login',
            url: 'http://localhost/lapor-www/index.php/ws/users/login',
            success: function(data){
                //console.log(data['first_name']);
                if(data=="error"){
                    alert("Verifikasi login gagal :(");
                }else{
                    localStorage.setItem("logged_in", "1");
                    localStorage.setItem("id_user", data['id']);
                    localStorage.setItem("nama_depan", data['first_name']);
                    localStorage.setItem("nama_belakang", data['last_name']);
                    //alert("sucsess");
                    var nama_user=localStorage.nama_depan+" "+localStorage.nama_belakang;
                    document.getElementById("nama_user").innerHTML = nama_user;
                    document.getElementById('close_login').click();
                    
                    //document.getElementById('laporan').click();
                    //document.getElementById('close-login').click();
                    //window.location = "index.html";
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
               //alert(xhr.status);
               //alert(xhr.responseText);
               //alert(thrownError);
               alert("Koneksi Server Gagal!");
            }
        });
        return false;
    }); 
}

function register(){
	$('#form-register').submit(function(){
        $.ajax({
            type: 'POST',
            data: $(this).serialize(),
           // url: 'http://lapor.arjuna64.dynu.com/index.php/ws/users/register',
            url: 'http://localhost/lapor-www/index.php/ws/users/register',
            success: function(data){
                console.log(data);
                //alert("sucsess");
                if(data=="Registrasi berhasil"){
                    document.getElementById('close-register').click();  
                    window.location = "index.html";  
                }else if(data=="username_taken"){
                    alert("Username sudah ada");
                }else{
                    alert("server error");
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
               alert("Berhasil Mendaftar");
               document.getElementById('close-register').click();  
               window.location = "index.html";
            }
        });
        return false;
    });	
}

function ambil_semua_laporan(){
    //localStorage.setItem('user_post', "0");
    $.ajax({
            type: 'POST',
            data: {'ambil':'semua'},
            url: 'http://localhost/lapor-www/index.php/ws/lapor/ambil_laporan',
            success: function(data){
                localStorage.setItem('post_data', JSON.stringify(data));
                console.log(data);
                //document.getElementById('laporan').click();
                tampilkan_semua()
            },
            error: function (xhr, ajaxOptions, thrownError) {
               //alert(xhr.status);
               //alert(xhr.responseText);
               //alert(thrownError);
               alert("Perikasa koneksi anda");
            }
    });
}

function ambil_laporan_user(){
    var id_user=localStorage.id_user;
    //localStorage.setItem('user_post', "1");
    $.ajax({
            type: 'POST',
            data: {'ambil' : id_user},
            url: 'http://localhost/lapor-www/index.php/ws/lapor/ambil_laporan',
            success: function(data){
                localStorage.setItem('post_data_user', JSON.stringify(data));
                console.log(data);
                tampilkan_laporan_user();
            },
            error: function (xhr, ajaxOptions, thrownError) {
               //alert(xhr.status);
               //alert(xhr.responseText);
               //alert(thrownError);
               alert("Perikasa koneksi anda");
            }
    });
}


function tampilkan_semua(){
    var data=[];
    if(localStorage.post_data){
        data=JSON.parse(localStorage.post_data);
        $.each(data, function(i,item){ 
            var username_id = item.id_username;
            var username = function () {
            var tmp = null;
            $.ajax({
                async: false,
                type: "POST",
                global: false,
                url: 'http://localhost/lapor-www/index.php/ws/lapor/id_to_username',
                data: {'id': username_id},
                success: function (data) {
                    tmp = data;
                }
            });
            return tmp;
            }();
            var subdes=item.deskripsi.substr(0, 30);
            $('#post_list').append("<li><div class='post_entry'><div class='post_date'><span class='day'><img src='images/icons/blue/userw.png'/></span><span>"+username+"</span></div><div class='post_title'><h2><a href='blog-single.html' onclick=ambil_satu("+item.idx+");>"+item.judul+"</a></h2><p><a href='blog-single.html' onclick=ambil_satu("+item.idx+");>"+subdes+"</a><p></div></div></li>");
            //console.log(item);
        });
    }
}

function tampilkan_laporan_user(){
    var datax=[];
    if(localStorage.post_data){
        datax=JSON.parse(localStorage.post_data_user);
        $.each(datax, function(i,item){ 

            var username_id = item.id_username;
            var username = function () {
            var tmp = null;
            $.ajax({
                async: false,
                type: "POST",
                global: false,
                url: 'http://localhost/lapor-www/index.php/ws/lapor/id_to_username',
                data: {'id': username_id},
                success: function (data) {
                    tmp = data;
                }
            });
            return tmp;
            }();

            var subdes=item.deskripsi.substr(0, 30);
            $('#post_list').append("<li><div class='post_entry'><div class='post_date'><span class='day'><img src='images/icons/blue/userw.png'/></span><span>"+username+"</span></div><div class='post_title'><h2><a href='blog-single.html' onclick=ambil_satu("+item.idx+");>"+item.judul+"</a></h2><p><a href='blog-single.html' onclick=ambil_satu("+item.idx+");>"+subdes+"</a><p></div></div></li>");
            //console.log(item);
        });
    }
}


function ambil_satu(id){
    $.ajax({
        type: 'POST',
        data: {'id': id},
        url: 'http://localhost/lapor-www/index.php/ws/lapor/ambil_detail_laporan',
        success: function(data){
            console.log(data);
            localStorage.setItem('satu_laporan', JSON.stringify(data));
            tampilkan_satu();
        },
        error: function (xhr, ajaxOptions, thrownError){
           //alert(xhr.status);
           //alert(xhr.responseText);
           //alert(thrownError);
           alert("Perikasa koneksi anda");
        }
    });
}

function ambil_kategori(){
    $.ajax({
        type: 'POST',
        data: {'ambil':'kategori'},
        url: 'http://localhost/lapor-www/index.php/ws/lapor/ambil_kategori',
        success: function(data){
            localStorage.setItem('kategori', JSON.stringify(data));
            pilih_kategori();
        },
        error: function (xhr, ajaxOptions, thrownError) {
           //alert(xhr.status);
           //alert(xhr.responseText);
           //alert(thrownError);
           alert("Perikasa koneksi anda");
        }
    });
}

function tampilkan_satu(){
    var kategori="";
    var status="";
    var username="";
    if(localStorage.post_data){
        d=JSON.parse(localStorage.satu_laporan);
        var kategori_id = d.id_kategori;
        var kategori = function () {
            var tmp = null;
            $.ajax({
                async: false,
                type: "POST",
                global: false,
                url: 'http://localhost/lapor-www/index.php/ws/lapor/id_to_kategori',
                data: {'id': kategori_id},
                success: function (data) {
                    tmp = data;
                }
            });
            return tmp;
        }();
        var status_id = d.status_id;
        var status = function () {
            var tmp = null;
            $.ajax({
                async: false,
                type: "POST",
                global: false,
                url: 'http://localhost/lapor-www/index.php/ws/lapor/id_to_status',
                data: {'id': status_id},
                success: function (data) {
                    tmp = data;
                }
            });
            return tmp;
        }();
        var username_id = d.id_username;
        var username = function () {
            var tmp = null;
            $.ajax({
                async: false,
                type: "POST",
                global: false,
                url: 'http://localhost/lapor-www/index.php/ws/lapor/id_to_username',
                data: {'id': username_id},
                success: function (data) {
                    tmp = data;
                }
            });
            return tmp;
        }();
    }
    document.getElementById("judul_laporan").innerHTML = d.judul;
    document.getElementById("deskripsi_laporan").innerHTML = d.deskripsi;
    document.getElementById("alamat").innerHTML = d.alamat;
    document.getElementById("kategori").innerHTML = kategori;
    document.getElementById("status").innerHTML = status;
    document.getElementById("tanggal").innerHTML = d.tanggal;
    document.getElementById("pelapor").innerHTML = username;

    //console.log(kategori);
    //console.log(status);
}
function pilih_kategori(){
    var data=[];
    if(localStorage.post_data){
        data=JSON.parse(localStorage.kategori);
        $.each(data, function(i,item){ 
            $('#kategori').append("<option value="+item.idx+">"+item.displayx+"</option>");
            console.log(item);
        });
    }
}

function kirim_laporan(){
    var id_user=localStorage.id_user;
    $('#form-laporan').submit(function(){
        $.ajax({
            type: 'POST',
            data: $(this).serialize()+'&id_user='+id_user,
            url: 'http://localhost/lapor-www/index.php/lapor/ajukan_laporan',
            success: function(data){
                //console.log(data);
                alert("Laporan Terkirim !!");
                window.location = "index.html"
            },
            error: function (xhr, ajaxOptions, thrownError) {
               //alert(xhr.status);
               //alert(xhr.responseText);
               //alert(thrownError);
               alert("Perikasa koneksi anda");
            }
        });
        return false;
    }); 
}
/*
var deviceReady = false;
var fileName='';
//init();
function takePicture() {
    navigator.camera.getPicture(
        function(uri) {
            var img = document.getElementById('camera_image');
            img.style.visibility = "visible";
            img.style.display = "block";
            img.src = uri;
            document.getElementById('camera_status').innerHTML = "Success";
        },
        function(e) {
            console.log("Error getting picture: " + e);
            document.getElementById('camera_status').innerHTML = "Error getting picture.";
        },
        { quality: 50, destinationType: navigator.camera.DestinationType.FILE_URI});
};

function selectPicture() {
        navigator.camera.getPicture(
            function(uri) {
                var img = document.getElementById('camera_image');
                img.style.visibility = "visible";
                img.style.display = "block";
                img.src = uri;
                document.getElementById('camera_status').innerHTML = "Success";
                window.location.hash = "#page2";
            },
            function(e) {
                console.log("Error getting picture: " + e);
                document.getElementById('camera_status').innerHTML = "Error getting picture.";
            },
            { quality: 50, targetWidth: 1153, targetHeight: 385, destinationType: navigator.camera.DestinationType.FILE_URI, sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY});
    };

function uploadPicture() {
            // Get URI of picture to upload
            var img = document.getElementById('camera_image');
            var imageURI = img.src;
            fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
            if (!imageURI || (img.style.display == "none")) {
                document.getElementById('camera_status').innerHTML = "Take picture or select picture from library first.";
                return;
            }
            
            // Verify server has been entered
            //server = document.getElementById('serverUrl').value;
            var server = 'http://36.73.23.190/index.php/lapor/do_upload';
            if (server) {
                
                // Specify transfer options
                var options = new FileUploadOptions();
                options.fileKey="userfile";
                options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
                options.mimeType="image/jpeg";
                options.chunkedMode = false;
                options.headers = {
                    Connection: "close"
                };
                // Transfer picture to server
                var ft = new FileTransfer();
                ft.upload(imageURI, encodeURI(server), function(r) {
                    document.getElementById('camera_status').innerHTML = "Upload successful: "+r.bytesSent+" bytes uploaded.";              
                }, function(error) {
                    document.getElementById('camera_status').innerHTML = "Upload failed: Code = "+error.code;               
                }, options);
            }
        };
var deviceReady = false;
function init() {
    document.addEventListener("deviceready", function() {deviceReady = true;}, false);
    window.setTimeout(function() {
        if (!deviceReady) {
            alert("Error: PhoneGap did not initialize.  Demo will not run correctly.");
        }
    },2000);
}   
*/
/*
    var pictureSource;   // picture source
    var destinationType; // sets the format of returned value

    // Wait for device API libraries to load
    //
    document.addEventListener("deviceready",onDeviceReady,false);

    // device APIs are available
    //
    function onDeviceReady() {
        pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;
    }

    // Called when a photo is successfully retrieved
    //
    function onPhotoDataSuccess(imageData) {
      // Uncomment to view the base64-encoded image data
      // console.log(imageData);

      // Get image handle
      //
      var smallImage = document.getElementById('smallImage');

      // Unhide image elements
      //
      smallImage.style.display = 'block';

      // Show the captured photo
      // The in-line CSS rules are used to resize the image
      //
      smallImage.src = "data:image/jpeg;base64," + imageData;
    }

    // Called when a photo is successfully retrieved
    //
    function onPhotoURISuccess(imageURI) {
      // Uncomment to view the image file URI
      // console.log(imageURI);

      // Get image handle
      //
      var largeImage = document.getElementById('largeImage');

      // Unhide image elements
      //
      largeImage.style.display = 'block';

      // Show the captured photo
      // The in-line CSS rules are used to resize the image
      //
      largeImage.src = imageURI;
    }

    // A button will call this function
    //
    function capturePhoto() {
      // Take picture using device camera and retrieve image as base64-encoded string
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
        destinationType: destinationType.DATA_URL });
        
    }

    // A button will call this function
    //
    function capturePhotoEdit() {
      // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true,
        destinationType: destinationType.DATA_URL });
    }

    // A button will call this function
    //
    function getPhoto(source) {
      // Retrieve image file location from specified source
      navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
        destinationType: destinationType.FILE_URI,
        sourceType: source });
    }

    // Called if something bad happens.
    //
    function onFail(message) {
      alert('Failed because: ' + message);
    }

$(document).ready(function(){
    $('#form_submit').click(function(){
    
    var test  = $('.test').val();
    var test2 = $('.test2').val(); 
    
    //alert(test);
    //alert(test2);
     
   
    var file_data = $('#sortpicture').prop('files')[0];   
    var form_data = new FormData();                  
    form_data.append('file', file_data);
    //alert(form_data);    

   /*untuk ajax upload*/    
 /*   $.ajax({
                url: 'http://localhost/lapor-www/index.php/ws/lapor/do_upload', // point to server-side PHP script 
                dataType: 'html',  // what to expect back from the PHP script, if anything
                cache: false,
                contentType: false,
                processData: false,
                data: form_data,                         
                type: 'post',
                success: function(php_script_response){
                    alert(php_script_response); // display response from the PHP script, if any
                }
   
   
      });
      
     
      $.ajax({
          
                url: 'http://location/lapor-www/index.php/ws/lapor/lokasi', // point to server-side PHP script 
                dataType: 'html',  // what to expect back from the PHP script, if anything
                data: {"test":test,"test2":test2},                         
                type: 'post',
                success: function(php_script_response){
                    alert(php_script_response); // display response from the PHP script, if any
                }
      
      });
  
   });  

});
*/

$("#form-laporan").on('submit',(function(e) {
    e.preventDefault();
    $("#message").empty();
    $('#loading').show();
    $.ajax({
        url: 'http://localhost/lapor-www/index.php/lapor/Upload', // Url to which the request is send
        type: "POST",             // Type of request to be send, called as method
        data: new FormData(this), // Data sent to server, a set of key/value pairs (i.e. form fields and values)
        contentType: false,       // The content type used when sending data to the server.
        cache: false,             // To unable request pages to be cached
        processData:false,        // To send DOMDocument or non processed data file it is set to false
        success: function(data)   // A function to be called if request succeeds
        {
        $('#loading').hide();
        $("#message").html(data);
        }
    });
}));