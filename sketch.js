var canvasWidth = 800;
var canvasHeight = 600;
var nodeRadius = 32;
var tree;
var initTime = 0;
var animation = [];
var highlightedIndex = -1;
var animationTimer = 0;
var animationActive = false;
var keyHandlers = {};

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    frameRate(2);
    tree = new AVLTree();
    for(let i = 0; i < 42; ++i){
        tree.insert(floor(random() * 900 + 100));
    }

    createKeyHandlers();
    console.log("tree.getMaxHeight() = " +  tree.getMaxHeight());
    console.log("tree.getMax() = " +  tree.getMax());
    console.log("tree.getMin() = " +  tree.getMin());
    console.log("tree.size() = " +  tree.size());
}

function createKeyHandlers(){
  keyHandlers['1'] = () => {
    console.log("Preorder");
    animation = [];
    tree.preorderTraversal(tree.root, (node) => {
      animation.push(node);
    });
    console.log("animation.size = " + animation.length);
    animationActive = true;
  };

  keyHandlers['2'] = function() {
    console.log("Inorder");
    animation = [];
    tree.inorderTraversal(tree.root, (node) => {
      animation.push(node);
    });
    console.log("animation.size = " + animation.length);
    animationActive = true;
  };

  keyHandlers['3'] = function() {
    console.log("Postorder");
    animation = [];
    tree.postorderTraversal(tree.root, (node) => {
      animation.push(node);
    });
    console.log("animation.size = " + animation.length);
    animationActive = true;
  };
}

//main loop
function draw() {
  var frameTime = (millis() - initTime) / 1000;
  animationTimer += frameTime;
  updateAnimation(frameTime);
	background(200);
  tree.visualize();
  initTime = millis();
}

function updateAnimation(frameTime){
  if(animationTimer >= 1){
    animationTimer = 0;
    if(animationActive){
      if(highlightedIndex >= animation.length - 1){
        animation = [];
        highlightedIndex = -1;
        tree.inorderTraversal(tree.root, (node) => {
          node.highlighted = false;
        });
        animationActive = false;
      } else {
        if(highlightedIndex >= 0){
            animation[highlightedIndex].highlighted = false;
        }
        ++highlightedIndex;
        animation[highlightedIndex].highlighted = true;
      }
    }
  }
}

function keyReleased(){
  if(typeof keyHandlers[key] !== undefined){
    console.log("Handler was found");
    keyHandlers[key]();
  } else {
    console.log("Handler not found");
  }
}
