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

import {Database} from "../api/connection/database/Database";
import {DatabaseManager} from "../api/connection/database/DatabaseManager";
import {ErrorMessage} from "../common/errors/ErrorMessage";
import {TypeDBClientError} from "../common/errors/TypeDBClientError";
import {TypeDBDatabaseImpl} from "./TypeDBDatabaseImpl";
import {checkFFIError} from "../common/util/FFIError";

const ffi = require("../typedb_client_nodejs");

export class TypeDBDatabaseManagerImpl implements DatabaseManager {
    private readonly _nativeObject: object;

    constructor(nativeConnection: object) {
        this._nativeObject = ffi.database_manager_new(nativeConnection);
    }

    public get(name: string): Database {
        if (!name) throw new TypeDBClientError(ErrorMessage.Client.MISSING_DB_NAME);
        const database = ffi.databases_get(this._nativeObject, name);
        checkFFIError();
        return new TypeDBDatabaseImpl(database);
    }

    public contains(name: string): boolean {
        if (!name) throw new TypeDBClientError(ErrorMessage.Client.MISSING_DB_NAME);
        const contains = ffi.databases_contains(this._nativeObject, name);
        checkFFIError();
        return contains;
    }

    public create(name: string): void {
        if (!name) throw new TypeDBClientError(ErrorMessage.Client.MISSING_DB_NAME);
        ffi.databases_create(this._nativeObject, name);
        checkFFIError();
    }

    public all(): Database[] {
        const iter = ffi.databases_all(this._nativeObject);
        checkFFIError();
        let databases: Database[] = [];
        do {
            const database = ffi.database_iterator_next(iter);
            checkFFIError();
            if (database == null) break;
            databases.push(new TypeDBDatabaseImpl(database));
        } while (true);
        return databases;
    }
}
