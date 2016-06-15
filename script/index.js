var Tile = React.createClass({
	getInitialState: function(){
		return {
			num: this.props.num,
			index: this.props.index
		}
	},
	getdefaultProps:function(){
		return {
			num:0,
			index:0
		}
	},
	render: function(){
	
		var class_ ="value" + this.props.num +  " tile position" + this.props.index ; 
		return (
			<div className={class_}>{this.props.num}</div>	
		)
	}

});



var Game = React.createClass({
	getRandomNum:function(num){
		return Math.floor(Math.random()*num);//传出[0,num)的数
	},
	handlerclick:function(){
		    document.getElementsByClassName('finish')[0].style.display = "none";
		    var tiles_ = new Array(16);
			
			var num,sum = 0;
			while(sum !== 2){
				num = this.getRandomNum(16);
				if(tiles_[num] >= 0 )continue;
				else{
					tiles_[num] =2;
					sum++;
				}
			}
			
			this.setState({tiles:tiles_});
	},
	getInitialState:function(){
		document.onkeydown = this.handlerKeydown;
		document.getElementById("again").onclick = this.handlerclick;
		    var tiles_ = new Array(16);
			
			var num,sum = 0;
			while(sum !== 2){
				num = this.getRandomNum(16);
				if(tiles_[num] >= 0 )continue;
				else{
					tiles_[num] =2;
					sum++;
				}
			}
	
			return{
				tiles: tiles_
			}

	},
	getDefaultProps: function(){
	
	
	
	},
	newGame:function(){
		var tiles_ = Array(16);
		var num,sum = 0;
		while(sum !== 2){
			num = this.getRandomNum(16);
			if(tiles_[num] >= 0 )continue;
			else{
				tiles_[num] =2;
				sum++;
			}
		}

		this.setState({
			tiles:tiles_
		})

	},
	render:function(){
		
		return(
			<div id= "container_" onKeydown={this.handlerKeydown}>
				<div className="total_score">total score:{this.score}</div>
				{this.renderChoices()}
			</div>
			)
		
	},
	
	oneTotwo:function(n){
		return {
			x: n%4,
			y: Math.floor(n / 4)
		}
	},
	twoToone:function(n){
		return n.x + n.y * 4;
	},
	renderGrid:function(){
		this.props.grid.map()
	},
	handlerKeydown:function(e){
		var tiles_ = this.state.tiles;
		
        var direc = e.which;
        var flag = false;
        //用于判断网格是否满了，也就是游戏是否已经结束，失败。
        var flag_ = false;
        var newCreate = [];
			for(var i = (direc <= 38 ? 1:2); i >= 0&&i<=3;direc <= 38 ? i++:i--){
				for( var j = 0 ; j < 4; j++){
					
					var position = {x:(direc == 37 || direc == 39?i:j),y:(direc==38 ||direc == 40?i:j)};
					
					if(tiles_[this.twoToone(position)] !== undefined){
						
					    var modified = [];
						var one = this.twoToone(position);
						
						var index = this.getNextPosition(position,tiles_,e.which);
						
						if(index !== one){
							if(tiles_[index] == undefined ){
								tiles_[index] = tiles_[one];
								modified.push(index);
								tiles_[one] = undefined;
								flag=true;
							}
							else if(tiles_[one] == tiles_[index]){
								if(newCreate[index] == tiles_[one]){
									if(direc ==37) {
										tiles_[index+1] = tiles_[one];
										tiles_[one] = undefined;
									}else if(direc == 38){
										tiles_[index+4] = tiles_[one];
										tiles_[one] = undefined;
									}else if(direc == 39){
										tiles_[index-1] = tiles_[one];
										tiles_[one] = undefined;
									}else if(direc == 40){
										tiles_[index-4] = tiles_[one];
										tiles_[one] = undefined;
									}
								}else{
									this.score = this.score + tiles_[index];
									newCreate[index] = tiles_[index]*2;
									tiles_[index] *=2;

									tiles_[one] = undefined;
									flag=true;
								}
								
							}
						}
					}
				}
			}
				
			
			


			//=================insert new tiles
			if(flag){
				tiles_[this.getRandomPosition(tiles_)] = 2;

			}
			if(tiles_.indexOf(2048) !== -1){
				alert("你赢了！！！！");
				document.getElementsByClassName("finish")[0].style.display = "block";
			}
			console.log(tiles_);
			
				
	  tiles_.forEach(function(e,index){
	  		if(e == undefined){
	  			flag_ = true;
	  			return;
	  		}
	  });
	  if(!flag_){
	  		alert("游戏失败");
	  		this.newGame();
	  		return;
	  }

		this.setState({
			tiles:tiles_
		});	
	},
	getRandomPosition: function(tiles){     //find the free index,so that place the new tile;
		var array_tiles = tiles;
		
		var array_temp = [];
		for (var i = 0; i < 16; i++) {
			if(array_tiles[i] == undefined)
			{
				array_temp.push(i);
			}
		}
		return array_temp[this.getRandomNum(array_temp.length)];

	},
	renderChoices:function(){
		return this.state.tiles.map(function(choice,i){
			    var AnswerItemFactory = React.createFactory(Tile);
			    
				return AnswerItemFactory({
					num:choice,
					index:i
				});
			
			
		}.bind(this));
	},
	score:0
	,
	getNextPosition:function(position,tiles,direc){
		var num = tiles[this.twoToone(position)];
		var result = this.twoToone(position);
		switch(direc){
			case 37:
			  for(var i = position.x; i >= 1; i--){
			  	var index = this.twoToone({x:i-1,y:position.y})

			  	if(tiles[index] == undefined){
			  		result = index;
			  	} else if(tiles[index] == num){
			  		result = index;
			  		break;
			  	}else{
			  		result = index + 1;
			  		break;
			  	}
			  }
			  break;
			 case 38:
			 	for(var i = position.y ; i >= 1; i--){
				  	var index = this.twoToone({x:position.x,y:i-1})
				  if(tiles[index] == undefined){
			  		result = index;
			  	} else if(tiles[index] == num){
			  		result = index;
			  		break;
			  	}else{
			  		result = index + 4;
			  		break;
			  	}

			    }
			   break;
			  case 39:
			  for(var i = position.x; i <= 2; i++){
			  	var index = this.twoToone({x:i+1,y:position.y})
				  
				if(tiles[index] == undefined){
			  		result = index;
			  	} else if(tiles[index] == num){
			  		result = index;
			  		break;
			  	}else{
			  		result = index - 1;
			  		break;
			  	}
			  }
			  break;
			   case 40:
			 	for(var i = position.y; i <=2 ; i++){
				  	var index = this.twoToone({x:position.x,y:i+1})
				  	if(tiles[index] == undefined){
			  		result = index;
			  	} else if(tiles[index] == num){
			  		result = index;
			  		break;
			  	}else{        
			  		result = index - 4;
			  		break;
			  	}
			    }
			   break;
		}
		return result;
	}
});

ReactDOM.render(<Game/>,document.getElementById('container'));