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
            return pivot;
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
            return pivot;
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
            console.log("Creating the new node with data = " + data);
            return new Node(data);
        }
        if(this.comparator(data, rootNode.data) < 0){
            console.log("Go to the left: data = " + data + " rootNode.data = " + rootNode.data);
            rootNode.leftChild = this.insertNode(rootNode.leftChild, data);
        } else if(this.comparator(data, rootNode.data) > 0){
            console.log("Go to the right: data = " + data + " rootNode.data = " + rootNode.data);
            rootNode.rightChild = this.insertNode(rootNode.rightChild, data);
        } else {
            console.log("Update the data: data = " + data + " rootNode.data = " + rootNode.data);
            rootNode.data = data;
        }
        return this.insertFixup(rootNode, data);
    }

    insertFixup(node, data){
        console.log("Insert fixup");
        let balance = this.getBalance(node);
        console.log("Node " + node.data + " Balance = " + balance);
        if(balance > 1 && data < node.leftChild.data){
            // Left-left heavy situation
            console.log("Left-left heavy situation");
            return this.rotateRight(node);
        }

        if(balance > 1 && data > node.leftChild.data){
            // Left-right heavy situation
            console.log("Left-right heavy situation");
            node.leftChild = this.rotateLeft(node.leftChild);
            return this.rotateRight(node);
        }

        if(balance < -1 && data > node.rightChild.data){
            // Right-Right heavy situation
            console.log("Right-Right heavy situation");
            return this.rotateLeft(node);
        }

        if(balance < -1 && data < node.rightChild.data){
            // Right-left heavy situation
            console.log("Right-left heavy situation");
            node.rightChild = this.rotateRight(node.rightChild);
            return this.rotateLeft(node);
        }
        return node;
    }

    remove(data){
        this.removeNode(this.root, data);
    }

    removeNode(node, data){
        if(this.comparator(data, node.data) < 0){
            node.leftChild = this.removeNode(node.leftChild, data);
        } else if(this.comparator(data, node.data) > 0){
            node.rightChild = this.removeNode(node.rightChild, data);
        } else {
            //The node we would like to remove has no children
            if(!node.rightChild && !node.leftChild){
                return null;
            }
            //The node we would like to remove has one child
            if(!node.leftChild){
                let newChild = node.rightChild;
                node = null;
                return newChild;
            } else if(!node.rightChild){
                let newChild = node.leftChild;
                node = null;
                return newChild;
            }
            //The node we would like to remove has two children
            let predecessor = this.getPredecessor(node);
            node.data = predecessor.data;
            node.leftChild = this.removeNode(node.leftChild, node.data);
        }
        return this.removeFixup(node);
    }

    getPredecessor(rootNode){
        if(!rootNode){
            return;
        };
        let currNode = rootNode.leftChild;
        while(currNode.rightChild !== null){
            currNode = currNode.rightChild;
        }
        return currNode;
    }

    removeFixup(node){
        console.log("removeFixup() node.data = " + node.data);
        let balance = this.getBalance(node);
        console.log("balance = " + balance);
        if(balance > 1){
            if(this.getBalance(node.leftChild) < 0){
                node.leftChild = this.rotateLeft(node.leftChild);
            }
            return this.rotateRight(node);
        } else if(balance < -1){
            if(this.getBalance(node.rightChild) > 0){
                node.rightChild = this.rotateRight(node.rightChild);
            }
            return this.rotateLeft(node);
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
        this.render(this.root, canvasWidth / 2, nodeRadius, 0);
    }

    render(root, posX, posY, level){
        if(!root){
            return;
        }

        let maxHeight = this.getMaxHeight();
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
            //fill(38,127,0);
            if(root.data === this.getMax()){
                fill(255,0,0);
            } else if(root.data === this.getMin()){
                fill(38,127,0);
            } else{
                fill(0,148,255);
            }

        }
        ellipse(posX, posY, nodeRadius, nodeRadius);
        textAlign(CENTER);

        if(root.highlighted){
            fill(255, 0, 0);
        } else {
            fill(255,255,0);
        }
        text(root.data, posX, posY + nodeRadius / 8);

        fill(127,0,0);
        let balance = this.getBalance(root);
        if(balance > 0){
            balance = "+" + balance;
        }
        text(balance, posX - nodeRadius / 2, posY - nodeRadius / 2);

        if(root.rightChild){
            this.render(root.rightChild, posX + dx, posY - dy, level + 1);
        }
    }

    flip(){
        this.flipSubtree(this.root);
    }

    flipSubtree(root){
        if(!root){
            return;
        }
        let tmp = root.rightChild;
        root.rightChild = root.leftChild;
        root.leftChild = tmp;
        this.flipSubtree(root.leftChild);
        this.flipSubtree(root.rightChild);
    }

    walk(startNode, walkFunc, level){
        if(!startNode){
            return;
        }
        this.walk(startNode.leftChild, walkFunc, level + 1);
        walkFunc(startNode, level);
        this.walk(startNode.rightChild, walkFunc, level + 1);
    }

    reversedWalk(rootNode, walkFunc, level){
        if(!rootNode){
            return;
        }
        this.reversedWalk(rootNode.rightChild, walkFunc, level + 1);
        walkFunc(rootNode, level);
        this.reversedWalk(rootNode.leftChild, walkFunc, level + 1);
    }

    printData(node, level){
        if(!node){
            return;
        }
        let spacing = "";
        for(let i = 0; i < level; ++i){
            spacing += "    ";
        }
        let color = node.color === Color.RED ? "R" : "B";
        console.log(spacing + color + node.data);
    }

    print(){
        this.reversedWalk(this.root, this.printData, 0);
    }

    isEmpty(){
        return this.size() === 0;
    }

    getMaxWidth() {
        if(this.isEmpty()){
            return 0;
        }
        let height = this.getMaxHeight();
        let maxWidth = 0;
        for (let level = 0; level <= height; level++) {
            let currentWidth = this.getWidth(this.root, level);
            if(currentWidth > maxWidth){
                maxWidth = currentWidth;
            }
        }
        return maxWidth;
    }

    getWidth(root, level){
        if(!root){
            return 0;
        }
        if(level == 1){
            return 1;
        } else if(level > 1){
            return this.getWidth(root.leftChild, level - 1)
            + this.getWidth(root.rightChild, level - 1);
        } else {
            return 0;
        }
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
}
