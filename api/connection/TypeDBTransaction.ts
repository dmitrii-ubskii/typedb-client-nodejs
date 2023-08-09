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

// import {ConceptManager} from "../concept/ConceptManager";
// import {LogicManager} from "../logic/LogicManager";
// import {QueryManager} from "../query/QueryManager";
import {TypeDBOptions} from "./TypeDBOptions";

const ffi = require("../../typedb_client_nodejs");

export interface TypeDBTransaction {
    isOpen(): boolean;

    readonly type: TransactionType;

    readonly options: TypeDBOptions;

    // readonly concepts: ConceptManager;

    // readonly logic: LogicManager;

    // readonly query: QueryManager;

    commit(): void;

    rollback(): void;

    close(): void;
}

export class TransactionType {
    static READ = new TransactionType(ffi.Read);
    static WRITE = new TransactionType(ffi.Write);

    private readonly _type: number;

    private constructor(type: number) {
        this._type = type;
    }

    public native(): number {
        return this._type;
    }

    isRead(): boolean {
        return this == TransactionType.READ;
    }

    isWrite(): boolean {
        return this == TransactionType.WRITE;
    }
}
