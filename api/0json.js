/**
 * Combined by jsDelivr.
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
/*! jQuery v3.2.1 | (c) JS Foundation and other contributors | jquery.org/license */

// resources from divmovies
document.write('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">');
document.write('<link rel="stylesheet" href="//cdn.jsdelivr.net/gh/rocky2242/G-drive_index_v4.1/css/base.css">');
document.write('<link rel="stylesheet" href="//cdn.jsdelivr.net/gh/rocky2242/G-drive_index_v4.1/css/vendor.css">');
document.write('<link rel="stylesheet" href="//cdn.jsdelivr.net/gh/rocky2242/G-drive_index_v4.1/css/main.css">');
document.write('<script src="//cdn.jsdelivr.net/gh/rocky2242/G-drive_index_v4.1/js/modernizr.js"></script>');
document.write('<script src="//cdn.jsdelivr.net/gh/rocky2242/G-drive_index_v4.1/js/pace.min.js"></script>');
// from index
document.write('<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/mdui@0.4.3/dist/css/mdui.min.css">');
document.write('<script src="//cdnjs.cloudflare.com/ajax/libs/mdui/0.4.3/js/mdui.min.js"></script>');
document.write('<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/plyr/3.6.2/plyr.css">');
document.write('<script src="//cdnjs.cloudflare.com/ajax/libs/plyr/3.6.2/plyr.min.js"></script>');
document.write('<script src="//cdn.jsdelivr.net/npm/markdown-it@10.0.0/dist/markdown-it.min.js"></script>');
document.write('<style>.mdui-appbar .mdui-toolbar{height:56px;font-size:1pc}.mdui-toolbar>*{padding:0 6px;margin:0 2px}.mdui-toolbar>i{opacity:.5}.mdui-toolbar>.mdui-typo-headline{padding:0 1pc 0 0}.mdui-toolbar>i{padding:0}.mdui-toolbar>a:hover,a.active,a.mdui-typo-headline{opacity:1}.mdui-container{max-width:980px}.mdui-list-item{transition:none}.mdui-list>.th{background-color:initial}.mdui-list-item>a{width:100%;line-height:3pc}.mdui-list-item{margin:2px 0;padding:0}.mdui-toolbar>a:last-child{opacity:1}@media screen and (max-width:980px){.mdui-list-item .mdui-text-right{display:none}.mdui-container{width:100%!important;margin:0}.mdui-toolbar>.mdui-typo-headline,.mdui-toolbar>a:last-child,.mdui-toolbar>i:first-child{display:block}}</style>');
// Dark Mode of listing
//document.write('<style>* {box-sizing: border-box}body{color:rgba(255,255,255,.87);background-color:#333232}.mdui-theme-primary-'+main_color+' .mdui-color-theme{background-color:#232427!important}</style>');
// lazy loading
document.write('<script src="//cdnjs.cloudflare.com/ajax/libs/lazysizes/4.1.5/lazysizes.min.js"></script>');
// Initialize the page and load the necessary resources
function init(){
    document.siteName = $('title').html();
    $('body').addClass("mdui-theme-primary-"+main_color+" mdui-theme-accent-"+accent_color);
    var html = "";
    html += `
        <div id="top">
           <div id="content"></div>
        <div>`;
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
	<header class="short-header">
              <div class="row header-content">
                <div class="logo"><h1>The Larkens</h1></div>
              </div>
            </header>
   <section id="bricks">
    <div class="row masonry">
         <div class="bricks-wrapper">
          <div id="list"></div>
          </div>
    </div>
   </section>
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
        	var nirr = p+'poster.jpg';	
              html +=`<article class="brick entry format-standard animate-this">
               <div class="entry-thumb">
                  <a href="${p}" class="thumb-link">
	            <img class="lazyload" data-src="${nirr}" onerror="this.onerror=null;this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQItDkLRAkxz2Obu_ZvDYmdbg6xEQ7Nd4yhEVc4NzXvMh1GJ9sy&s';" alt="${nirr}">                   
                  </a>
               </div>
               <div class="entry-text">
               	<div class="entry-header">
               	<div class="entry-meta">
                    <span class="cat-links">                     
                      TYPE: FOLDER
                    </span>     
                  </div>
               	<h1 class="entry-title"><a href="${p}">${item.name}</a></h1>
               	</div>
				<div class="entry-excerpt">
				</div>
               </div>
        		</article> `;
                        
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
	         html += `<article class="brick entry format-standard animate-this">
               <div class="entry-thumb">
                  <a gd-type="${item.mimeType}" href="${p}" class="thumb-link" alt="${c}">
	                  <img class="lazyload" data-src="${res}" alt="ferris wheel">                   
                  </a>
               </div>
               <div class="entry-text">
               	<div class="entry-header">
               	<div class="entry-meta">
                    <span class="cat-links">                     
                      Size:${item['size']}
                    </span>     
                  </div>
               	<h1 class="entry-title"><a href="${p}">${item.name}</a></h1>
               	</div>
				<div class="entry-excerpt">
				</div>
               </div>
        		</article>`;
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