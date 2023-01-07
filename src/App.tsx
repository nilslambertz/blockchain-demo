import React, { useEffect, useState } from "react";
import "./App.css";
import "./Style/Buttons.css";
import {
  Account,
  LogElem,
  Transaction,
  validStartHash,
} from "./Utils/Interfaces";
import {
  blockToString,
  generateAccount,
  generateBlockHash,
  generateBlockHashFromString,
  signTransactionWithPrivateKey,
  verifyAllBlockTransactions,
} from "./Utils/Functions";
import Blockchain from "./Components/Blockchain/Blockchain";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showError, showWarning } from "./Utils/ToastFunctions";
import LogList from "./Components/LogList";
import Footer from "./Components/Footer";
import AccountList from "./Components/Account/AccountList";
import TransactionList from "./Components/Transaction/TransactionList";
import {
  BLOCK_DROPPABLE_PREFIX,
  INITIAL_BLOCKS,
  MAX_MINING_HASH_ITERATIONS,
  TIME_FORMATTER_OPTIONS,
  TRANSACTION_DRAGGABLE_PREFIX,
  TRANSACTION_LIST_DROPPABLE_ID,
} from "./shared/constants";

export default function App() {
  const [logs, setLogs] = useState<LogElem[]>([]);
  const [logsVisible, setLogsVisible] = useState(false);

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [blocks, setBlocks] = useState(INITIAL_BLOCKS);

  const [unusedTransactions, setUnusedTransactions] = useState<number[]>([]);
  const [lastConfirmedBlock, setLastConfirmedBlock] = useState(-1);

  const addLog = (log: LogElem) => {
    const time = new Date().toLocaleTimeString(
      undefined,
      TIME_FORMATTER_OPTIONS
    );
    setLogs([...logs, { ...log, time }]);
  };

  // Recalculates hashes for blocks and checks for changes in previous hashes
  useEffect(() => {
    // If blocks haven't been initialized
    if (!blocks || blocks.length < 2) return;

    const newBlocks = [...blocks];
    const lastBlock = blocks[blocks.length - 1];

    let newBlockAdded = false;

    // If the last block is confirmed or transactions are put into it, an empty block is appended to the list
    if (lastBlock.confirmed || lastBlock.transactions.length !== 0) {
      newBlocks.push({
        id: blocks.length,
        nonce: 0,
        transactions: [],
        confirmed: false,
      });
      addLog({
        type: "info",
        message: "Added new block",
      });
      newBlockAdded = true;
    }

    let changed = false;
    let lastConfirmed = lastConfirmedBlock;

    for (let i = 0; i < newBlocks.length; i++) {
      let hash = generateBlockHash(newBlocks[i], transactions);
      if (hash === "") {
        console.log(
          "Error while generating hash, see previous error-messages!"
        );
        return;
      }

      if (hash !== newBlocks[i].hash) {
        if (!changed && lastConfirmed > i - 1) {
          lastConfirmed = i - 1;
          addLog({
            type: "warning",
            message: `Hash of block ${i} changed, all following blocks are set to unconfirmed`,
          });
        }

        changed = true;
      }
      if (changed) {
        newBlocks[i].confirmed = false;
      }

      newBlocks[i].hash = hash;
      if (i !== newBlocks.length - 1) {
        newBlocks[i + 1].prevHash = hash;
      }
    }

    if (changed || newBlockAdded) {
      setBlocks(newBlocks);
      setLastConfirmedBlock(
        newBlocks.map((block) => block.confirmed).lastIndexOf(true)
      );
    }
  }, [blocks]);

  const addAccount = () => {
    const newAccount = generateAccount(accounts.length, lastConfirmedBlock);
    setAccounts([...accounts, newAccount]);
    addLog({
      type: "info",
      message: `Added account ${newAccount.idString}`,
    });
  };

  const addTransaction = () => {
    const newTransaction: Transaction = {
      id: transactions.length,
      idString: "t" + transactions.length,
      signed: false,
    };

    setTransactions([...transactions, newTransaction]);
    setUnusedTransactions([...unusedTransactions, newTransaction.id]);

    addLog({
      type: "info",
      message: `Added transaction ${newTransaction.idString}`,
    });
  };

  const updateTransaction = (transaction: Transaction) => {
    setTransactions((transactionsArray) => {
      const updatedTransactions = [...transactionsArray];
      updatedTransactions[transaction.id] = transaction;
      return updatedTransactions;
    });
  };

  const signTransaction = (transaction: Transaction) => {
    if (accounts.length === 0) {
      showError("At least one account is needed to set transaction values!");
      addLog({
        type: "error",
        message: "At least one account is needed to set transaction values!",
      });
      return;
    }

    setTransactions((previousTransactions) => {
      // Update transaction in case values have changed
      const updatedTransactions = [...previousTransactions];
      updatedTransactions[transaction.id] = transaction;

      if (transaction.from === undefined || transaction.to === undefined) {
        showError("All values have to be set to sign a transaction!");
        addLog({
          type: "error",
          message: `Transaction ${transaction.id}: All values have to be set to sign the transaction!`,
        });
        return updatedTransactions;
      }

      const sender = transaction.from;
      const senderPrivateKey = accounts[sender].privateKeyArray;
      const senderAddress = accounts[sender].addressArray;

      if (senderPrivateKey !== undefined && senderAddress !== undefined) {
        const signaturePair = signTransactionWithPrivateKey(
          transaction,
          senderPrivateKey
        );

        updatedTransactions[transaction.id].signed = true;
        updatedTransactions[transaction.id].signatureArray =
          signaturePair.signatureArray;
        updatedTransactions[transaction.id].signature = signaturePair.signature;
        addLog({
          type: "success",
          message: `Signed transaction ${transaction.idString}`,
        });
      }

      return updatedTransactions;
    });
  };

  const removeSignature = (transactionId: number) => {
    const updatedTransactions = [...transactions];

    if (updatedTransactions[transactionId].signed) {
      updatedTransactions[transactionId].signed = false;
      updatedTransactions[transactionId].signatureArray = undefined;
      updatedTransactions[transactionId].signature = undefined;

      setTransactions(updatedTransactions);
      addLog({
        type: "info",
        message: `Removed signature of transaction ${updatedTransactions[transactionId].idString} because some values changed`,
      });
    }
  };

  const confirmBlock = (blockId: number) => {
    const updatedAccounts = [...accounts];
    const updatedBlocks = [...blocks];
    const block = { ...updatedBlocks[blockId] };

    if (blockId !== 0 && !blocks[blockId - 1].confirmed) {
      showWarning("All previous blocks need to be confirmed first!");
      addLog({
        type: "error",
        message: "All previous blocks need to be confirmed first!",
      });
      return;
    }

    const transactionsValidated = verifyAllBlockTransactions(
      blocks[blockId],
      transactions,
      accounts
    );

    if (!transactionsValidated) {
      showError("Some transactions could not be verified!");
      addLog({
        type: "error",
        message: `Some transactions in block ${blockId} could not be verified!`,
      });
      return;
    }
    addLog({
      type: "info",
      message: `All transactions in block ${blockId} have valid signatures`,
    });

    const balancesAfterBlock: number[] = [];
    for (let i = 0; i < accounts.length; i++) {
      balancesAfterBlock[i] = accounts[i].balanceBeforeBlock[blockId];
    }

    for (let i = 0; i < blocks[blockId].transactions.length; i++) {
      const transaction = transactions[blocks[blockId].transactions[i]];

      if (
        transaction.from === undefined ||
        transaction.to === undefined ||
        transaction.amount === undefined
      )
        return;

      let newFromValue =
        balancesAfterBlock[transaction.from] - transaction.amount;
      if (newFromValue < 0) {
        showError(
          `Transaction ${transaction.idString} could not be confirmed, account ${transaction.from} doesn't have enough balance for this transaction!`
        );
        addLog({
          type: "error",
          message: `Transaction ${transaction.idString} could not be confirmed, account ${transaction.from} doesn't have enough balance for this transaction!`,
        });
        for (let j = 0; j < accounts.length; j++) {
          updatedAccounts[j].balanceBeforeBlock = updatedAccounts[
            j
          ].balanceBeforeBlock.slice(0, blockId + 1);
        }
        setAccounts(updatedAccounts);
        return;
      }

      balancesAfterBlock[transaction.from] =
        balancesAfterBlock[transaction.from] - transaction.amount;
      balancesAfterBlock[transaction.to] =
        balancesAfterBlock[transaction.to] + transaction.amount;
    }

    for (let i = 0; i < accounts.length; i++) {
      updatedAccounts[i].balanceBeforeBlock[blockId + 1] =
        balancesAfterBlock[i];
    }

    let hash = "";
    let nonce = -1;
    let blockString = blockToString(block, transactions);

    let startTime = performance.now();
    do {
      nonce++;
      hash = generateBlockHashFromString(blockString, nonce);
    } while (
      !hash.startsWith(validStartHash) &&
      nonce < MAX_MINING_HASH_ITERATIONS
    );
    let endTime = performance.now();

    if (
      nonce >= MAX_MINING_HASH_ITERATIONS &&
      !hash.startsWith(validStartHash)
    ) {
      showError("Could not validate block!");
      addLog({
        type: "error",
        message: `Didn't find a valid nonce after ${MAX_MINING_HASH_ITERATIONS} iterations!`,
      });
      return;
    }

    updatedBlocks[blockId] = { ...block, nonce, hash, confirmed: true };
    setBlocks(updatedBlocks);

    addLog({
      type: "success",
      message: `Confirmed block ${blockId} with nonce ${nonce}; calculation time: ${
        endTime - startTime
      }ms`,
    });
  };

  const onDragEnd = (result: DropResult) => {
    let { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    let transactionId: number = parseInt(
      draggableId.replace(TRANSACTION_DRAGGABLE_PREFIX, "")
    );

    const updatedTransactions = [...transactions];
    const updatedUnusedTransactions = [...unusedTransactions];
    const updatedBlocks = [...blocks];

    // If order changed inside unused transactions
    if (
      source.droppableId === TRANSACTION_LIST_DROPPABLE_ID &&
      destination.droppableId === TRANSACTION_LIST_DROPPABLE_ID
    ) {
      updatedUnusedTransactions.splice(source.index, 1);
      updatedUnusedTransactions.splice(destination.index, 0, transactionId);
      setUnusedTransactions(updatedUnusedTransactions);
      return;
    }

    // If transaction was dropped from a block into unused transactions
    if (
      source.droppableId !== TRANSACTION_LIST_DROPPABLE_ID &&
      destination.droppableId === TRANSACTION_LIST_DROPPABLE_ID
    ) {
      const sourceString = result.source.droppableId.replace(
        BLOCK_DROPPABLE_PREFIX,
        ""
      );
      const sourceBlockId = parseInt(sourceString);
      updatedBlocks[sourceBlockId].transactions.splice(source.index, 1);

      updatedUnusedTransactions.splice(destination.index, 0, transactionId);

      setBlocks(updatedBlocks);
      setUnusedTransactions(updatedUnusedTransactions);
      setTransactions(updatedTransactions);
      return;
    }

    // If transaction was dropped from unused transactions into a block
    if (
      source.droppableId === TRANSACTION_LIST_DROPPABLE_ID &&
      destination.droppableId !== TRANSACTION_LIST_DROPPABLE_ID
    ) {
      if (!transactions[transactionId].signed) {
        showError("Transaction must be signed to be included in a block!");
        return;
      }

      updatedUnusedTransactions.splice(source.index, 1);

      const sourceBlockId = parseInt(
        destination.droppableId.replace(BLOCK_DROPPABLE_PREFIX, "")
      );
      const sourceBlockIndex = destination.index;
      updatedBlocks[sourceBlockId].transactions.splice(
        sourceBlockIndex,
        0,
        transactionId
      );

      setBlocks(updatedBlocks);
      setUnusedTransactions(updatedUnusedTransactions);
      setTransactions(updatedTransactions);
      return;
    }

    // If transaction was dropped from a block into another block
    if (
      source.droppableId !== TRANSACTION_LIST_DROPPABLE_ID &&
      destination.droppableId !== TRANSACTION_LIST_DROPPABLE_ID
    ) {
      // Source and destination are blocks
      const sourceBlockId = parseInt(
        source.droppableId.replace(BLOCK_DROPPABLE_PREFIX, "")
      );
      const destinationBlockId = parseInt(
        destination.droppableId.replace(BLOCK_DROPPABLE_PREFIX, "")
      );

      if (sourceBlockId === destinationBlockId) {
        const blockTransactions = [...blocks[sourceBlockId].transactions];

        blockTransactions.splice(source.index, 1);
        blockTransactions.splice(destination.index, 0, transactionId);

        updatedBlocks[sourceBlockId].transactions = blockTransactions;
        setBlocks(updatedBlocks);
      } else {
        const sourceTransactions = [...blocks[sourceBlockId].transactions];
        sourceTransactions.splice(source.index, 1);
        updatedBlocks[sourceBlockId].transactions = sourceTransactions;

        const destinationTransactions = [
          ...blocks[destinationBlockId].transactions,
        ];
        destinationTransactions.splice(destination.index, 0, transactionId);
        updatedBlocks[destinationBlockId].transactions =
          destinationTransactions;

        setBlocks(updatedBlocks);
      }
    }
  };

  return (
    <div className="App">
      <DragDropContext onDragEnd={onDragEnd}>
        <div id={"upperContent"}>
          <AccountList
            accounts={accounts}
            onAddAccount={addAccount}
            lastConfirmedBlock={lastConfirmedBlock}
          ></AccountList>
          <TransactionList
            numberOfAccounts={accounts.length}
            onAddTransaction={addTransaction}
            onRemoveSignature={removeSignature}
            onSign={signTransaction}
            onUpdateTransaction={updateTransaction}
            transactions={transactions}
            transactionOrder={unusedTransactions}
            droppableId={TRANSACTION_LIST_DROPPABLE_ID}
            emptyText="Add some transactions!"
          ></TransactionList>
          <LogList logsVisible={logsVisible} logElements={logs} />
        </div>
        <div id={"lowerContent"}>
          <Blockchain
            blocks={blocks}
            transactions={transactions}
            numberOfAccounts={accounts.length}
            onConfirm={confirmBlock}
            onAddLog={addLog}
          />
        </div>
        <Footer
          toggleLogs={() => setLogsVisible(!logsVisible)}
          logsVisible={logsVisible}
        ></Footer>
      </DragDropContext>
      <ToastContainer />
    </div>
  );
}
