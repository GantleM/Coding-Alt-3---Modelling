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

function frequency(arr, x_value, y_value){
    count = 0
    positions = []
    for(let i = 0; i < arr.length; i++){
        if(arr[i]["x"] == x_value && arr[i]["y"] == y_value){
            count++
            positions.push(i)
        }
    }
    return [count, positions]
}

function handleConflict(claim_requests, grid){
    // console.log(claim_requests)
    for(let request of claim_requests){
        // console.log(claim_requests)
        // console.log(frequency(claim_requests,"x" ,request.x))

        let affected_cell = frequency(claim_requests, request.x, request.y)

        if (affected_cell[0] > 1){
            for(let i of affected_cell[1]){
                //HELP ME BRO
               
            }
        }
    }
}


function makeNextGrid(oldGrid){
    let cellsToSpreadTo
    let nextGrid = makeMatrix(cols, rows)
    let claim_requests = []

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let cellState = oldGrid[i][j]
            let expand = Math.floor(Math.random() * 10) >= 8 ? true : false 
            switch(cellState){
                case 1:
                    nextGrid[i][j] = 1
                    break
                    
                case 2:
                    nextGrid[i][j] = 2
                    cellsToSpreadTo = expandTerritory(oldGrid, i, j)
                    
                    // print(expandTerritory(oldGrid, 1, 1))
                    
                    // LOGIC ERROR - cells overwritten
                    for (const [_, data] of Object.entries(cellsToSpreadTo)){
                    // IF the direction is open and has an empty value
                    if(data.isAvailable && data.state_of_cell != 1){
                        if(expand){
                          // fill the cell at that empty position
                          nextGrid[data.x][data.y] = 2
                          claim_requests.push({
                              "x" : data.x,
                              "y" : data.y,
                              "change_to"     : 2
                          })
                          }
                        
                    }
                    }
                    
                    break
                    
                    
                case 3:
                    nextGrid[i][j] = 3
                    cellsToSpreadTo = expandTerritory(oldGrid, i, j)
                
                    for (const [_, data] of Object.entries(cellsToSpreadTo)){
                    // IF the direction is open and has an empty value
                    if(data.isAvailable && data.state_of_cell != 1){
                        
                        
                        if(expand){
                        // fill the cell at that empty position
                          nextGrid[data.x][data.y] = 3
                          claim_requests.push({
                              "x" : data.x,
                              "y" : data.y,
                              "change_to"     : 3
                          })
                          }
                    }
                    }
                    
                    break
            }
        }
    }


    //Constants/currents are placed in, now need to handle expansions / "attacks" then merge these
    let nextGrid_resolved = handleConflict(claim_requests, nextGrid)

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
