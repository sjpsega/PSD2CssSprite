/*
<javascriptresource> 
<name>css sprite</name> 
<menu>help</menu> 
<enableinfo>true</enableinfo> 
</javascriptresource>
*/

// Settings
#target photoshop
app.displayDialogs = DialogModes.NO; // suppress all dialogs
app.bringToFront(); // bring top

// Set Adobe Photoshop CS4 to use pixels
app.preferences.rulerUnits = Units.PIXELS;
app.preferences.typeUnits = TypeUnits.PIXELS;

(function(){
			var doc = app.activeDocument,
				 layers = doc.artLayers,
				 allVisibleArtLayers = getAllVisibleLayers(),
				 config = {
					image:{
						extension:'jpg'
					},
					dir:''
				},
				 win = new Window('dialog{\
					text:"chose type",\
					option:Group{\
						orientation:"column",\
						alignChildren: "left",\
						image: Group{\
							alignChildren: "left",\
							orientation: "column",\
							a: Group{\
								alignChildren: "left",\
								t: StaticText{text:"imgFormat"},\
								jpg: RadioButton{text:"jpg", value:true},\
								p8:RadioButton{text:"png-8"},\
								gif:RadioButton{text:"gif"}\
							},\
							q: Group{\
								alignChildren: "left",\
								t: StaticText{text:"Image quality", helpTip:"Image quality"},\
								s: EditText{ text:"60", preferredSize: [50, 20] }\
							}\
						},\
						output: Group{\
							orientation:"row",\
							b: Button{text:"file", properties:{name:"open"}, helpTip:"chose file"},\
							s: EditText  { text:"", preferredSize:[180, 20], helpTip:"defaultToMyDocument"}\
						}\
					},\
					buttons:Group{\
						ok: Button{text:"OK",  properties:{name:"ok"}},\
						cancel: Button{text:"cancel",  properties:{name:"cancel"}}\
					}\
				}');
				//选择路径
				win.option.output.b.onClick = function(){
					var output = Folder.selectDialog ('Output Folder');
					if(output){
						win.option.output.s.text = config.dir = output.fsName;
					}
				}
				win.option.image.a.addEventListener('click', function(e){
					var target = e.target,
						quality = this.parent.q;
					switch(target.text){
						case "jpg":
							quality.show();
							config.image.extension = 'jpg';
							break;
						case "png-8":
							quality.hide();
							config.image.extension = 'png';
							break;
						case "gif":
							quality.hide();
							config.image.extension = 'gif';
							break;
					}
				});
				//导出图片的格式
				var exportImg = {
						png: function(){
							var img = new File (config.dir + '/' + 'bg.png');
							var options = new ExportOptionsSaveForWeb();
							options.format = SaveDocumentType.PNG;
							options.PNG8 = true;
							doc.exportDocument(img, ExportType.SAVEFORWEB, options);
						},
						jpg:function(){
							var img = new File (config.dir + '/' + 'bg.jpg');
							var options = new ExportOptionsSaveForWeb();
							options.format = SaveDocumentType.JPEG;
							options.quality = win.option.image.q.s.text;
							doc.exportDocument(img, ExportType.SAVEFORWEB, options);
						},
						gif:function(){
							var img = new File (config.dir + '/' + 'bg.gif');
							var options = new ExportOptionsSaveForWeb();
							options.format = SaveDocumentType.COMPUSERVEGIF;
							doc.exportDocument(img, ExportType.SAVEFORWEB, options);
						}
				}
				win.buttons.ok.onClick = function(){
					//保存
					var img = new File (config.dir + '/' + 'bg.png'),
						 options = new ExportOptionsSaveForWeb(),
						 htmlCode = creatPage();
					if(config.dir ===''){
						alert('请选择需要保存的路径');
						return;
					}
					exportImg[config.image.extension]();
					saveFile(config.dir + '/' + 'background.html', htmlCode , 'GBK');
					win.close();
				}
				win.show();
				function saveFile(fileName, content, encoding){
					if(encoding){encoding = "GBK"}
					var f = new File (fileName);
					f.encoding = encoding;
					f.open('w', 'HTML');
					f.write(content);
					f.close();
				}
				//遍历图层，获取坐标
				function getAllVisibleLayers(){
					var tempLayers = [];
					for( var i = 0; i< layers.length; i++){
						if(layers[i].visible){
							var layer = layers[i],
								bounds = layer.bounds,
								left = bounds[0].value,
								top = bounds[1].value,
								width = bounds[2].value - bounds[0].value,
								height = bounds[3].value - bounds[1].value; 
							var info = {
								left: left || 0,
								top: top || 0,
								width: width || 0,
								height: height || 0
							}
						if( info.width > 0)
							tempLayers.push(info);
						}
					}
					return tempLayers;
				}
				//生成html文档
				function creatPage(){
					var html = new XML('<html></html>'),
					head = new XML('<head></head>'),
					meta = new XML('<meta charset="gbk"/>'),
					title = new XML('<title>background-position</title>'),
					body = new XML('<body></body>'),
					doc = new XML('<div id="doc" class="page-doc"></div>'),
					h1 = new XML('<h1>background info</h1>'),
					imgInfo = new XML('<div class="line">image info: width:'+ app.activeDocument.width +'; height:' +app.activeDocument.height+';</div>');
					
					head.appendChild(title);
					head.appendChild(meta);
					
					html.appendChild(head);
					html.appendChild(body);
					body.appendChild(doc);
					doc.appendChild(h1);
					doc.appendChild(imgInfo);
					var str = [], text= [], aa = [], left = 0, top = 0,
					alllayersInfo = getAllVisibleLayers();
					str.push('<style type="text/css">*{margin:0;padding:0} h1{border-left:solid 6px #0a4698;padding:5px 10px;font-size:2em;font-family: arial;margin-bottom:20px;}.bg{background:url(bg.' + config.image.extension +') no-repeat;text-indent:-9999px;overflow:hidden;}body{font-size:14px;}.page-doc{width:960px;margin:0px auto;padding:20px 0;}.line{padding:10px;margin:5px 0;background:#f7f7f7;border-bottom:1px solid #ddd;}.line span{vertical-align: middle;}' )
					for(var i = 0, len = alllayersInfo.length; i<len; i++){
						left = alllayersInfo[i].left >0 ? '-' + alllayersInfo[i].left + 'px' :0;
						top = alllayersInfo[i].top > 0 ? '-' + alllayersInfo[i].top + 'px' :0;
						str.push('.img'+ i + ' .icon{display:inline-block;width:' + alllayersInfo[i].width + 'px;height:' + alllayersInfo[i].height + 'px;background-position:' + left + ' ' + top + ';}'); 
						var span = new XML ('<span class="icon bg"> '+i+'</span>'),
							div = new XML('<div class="img' + i + ' line">img' + i +'</div>'),
							txt = new XML('background-position:'+ left  +' '+ top +';width:' + alllayersInfo[i].width +'px; height:' + alllayersInfo[i].height+'px;' )
						doc.appendChild(div);
						div.appendChild(span);
						div.appendChild(txt);
					}
					str.push('</style>');
					head.appendChild(new XML(str.join('')));
					return '<!DOCTYPE html>\r'+html.toXMLString().replace('imgspan','');	
				}
})();


