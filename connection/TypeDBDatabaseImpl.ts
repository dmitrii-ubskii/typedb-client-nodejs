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
import {ErrorMessage} from "../common/errors/ErrorMessage";
import {TypeDBClientError} from "../common/errors/TypeDBClientError";
import {checkFFIError} from "../common/util/FFIError";
import SESSION_CLOSED = ErrorMessage.Client.SESSION_CLOSED;
import Replica = Database.Replica;

const ffi = require("../typedb_client_nodejs");

export class TypeDBDatabaseImpl implements Database {
    private _nativeObject: object;

    constructor(native: object) {
        this._nativeObject = native;
    }

    public native(): object {
        return this._nativeObject;
    }

    get name(): string {
        if (this._nativeObject == null) throw new TypeDBClientError(SESSION_CLOSED);  // FIXME DATABASE_DELETED
        return ffi.database_get_name(this._nativeObject);
    }

    schema(): string {
        if (this._nativeObject == null) throw new TypeDBClientError(SESSION_CLOSED);  // FIXME DATABASE_DELETED
        const schema = ffi.database_schema(this._nativeObject);
        checkFFIError();
        return schema;
    }

    typeSchema(): string {
        if (this._nativeObject == null) throw new TypeDBClientError(SESSION_CLOSED);  // FIXME DATABASE_DELETED
        const schema = ffi.database_type_schema(this._nativeObject);
        checkFFIError();
        return schema;
    }

    ruleSchema(): string {
        if (this._nativeObject == null) throw new TypeDBClientError(SESSION_CLOSED);  // FIXME DATABASE_DELETED
        const schema = ffi.database_rule_schema(this._nativeObject);
        checkFFIError();
        return schema;
    }

    delete(): void {
        if (this._nativeObject == null) throw new TypeDBClientError(SESSION_CLOSED);  // FIXME DATABASE_DELETED
        ffi.database_delete(this._nativeObject);
        this._nativeObject = null;
        checkFFIError();
    }

    get replicas(): Replica[] {
        if (this._nativeObject == null) throw new TypeDBClientError(SESSION_CLOSED);  // FIXME DATABASE_DELETED
        const iter = ffi.database_get_replicas_info(this._nativeObject);
        checkFFIError();
        let replicas: Replica[] = [];
        do {
            let replica = ffi.replica_iterator_next(iter)
            checkFFIError();
            if (replica == null) break;
            replicas.push(new ReplicaImpl(replica));
        } while (true);
        return replicas;
    }

    get primaryReplica(): Replica | null {
        if (this._nativeObject == null) throw new TypeDBClientError(SESSION_CLOSED);  // FIXME DATABASE_DELETED
        const res = ffi.database_get_primary_replica_info(this._nativeObject);
        checkFFIError();
        if (res != null) return new ReplicaImpl(res);
        else return null;
    }

    get preferredReplica(): Replica | null {
        if (this._nativeObject == null) throw new TypeDBClientError(SESSION_CLOSED);  // FIXME DATABASE_DELETED
        const res = ffi.database_get_preferred_replica_info(this._nativeObject);
        checkFFIError();
        if (res != null) return new ReplicaImpl(res);
        else return null;
    }

    toString(): string {
        return "Database[" + this.name + "]";
    }
}

export class ReplicaImpl implements Replica {
    private readonly _nativeObject: object;

    constructor(native: object) {
        this._nativeObject = native;
    }

    get address(): string {
        return ffi.replica_info_get_address(this._nativeObject);
    }

    get isPrimary(): boolean {
        return ffi.replica_info_is_primary(this._nativeObject);
    }

    get isPreferred(): boolean {
        return ffi.replica_info_is_preferred(this._nativeObject);
    }

    get term(): number {
        return ffi.replica_info_get_term(this._nativeObject);
    }
}
