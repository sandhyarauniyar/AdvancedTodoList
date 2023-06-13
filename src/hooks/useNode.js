const useNode = () => {
    const insertNode = (tree,commentId,item) => {
        if(commentId === 1 || tree.id === commentId){
            let newNode = {
                id:new Date().getTime(),
                taskName:item,
                subtask:[]
            }

            if(tree.length === 0){
                return [{...newNode}];
            }
            else{
                tree.subtask.push(newNode);
                return tree;
            }
        }

        let latestNode = tree?.subtask?.map(task => {
            return insertNode(task,commentId,item)
        })

        return {...tree,subtask:latestNode}
    }

    const editNode = (tree,commentId,item) => {
            if(tree.id === commentId){
                    tree.taskName = item;
                    return tree;
            }
    
            tree?.subtask?.map(task => {
                return editNode(task,commentId,item)
            })
    
            return {...tree}
    }

    const deleteNode = (tree, id) => {
        for (let i = 0; i < tree.subtask.length; i++) {
          const currentItem = tree.subtask[i];
          if (currentItem.id === id) {
            tree.subtask.splice(i, 1);
            return tree;
          } else {
            deleteNode(currentItem, id);
          }
        }
        return tree;
      };

    return {
        insertNode,
        editNode,
        deleteNode
    };
}

export default useNode;