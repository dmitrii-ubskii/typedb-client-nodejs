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

import { ChannelCredentials } from "@grpc/grpc-js";
import { TypeDBClient as GRPCStub } from "typedb-protocol/proto/service";
import { TypeDBStub } from "../../common/rpc/TypeDBStub";

export class CoreStub extends TypeDBStub {
    private readonly _stub: GRPCStub;

    constructor(address: string) {
        super();
        this._stub = new GRPCStub(address, ChannelCredentials.createInsecure());
    }

    stub(): GRPCStub {
        return this._stub;
    }

    async mayRenewToken<RES>(fn: () => Promise<RES>): Promise<RES> {
        return await fn();
    }
}