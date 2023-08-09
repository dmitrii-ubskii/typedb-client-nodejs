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
import {TypeDBOptions} from "../api/connection/TypeDBOptions";
import {SessionType, TypeDBSession} from "../api/connection/TypeDBSession";
import {TransactionType, TypeDBTransaction} from "../api/connection/TypeDBTransaction";
// import {ErrorMessage} from "../common/errors/ErrorMessage";
// import {TypeDBClientError} from "../common/errors/TypeDBClientError";
import {TypeDBTransactionImpl} from "./TypeDBTransactionImpl";
// import SESSION_CLOSED = ErrorMessage.Client.SESSION_CLOSED;
import {checkFFIError} from "../common/util/FFIError";
import {TypeDBDatabaseImpl} from "./TypeDBDatabaseImpl";

const ffi = require("../typedb_client_nodejs");

export class TypeDBSessionImpl implements TypeDBSession {
    private readonly _nativeObject: object;

    private readonly _type: SessionType;
    private readonly _options: TypeDBOptions;

    constructor(database: TypeDBDatabaseImpl, type: SessionType, options: TypeDBOptions) {
        this._nativeObject = ffi.session_new(database.native(), type.native(), options.native());
        checkFFIError();
        this._type = type;
        this._options = options;
    }

    public native(): object {
        return this._nativeObject;
    }

    close() {
        ffi.session_force_close(this._nativeObject)
        checkFFIError();
    }

    transaction(type: TransactionType, options?: TypeDBOptions): TypeDBTransaction {
        return new TypeDBTransactionImpl(this, type, options);
    }

    isOpen(): boolean {
        return ffi.session_is_open(this._nativeObject);
    }

    get options(): TypeDBOptions {
        return this._options;
    }

    get type(): SessionType {
        return this._type;
    }

    get database_name(): string {
        return ffi.session_get_database_name(this._nativeObject);
    }
}
