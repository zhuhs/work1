window.SINGLE_TAB = "  ";
window.ImgCollapsed = "./img/json/Collapsed.gif";
window.ImgExpanded = "./img/json/Expanded.gif";
window.QuoteKeys = true;
window.IsCollapsible = true;
function $id(id){ return document.getElementById(id); }
function IsArray(obj) {
  return  obj && 
          typeof obj === 'object' && 
          typeof obj.length === 'number' &&
          !(obj.propertyIsEnumerable('length'));
}

function prism(){
  SetTab();
  var json = $id("RawJson").value;
  var html = "";
  try{
    if(json == ""){ json = "\"\"";return;}
    var obj = eval("["+json+"]");
    html = ProcessObject(obj[0], 0, false, false, false);
    $id("Canvas").innerHTML = "<PRE class='CodeContainer'>"+html+"</PRE>";
    
//    $("#RawJson").val(html);
  }catch(e){
    alert("JSON数据格式不正确:\n"+e.message);
    $id("Canvas").innerHTML = "";
  }
}
window._dateObj = new Date();
window._regexpObj = new RegExp();
function ProcessObject(obj, indent, addComma, isArray, isPropertyContent){
  var html = "";
  var comma = (addComma) ? "<span class='Comma'>,</span> " : ""; 
  var type = typeof obj;
  var clpsHtml ="";
  if(IsArray(obj)){
    if(obj.length == 0){
      html += GetRow(indent, "<span class='ArrayBrace'>[ ]</span>"+comma, isPropertyContent);
    }else{
      clpsHtml = window.IsCollapsible ? "<span><img src=\""+window.ImgExpanded+"\" onClick=\"ExpImgClicked(this)\" /></span><span class='collapsibleClass'>" : "";
      html += GetRow(indent, "<span class='ArrayBrace'>[</span>"+clpsHtml, isPropertyContent);
      for(var i = 0; i < obj.length; i++){
        html += ProcessObject(obj[i], indent + 1, i < (obj.length - 1), true, false);
      }
      clpsHtml = window.IsCollapsible ? "</span>" : "";
      html += GetRow(indent, clpsHtml+"<span class='ArrayBrace'>]</span>"+comma);
    }
  }else if(type == 'object'){
    if (obj == null){
        html += FormatLiteral("null", "", comma, indent, isArray, "Null");
    }else if (obj.constructor == window._dateObj.constructor) { 
        html += FormatLiteral("new Date(" + obj.getTime() + ") /*" + obj.toLocaleString()+"*/", "", comma, indent, isArray, "Date"); 
    }else if (obj.constructor == window._regexpObj.constructor) {
        html += FormatLiteral("new RegExp(" + obj + ")", "", comma, indent, isArray, "RegExp"); 
    }else{
      var numProps = 0;
      for(var prop in obj) numProps++;
      if(numProps == 0){
        html += GetRow(indent, "<span class='ObjectBrace'>{ }</span>"+comma, isPropertyContent);
      }else{
        clpsHtml = window.IsCollapsible ? "<span><img src=\""+window.ImgExpanded+"\" onClick=\"ExpImgClicked(this)\" /></span><span class='collapsibleClass'>" : "";
        html += GetRow(indent, "<span class='ObjectBrace'>{</span>"+clpsHtml, isPropertyContent);

        var j = 0;

        for(var prop in obj){

          var quote = window.QuoteKeys ? "\"" : "";

          html += GetRow(indent + 1, "<span class='PropertyName'>"+quote+prop+quote+"</span>: "+ProcessObject(obj[prop], indent + 1, ++j < numProps, false, true));

        }

        clpsHtml = window.IsCollapsible ? "</span>" : "";

        html += GetRow(indent, clpsHtml+"<span class='ObjectBrace'>}</span>"+comma);

      }

    }

  }else if(type == 'number'){

    html += FormatLiteral(obj, "", comma, indent, isArray, "Number");

  }else if(type == 'boolean'){

    html += FormatLiteral(obj, "", comma, indent, isArray, "Boolean");

  }else if(type == 'function'){

    if (obj.constructor == window._regexpObj.constructor) {

        html += FormatLiteral("new RegExp(" + obj + ")", "", comma, indent, isArray, "RegExp"); 

    }else{

        obj = FormatFunction(indent, obj);

        html += FormatLiteral(obj, "", comma, indent, isArray, "Function");

    }

  }else if(type == 'undefined'){

    html += FormatLiteral("undefined", "", comma, indent, isArray, "Null");

  }else{

    html += FormatLiteral(obj.toString().split("\\").join("\\\\").split('"').join('\\"'), "\"", comma, indent, isArray, "String");

  }

  return html;

}

function FormatLiteral(literal, quote, comma, indent, isArray, style){

  if(typeof literal == 'string')

    literal = literal.split("<").join("&lt;").split(">").join("&gt;");

  var str = "<span class='"+style+"'>"+quote+literal+quote+comma+"</span>";

  if(isArray) str = GetRow(indent, str);

  return str;

}

function FormatFunction(indent, obj){

  var tabs = "";

  for(var i = 0; i < indent; i++) tabs += window.TAB;

  var funcStrArray = obj.toString().split("\n");

  var str = "";

  for(var i = 0; i < funcStrArray.length; i++){

    str += ((i==0)?"":tabs) + funcStrArray[i] + "\n";

  }

  return str;

}

function GetRow(indent, data, isPropertyContent){

  var tabs = "";

  for(var i = 0; i < indent && !isPropertyContent; i++) tabs += window.TAB;

  if(data != null && data.length > 0 && data.charAt(data.length-1) != "\n")

    data = data+"\n";

  return tabs+data;                       

}

function CollapsibleViewClicked(){

  $id("CollapsibleViewDetail").style.visibility = $id("CollapsibleView").checked ? "visible" : "hidden";

  Process();

}



function QuoteKeysClicked(){

  window.QuoteKeys = $id("QuoteKeys").checked;

  Process();

}



function CollapseAllClicked(){

  EnsureIsPopulated();

  TraverseChildren($id("Canvas"), function(element){

    if(element.className == 'collapsibleClass'){

      MakeContentVisible(element, false);

    }

  }, 0);

}

function ExpandAllClicked(){

  EnsureIsPopulated();

  TraverseChildren($id("Canvas"), function(element){

    if(element.className == 'collapsibleClass'){

      MakeContentVisible(element, true);

    }

  }, 0);

}

function MakeContentVisible(element, visible){

  var img = element.previousSibling.firstChild;

  if(!!img.tagName && img.tagName.toLowerCase() == "img"){

    element.style.display = visible ? 'inline' : 'none';

    element.previousSibling.firstChild.src = visible ? window.ImgExpanded : window.ImgCollapsed;

  }

}

function TraverseChildren(element, func, depth){

  for(var i = 0; i < element.childNodes.length; i++){

    TraverseChildren(element.childNodes[i], func, depth + 1);

  }

  func(element, depth);

}

function ExpImgClicked(img){

  var container = img.parentNode.nextSibling;

  if(!container) return;

  var disp = "none";

  var src = window.ImgCollapsed;

  if(container.style.display == "none"){

      disp = "inline";

      src = window.ImgExpanded;

  }

  container.style.display = disp;

  img.src = src;

}

function CollapseLevel(level){

  EnsureIsPopulated();

  TraverseChildren($id("Canvas"), function(element, depth){

    if(element.className == 'collapsible'){

      if(depth >= level){

        MakeContentVisible(element, false);

      }else{

        MakeContentVisible(element, true);  

      }

    }

  }, 0);

}

function TabSizeChanged(){

  Process();

}

function SetTab(){
  var select = $id("TabSize");
  window.TAB = MultiplyString(2, window.SINGLE_TAB);
}

function EnsureIsPopulated(){

  if(!$id("Canvas").innerHTML && !!$id("RawJson").value) Process();

}

function MultiplyString(num, str){

  var sb =[];

  for(var i = 0; i < num; i++){

    sb.push(str);

  }

  return sb.join("");

}

function SelectAllClicked(){



  if(!!document.selection && !!document.selection.empty) {

    document.selection.empty();

  } else if(window.getSelection) {

    var sel = window.getSelection();

    if(sel.removeAllRanges) {

      window.getSelection().removeAllRanges();

    }

  }



  var range = 

      (!!document.body && !!document.body.createTextRange)

          ? document.body.createTextRange()

          : document.createRange();

  

  if(!!range.selectNode)

    range.selectNode($id("Canvas"));

  else if(range.moveToElementText)

    range.moveToElementText($id("Canvas"));

  

  if(!!range.select)

    range.select($id("Canvas"));

  else

    window.getSelection().addRange(range);

}

function LinkToJson(){

  var val = $id("RawJson").value;

  val = escape(val.split('/n').join(' ').split('/r').join(' '));

  $id("InvisibleLinkUrl").value = val;

  $id("InvisibleLink").submit();

}

function transformToJava(){
	var val = $("#RawJson").val();
	
	var beans = getBeanFieldFromJson(val, "Test");
	$("#Canvas").html("");
	$.each(beans, function(i,v){
        var beanText = toBeanText(v, "com.cff.model");
        var textCss = "";
        if(i != 0){
            textCss = "small-text";
        }
		beanText = beanText.replace(new RegExp("<int>",'g'),"<Integer>").replace(new RegExp("<long>",'g'),"<Long>").replace(/<([^s -+_/\\])/g,"&lt;$1");
        //var html = '<div class="row result_row">'+'<textarea class_name="' + v.name + '" class="result '+ textCss +'" >'+ beanText + '</textarea></div>';
		var class_name = v.name.replace(/<span.+?>/g,"").replace(/<\/span.+?>/g,"");
		console.log(class_name);
		var html = '<div class="card-panel hoverable"><pre><code class="lang-java result-bean" class_name="' + class_name +'">'+ beanText + '</code></pre></div>';
        $("#Canvas").append(html);

    })
    if ( $("#download").length > 0 ) { 
    	$("#download").removeClass("disabled");
    }
}
function transformToJavaWithPackage(){
	var val = $("#RawJson").val();
	
	var packageText = $('#packageText').val();
	var packageName = "com.cff.model";

	if(packageText != null && packageText != ''){
		packageName = packageText;
	}
	
	var classText = $('#classText').val();
	var className = "Test";

	if(classText != null && classText != ''){
		className = classText;
	}
	
	var beans = getBeanFieldFromJson(val, className);
	$("#Canvas").html("");
	$.each(beans, function(i,v){
        var beanText = toBeanText(v, packageName);
        var textCss = "";
        if(i != 0){
            textCss = "small-text";
        }
		beanText = beanText.replace(new RegExp("<int>",'g'),"<Integer>").replace(new RegExp("<long>",'g'),"<Long>").replace(/<([^s -+_/\\])/g,"&lt;$1");
        //var html = '<div class="row result_row">'+'<textarea class_name="' + v.name + '" class="result '+ textCss +'" >'+ beanText + '</textarea></div>';
		var class_name = v.name.replace(/<span.+?>/g,"").replace(/<\/span.+?>/g,"");
		console.log(class_name);
		var copyBtn="<div class='right'><a href='javascript:void(0)' class='tooltipped copy' data-position='bottom' data-delay='1'  data-tooltip='复制' data-clipboard-action='copy' data-clipboard-target='#className"+ class_name + "'><i class='material-icons'>library_add</i></a></div>";
		
		var html = '<div class="card-panel hoverable">'+copyBtn+'<pre><code id="className'+ class_name + '" class="lang-java result-bean" class_name="' + class_name +'">'+ beanText + '</code></pre></div>';
        $("#Canvas").append(html);
        $('.tooltipped').tooltip({delay: 1});

    })
    if ( $("#download").length > 0 ) { 
    	$("#download").removeClass("disabled");
    }
}

function transformToJavaForJava(id,targertId){
	var val = $(id).val();
	
	var beans = getBeanFieldFromJson(val, "Test");
	$(targertId).html("");
	$.each(beans, function(i,v){
        var beanText = toBeanText(v, "com.cff.model");
        var textCss = "";
        if(i != 0){
            textCss = "small-text";
        }
		beanText = beanText.replace("<int>","<Integer>").replace("<long>","<Long>");
        //var html = '<div class="row result_row">'+'<textarea class_name="' + v.name + '" class="result '+ textCss +'" >'+ beanText + '</textarea></div>';
		var html = '<div class="card-panel hoverable"><pre><code class="lang-java">'+ beanText + '</code></pre></div>';
        $(targertId).append(html);
    })
    
}
function isInt(integer) {
    return integer % 1 === 0
}
function isDate(dateStr) {
    var isDate = ((new Date(dateStr) !== "Invalid Date" && !isNaN(new Date(dateStr))) && isNaN((+dateStr)));
    console["log"]("value:" + dateStr + " is date:" + isDate);
    return isDate
}
function isArray(array) {
    return Object["prototype"]["toString"]["call"](array) === "[object Array]"
}
function camelCase(str) {
	var camelStr = str.split("_");
	var name = camelStr[0];
	for(var i=1;i<camelStr.length;i++){
		name += firstToUpperCase(camelStr[i]);
	}
    return name;
}
function camelCaseWithFirstCharUpper(str) {
    if (!str) {
        return "";
    }
    str = camelCase(str);
    return str[0]["toUpperCase"]() + str["substr"](1)
}
function trimStr(text) {
    return text.replace(/(^\s*)|(\s*$)/g, "");
}
function getTypeFromJsonVal(jsonData, key, _0x6d8fx2c) {
    if (jsonData && jsonData["replace"]) {
        jsonData = trimStr(jsonData)
    }
    ;var strType = typeof (jsonData);
    if (strType === "number") {
        if (isInt(jsonData)) {
            return jsonData < 65536 ? "int" : "long"
        } else {
            return "double"
        }
    } else {
        if (strType === "boolean") {
            return strType
        } else {
            if (isDate(jsonData)) {
                return "Date"
            } else {
                if (!jsonData) {
                    return "String"
                } else {
                    if (strType === "string") {
                        return "String"
                    } else {
                        if (isArray(jsonData)) {
                            var arrayType = getTypeFromJsonVal(jsonData[0], key, _0x6d8fx2c);
                            return "List<" + arrayType + ">"
                        } else {
                            var _0x6d8fx31 = camelCaseWithFirstCharUpper(key);
                            var _0x6d8fx1b = {};
                            for (key in jsonData) {
                                var _0x6d8fx32 = jsonData[key];
                                _0x6d8fx1b[key] = getTypeFromJsonVal(_0x6d8fx32, key, _0x6d8fx2c)
                            }
                            ;_0x6d8fx2c["push"]({
                                name: _0x6d8fx31,
                                val: _0x6d8fx1b
                            });
                            return _0x6d8fx31
                        }
                    }
                }
            }
        }
    }
}
function firstToUpperCase(str) {
    return str["substr"](0, 1)["toUpperCase"]() + str["substr"](1)
}
var importMap = {
    "Date": "java.util.Date",
    "List": "java.util.List"
};

function toBeanText(_0x6d8fx1b, packageName) {
	console.log(_0x6d8fx1b);
    var value = _0x6d8fx1b["val"];
    var name = _0x6d8fx1b["name"];
    var headContent = "";
    var _0x6d8fx20 = "";
    var _0x6d8fx21 = "";
    var _0x6d8fx22 = {};
    var isCamel = false;
    var getSet = "\x0A  <span class=\"token keyword\">public void</span> <span class=\"token function\">set#</span>(& @) {\x0A    <span class=\"token keyword\">this</span>.@ = @;\x0A  }\x0A  <span class=\"token keyword\">public</span> & <span class=\"token function\">get#</span>() {\x0A    <span class=\"token keyword\">return</span> @;\x0A  }\x0A";
    for (key in value) {
        var jsonKey = camelCase(key);
        if (jsonKey != key) {
            _0x6d8fx20 += "  @JsonProperty(\"" + key + "\")\x0A";
            isCamel = true
        }
        ;_0x6d8fx20 += "  private " + value[key] + " " + jsonKey + ";\x0A";
        var rowType = value[key];
        if (rowType.indexOf("List<") > -1) {
            rowType = value[key]["replace"]("List<", "");
            rowType = rowType["replace"](">", "");
            _0x6d8fx22["List"] = "true";
        }
        ;_0x6d8fx22[rowType] = "true";
        var _0x6d8fx27 = {
            '@': jsonKey,
            '#': firstToUpperCase(jsonKey),
            '&': value[key]
        };
        _0x6d8fx21 += getSet["replace"](/@|#|&/g, function(_0x6d8fx28) {
            return _0x6d8fx27[_0x6d8fx28]
        })
    }
    ;for (t in _0x6d8fx22) {
        if (importMap[t]) {
            headContent += "<span class=\"token keyword\">import</span> " + importMap[t] + ";\x0A"
        }
    }
    ;if (isCamel) {
        headContent += "<span class=\"token keyword\">import</span> org.codehaus.jackson.annotate.JsonIgnoreProperties;\x0A<span class=\"token keyword\">import</span> org.codehaus.jackson.annotate.JsonProperty;\x0A";
    }
    ;if (packageName) {
        headContent = "<span class=\"token keyword\">package</span> " + packageName + ";\x0A" + headContent
    }
    ;return headContent + "\x0A" + "<span class=\"token keyword\">public class</span> <span class=\"token class-name\">" + name + "</span> {\x0A" + _0x6d8fx20 + _0x6d8fx21 + "\x0A}"
}

function getBeanFieldFromJson(text, class_name) {
    var result = null;
    text = trimStr(text);
    //jsonlint["parse"](text);
    if (text[0] === "[" && text[text.length - 1] === "]") {
        text = "{ \" list \" : " + text + "}";
        result = JSON["parse"](text)["list"][0]
    } else {
        result = JSON["parse"](text)
    }
    ;var _0x6d8fx1b = {};
    var _0x6d8fx2c = [];
    for (key in result) {
        var _0x6d8fx2d = result[key];
        _0x6d8fx1b[key] = getTypeFromJsonVal(_0x6d8fx2d, key, _0x6d8fx2c)
    }
    ;if (!class_name) {
        class_name = "AtoolBean";
    } else {}
    ;_0x6d8fx1b = {
        name: class_name,
        val: _0x6d8fx1b
    };
    return $.merge([_0x6d8fx1b], _0x6d8fx2c)
}

function compress() {
	var str = $("#RawJson").val();
    str = trimStr(str);
    $("#Canvas").html(Prism.highlight(str, Prism.languages.json, 'json') );
}

function escape() {
	var str = $("#RawJson").val();
    str = str.replace(/\"/g, "\\\"");
    $("#Canvas").html("<pre><code>" + str + "</code></pre>");
}

function compressAndEscape() {
	var str = $("#RawJson").val();
    str = trimStr(str);
    str = str.replace(/\"/g, "\\\"");
    $("#Canvas").html(Prism.highlight(str, Prism.languages.json, 'json') );
}
function disEscape() {
	var str = $("#RawJson").val();
	var json = str.replace(/\\\"/g, "\"");
	var html = "";
	SetTab();
	try{
		if(json == ""){ json = "\"\"";return;}
		var obj = eval("["+json+"]");
		html = ProcessObject(obj[0], 0, false, false, false);
	    $("#Canvas").html("<PRE class='CodeContainer'>"+html+"</PRE>" );

	}catch(e){
		alert("JSON数据格式不正确:\n"+e.message);
		$id("Canvas").innerHTML = "";
	}
}

function transformToXML() {
	var xotree = new XML.ObjTree();
	var json = eval("(" + $("#RawJson").val() + ")");
	var xmlStr = formatXml(xotree.writeXML(json));
	$("#Canvas").html("<pre v-pre='' data-lang='xml'><code class='lang-xml'>" + Prism.highlight(xmlStr, Prism.languages.xml, 'xml') + "</code></pre>");
}

function transformToJSON() {
	var xotree = new XML.ObjTree();
    var dumper = new JKL.Dumper(); 
	var xmlText = $("#RawJson").val();
	var tree = xotree.parseXML(xmlText);
	var json = dumper.dump(tree);
	SetTab();
	try{
		if(json == ""){ json = "\"\"";return;}
		var obj = eval("["+json+"]");
		html = ProcessObject(obj[0], 0, false, false, false);
	    $("#Canvas").html("<PRE class='CodeContainer'>"+html+"</PRE>" );

	}catch(e){
		alert("JSON数据格式不正确:\n"+e.message);
		$id("Canvas").innerHTML = "";
	}
}

function postJsonForResult(){
	var url = $("#inputUrl").val()
	var content = $("#RawJson").val();
	var obj = eval("["+content+"]");
	$("#Canvas").html("");
	$.ajax({
        type : "post",
        url : url,
        contentType: 'application/json',
        data: JSON.stringify(obj[0]),
        dataType : "json",
        success : function(data) {
        	SetTab();
        	var json = data;
        	var html = "";
        	try{
	    	    html = ProcessObject(json, 0, false, false, false);
	    	    $id("Canvas").innerHTML = "<PRE class='CodeContainer'>"+html+"</PRE>";
        	}catch(e){
	    	    alert("JSON数据格式不正确:\n"+e.message);
	    	    $id("Canvas").innerHTML = "";
        	}
        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
        	$id("Canvas").innerHTML = "请求失败！";
        }
    });
}
function httpForResult(httpType){
	var url = $("#inputUrl").val()
	
	var trList = $("#tableBody").children("tr")
	var content = "";
    for (var i=0;i<trList.length;i++) {
        var tdArr = trList.eq(i).find("td");
        var key = tdArr.eq(0).find('div').html();//收入类别
        var value = tdArr.eq(1).find('div').html();//收入金额
        var ischecked = tdArr.eq(2).find('input').prop("checked");
        console.log(ischecked);
        if(ischecked){
            content = content + "&" + key + "=" + value;
        }
    }
    content = content.substr(1);
    console.log(content);
	$("#Canvas").html("");
	$.ajax({
        type : httpType,
        url : url,
        data: content,
        dataType : "json",
        success : function(data) {
        	SetTab();
        	var json = data;
        	var html = "";
        	try{
	    	    html = ProcessObject(json, 0, false, false, false);
	    	    $id("Canvas").innerHTML = "<PRE class='CodeContainer'>"+html+"</PRE>";
        	}catch(e){
	    	    alert("JSON数据格式不正确:\n"+e.message);
	    	    $id("Canvas").innerHTML = "";
        	}
        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
        	$id("Canvas").innerHTML = "请求失败！";
        }
    });
}
function saveSnapshot(){
	var url = $("#inputUrl").val()
	var html = $("#Canvas").html();
	var val=$('input:radio[name="group1"]:checked').val();
	var ischecked = $("#second_switch_dst").prop("checked");
	var httpType = "POST";
	if(!ischecked){
		httpType = "GET";
	}	
	if(val==null){
	    val = 2;
    }
	var content = "";
	if(val == 2){
		content = $("#RawJson").val();
	}else{
		var trList = $("#tableBody").children("tr")
	    for (var i=0;i<trList.length;i++) {
	        var tdArr = trList.eq(i).find("td");
	        var key = tdArr.eq(0).find('div').html();//收入类别
	        var value = tdArr.eq(1).find('div').html();//收入金额
	        
	        content = content + "&" + key + "=" + value;
	    }
	    content = content.substr(1);
	}
	var json={"httpType":httpType,"val":val,"url":url,"content":content,"result":html};
	var blob = new Blob([JSON.stringify(json)], {type: "text/plain;charset=utf-8"});
	saveAs(blob, "post-" + url.replace(/\//g,"-") +".json");
}

function loadSnapshot(files){
	if (files.length) {
        var file = files[0];
        console.log(file);
        var reader = new FileReader();//new一个FileReader实例
        if (/application\/json/.test(file.type)) {//判断文件类型，是不是text类型
            reader.onload = function() {
            	var obj = eval("["+this.result+"]");
            	var json = obj[0];
            	var val = json.val;
            	if(!val){
            		val = 2;
            	}
            	if(val == 2){
            		$("#rootInputData").html(`
        					<textarea class="z-depth-1" id="RawJson" style="resize:none; height: 15rem; background-color: white" ></textarea>
        					`);
            		$('#RawJson').val(json.content);
                    $('#inputUrl').val(json.url);
                    $('#Canvas').html(json.result);
                    
                    $("#jsonRadio").removeAttr("disabled");
            		$("#formdata").removeAttr("disabled");
            		$("#urlencoded").removeAttr("disabled");
                    $("#jsonRadio").attr("checked","checked");
                    $("#second_switch_dst").attr("checked", true);
            	}else{
            		var trList = json.content.split("&");
            		var trIn = "";
            		if(trList && trList.length > 0){
            			for(var i =0;i<trList.length;i++){
            				var keyValue = trList[i].split("=");
            				var key = keyValue[0];
            				var value = keyValue[1];
            				trIn += `
            				<tr>
                			<td style="padding: 10px 5px;"><div contenteditable="true">${key}</div></td>
                			<td style="padding: 10px 5px;"><div contenteditable="true">${value}</div></td>
                			<td style="padding: 10px 5px;"> 
		        		      		<input type="checkbox" id="checkbox${i}" checked="checked" />
		        		      		<label for="checkbox${i}"></label>
		        		    </td>
                			<td style="padding: 10px 5px;"><a style="cursor:pointer" onclick="deleteRow(this);"><i class="material-icons">delete</i></a></td>
                			</tr>
            				`;
            			}
            		}
            		$("#rootInputData").html(`
        					<div class="z-depth-1" id="RawJson" style="resize:none; height: 15rem;overflow:auto;margin-bottom:0px;background-color: white" >
        			<table class="left" id="oTable" style="background-color:#eeeeee;width: 70%; table-layout:fixed;" bordercolor="#aaaaaa" border="1" cellpadding="0" cellpadding="2" width="60%">
        			<thead>
        			<tr>
        			<th>key</th>
        			<th>value</th>
        			<th>是否传输</th>
        			<th>操作</th>
        			</tr>
        			</thead>
        			<tbody id="tableBody">
        			${trIn}
        			</tbody>
        			</table>
        			<div class="right">
        	        	<button type="button" class="waves-effect  green darken-1 lighten-2 waves-light btn" style="margin-left:30px" onclick="addRow();">添加一行</button>
        	        </div>
    				</div>
        					`);
            		$('#inputUrl').val(json.url);
                    $('#Canvas').html(json.result);
            		var httpType = json.httpType;
            		if(httpType && httpType == "GET"){
            			$("#second_switch_dst").attr("checked", false);
            			$("#getParam").attr("checked","checked");
            			$("#jsonRadio").attr("disabled","disabled");
                		$("#formdata").attr("disabled","disabled");
                		$("#urlencoded").attr("disabled","disabled");
            		}else{
            			$("#second_switch_dst").attr("checked", true);
            			$("#jsonRadio").removeAttr("disabled");
                		$("#formdata").removeAttr("disabled");
                		$("#urlencoded").removeAttr("disabled");
            			$("#urlencoded").attr("checked","checked");
            		}
            		
            	}
                
            }
            reader.readAsText(file);
        }
    }
}