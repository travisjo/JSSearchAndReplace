javascript:{
	function Search(find, replace, numberOfReplaces) {
		this.find = find;
		this.replace = replace;
		this.numberOfReplaces = numberOfReplaces;
		this.htmlNode = null;
		
		this.createNode = function() {
			var newRowLi = document.createElement("li");
			newRowLi.className = "search-result";
			newRowLi.innerHTML = '<span class="results-remove" onclick="removeSearch(this);">&#10005;</span><span class="results-search"><span class="find">'+this.find+'</span> &rarr; <span class="replace">'+this.replace+'</span></span><span class="results-count">'+this.numberOfReplaces+'</span>';
			this.htmlNode = newRowLi;
			
			return newRowLi;
		}
	}
	
	var searches = Array();
	
	var htmlreplace = 
		function(find, replace, element, count) {
			if(count == undefined)
				count = 0;
			if(!element)
				element = document.body;
			var nodes = element.childNodes;
			for(var n=0; n < nodes.length; n++) {
				if(nodes[n].id == 'searchAndReplace')
					continue;
				if(nodes[n].nodeType == Node.TEXT_NODE) {
					if(nodes[n].parentNode.tagName.toLowerCase() != 'script' &&
						nodes[n].parentNode.tagName.toLowerCase() != 'style') {
						var regex = new RegExp('\\b'+find+'\\b','gi');
						if(nodes[n].textContent.match(regex)) {
							count += nodes[n].textContent.match(regex).length;
						}
						nodes[n].textContent=nodes[n].textContent.replace(regex,replace);	
					}
				} else {
					count = htmlreplace(find, replace, nodes[n], count);
				}
			}
			return count;
		}
	
	var runIt =
		function() {
			var find = document.getElementById("__searchAndReplaceForm_Search").value;
			var replace = document.getElementById("__searchAndReplaceForm_Replace").value;
			var numberOfReplaces = htmlreplace(find, replace);
			var search = new Search(find, replace, numberOfReplaces);
			searches[searches.length] = search;
			document.getElementById('start-search-results').parentNode.appendChild(search.createNode());
		}
	
	var removeSearch =
		function(removeSearchButton) {
			//Parse out find and replace strings
			var searchLi = removeSearchButton.parentNode;
			var spans = searchLi.getElementsByTagName('span');
			var find = '';
			var replace = '';
			for(var spanNum in spans) {
				var span = spans[spanNum];
				if(span.className == 'find')
					find = span.innerText;
				if(span.className == 'replace')
					replace = span.innerText;
			}
			
			//Find search that corresponds to find and replace strings
			for(var i = searches.length-1; i >= 0; i--) {
				var search = searches[i];
				if(search.find == find && search.replace == replace) {
					search.htmlNode.parentNode.removeChild(search.htmlNode);
					htmlreplace(replace, find); //reverse find and replace
					searches.splice(i, 1);
				}
			}
		}
		
	var stylesNode = document.createElement("style");
	stylesNode.innerHTML = '#searchAndReplace { font-family: Helvetica, sans-serif; position: fixed; bottom: 0px; left: 0px; z-index: 99999999999; width: 100%; min-height: 34px; background-color: rgba(36, 32, 111, .7); border-top: 1px solid black; padding: 10px; text-align: left; } #searchAndReplace > form > ul > li > input[type="text"] { width: initial; height: initial; padding: 0px 0px 0px 10px; margin: 0px 10px 11px 0px; border: 3px solid rgba(255,255,255,1); border-radius: 17px; line-height: 26px; font-size: 18px; } #searchAndReplace > form > ul > li > input[type="submit"] { background-color: rgba(0, 0, 0, .5); color: white; font-size: 18px; line-height: 26px; width: 165px; border: 4px solid rgba(255, 255, 255, 1); border-radius: 20px; margin: 0px; padding: 0px; }  #searches { list-style-type: none; padding: 0px; margin: 0px; margin-top: 10px; display: inline-block; } #searches > li { display: inline-block; } #searches > li.search-result { display: inline-block; color: white; background-color: #5049BC; border: 1px solid white; border-radius: 25px; padding-left: 4px; padding-right: 4px; padding-top: 3px; padding-bottom: 3px; margin-bottom: 10px; margin-right: 5px; } #start-search-results > span { display: inline-block; width: 1px; height: 30px; line-height: 30px; position: static; top: 13px; color: white; margin-left: 20px; margin-right: 20px; background-color: white; } .results-count { display: inline-block; text-align: center; font-size: 14px; line-height: 16px; color: white; background-color: #40406F; border-radius: 10px; width: 18px; height: 17px; padding-top: 1px; padding-right: 7px; padding-left: 8px; margin-left: 8px; } .results-remove { font-size: 14px; line-height: 16px; display: inline-block; position: relative; border-radius: 10px; width: 18px; color: white; text-align: center; height: 17px; margin-right: 8px; padding-top: 1px; } .results-remove:hover { background-color: #40406F; } .results-search { display: inline-block; text-align: center; font-size: 14px; line-height: 16px; color: white; height: 17px; padding-top: 1px; padding-right: 7px; }';
	
	var formNode = document.createElement("div");
	formNode.id = "searchAndReplace";
	formNode.innerHTML = "<form onsubmit='return false;'><ul id='searches'><li><input type='text' placeholder='Find' id='__searchAndReplaceForm_Search'/></li><li><input type='text' placeholder='Replace' id='__searchAndReplaceForm_Replace'/></li><li><input type='submit' value='Find &amp; Replace' onclick='runIt()'/></li><li id='start-search-results'><span>&nbsp;</span></li></ul></form>";
	if(document.getElementById("searchAndReplace") == null) { //check to see if bookmarklet already installed
		document.body.appendChild(stylesNode);
		document.body.appendChild(formNode);	
	}
	
	var f = function () {
		document.body.style.marginBottom = "75px"; //hack to fix bookmarklet after minifying
	}
	f();
}