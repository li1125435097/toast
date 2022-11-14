/**
 *  提示框
 * @param {any} text   提示框内容
 * @param {string} mystyle  自定义提示框样式
 * @param {number} delay  提示框停留时间
 * @param {number} opacity  提示框显示透明度
 */
 function toast(text,mystyle="",delay=1,opacity=0.7){
	let style = `
	  background-color:black;
	  color:white;
	  font-size:12px;
	  font-weight:400;
	  width:fit-content;
	  padding:5px 15px;
	  border-radius: 3px;
	`
	style += mystyle
	
	// 同时渲染多个提示框弹出动画
	let toasts = document.querySelectorAll('.mytoast')
	Array.from(toasts).map(v=>v.style.top = `calc(50vh + ${-10+v.style.top.match(/\d+px/g)[0].slice(0,-2)}px)`)
	
	// 新建提示框容器，并添加事件
	let container = new Container(text,style,'mytoast',opacity)
	
	// 渲染提示框，渲染成功后激活自关闭事件
	container.render(()=>{
		setTimeout(function(){container.destory()},delay*1000)  // 默认1秒后关闭弹窗
	})
	
}

function success(text){toast(text,'background:#34a853;padding:10px 20px',1.5)}
function danger(text){toast(text,'background:#e13138;padding:10px 20px',1.5)}
function warning(text){toast(text,'background:#fbbc05;padding:10px 20px',1.5)}

/**
 *  确认框
 * @param {string} text 确认框显示的文本
 * @param {function} cb 点击确定后回调函数
 */
function okBox(text,cb){
	let html = `<div style="margin:30px 0 30px;">${text}</div>`
	interaction(html,'okbox',cb)
}

/**
 *  输入框
 * @param {Array} label 输入框的前的文本，数组可渲染多个输入框
 * @param {number} inputWidth 输入框宽度，百分比*100 正常取值60-80 
 * @param {function} cb 回调函数
 */
function inputBox(label,inputWidth=70,cb){
	label = Array.isArray(label) ? label : [label]
	let html = []
	let maxL = Math.max(label.map(v=>v.length))
	label.map(v=>html.push(`<label>${v.padStart(maxL,'*').replace(/\*/g,'&emsp;')}：</label><input id="inputbox" style="padding:3px;border:1px solid #ccc;border-radius:3px;margin-bottom:3px;text-indent:2px;width:${inputWidth}%;outline:none;color:#888"/>`))
	html = `<div style="font-size:12px;margin:15px 0 10px;">${html.join("")}</div>`
	
	let container = interaction(html,'inputbox',cb,function(){return Array.from(document.querySelectorAll('#inputbox')).map(v=>v.value)})
	container.ele.onblur = null
	document.querySelector('#inputbox').focus()
}

// 事件封禁函数
function eventBan(){
	event.preventDefault();
	event.stopPropagation();
	console.log('事件封禁中...');
	return false
}


/**
 *  交互框基容器
 * @param {Element} html 填充的html文本
 * @param {string} cname 容器类名
 * @param {function} cb 回调函数
 * @param {function} cbData 回调函数参数
 * @returns Container
 */
function interaction(html,cname,cb,cbData=new Function()){
	
	// 无回调不渲染
	if(typeof cb !== 'function') return toast("无回调函数！！！","padding:12px 60px;font-size:3rem;")
	
	// 清理余孽
	while(document.querySelector('.'+cname)){document.body.remove(document.querySelector('.'+cname))}

	// 定制确认html文本
	let myhtml = `
		<div style="color:#888;width: 300px;text-align: right;box-shadow: 0px 0px 9px -3px #aaa;border-radius: 5px;padding: 15px;">
			<div style="text-align:center;display: flex;align-items: center;justify-content: center;">${html}</div>
			<div style="padding:7px 20px;background-color: white;color: #2278e9;border-radius: 3px;font-size: 12px;font-weight: 500;width: fit-content;display: inline-block;border: 1px solid #e3e3e3;cursor: pointer;">取消</div>
			<div style="padding:7px 20px;background-color: #1973e8;color: white;border-radius: 3px;font-size: 12px;font-weight: 500;width: fit-content;display: inline-block;border: 1px solid transparent;cursor: pointer;">确定</div>
		</div>
	`
	
	// 新建交互框容器
	let container = new Container(myhtml,0,cname,1,0.1)
	container.render(()=>{
		let ele = container.ele.children[0]
		let no = ele.children[1]
		let ok = ele.children[2]

		no.onclick = function(){container.destory()}
		ok.onclick = function(){cb(cbData());container.destory()}
		
		container.hover(no,'background','#eaf2fd')
		container.hover(ok,'opacity',0.8)

		// 封锁body事件传播
		document.body.addEventListener('click',eventBan)
		
	})
	
	return container
}


/**
 *  弹出框容器父类(相当类于构造函数)
 * @param {Element} content html文本
 * @param {string} mystyle style文本
 * @param {string} cname 类名
 * @param {number} opacity 透明度 0-1
 * @param {number} animation 入场动画时间
 */
function Container(content,mystyle,cname,opacity,animation=0.5){
	this.scrollY = window.scrollY
	this.opacity = opacity
	this.style = `
		opacity: 0;
	  position: absolute;
	  top: calc(50vh + ${this.scrollY}px);
	  left: 50vw;
	  transform:translate(-50%,-50%);
	  outline:none;				
	  transition-duration:${animation}s;
	  transition-timing-function:ease-in;
		z-index:999999999;
		background:white;
	`
	this.style += mystyle
	
	// 标签构造
	this.ele = document.createElement('div')
	this.ele.className = cname
	this.ele.style = this.style
	this.ele.innerHTML = content
	this.ele.tabIndex = 1e7

}

/**
 *  弹出框容器添加标签渲染公共方法
 * @param {function} cb 渲染完成后钩子函数
 */
Container.prototype.render = function(cb){
	document.body.style.overflow = 'hidden'
	document.body.appendChild(this.ele)
	this.ele.focus()
	this.ele.onblur = ()=>{this.destory()}
	this.ele.style.opacity = this.opacity				// 渲染入场动画
	if(typeof cb == 'function') cb()
}

/**
 * 弹出框容器添加销毁标签公共方法
 * @param {function} cb 实例销毁后钩子函数
 */
Container.prototype.destory = function(cb){
	this.ele.style.opacity = 0;
	setTimeout(()=>{
		try{document.body.removeChild(this.ele)}catch(e){}
		document.body.style.overflow = ''
		if(typeof cb == 'function') cb()
		document.body.removeEventListener('click',eventBan)
	},500)
}

/**
 * 弹出框容器添加hover属性公共方法
 * @param {Element} ele Element对象
 * @param {string} k css属性 
 * @param {string} v css值
 */
Container.prototype.hover = function(ele,k,v){
	let oldValue = ele.style[k]
	ele.onmouseover = ()=>{ele.style[k] = v}
	ele.onmouseout = ()=>{ele.style[k] = oldValue}
}
