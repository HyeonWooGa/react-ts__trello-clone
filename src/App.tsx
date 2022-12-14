import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import Board, { Area } from "./Components/Board";

const Container = styled.div`
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const I = styled.i`
  font-size: 50px;
  color: white;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 30px;
`;

const Boards = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    const { destination, draggableId, source } = info;
    console.log(info);
    if (!destination) return;

    if (destination.droppableId === "Delete") {
      // cross board movement.
      setToDos((allBoards) => {
        // 1) Delete item on source board
        const sourceBoard = [...allBoards[source.droppableId]];
        sourceBoard.splice(source.index, 1);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
        };
      });
    } else {
      if (destination.droppableId === source.droppableId) {
        // same board movement.
        setToDos((allBoards) => {
          const boardCopy = [...allBoards[source.droppableId]];
          // 1) Deldte item on source.index
          const targetToDo = boardCopy.splice(source.index, 1);
          // 2) Put back the item on the destination.index
          boardCopy.splice(destination?.index, 0, ...targetToDo);
          return {
            ...allBoards,
            [source.droppableId]: boardCopy,
          };
        });
      }
      if (destination.droppableId !== source.droppableId) {
        // cross board movement.
        setToDos((allBoards) => {
          // 1) Delete item on source board
          const sourceBoard = [...allBoards[source.droppableId]];
          const targetToDo = sourceBoard.splice(source.index, 1);
          // 2) put back the item on the destination board
          const destinationBoard = [...allBoards[destination.droppableId]];
          destinationBoard.splice(destination.index, 0, ...targetToDo);
          return {
            ...allBoards,
            [source.droppableId]: sourceBoard,
            [destination.droppableId]: destinationBoard,
          };
        });
      }
    }
    /*setToDos((oldToDos) => {
      const toDosCopy = [...oldToDos];
      // 1) Deldte item on source.index
      toDosCopy.splice(source.index, 1);
      // 2) Put back the item on the destination.index
      toDosCopy.splice(destination?.index, 0, draggableId);
      return toDosCopy;
    });*/
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Wrapper>
          <Container>
            <Boards>
              {Object.keys(toDos).map((boardId) => (
                <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
              ))}
            </Boards>
          </Container>
          <Container>
            <Droppable droppableId="Delete">
              {(magic, info) => (
                <Area
                  isDraggingOver={info.isDraggingOver}
                  isDraggingFromThis={Boolean(info.draggingFromThisWith)}
                  ref={magic.innerRef}
                  {...magic.droppableProps}
                >
                  <I className="fa-solid fa-trash-can"></I>
                  {magic.placeholder}
                </Area>
              )}
            </Droppable>
          </Container>
        </Wrapper>
      </DragDropContext>
    </>
  );
}

export default App;
