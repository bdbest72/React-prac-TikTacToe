import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// //class 컴포넌트형 Square 
// class Square extends React.Component {
//     render() {
//         return (
//             <button 
//                 className="square" 
//                 onClick={ ()=>this.props.onClick()}
//             >
//                 {this.props.value}
//             </button>
//         );
//     }
// }

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
        >
            {props.value}
        </button>
    )
}

class Board extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         squares: Array(9).fill(null),
    //         xIsNext: true,
    //     };
    // }

    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                //Square 컴포에서 상위 컴포인 Baord의 state를 변경할 수 없기에,
                //이를 변경할 수 있는 함수를 하위 컴포에 전달한다.
                onClick={() => this.props.onClick(i)}
            //결과적으로, Board에서 Square로 value와 onClick 두 개의 props를 전달한다.
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        // 하드 카피
        const squaresCopy = current.squares.slice();
        //누군가가 승자라면 클릭을 무시한다.
        if (calculateWinner(squaresCopy) || squaresCopy[i]) {
            return;
        }
        //const 변수가 array, object일 경우 내부 원소를 조작하는 것은
        //재선언, 재할당에 해당하지 않음으로 가능!
        squaresCopy[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            //push()와 비슷하지만 기존 배열을 변경하지 않는 concat()
            history: history.concat([{
                squares: squaresCopy,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={()=>this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })


        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    //승리 경우의 수
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
