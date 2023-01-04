import React from "react";
import "./App.css";
import "./Style/Buttons.css";
import UpperList from "./Components/UpperList/UpperList";
import {
  Account,
  Block,
  LogElem,
  SignaturePair,
  Transaction,
  validStartHash,
} from "./Utils/Interfaces";
import {
  blockToString,
  generateAccount,
  generateBlockHash,
  generateBlockHashFromString,
  signTransaction,
  verifyAllBlockTransactions,
} from "./Utils/Functions";
import Blockchain from "./Components/Blockchain/Blockchain";
import { DragDropContext } from "react-beautiful-dnd";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showError, showWarning } from "./Utils/ToastFunctions";
import LogList from "./Components/LogList";
import Footer from "./Components/Footer";
import AccountList from "./Components/Account/AccountList";

interface AppProps {}

interface AppState {
  accountIdCount: number;
  accounts: Account[];
  transactionIdCount: number;
  transactions: Transaction[];
  unusedTransactions: number[];
  blockIdCount: number;
  blocks: Block[];
  lastConfirmedBlock: number;
  lastUnusedBlock: number;
  logs: LogElem[];
  logsVisible: boolean;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      accountIdCount: 0,
      accounts: [],
      transactionIdCount: 0,
      transactions: [],
      unusedTransactions: [],
      blockIdCount: 2,
      blocks: [
        {
          id: 0,
          prevHash: validStartHash,
          nonce: 0,
          transactions: [],
          confirmed: false,
        },
        {
          id: 1,
          nonce: 0,
          transactions: [],
          confirmed: false,
        },
      ],
      lastConfirmedBlock: -1,
      lastUnusedBlock: 1,
      logs: [],
      logsVisible: false,
    };

    this.recalculateBlocks();
  }

  /**
   * Creates a new account and appends it to the account-list
   */
  addAccount = (): void => {
    let count = this.state.accountIdCount;
    let a = generateAccount(count, this.state.lastConfirmedBlock);

    let arr: Account[] = this.state.accounts;
    arr.push(a);
    this.setState({ accounts: arr, accountIdCount: count + 1 }, () => {
      this.addLog({
        type: "info",
        message: "Added account " + a.idString,
      });
    });
  };

  /**
   * Creates a new transaction and appends it to the unused-transactions-list
   */
  addTransaction = (): void => {
    let count = this.state.transactionIdCount;

    let t: Transaction = {
      id: count,
      idString: "t" + count,
      signed: false,
      editable: true,
    };

    let arr: Transaction[] = this.state.transactions;
    let unusedArr: number[] = this.state.unusedTransactions;
    arr.push(t);
    unusedArr.push(t.id);
    this.setState(
      {
        transactions: arr,
        unusedTransactions: unusedArr,
        transactionIdCount: count + 1,
      },
      () => {
        this.addLog({
          type: "info",
          message: "Added transaction " + t.idString,
        });
      }
    );
  };

  /**
   * Signs a transaction with the private key
   * @param t transaction
   */
  signTransaction = (t: Transaction) => {
    if (this.state.accounts.length === 0) {
      showError(
        "At least one account is needed to set all transaction values!"
      );
      this.addLog({
        type: "error",
        message:
          "At least one account is needed to set all transaction values!",
      });
      return;
    }

    if (t.from === undefined || t.to === undefined) {
      showError("All values have to be set to sign a transaction!");
      this.addLog({
        type: "error",
        message:
          "Transaction " +
          t.id +
          ": All values have to be set to sign the transaction!",
      });
      return;
    }

    let sender: number = t.from;

    let privateKey = this.state.accounts[sender].privateKeyArray;
    let address = this.state.accounts[sender].addressArray;

    if (sender !== -1 && privateKey !== undefined && address !== undefined) {
      let sig: SignaturePair = signTransaction(t, privateKey);

      let transactionArray = this.state.transactions;

      transactionArray[t.id].signed = true;
      transactionArray[t.id].signatureArray = sig.signatureArray;
      transactionArray[t.id].signature = sig.signature;

      this.setState({ transactions: transactionArray }, () => {
        this.addLog({
          type: "success",
          message: "Signed transaction " + t.idString,
        });
      });
    }
  };

  /**
   * Removes signature of transaction
   * @param id transactionId
   */
  removeSignature = (id: number) => {
    let transactionArray: Transaction[] = this.state.transactions;
    let t: Transaction = transactionArray[id];

    if (t.signed) {
      t.signed = false;
      t.signatureArray = undefined;
      t.signature = undefined;

      transactionArray[id] = t;

      this.setState({ transactions: transactionArray }, () => {
        this.addLog({
          type: "info",
          message:
            "Removed signature of transaction " +
            t.idString +
            " because some values changed",
        });
      });
    }
  };

  /**
   * Calculates the hashes of every block and sets them to unconfirmed if previous hashes changed
   */
  recalculateBlocks = () => {
    let blocks = [...this.state.blocks];
    let transactions = [...this.state.transactions];
    let nextId = this.state.blockIdCount;
    let lastUnusedBlock = this.state.lastUnusedBlock;

    // If the last block is confirmed or transactions are put into it, an empty block is appended to the list
    if (
      blocks[blocks.length - 1].confirmed ||
      blocks[blocks.length - 1].transactions.length !== 0
    ) {
      blocks.push({
        id: nextId,
        nonce: 0,
        transactions: [],
        confirmed: false,
      });
      this.addLog({
        type: "info",
        message: "Added new block",
      });
      lastUnusedBlock = nextId;
    }

    let changed = false;
    let lastConfirmed = this.state.lastConfirmedBlock;

    for (let i = 0; i < blocks.length; i++) {
      let hash = generateBlockHash(blocks[i], transactions);
      if (hash === "") {
        console.log(
          "Error while generating hash, see previous error-messages!"
        );
        return;
      }
      if (hash !== blocks[i].hash) {
        if (!changed && lastConfirmed > i - 1) {
          lastConfirmed = i - 1;
          this.addLog({
            type: "warning",
            message:
              "Hash of block " +
              i +
              " changed, all following blocks are set to unconfirmed",
          });
        }

        changed = true;
      }
      if (changed) {
        blocks[i].confirmed = false;
      }

      blocks[i].hash = hash;
      if (i !== blocks.length - 1) {
        blocks[i + 1].prevHash = hash;
      }
    }

    this.setState({
      blocks: blocks,
      lastUnusedBlock: lastUnusedBlock,
      lastConfirmedBlock: lastConfirmed,
      blockIdCount: lastUnusedBlock + 1,
    });
  };

  confirmBlock = (id: number) => {
    let blocks = [...this.state.blocks];
    let transactions = [...this.state.transactions];
    let accounts = [...this.state.accounts];

    if (id !== 0 && !blocks[id - 1].confirmed) {
      showWarning("All previous blocks need to be confirmed first!");
      this.addLog({
        type: "error",
        message: "All previous blocks need to be confirmed first!",
      });
      return;
    }

    let transactionsValidated = verifyAllBlockTransactions(
      blocks[id],
      transactions,
      accounts
    );

    if (!transactionsValidated) {
      showError("Some transactions could not be verified!");
      this.addLog({
        type: "error",
        message: "Some transactions in block " + id + " could not be verified!",
      });
      return;
    }
    this.addLog({
      type: "info",
      message: "All transactions in block " + id + " have valid signatures",
    });

    let balancesAfterBlock: number[] = [];
    for (let i = 0; i < accounts.length; i++) {
      balancesAfterBlock[i] = accounts[i].balanceBeforeBlock[id];
    }

    for (let i = 0; i < blocks[id].transactions.length; i++) {
      let t = transactions[blocks[id].transactions[i]];

      if (t.from === undefined || t.to === undefined || t.amount === undefined)
        return;

      let newFromValue = balancesAfterBlock[t.from] - t.amount;
      if (newFromValue < 0) {
        showError(
          "Transaction " +
            t.idString +
            " could not be confirmed, account " +
            t.from +
            " doesn't have enough balance for this transaction!"
        );
        this.addLog({
          type: "error",
          message:
            "Transaction " +
            t.idString +
            " could not be confirmed, account " +
            t.from +
            " doesn't have enough balance for this transaction!",
        });
        for (let j = 0; j < accounts.length; j++) {
          accounts[j].balanceBeforeBlock = accounts[j].balanceBeforeBlock.slice(
            0,
            id + 1
          );
        }
        this.setState({ accounts: accounts });
        return;
      }

      balancesAfterBlock[t.from] = balancesAfterBlock[t.from] - t.amount;
      balancesAfterBlock[t.to] = balancesAfterBlock[t.to] + t.amount;
    }

    for (let i = 0; i < accounts.length; i++) {
      accounts[i].balanceBeforeBlock[id + 1] = balancesAfterBlock[i];
    }

    let hash = "";
    let block = blocks[id];
    let nonce = -1;

    let blockString = blockToString(block, transactions);

    let iterations = 1000000;

    let startTime = performance.now();
    do {
      nonce++;
      hash = generateBlockHashFromString(blockString, nonce);
    } while (!hash.startsWith(validStartHash) && nonce < iterations);
    let endTime = performance.now();

    if (nonce >= iterations && !hash.startsWith(validStartHash)) {
      showError("Could not validate block!");
      this.addLog({
        type: "error",
        message: "Didn't find a valid nonce in " + iterations + " iterations!",
      });
      return;
    }

    block.nonce = nonce;
    block.confirmed = true;
    block.hash = hash;
    blocks[id] = block;

    this.setState(
      { blocks: blocks, lastConfirmedBlock: block.id, accounts: accounts },
      () => {
        this.addLog({
          type: "success",
          message:
            "Confirmed block " +
            id +
            " with nonce " +
            nonce +
            "; calculation time: " +
            (endTime - startTime) +
            "ms",
        });
        this.recalculateBlocks();
      }
    );
  };

  onDragEnd = (result: any) => {
    let { destination, source, draggableId } = result;

    if (result.destination === null) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    let sourceIndex: number = result.source.index;
    let destinationIndex: number = result.destination.index;
    let transactionId: number = parseInt(
      draggableId.replace("transaction", "")
    );

    let transactionList = this.state.transactions;
    let unusedTransactions = this.state.unusedTransactions;
    let blocks = this.state.blocks;

    if (result.destination.droppableId === "transactionList") {
      if (result.source.droppableId === "transactionList") {
        unusedTransactions.splice(sourceIndex, 1);
        unusedTransactions.splice(destinationIndex, 0, transactionId);

        this.setState({ unusedTransactions: unusedTransactions });
      } else {
        let source = result.source.droppableId.replace("block", "");
        let blockId = parseInt(source);

        blocks[blockId].transactions.splice(sourceIndex, 1);

        unusedTransactions.splice(destinationIndex, 0, transactionId);

        transactionList[transactionId].editable = true;

        this.setState({
          blocks: blocks,
          unusedTransactions: unusedTransactions,
          transactions: transactionList,
        });
      }
    } else {
      if (result.source.droppableId === "transactionList") {
        let transactionList = this.state.transactions;
        if (!transactionList[transactionId].signed) {
          showError("Transaction must be signed to be included in a block!");
          return;
        }

        unusedTransactions.splice(sourceIndex, 1);

        // console.log(this.state.blocks);

        let blockId = parseInt(
          result.destination.droppableId.replace("block", "")
        );
        //console.log(blockId);
        let blockIndex = result.destination.index;
        blocks[blockId].transactions.splice(blockIndex, 0, transactionId);

        transactionList[transactionId].editable = false;

        this.setState({
          unusedTransactions: unusedTransactions,
          blocks: blocks,
          transactions: transactionList,
        });
      } else {
        // Source and destination are blocks
        let sourceBlockId = parseInt(
          result.source.droppableId.replace("block", "")
        );
        let destinationBlockId = parseInt(
          result.destination.droppableId.replace("block", "")
        );

        if (sourceBlockId === destinationBlockId) {
          let blocks = this.state.blocks;
          let transactions = blocks[sourceBlockId].transactions;

          transactions.splice(sourceIndex, 1);
          transactions.splice(destinationIndex, 0, transactionId);

          blocks[sourceBlockId].transactions = transactions;
          this.setState({ blocks: blocks });
        } else {
          let sourceTransactions = blocks[sourceBlockId].transactions;
          sourceTransactions.splice(sourceIndex, 1);
          blocks[sourceBlockId].transactions = sourceTransactions;

          let destinationTransactions = blocks[destinationBlockId].transactions;
          destinationTransactions.splice(destinationIndex, 0, transactionId);
          blocks[destinationBlockId].transactions = destinationTransactions;

          this.setState({ blocks: blocks });
        }
      }
    }

    this.recalculateBlocks();
  };

  addLog = (log: LogElem) => {
    let date = new Date();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    log.time =
      (h < 10 ? "0" + h : h) +
      ":" +
      (m < 10 ? "0" + m : m) +
      ":" +
      (s < 10 ? "0" + s : s);

    let logs = this.state.logs;
    logs.push(log);
    this.setState({ logs: logs });
  };

  render() {
    return (
      <div className="App">
        <DragDropContext onDragEnd={this.onDragEnd}>
          <div id={"upperContent"}>
            <AccountList
              accounts={this.state.accounts}
              onAddAccount={this.addAccount}
              lastConfirmedBlock={this.state.lastConfirmedBlock}
            ></AccountList>
            <UpperList
              title={"transactions"}
              transactions={this.state.transactions}
              transactionOrder={this.state.unusedTransactions}
              numberOfAccounts={this.state.accountIdCount}
              className={"transactionListContainer"}
              droppableId={"transactionList"}
              addFunction={this.addTransaction}
              signFunction={this.signTransaction}
              removeSignatureFunction={this.removeSignature}
              addLogFunction={this.addLog}
            />
            <LogList
              logsVisible={this.state.logsVisible}
              logElements={this.state.logs}
            />
          </div>
          <div id={"lowerContent"}>
            <Blockchain
              blocks={this.state.blocks}
              transactions={this.state.transactions}
              onConfirm={this.confirmBlock}
              onAddLog={this.addLog}
            />
          </div>
          <Footer
            toggleLogs={() =>
              this.setState({ logsVisible: !this.state.logsVisible })
            }
            logsVisible={this.state.logsVisible}
          ></Footer>
        </DragDropContext>
        <ToastContainer />
      </div>
    );
  }
}

export default App;
