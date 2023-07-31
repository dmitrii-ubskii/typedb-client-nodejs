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

import { TypeDBClient as TypeDBClient } from "./api/connection/TypeDBClient";
import { TypeDBCredential } from "./api/connection/TypeDBCredential";
import { TypeDBClientImpl } from "./connection/TypeDBClientImpl";

export namespace TypeDB {
    export const CORE_DEFAULT_ADDRESS = "localhost:1729";
    export const CLUSTER_DEFAULT_ADDRESS = "localhost:11729";

    export function coreClient(address: string = CORE_DEFAULT_ADDRESS): TypeDBClient {
        return TypeDBClientImpl.openPlaintext(address);
    }

    export function clusterClient(addresses: string | string[], credential: TypeDBCredential): TypeDBClient {
        if (typeof addresses === 'string') addresses = [addresses];
        return TypeDBClientImpl.openEncrypted(addresses, credential);
    }
}
