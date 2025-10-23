let cols,rows;

//SETTINGS
const [width, height] = [400,400]  //Canvas size in px
const tile   = 10  //Tile size in px
const speed  = 5//Framerate (updates/frame)


//init the grid matrix - First loop creates the columns and second loop creates the rows + data in them
function makeMatrix(col, row){
  var matrix = [];
  for ( var i = 0; i < col; i++ ) {
    matrix[i] = []
    for (var j = 0; j <row; j++){
      matrix[i][j] = 0
    }
  }
  return(matrix);
}

function expandTerritory(grid, x, y){
  has_left = x-1 >= 0
  has_right = x+1 < cols 
  has_top = y-1 >= 0 
  has_bottom = y+1 < rows
  
  
  // Left value is if cell exists, right value is coordinates of it
  let result = {
    "left"         :[has_left, [-1,0] ],
    "top_left"     :[has_left && has_top,  [-1,-1]], 
    "top_right"    :[has_right && has_top, [1, -1]],
    "right"        :[has_right, [1,0]],
    "top"          :[has_top, [0,-1]],
    "bottom"       :[has_bottom, [0,1]],
    "bottom_left"  :[has_left && has_bottom, [-1,-1]],
    "bottom_right" :[has_right && has_bottom, [1,-1]]
  }

  for(const [key, value] of Object.entries(result)){
    if(value[0]){
      cell_y =  y+value[1][1]
      cell_x =  x+value[1][0]
      state =  grid[cell_x][cell_y]
      result[key] = {"isAvailable": true, "x": cell_x, "y": cell_y, "state_of_cell": state} 
    }
  }
  
  
  return result
}

function makeNextGrid(oldGrid){
  let cellsToSpreadTo
  let nextGrid = makeMatrix(cols, rows)
  let claim_requests = []
  
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let cellState = oldGrid[i][j]
      let expand = Math.floor(Math.random() * 10) >= 8 ? true : false 
    
      nextGrid[i][j] = cellState
      if(cellState == 2 || cellState == 3){
        cellsToSpreadTo = expandTerritory(oldGrid, i, j)
        for (const [_, data] of Object.entries(cellsToSpreadTo)){

          if(data.isAvailable && data.state_of_cell != 1){
            if(expand){
              claim_requests.push({
                "x" : data.x,
                "y" : data.y,
                "change_to"     : cellState
              })
            }
          }
        }
      }     
    }
  }

  //Handle expansion conflicts 
  let claimMap = {}
  for(let claim of claim_requests){
    let key = `${claim.x}_${claim.y}`

    //Check if value exists already, initialize it if not. undefined/none are counted as false
    if(!claimMap[key]){
      claimMap[key] = []
      claimMap[key].push(claim)
    }
  }

  for(let key in claimMap){
    let claims = claimMap[key]
    let winner = claims[Math.floor(Math.random() * claims.length)]
    nextGrid[winner.x][winner.y] = winner.change_to
  }

  return(nextGrid)
}
  

function updateDisplay(gridToDisplay){
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      //Scaling up size of a tile to pixels 
      let x = i*tile
      let y = j*tile
      stroke(0)
      
      if (gridToDisplay[i][j] == 1){
        fill(255, 165, 0)
      } 
      else if(gridToDisplay[i][j] == 2){
        fill(0, 0 , 255)
      }
      else if(gridToDisplay[i][j] == 3){
        fill(255,0,0)
      }
      else{
        fill(255)
      }
      rect(x, y, tile, tile)
      
    }
  }
}


function setup() {
  createCanvas(width, height);
  
  //Dynamically get the measurements so that it can be adjusted later
  cols = width/tile
  rows = height/tile
  grid = makeMatrix(cols, rows)
    
  //Initialize food/resource node locations 
  // [x][y] - 0,0 is top left, y increase downwards
  grid[1][1] = 1
  grid[2][1] = 1
  grid[8][8] = 3
  grid[0][0] = 2
  grid[rows-1][0] = 2
  grid[8][5] = 2
  grid[0][cols-5] = 2
  grid[rows-1][cols-1] = 3
  
  // BEGIN DRAWING
  updateDisplay(grid)
  
  frameRate(speed)
}

function draw() { 
  background(220);
  
  grid = makeNextGrid(grid)
  updateDisplay(grid)
  print("Updated")
  
}
