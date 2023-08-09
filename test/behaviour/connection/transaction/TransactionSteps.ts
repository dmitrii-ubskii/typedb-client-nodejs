/*
 * Copyright (C) 2022 Vaticle
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import {Given, Then} from "@cucumber/cucumber";
import DataTable from "@cucumber/cucumber/lib/models/data_table";
import { TransactionType, TypeDBSession, TypeDBTransaction } from "../../../../dist";
import { assertThrows, assertThrowsWithMessage } from "../../util/Util";
import {optionSetters, sessions, sessionsToTransactions, transactionOptions} from "../ConnectionStepsBase";
import assert = require("assert");

function forEachSessionOpenTransactionsOfType(transactionTypes: TransactionType[]) {
    for (const session of sessions) {
        const transactions: TypeDBTransaction[] = []
        for (const transactionType of transactionTypes) {
            const transaction = session.transaction(transactionType, transactionOptions);
            transactions.push(transaction);
        }
        sessionsToTransactions.set(session, transactions);
    }
}

Then('(for each )session(,) open(s) transaction(s) of type: {transaction_type}', function (transactionType: TransactionType) {
    forEachSessionOpenTransactionsOfType([transactionType]);
});

Then('(for each )session(,) open(s) transaction(s) of type:', function (transactionTypeTable: DataTable) {
    const transactionTypes = dataTableToTransactionTypes(transactionTypeTable);
    forEachSessionOpenTransactionsOfType(transactionTypes);
});

Then('(for each )session(,) open transaction(s) of type; throws exception: {transaction_type}', function (transactionType: TransactionType) {
    for (const session of sessions) {
        assertThrows(() => session.transaction(transactionType));
    }
});

Then('(for each )session(,) open transaction(s) of type; throws exception', function (transactionTypeTable: DataTable) {
    const typeArray = dataTableToTransactionTypes(transactionTypeTable);
    for (const session of sessions) {
        if (!sessionsToTransactions.has(session)) sessionsToTransactions.set(session, [])
        for (const transactionType of typeArray) {
            assertThrows(() => session.transaction(transactionType));
        }
    }
});

Then('(for each )session(,) transaction(s)( in parallel) is/are null: {bool}', function (isNull: boolean) {
    for (const session of sessions) assert.ok(sessionsToTransactions.has(session) !== isNull)
});

Then('(for each )session(,) transaction(s)( in parallel) is/are open: {bool}', function (isOpen: boolean) {
    for (const session of sessions) {
        assert.ok(sessionsToTransactions.has(session));
        for (const transaction of sessionsToTransactions.get(session)) {
            assert.ok(transaction.isOpen() === isOpen);
        }
    }
});

Then('transaction commits', function () {
    sessionsToTransactions.get(sessions[0])[0].commit();
});

Then('transaction commits; throws exception', function () {
    assertThrows(() => sessionsToTransactions.get(sessions[0])[0].commit());
});

Then('transaction commits; throws exception containing {string}', function (error: string) {
    assertThrowsWithMessage(() => sessionsToTransactions.get(sessions[0])[0].commit(), error);
});

Then('(for each )session(,) transaction(s) commit(s)', function () {
    for (const session of sessions) {
        for (const transaction of sessionsToTransactions.get(session)) {
            transaction.commit();
        }
    }
});

Then('(for each )session(,) transaction(s) commit(s); throws exception', function () {
    for (const session of sessions) {
        for (const transaction of sessionsToTransactions.get(session)) {
            assertThrows(() => transaction.commit());
        }
    }
});

Then('(for each )session(,) transaction(s) close(s)', function () {
    for (const session of sessions) {
        for (const transaction of sessionsToTransactions.get(session)) {
            transaction.close();
        }
    }
});

Then('(for each )session(,) transaction(s)( in parallel) has/have type: {transaction_type}', function (type: TransactionType) {
    for (const session of sessions) {
        for (const transaction of sessionsToTransactions.get(session)) {
            assert(transaction.type === type);
        }
    }
});

Then('(for each )session(,) transaction(s)( in parallel) has/have type(s):', function (transactionTypeTable: DataTable) {
    const typeArray = dataTableToTransactionTypes(transactionTypeTable);
    for (const session of sessions) {
        const transactionArray = sessionsToTransactions.get(session)
        for (let i = 0; i < transactionArray.length; i++) {
            assert(transactionArray[i].type === typeArray[i]);
        }
    }
});

Then('(for each )session(,) open transaction(s) in parallel of type:', function (transactionTypeTable: DataTable) {
    const typeArray = dataTableToTransactionTypes(transactionTypeTable);
    const newTransactions: TypeDBTransaction[] = []
    const sessionList: TypeDBSession[] = []
    for (const type of typeArray) {
        for (const session of sessions) {
            newTransactions.push(session.transaction(type));
            sessionList.push(session);
        }
    }
    for (let i = 0; i < newTransactions.length; i++) {
        if (!sessionsToTransactions.has(sessionList[i])) sessionsToTransactions.set(sessionList[i], [])
        sessionsToTransactions.get(sessionList[i]).push(newTransactions[i]);
    }
});


Given('set transaction option {word} to: {word}', function (option: string, value: string) {
    if (!(option in optionSetters)) {
        throw ("Unrecognised option: " + option);
    } else {
        optionSetters[option](transactionOptions, value);
    }
});


function dataTableToTransactionTypes(transactionTypeTable: DataTable): TransactionType[] {
    const typeArray: TransactionType[] = [];
    for (const transactionTypeRow of transactionTypeTable.raw()) {
        switch (transactionTypeRow[0]) {
            case "write":
                typeArray.push(TransactionType.WRITE);
                break;
            case "read":
                typeArray.push(TransactionType.READ);
                break;
            default:
                throw "Behaviour asked for unrecognised Transaction Type. This is a problem with the feature file, not the client or server."
        }
    }
    return typeArray;
}
