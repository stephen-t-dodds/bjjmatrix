import React, { useEffect } from "react";
import Tree from 'react-d3-tree';
import clone from 'clone';
import axios from 'axios';

import Modal from "./Modal";

const countNodes = (count = 0, n) => {
  // Count the current node
  count += 1;
  n.id = count;

  // Base case: reached a leaf node.
  if (!n.children) {
    return count;
  }

  // Keep traversing children while updating `count` until we reach the base case.
  return n.children.reduce((sum, child) => countNodes(sum, child), count);
};

const findNodes = (count = 0, n, cn, nn) => {
  if (count > 0) {
    return;
  }

  if (n.name == cn.name && n.id == cn.id) {
    count = 1;
    if (n.children) {
      n.children.push(nn);
    } else { 
      n.children = [];
      n.children.push(nn);
    }
    return;
  }

  // Base case: reached a leaf node.
  if (!n.children) {
    return;
  }

  // Keep traversing children while updating `count` until we reach the base case.
  n.children.reduce((sum, child) => findNodes(sum, child, cn, nn), count);
};

// for findRoute function
const flowData = {};
const findRouteMain = (start, end, path) => {
  if (start.id == end.id) {
    console.log("route");
    console.log([...path, end.id]);
    return;
  }

  if (!start.children) {
    return;
  }

  for (var i = 0; i < start.children.length; i ++) {
    if (start.children[i].id > end.id) {
      return;
    }
    findRouteMain(start.children[i], end, [...path, start.id]);
  }
};

const findRoute = (stNode, edNode) => {
  flowData = {};
  findRouteMain(stNode, edNode, []);
  return flowData;
};

const RightContext = (props) => {

  let totalNodeCount = props.json_data.name == undefined ?
            0 : countNodes(0, Array.isArray(props.json_data) ? props.json_data[0] : props.json_data);

  // modal dialog
  const [show, setShow] = React.useState(false);
  const [addItem, setAddItem] = React.useState('');

  const [originNode, setOriginNode] = React.useState({});
  const [currentNode, setCurrentNode] = React.useState({});
  const [startNode, setStartNode] = React.useState({});
  const [endNode, setEndNode] = React.useState({});
  const [context, setContext] = React.useState(false);
  const [xYPosistion, setXyPosistion] = React.useState({ x: 0, y: 0 });

  const showNav = (event) => {
    event.preventDefault();
    setContext(false);
    const positionChange = {
      x: event.pageX,
      y: event.pageY,
    };
    setXyPosistion(positionChange);
    setContext(true);

    setCurrentNode(originNode);
  };
  const hideContext = (event) => {
    setContext(false);
  };
  const initMenu = (chosen) => {
    let stNode, edNode;

    if (chosen == 0) {
      // add node
      if (currentNode.data == undefined) {
        return;
      }

      setShow(true);
      return;
    }
    else if (chosen == 1) {
      // start position 
      setStartNode(currentNode);
      stNode = currentNode;
      edNode = endNode;
    }
    else if (chosen == 2) {
      // end position
      setEndNode(currentNode);
      stNode = startNode;
      edNode = currentNode;
    } else {
      return;
    }

    if (stNode.data != undefined && edNode.data != undefined) {
      if (stNode.data.id > edNode.data.id) {
        props.setFlowData(findRoute(edNode.data, stNode.data));
      } else {
        props.setFlowData(findRoute(stNode.data, edNode.data));
      }
    }
  };

  const onCloseModal = () => {
    setShow(false);
  };

  const addNewItem = (item) => {
    const data = clone(props.json_data);
    findNodes(0, data, currentNode.data, {name: item, id: ++ totalNodeCount});

    // Save to JSON File
    try {
      axios.post(
        'http://localhost:9000/writeJson', {
          data: totalNodeCount > 1 ? data : {name: item, id: totalNodeCount}
        }
      )
      .then(function(res) {
        console.log('fetch data again');
      });

      props.fetch();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Modal 
        onClose = {onCloseModal} 
        setAddItem = {setAddItem}
        addItem = {addNewItem}
        show={show} />

      <div
        className="contextContainer"
        onContextMenu={showNav}
        onClick={hideContext}
      >
        <Tree
          data={ props.json_data }
          orientation={ 'vertical' }
          collapsible={ false }
          zoom={ 1 }
          scaleExtent={{ min: 0.1, max: 5 }}
          onNodeClick={(node, evt) => {
            //console.log('onNodeClick', node, evt);
            //setCurrentNode(node);
          }}
          onNodeMouseOver={(node, evt) => {
            //console.log('onNodeMouseOver', node, evt);
            setOriginNode(node);
            !context && setCurrentNode(node);
          }}
          onNodeMouseOut={(node, evt) => {
            //console.log('onNodeMouseOut', node, evt);
            setOriginNode({});
            !context && setCurrentNode({});
          }}
          />
        {context && (
          <div
            style={{ top: xYPosistion.y, left: xYPosistion.x }}
            className="rightClick"
          >
            <div className="menuElement" onClick={() => initMenu(0)}>
              Add Node
            </div>
            <div className="menuElement" onClick={() => initMenu(1)}>
              Start Position
            </div>
            <div className="menuElement" onClick={() => initMenu(2)}>
              End Position
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default RightContext;