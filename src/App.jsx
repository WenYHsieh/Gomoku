import { useState } from 'react'
import styled from 'styled-components'

const Game = styled.div`
  height: 100vh;
  position: relative;
  background-color: slate;
  overflow: hidden;
`
const ControlPanel = styled.div`
  width: 630px;
  display: flex;
  margin: 20px auto;
  justify-content: space-between;
  align-items: center;
`

const Status = styled.span`
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  font-style: italic;
`

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -48%);
  border: 3px solid #2b2b2b;
  box-shadow: 15px 10px 15px -4px rgba(0, 0, 0, 0.75);
  ${(props) => {
    if (props.$type === 'grid')
      return `left: calc(50%);  border: 2px solid black;  box-shadow:none; `
  }}
`

const Row = styled.div`
  display: flex;
`

const Cell = styled.div`
  width: 40px;
  height: 40px;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;

  ${(props) => {
    if (props.$type === 'grid')
      return ` border-color: #2b2b2b; background-color:transparent`
  }};
`

const Chessman = styled.div`
  width: 30px;
  height: 30px;
  border: 1px solid black;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  border: 1px solid black;
  box-shadow: 0px 2px 2px 2px rgba(0, 0, 0, 0.12);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  ${(props) => {
    if (props.$isChessmanWinner) return `box-shadow: -1px 2px 5px 3px #f7ff00`
  }}
`
const GameoverBanner = styled.div`
  width: 100%;
  height: 0px;
  font-size: 50px;
  color: white;
  text-align: center;
  line-height: 200px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 2;
  overflow: hidden;
  transition: 0.8s linear;
  ${(props) => {
    if (props.$winner) return `height: 200px`
  }}
`

const ResetBtn = styled.button`
  border: 0;
  padding: 0;
  padding: 8px 16px;
  board-radius: 5px;
  outline: none;
  transition: 0.8s linear;
  &:hover {
    opacity: 0.7;
  }
`

const initialState = Array(15).fill(Array(15).fill(null))

const App = () => {
  const [board, setBoard] = useState(initialState)
  const [isBlackTurn, setIsBlackTurn] = useState(true)
  const [winnerData, setWinnerData] = useState({
    winner: null,
    coordinations: new Array(),
  })

  const handleClick = (rowIndex, colIndex) => {
    if (board[rowIndex][colIndex] || winnerData?.winner) {
      return
    }

    const updatedBoard = board.map((row, i) =>
      i === rowIndex
        ? row.map((value, j) =>
            j === colIndex ? (isBlackTurn ? 'BLACK' : 'WHITE') : value
          )
        : row
    )

    setBoard(updatedBoard)
    setIsBlackTurn(!isBlackTurn)
    checkWinner(updatedBoard, rowIndex, colIndex)
  }

  const checkWinner = (board, rowIndex, colIndex) => {
    const directions = [
      [0, 1], // 水平
      [1, 0], // 垂直
      [1, 1], // 正斜線
      [-1, 1], // 反斜線
    ]

    const currentPlayer = board[rowIndex][colIndex]
    for (const [dx, dy] of directions) {
      let count = 1
      const sameColorCoordination = new Array()
      let i = rowIndex + dx
      let j = colIndex + dy

      while (
        i >= 0 &&
        i < 15 &&
        j >= 0 &&
        j < 15 &&
        board[i][j] === currentPlayer
      ) {
        sameColorCoordination.push([i, j])
        count++
        i += dx
        j += dy
      }

      i = rowIndex - dx
      j = colIndex - dy
      while (
        i >= 0 &&
        i < 15 &&
        j >= 0 &&
        j < 15 &&
        board[i][j] === currentPlayer
      ) {
        sameColorCoordination.push([i, j])

        count++
        i -= dx
        j -= dy
      }

      if (count >= 5) {
        sameColorCoordination.push([rowIndex, colIndex]),
          setWinnerData({
            winner: currentPlayer,
            coordinations: sameColorCoordination,
          })
        break
      }
    }
  }

  const handleRestartGame = () => {
    setBoard(initialState)
    setWinnerData({
      winner: null,
      coordinations: new Array(),
    })
  }

  const isSubarrayIn2DArray = (subarray, array) => {
    const subarrayStr = subarray.join(',')
    return array.some((row) => row.join(',').includes(subarrayStr))
  }

  const renderBoard = () =>
    board.map((row, rowIndex) => (
      <Row key={rowIndex}>
        {row.map((value, colIndex) => {
          const isChessmanWinner = isSubarrayIn2DArray(
            [rowIndex, colIndex],
            winnerData?.coordinations
          )
          return (
            <Cell
              key={colIndex}
              onClick={() => handleClick(rowIndex, colIndex)}
            >
              {value && (
                <Chessman
                  color={value === 'BLACK' ? '#000000' : '#ffff'}
                  $isChessmanWinner={isChessmanWinner}
                />
              )}
            </Cell>
          )
        })}
      </Row>
    ))

  const renderGrid = () => {
    return Array(14)
      .fill(Array(14).fill(null))
      ?.map((row, rowIndex) => (
        <Row key={rowIndex}>
          {row.map((_, colIndex) => (
            <Cell key={colIndex} $type='grid'></Cell>
          ))}
        </Row>
      ))
  }

  return (
    <>
      <Game>
        <GameoverBanner $winner={winnerData?.winner}>
          Game Over... The Winner is {winnerData?.winner} !
        </GameoverBanner>
        <ControlPanel>
          <Status>{'Next player: ' + (isBlackTurn ? 'black' : 'white')}</Status>
          <ResetBtn onClick={handleRestartGame}>RESTART</ResetBtn>
        </ControlPanel>
        <BoardContainer $type='grid'>{renderGrid()}</BoardContainer>
        <BoardContainer>{renderBoard()}</BoardContainer>
      </Game>
    </>
  )
}

export default App

/**
 * 悔棋
 * 紀錄每一步
 * 回朔每一步
 *
 */
