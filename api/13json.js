// Initialize the page and load the necessary resources
function init(){
    document.siteName = $('title').html();
    $('body').addClass("mdui-theme-primary-"+main_color+" mdui-theme-accent-"+accent_color);
    var html = "";
    html += `
    <header >
 	  <div id="nav">
  	  </div>
	</header>
        <div>
			<div id="content">
		</div>`;
    $('body').html(html);
}

function render(path){
	if(path.indexOf("?") > 0){
		path = path.substr(0,path.indexOf("?"));
	}
    if(path.substr(-1) == '/'){
    	list(path);
    }
    if(path.indexOf("home") > 0){
		gohome();
	}else{
	    file(path);
    }
}





// List files
function list(path){
    var content = "";
	content += ` 
  <div class="container-fluid">
  <h5 id="folderne"><input type="text" id="folderne" class="form-control" placeholder="Current Path: Homepage" value="" readonly><script>document.getElementById("folderne").innerHTML='Current Folder: '+decodeURI(this.window.location.href.substring(window.location.href.lastIndexOf('/',window.location.href.lastIndexOf('/')-1))).replace('/','').replace('/','');</script>
  </h5>
      <div id="list" class="row">
      </div>
  </div>
  <div class="card">
  <div id="readme_md" style="display:none; padding: 20px 20px;"></div>
  </div>
	`;
	$('#content').html(content);
    $('#list').html(`<div class="mdui-progress"><div class="mdui-progress-indeterminate"></div></div>`);
    $('#readme_md').hide().html('');
    $('#head_md').hide().html('');
    $.post(path, function(data,status){
        var obj = jQuery.parseJSON(data);
        if(typeof obj != 'null'){
            list_files(path,obj.files);
        }
    });
}

function list_files(path,files){
    html = "";
	console.log("pgno check2 is",pgno);
    var files =  files.splice(pgno*15, 15);
    console.log(files);
    for(i in files){
        var item = files[i];
        var p = path+item.name+'/';
        if(item['size']==undefined){
            item['size'] = "";
        }
        item['size'] = formatFileSize(item['size']);
        if(item['mimeType'] == 'application/vnd.google-apps.folder'){
        	html += `<div class="col-6 col-sm-4 col-md-3 col-lg-3 col-xl-3">
                        <a href="${p}" class="card">
                             <img class="card-img-top" src="https://redzone.fun/images/folder_dk_icon.png" style="height: 120px">
                                <div class="card-body">
                                <p class="card-text">${item.name}</p>
                                </div>
                         </a>
                     </div>
			                   `;
                        
        }else{
            var p = path+item.name;
            var c = "file";
            var ext = p.split('.').pop();
            var res = item['thumbnailLink'];
			var res = (res === undefined) ? 'https://cdn.jsdelivr.net/gh/Achrou/goindex-theme-acrou/public/images/airplane.gif' : res ;
            var res = res.replace("=s220","=s420");
            if("|html|php|css|go|java|js|json|txt|sh|md|mp4|webm|avi|bmp|jpg|jpeg|png|gif|m4a|mp3|wav|ogg|mpg|mpeg|mkv|rm|rmvb|mov|wmv|asf|ts|flv|".indexOf(`|${ext}|`) >= 0){
	            p += "?a=view";
	            c += " view";
            }
			html += `<div class="col-12 col-sm-4 col-md-3 col-lg-3 col-xl-3">
                        <a href="${p}" class="card">
                             <img class="card-img-top" src="${res}">
                                <div class="card-body">
                                <p class="card-text">${item.name}<br>Size:${item['size']}</p>
                                </div>
                         </a>
                     </div>
			`;
        }
    }
    $('#list').html(html);
}

//delete before check
function get_file(path, file, callback){
	var key = "file_path_"+path+file['modifiedTime'];
	var data = localStorage.getItem(key);
	if(data != undefined){
		return callback(data);
	}else{
		$.get(path, function(d){
			localStorage.setItem(key, d);
            callback(d);
        });
	}
}


function searchOnlyActiveDir() {
	var e, t, n, l;
	for (e = document.getElementById("searchInput").value.toUpperCase(), t = document.getElementById("list").getElementsByTagName("li"), l = 0; l < t.length; l++)((n = t[l].getElementsByTagName("a")[0]).textContent || n.innerText).toUpperCase().indexOf(e) > -1 ? t[l].style.display = "" : t[l].style.display = "none"
}

// bytes conversion to KB, MB, GB
function formatFileSize(bytes) {
    if (bytes>=1000000000) {bytes=(bytes/1000000000).toFixed(2)+' GB';}
    else if (bytes>=1000000)    {bytes=(bytes/1000000).toFixed(2)+' MB';}
    else if (bytes>=1000)       {bytes=(bytes/1000).toFixed(2)+' KB';}
    else if (bytes>1)           {bytes=bytes+' bytes';}
    else if (bytes==1)          {bytes=bytes+' byte';}
    else                        {bytes='';}
    return bytes;
}

String.prototype.trim = function (char) {
    if (char) {
        return this.replace(new RegExp('^\\'+char+'+|\\'+char+'+$', 'g'), '');
    }
    return this.replace(/^\s+|\s+$/g, '');
};

// start 2nd page
// file display ?a=view
function file(path){
	var name = path.split('/').pop();
	var ext = name.split('.').pop().toLowerCase().replace(`?a=view`,"");
	if("|html|php|css|go|java|js|json|txt|sh|md|".indexOf(`|${ext}|`) >= 0){
		return file_code(path);
	}

	if("|mp4|webm|avi|".indexOf(`|${ext}|`) >= 0){
		return file_video(path);
	}

	if("|mpg|mpeg|mkv|rm|rmvb|mov|wmv|asf|ts|flv|".indexOf(`|${ext}|`) >= 0){
		return file_video(path);
	}
	
	if("|mp3|wav|ogg|m4a|".indexOf(`|${ext}|`) >= 0){
		return file_audio(path);
	}

	if("|bmp|jpg|jpeg|png|gif|".indexOf(`|${ext}|`) >= 0){
		return file_image(path);
	}
}

// file display video |mp4|webm|avi|
function file_video(path){
	var url = window.location.origin + path;
	var playBtn = `
      <button class="mdui-btn mdui-ripple mdui-color-theme-accent" mdui-menu="{target:'#external-player'}">
        <i class="mdui-icon material-icons">&#xe039;</i> Play in External Player
	  </button>
	  <ul class="mdui-menu" id="external-player">`;
	if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) {
		playBtn += `
		<li class="mdui-menu-item"><a href="intent:${url}#Intent;package=com.mxtech.videoplayer.ad;S.title=${path};end" class="mdui-ripple">MX Player</a></li>
		<li class="mdui-menu-item"><a href="intent:${url}#Intent;package=com.mxtech.videoplayer.pro;S.title=${path};end" class="mdui-ripple">MX Player Pro</a></li>
		<li class="mdui-menu-item"><a href="vlc://${url}" class="mdui-ripple">VLC</a></li>`;
	}else{
		playBtn += `
		<li class="mdui-menu-item"><a href="potplayer://${url}" class="mdui-ripple">PotPlayer</a></li>
		<li class="mdui-menu-item"><a href="vlc://${url}" class="mdui-ripple">VLC</a></li>`;
	}
	playBtn += `</ul>`;
	var content = `
<div class="mdui-container-fluid">
	<br>
	<video id="player" class="mdui-video-fluid mdui-center" preload controls>
	  <source src="${url}" type="video/mp4">
	</video>
	<br>${playBtn}
	<!-Fixed label->
	<div class="mdui-textfield">
	  <label class="mdui-textfield-label">download link</label>
	  <input class="mdui-textfield-input" type="text" value="${url}"/>
	</div>
	<div class="mdui-textfield">
	  <label class="mdui-textfield-label">HTML reference</label>
	  <textarea class="mdui-textfield-input"><video><source src="${url}" type="video/mp4"></video></textarea>
	</div>
</div>
<a href="${url}" class="mdui-fab mdui-fab-fixed mdui-ripple mdui-color-theme-accent"><i class="mdui-icon material-icons">file_download</i></a>
	`;
	$('#content').html(content);
	const player = new Plyr('#player');
	window.player = player;
}
// file display |html|php|css|go|java|js|json|txt|sh|md|
function file_code(path){
	var type = {
		"html":"html",
		"php":"php",
		"css":"css",
		"go":"golang",
		"java":"java",
		"js":"javascript",
		"json":"json",
		"txt":"Text",
		"sh":"sh",
		"md":"Markdown",	
	};
	var name = path.split('/').pop();
	var ext = name.split('.').pop();
	var href = window.location.origin + path;
	var content = `
<div class="mdui-container">
<pre id="editor" ></pre>
</div>
<div class="mdui-textfield">
	<label class="mdui-textfield-label">Download link</label>
	<input class="mdui-textfield-input" type="text" value="${href}"/>
</div>
<a href="${href}" class="mdui-fab mdui-fab-fixed mdui-ripple mdui-color-theme-accent"><i class="mdui-icon material-icons">file_download</i></a>
<script src="https://cdn.staticfile.org/ace/1.4.7/ace.js"></script>
<script src="https://cdn.staticfile.org/ace/1.4.7/ext-language_tools.js"></script>
	`;
	$('#content').html(content);
	
	$.get(path, function(data){
		$('#editor').html($('<div/>').text(data).html());
		var code_type = "Text";
		if(type[ext] != undefined ){
			code_type = type[ext];
		}
		var editor = ace.edit("editor");
	    editor.setTheme("ace/theme/ambiance");
	    editor.setFontSize(18);
	    editor.session.setMode("ace/mode/"+code_type);
	    
	    //Autocompletion
	    editor.setOptions({
	        enableBasicAutocompletion: true,
	        enableSnippets: true,
	        enableLiveAutocompletion: true,
	        maxLines: Infinity
	    });
	});
}
// file display music |mp3|m4a|wav|ogg|
function file_audio(path){
	var url = window.location.origin + path;
	var content = `
<div class="mdui-container-fluid">
	<br>
	<audio class="mdui-center" preload controls>
	  <source src="${url}"">
	</audio>
	<br>
	<!-Fixed label->
	<div class="mdui-textfield">
	  <label class="mdui-textfield-label">Download link</label>
	  <input class="mdui-textfield-input" type="text" value="${url}"/>
	</div>
	<div class="mdui-textfield">
	  <label class="mdui-textfield-label">HTML reference</label>
	  <textarea class="mdui-textfield-input"><audio><source src="${url}"></audio></textarea>
	</div>
</div>
<a href="${url}" class="mdui-fab mdui-fab-fixed mdui-ripple mdui-color-theme-accent"><i class="mdui-icon material-icons">file_download</i></a>
	`;
	$('#content').html(content);
}
// picture display
function file_image(path){
	var url = window.location.origin + path;
	var content = `
<div class="mdui-container-fluid">
	<br>
	<img class="mdui-img-fluid" src="${url}"/>
	<br>
	<div class="mdui-textfield">
	  <label class="mdui-textfield-label">Download link</label>
	  <input class="mdui-textfield-input" type="text" value="${url}"/>
	</div>
	<div class="mdui-textfield">
	  <label class="mdui-textfield-label">HTML references</label>
	  <input class="mdui-textfield-input" type="text" value="<img src='${url}' />"/>
	</div>
        <div class="mdui-textfield">
	  <label class="mdui-textfield-label">Markdown Reference</label>
	  <input class="mdui-textfield-input" type="text" value="![](${url})"/>
	</div>
        <br>
</div>
<a href="${url}" class="mdui-fab mdui-fab-fixed mdui-ripple mdui-color-theme-accent"><i class="mdui-icon material-icons">file_download</i></a>
	`;
	$('#content').html(content);
}
//end 2nd page

// start home page goto gome
function gohome(){
	var content = `
<style>
html,body,iframe { 
    margin: 0px; 
    padding: 0px; 
    height: 100%; 
    border: none; 
} 
.responsive-iframe {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  border: none;
}
</style>
	<iframe class="responsive-iframe" src="https://divmovies.com/file.html"></iframe>
    `;
	$('#content').html(content);
}
// end home page

// Listen for fallback events
window.onpopstate = function(){
	console.log("1st");
	console.log(window);
	console.log(window.location);
    var path = window.location.pathname;
    render(path);
}

$(function(){
    init();
    console.log("2nd");
	var check1 = window.location.search;
	if (check1.substr(check1.indexOf("p=")+2)) {
		pgno = check1.substr(check1.indexOf("p=")+2)-1;
		console.log("pgno check1 is",pgno);
	} else {
		pgno = 0;
		console.log("nothing in pgno");
	}
    var path = window.location.pathname;
    $("body").on("click",'.folder',function(){
        var url = $(this).attr('href');
        history.pushState(null, null, url);
        render(url);
        return false;
    });

    $("body").on("click",'.view',function(){
        var url = $(this).attr('href');
        history.pushState(null, null, url);
        render(url);
        return false;
    });
    
    render(path);
});