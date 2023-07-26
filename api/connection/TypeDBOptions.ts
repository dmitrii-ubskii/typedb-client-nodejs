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

import {TypeDBClientError} from "../../common/errors/TypeDBClientError";
import {ErrorMessage} from "../../common/errors/ErrorMessage";
import POSITIVE_VALUE_REQUIRED = ErrorMessage.Client.POSITIVE_VALUE_REQUIRED;

const ffi = require("../typedb_client_nodejs");

export class TypeDBOptions {
    private readonly _nativeObject: object;

    constructor() {
        this._nativeObject = ffi.options_new();
    }

    get infer() {
        if (ffi.options_has_infer(this._nativeObject)) return ffi.options_get_infer(this._nativeObject);
        else return null;
    }

    set infer(value: boolean) {
        ffi.options_set_infer(this._nativeObject, value);
    }

    get traceInference() {
        if (ffi.options_has_trace_inference(this._nativeObject)) return ffi.options_get_trace_inference(this._nativeObject); else return null;
    }

    set traceInference(value: boolean) {
        ffi.options_set_trace_inference(this._nativeObject, value);
    }

    get explain() {
        if (ffi.options_has_explain(this._nativeObject)) return ffi.options_get_explain(this._nativeObject); else return null;
    }

    set explain(value: boolean) {
        ffi.options_set_explain(this._nativeObject, value);
    }

    get parallel() {
        if (ffi.options_has_parallel(this._nativeObject)) return ffi.options_get_parallel(this._nativeObject); else return null;
    }

    set parallel(value: boolean) {
        ffi.options_set_parallel(this._nativeObject, value);
    }

    get prefetch() {
        if (ffi.options_has_prefetch(this._nativeObject)) return ffi.options_get_prefetch(this._nativeObject); else return null;
    }

    set prefetch(value: boolean) {
        ffi.options_set_prefetch(this._nativeObject, value);
    }

    get prefetchSize() {
        if (ffi.options_has_prefetch_size(this._nativeObject)) return ffi.options_get_prefetch_size(this._nativeObject); else return null;
    }

    set prefetchSize(value: number) {
        if (value < 1) {
            throw new TypeDBClientError(POSITIVE_VALUE_REQUIRED.message(value));
        }
        ffi.options_set_prefetch_size(this._nativeObject, value);
    }

    get sessionIdleTimeoutMillis() {
        if (ffi.options_has_session_idle_timeout_millis(this._nativeObject)) return ffi.options_get_session_idle_timeout_millis(this._nativeObject);
        return null;
    }

    set sessionIdleTimeoutMillis(value: number) {
        if (value < 1) {
            throw new TypeDBClientError(POSITIVE_VALUE_REQUIRED.message(value));
        }
        ffi.options_set_session_idle_timeout_millis(this._nativeObject, value);
    }

    get schemaLockAcquireTimeoutMillis() {
        if (ffi.options_has_transaction_timeout_millis(this._nativeObject)) return ffi.options_get_transaction_timeout_millis(this._nativeObject);
        return null;
    }

    set transactionTimeoutMillis(value: number) {
        if (value < 1) {
            throw new TypeDBClientError(POSITIVE_VALUE_REQUIRED.message(value));
        }
        ffi.options_set_transaction_timeout_millis(this._nativeObject, value);
    }

    get transactionTimeoutMillis() {
        if (ffi.options_has_schema_lock_acquire_timeout_millis(this._nativeObject)) return ffi.options_get_schema_lock_acquire_timeout_millis(this._nativeObject);
        return null;
    }

    set schemaLockAcquireTimeoutMillis(value: number) {
        if (value < 1) {
            throw new TypeDBClientError(POSITIVE_VALUE_REQUIRED.message(value));
        }
        ffi.options_set_schema_lock_acquire_timeout_millis(this._nativeObject, value);
    }

    get readAnyReplica() {
        if (ffi.options_has_read_any_replica(this._nativeObject)) return ffi.options_get_read_any_replica(this._nativeObject);
        return null;
    }

    set readAnyReplica(value: boolean) {
        ffi.options_set_read_any_replica(this._nativeObject, value);
    }
}
