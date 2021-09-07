/*
 * Copyright (C) 2021 Vaticle
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

package com.vaticle.typedb.client.connection.core;

import com.vaticle.typedb.client.common.exception.TypeDBClientException;
import com.vaticle.typedb.client.common.rpc.TypeDBStub;
import com.vaticle.typedb.protocol.TypeDBGrpc;
import io.grpc.ManagedChannel;
import io.grpc.StatusRuntimeException;

import java.util.function.Supplier;

public class CoreStub extends TypeDBStub {

    private final ManagedChannel channel;
    private final TypeDBGrpc.TypeDBBlockingStub blockingStub;
    private final TypeDBGrpc.TypeDBStub asyncStub;

    private CoreStub(ManagedChannel channel) {
        super();
        this.channel = channel;
        this.blockingStub = TypeDBGrpc.newBlockingStub(channel);
        this.asyncStub = TypeDBGrpc.newStub(channel);
    }

    public static CoreStub create(ManagedChannel channel) {
        return new CoreStub(channel);
    }

    @Override
    protected ManagedChannel channel() {
        return channel;
    }

    @Override
    protected TypeDBGrpc.TypeDBBlockingStub blockingStub() {
        return blockingStub;
    }

    @Override
    protected TypeDBGrpc.TypeDBStub asyncStub() {
        return asyncStub;
    }

    @Override
    protected <RES> RES resilientCall(Supplier<RES> function) {
        try {
            ensureConnected();
            return function.get();
        } catch (StatusRuntimeException e) {
            throw TypeDBClientException.of(e);
        }
    }
}
