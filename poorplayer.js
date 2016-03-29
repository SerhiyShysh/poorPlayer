var MyRadioPlayer=function()
{

	this.audioPlay=null;
	this.parent=null;
	this.skin_data=null;
	this.skin_url=null;
	this.skin_img_folder_url=null;
	
	this.player_div=null;
	
	this.bg_img = null;
	
	this.play_button_node = null;
	this.stop_button_node = null;
	this.indicator_node = null;
	this.text_node = null;
	
	this.play_button_img = null;
	this.play_button_img_click = null;
	
	this.stop_button_img = null;
	this.stop_button_img_click = null;
	
	this.indicator_img_active = null;
	this.indicator_img_not_active = null;
	
	this.c1 = null;
	this.c2 = null;
	
	this.vol_x = null;
	this.vol_width = null;
	
	this.volume=0.7;
	
	this.radio_url=null;
	
	
	this.skin_attr=function(t,a)
	{
		return this.skin_data.getElementsByTagName(t)[0].getAttribute(a);
	}
	
	this.new_node = function(tag, x,y,w,h)
	{
		node = document.createElement(tag);
		node.style.position = 'absolute';
		node.style.top = y+'px';
		node.style.left = x+'px';
		
		if(w == null)
			return node;
		
		node.style.width = w+'px';
		node.style.height = h+'px';
		
		return node;
	}
	
	this.ShowMessage = function(msg)
	{

		var tn = this.parent.getElementsByClassName('my-player-text')[0];
		tn.innerHTML = msg;
	}
	
	this._RedrawVolumeBars=function()
	{
		if(this.skin_attr('volume', 'mode') == 'bars')
		{
			var bars = this.parent.getElementsByClassName('my-player-volume-bar');
				
			for(i=0; i<bars.length; i++)
			{
				if((i/bars.length) < this.GetVolume())
				{
					bars[i].style.backgroundColor=this.c1;
				}
				else
				{
					bars[i].style.backgroundColor=this.c2;
				}
			}
		}
		else
		{
			this.parent.getElementsByClassName('my-player-volume-holder')[0].style.left = this.vol_x+this.vol_width*this.GetVolume()+'px';
		}
	}
	
	
	this._DrawVolumeBars=function()
	{
		var x = Number(this.skin_attr('volume','x'));
		var y = Number(this.skin_attr('volume','y'));
		var w = Number(this.skin_attr('volume','width'));
		var h = Number(this.skin_attr('volume','height'));
		var bw = Number(this.skin_attr('volume','barwidth'));
		var bs = Number(this.skin_attr('volume','barStep'));
	
		this.vol_x = x;
		this.vol_width = w;
	
		// if mode "bars"
		if(this.skin_attr('volume','mode') == 'bars')
		{	
			this.c1 = this.skin_attr('volume','colOr1');
			this.c2 = this.skin_attr('volume','color2');
		
			var count = Math.round(w / bs);
			var dh = (h-1)/(count-1);
		
			for(var i=0; i<count;i++)
			{
				var top = y + (h-1 - i*dh);
				var left = x + bs*i;
				var height = 1+i*dh;//Math.floor(1+i*dh);
				
				color = ((i+1)/(count) < this.audioPlay.volume)?(this.c1):(this.c2);
				
				var el = this.new_node('div', left, top, bw, height);
				el.className = 'my-player-volume-bar';
				el.style.backgroundColor = color;
				
				this.player_div.appendChild(el);
				
			}
		} // if mode "holder"
		else
		{
			var left = x + w*this.GetVolume();
			
			var el = this.new_node('img', left, y);
			el.className = 'my-player-volume-holder';
			el.src = this.skin_img_folder_url + this.skin_attr('volume','holderImage');
			this.player_div.appendChild(el);
		}
			
		// receive click to regulate volume
		var el = this.new_node('div', x,y,w,h);
		el.style.opacity = '0%';
		el.playerInstance = this;
		
		el.onclick = function(e){
			//var X = e.pageX - this.offsetLeft ;
			var X = e.layerX;
			this.playerInstance.SetVolume(X/this.clientWidth);
		}

		this.player_div.appendChild(el);
	}
	
	
	this.Render=function()
	{
		var tmp = this.skin_url.split('/');
		tmp.pop();
		var path = tmp.join('/');
		
		this.skin_img_folder_url = path + '/' + this.skin_attr('ffmp3-skin','folder')+'/';
		
		
		this.player_div = document.createElement('div');
		this.player_div.className = 'my-player';
		this.player_div.style = "position: relative";
		
		this.bg_img = document.createElement('img');
		this.bg_img.className = 'my-player-bg';
		this.bg_img.src = this.skin_img_folder_url + this.skin_attr('bg','image');
		this.bg_img.style = "margin:0px; padding:0px";
		
		this.player_div.appendChild(this.bg_img);
		

		// play button
		this.play_button_node = this.new_node('img', this.skin_attr('play','x'), this.skin_attr('play','y'));
		this.play_button_node.src = this.skin_img_folder_url + this.skin_attr('play','image');
		this.play_button_node.style.opacity = '0.0';

		
		this.play_button_node.playerInstance = this;
		
		this.play_button_node.onmouseover = function(){
				this.style.opacity = "1.0";
			};
			
		this.play_button_node.onmouseout = function(){
				this.style.opacity = "0.0";
			};
		
		this.play_button_node.onmousedown = function(){
				this.src = this.playerInstance.skin_img_folder_url + this.playerInstance.skin_attr('play','clickimage');
			};

		this.play_button_node.onmouseup = function(){
				this.src = this.playerInstance.skin_img_folder_url + this.playerInstance.skin_attr('play','image');
			};
			
		this.play_button_node.onclick = function(){
				this.playerInstance.Play();
			};

			
		this.player_div.appendChild(this.play_button_node);
		
		
		
		//// stop button
		this.stop_button_node = this.new_node('img', this.skin_attr('stop','x'), this.skin_attr('stop','y'));
		this.stop_button_node.src = this.skin_img_folder_url + this.skin_attr('stop','image');
		this.stop_button_node.style.opacity = '0.0';
		
		
		this.stop_button_node.playerInstance = this;
		
		this.stop_button_node.onmouseover = function(){
				this.style.opacity = "1.0";
			};
			
		this.stop_button_node.onmouseout = function(){
				this.style.opacity = "0.0";
			};
		
		this.stop_button_node.onmousedown = function(){
				this.src = this.playerInstance.skin_img_folder_url + this.playerInstance.skin_attr('stop','clickimage');
			};

		this.stop_button_node.onmouseup = function(){
				this.src = this.playerInstance.skin_img_folder_url + this.playerInstance.skin_attr('stop','image');
			};
		
		this.stop_button_node.onclick = function(){
				this.playerInstance.Stop();
			};
		
		
		this.player_div.appendChild(this.stop_button_node);
		
		
		///// indicator
		/////////////////////////////////////
		this.indicator_node = this.new_node('img', this.skin_attr('status','x'), this.skin_attr('status','y'));
		this.indicator_node.src = this.skin_img_folder_url+this.skin_attr('status', 'imageStop');
		
		this.player_div.appendChild(this.indicator_node);
		
		
		this.audioPlay.playerInstance = this;
		this.audioPlay.onplaying = function(){
				this.playerInstance.indicator_node.src = this.playerInstance.skin_img_folder_url + this.playerInstance.skin_attr('status', 'imagePlay');
			};
		
		this.audioPlay.onpause = function(){
				this.playerInstance.indicator_node.src = this.playerInstance.skin_img_folder_url + this.playerInstance.skin_attr('status', 'imageStop');
			};
		
		
		// text node
		this.text_node = this.new_node('div', this.skin_attr('text','x'),
												this.skin_attr('text','y'),
												this.skin_attr('text','width'),
												this.skin_attr('text','height'));
		
		this.text_node.style.color = this.skin_attr('text','color');
		this.text_node.style.fontFamily = this.skin_attr('text','font');
		this.text_node.style.fontSize = this.skin_attr('text','size')+'pt';
		
		this.text_node.className = 'my-player-text';
		
		this.player_div.appendChild(this.text_node);
		

		
		this._DrawVolumeBars();

		this.parent.appendChild(this.player_div);
	}
	
	this.SetSkinXML=function(xml)
	{
		this.skin_data=xml;
		this.Render();
	}
	
	this.LoadSkin=function(url)
	{
		this.skin_url=url;
		$.get(url, $.proxy(this.SetSkinXML, this));
	}
	
	this.SetRadioUrl=function(url, start_play)
	{
		this.radio_url = url;
		
		this.audioPlay = new Audio(url);
		this.audioPlay.volume=this.volume; // default
		if(start_play) this.audioPlay.play();
	}
	
	this.Stop=function()
	{
		this.audioPlay.pause();
		this.ShowMessage('stop');
	}
	
	this.Play=function()
	{
		this.audioPlay.play();
		this.ShowMessage('play');
	}

	this.SetVolume=function(v)
	{
		this.volume = v;
		
		if(this.audioPlay != null) this.audioPlay.volume=this.volume;
		
		this._RedrawVolumeBars();
		this.ShowMessage('volume: '+Math.round(v*100)+'%');
	}
	
	this.GetVolume=function()
	{
		return this.volume;
	}
	
	this.RenderTo=function(node)
	{
		this.parent=node;
	}
	
	this.IsPlaying=function()
	{
		return !(this.audioPlay == null || this.audioPlay.muted); 
	}
	
	this.Setup = function(node, skin, url)
	{
		this.RenderTo(node);
		this.LoadSkin(skin);
		this.SetRadioUrl(url);
	}
}
