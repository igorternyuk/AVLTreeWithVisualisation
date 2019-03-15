class AVLTree {
  constructor(comparator = (a, b) => {
    return a > b ? 1 : (a < b ? -1 : 0);
  }){
    this.root = null;
    this.comparator = comparator;
    this.height = 0;
    this.hightChanged = true;
  }

  getBalance(node){
      if(!node){
          return 0;
      } else {
          return this.getHeight(node.leftChild) - this.getHeight(node.rightChild);
      }
  }

  getHeight(node){
    if(!node){
      return -1;
    }
    return Math.max(this.getHeight(node.leftChild), this.getHeight(node.rightChild)) + 1;
  }

  rotateLeft(pivot){
      console.log("rotateLeft()");
      if(!pivot || !pivot.rightChild){
          return;
      }
      let newRoot = pivot.rightChild;
      let tmp = newRoot.leftChild;
      newRoot.leftChild = pivot;
      pivot.rightChild = tmp;
      return newRoot;
    }

  rotateRight(pivot){
      console.log("rotateRight()");
      if(!pivot || !pivot.leftChild){
          return;
      }
      let newRoot = pivot.leftChild;
      let tmp = newRoot.rightChild;
      newRoot.rightChild = pivot;
      pivot.leftChild = tmp;
      return newRoot;
  }

  getMaxHeight(){
    if(!this.hightChanged){
      return this.height;
    } else {
      this.hightChanged = false;
      this.height = this.getHeight(this.root);
      return this.height;
    }
  }

  insert(data){
    console.log("Inserting " + data);
    this.hightChanged = true;
    this.root = this.insertNode(this.root, data);
  }

  insertNode(rootNode, data){
      console.log("insertNode " + data);
    if(!rootNode){
        return new Node(data);
    }
    if(this.comparator(data, rootNode.data) < 0){
        console.log("Go to the left");
        rootNode.leftChild = this.insertNode(rootNode.leftChild, data);
    } else if(this.comparator(data, rootNode.data) > 0){
        console.log("Go to the right");
        rootNode.rightChild = this.insertNode(rootNode.rightChild, data);
    } else {
        console.log("Update the data");
        rootNode.data = data;
    }
    return this.insertFixup(rootNode, data);
  }

  insertFixup(node, data){
      console.log("Insert fixup");
      let balance = this.getBalance(node);
      console.log("Node " + node.data + " Balance = " + balance);
      if(balance > 1){
          if(data < node.data){
              // Left-left heavy situation
              console.log("Left-left heavy situation");
              return this.rotateRight(node);
          }

          if(data > node.data){
              // Left-right heavy situation
              console.log("Left-right heavy situation");
              node.leftChild = this.rotateLeft(node.leftChild);
              return this.rotateRight(node);
          }
      } else if(balance < -1){
          if(data > node.data){
              // Right-Right heavy situation
              console.log("Right-Right heavy situation");
              return this.rotateLeft(node);
          }

          if(data < node.data){
              // Right-left heavy situation
              console.log("Right-left heavy situation");
              node.rightChild = this.rotateRight(node.rightChild);
              return this.rotateLeft(node);
          }
      }

      return node;
  }


  inorderTraversal(node, visitFunc){
    if(!node){
      return;
    }
    this.inorderTraversal(node.leftChild, visitFunc);
    visitFunc(node);
    this.inorderTraversal(node.rightChild, visitFunc);
  }

  preorderTraversal(node, visitFunc){
    if(!node){
      return;
    }
    visitFunc(node);
    this.preorderTraversal(node.leftChild, visitFunc);
    this.preorderTraversal(node.rightChild, visitFunc);
  }

  postorderTraversal(node, visitFunc){
    if(!node){
      return;
    }
    this.postorderTraversal(node.leftChild, visitFunc);
    this.postorderTraversal(node.rightChild, visitFunc);
    visitFunc(node);
  }

  visualize(){
      //draw(this.root, canvasWidth / 2, nodeRadius, 0);
      this.render(this.root, canvasWidth / 2, nodeRadius, 0);
  }

  render(root, posX, posY, level){
    //console.log("Rendering the node x = " + posX + " y = " + posY);
    if(!root){
      return;
    }

    let maxHeight = this.getMaxHeight();
    //console.log("maxHeight = " + maxHeight);
    let dy = maxHeight !== 0 ? -(canvasHeight - 2 * nodeRadius) / maxHeight : 0;
    let dx = (canvasWidth - nodeRadius) / (Math.pow(2, level)) / 4;

    if(root.leftChild){
        line(posX, posY, posX - dx, posY - dy);
        this.render(root.leftChild, posX - dx, posY - dy, level + 1);
    }
    if(root.rightChild){
        line(posX, posY, posX + dx, posY - dy);
    }

    if(root.highlighted){
      fill(255, 255, 0);
    } else {
      fill(38,127,0);
    }
    ellipse(posX, posY, nodeRadius, nodeRadius);
    textAlign(CENTER);
    fill(255,255, 0);
    text(root.data, posX, posY + nodeRadius / 8);

    if(root.rightChild){
        this.render(root.rightChild, posX + dx, posY - dy, level + 1);
    }
  }

  walk(startNode, walkFunc, level){
    if(!startNode){
      return;
    }
    this.walk(startNode.leftChild, walkFunc, level + 1);
    walkFunc(startNode, level);
    this.walk(startNode.rightChild, walkFunc, level + 1);
  }

  size(){
    return this.countNodes(this.root);
  }

  countNodes(node){
    if(!node){
      return 0;
    }
    return this.countNodes(node.leftChild) + this.countNodes(node.rightChild) + 1;
  }

  getMax(){
    if(this.root){
      let currNode = this.root;
      while(currNode.rightChild){
        currNode = currNode.rightChild;
      }
      return currNode.data;
    } else {
      return null;
    }
  }

  getMin(){
    if(this.root){
      let currNode = this.root;
      while(currNode.leftChild){
        currNode = currNode.leftChild;
      }
      return currNode.data;
    } else {
      return null;
    }
  }


  remove(data){

  }

  removeFixup(node){

  }
}
