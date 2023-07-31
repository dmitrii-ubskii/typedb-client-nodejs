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

import {TypeDBOptions} from "./TypeDBOptions";
import {TransactionType, TypeDBTransaction} from "./TypeDBTransaction";

const ffi = require("../../typedb_client_nodejs");

export interface TypeDBSession {
    isOpen(): boolean;

    readonly type: SessionType;

    readonly options: TypeDBOptions;

    readonly database_name: string;

    // transaction(type: TransactionType, options?: TypeDBOptions): TypeDBTransaction;

    close(): void;
}

export interface SessionType {
    isData(): boolean;

    isSchema(): boolean;
}

export class SessionType {
    static DATA = new SessionType(ffi.Data);
    static SCHEMA = new SessionType(ffi.Schema);

    private readonly _type: number;

    private constructor(type: number) {
        this._type = type;
    }

    public native(): number {
        return this._type;
    }

    isData(): boolean {
        return this == SessionType.DATA;
    }

    isSchema(): boolean {
        return this == SessionType.SCHEMA;
    }
}
