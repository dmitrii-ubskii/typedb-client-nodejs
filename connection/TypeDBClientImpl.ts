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

import {DatabaseManager} from "../api/connection/database/DatabaseManager";
import {TypeDBCredential} from "../api/connection/TypeDBCredential";
import {TypeDBClient} from "../api/connection/TypeDBClient";
import {TypeDBDatabaseManagerImpl} from "./TypeDBDatabaseManagerImpl";
// import {UserManager} from "../api/user/UserManager";
import {SessionType, TypeDBSession} from "../api/connection/TypeDBSession";
import {TypeDBOptions} from "../api/connection/TypeDBOptions";
// import {UserManagerImpl} from "../user/UserManagerImpl";
import {checkFFIError} from "../common/util/FFIError";
import {TypeDBSessionImpl} from "./TypeDBSessionImpl";
import {TypeDBDatabaseImpl} from "./TypeDBDatabaseImpl";

const ffi = require("../typedb_client_nodejs");

export class TypeDBClientImpl implements TypeDBClient {
    private readonly _nativeObject: object;

    private readonly _databases: TypeDBDatabaseManagerImpl;

    // private readonly _users: UserManagerImpl;

    static openPlaintext(address: string): TypeDBClient {
        const nativeObject = ffi.connection_open_plaintext(address);
        checkFFIError();
        return new TypeDBClientImpl(nativeObject);
    }

    static openEncrypted(addresses: string[], credential: TypeDBCredential): TypeDBClient {
        const nativeObject = ffi.connection_open_encrypted(addresses, credential.nativeObject);
        checkFFIError();
        return new TypeDBClientImpl(nativeObject);
    }

    private constructor(native: object) {
        this._nativeObject = native;
        this._databases = new TypeDBDatabaseManagerImpl(this._nativeObject);
        // this._users = new UserManagerImpl(this._nativeObject);
    }

    isOpen(): boolean {
        return ffi.connection_is_open(this._nativeObject);
    }

    get databases(): DatabaseManager {
        return this._databases;
    }

    // get users(): UserManager {
    //     return this._users;
    // }

    session(database: string, type: SessionType, options?: TypeDBOptions): TypeDBSession {
        if (!options) options = new TypeDBOptions();
        return new TypeDBSessionImpl(this.databases.get(database) as TypeDBDatabaseImpl, type, options);
    }

    close(): void {
        ffi.connection_force_close(this._nativeObject);
        checkFFIError();
    }
}
