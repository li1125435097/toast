# toast
light toast for fore-end

# grammar
``` html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
		<title></title>
	</head>
	<body>
    <textarea name="" id="" cols="30" rows="10" onclick='toast("你好")'></textarea>
		<textarea name="" id="" cols="30" rows="10" onclick='warning("你好1")'></textarea>
		<textarea name="" id="" cols="30" rows="10" onclick='danger("你好2")'></textarea>
		<textarea name="" id="" cols="30" rows="10" onclick='success("你好3")'></textarea>
		<script src="./toast.js"></script>
		<script>
      onload = function(){
        okbox('确认删除吗？',()=>{console.log('你已点击确认')})
        
        setTimeout(()=>{
          toast('收到覅',"padding:12px 60px;font-size:3rem;")
        },1e10)
        
      }
    </script>
	</body>
</html>
```

