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

import {After, Before, BeforeAll} from "@cucumber/cucumber";
import {TypeDB, TypeDBClient, TypeDBOptions} from "../../../dist";
import {
    afterBase,
    beforeBase,
    client,
    createDefaultClient,
    setClientFn,
    setDefaultClientFn,
    setSessionOptions,
    setTransactionOptions
} from "./ConnectionStepsBase";

BeforeAll(() => {
    setClientFn((username, password) => {
        throw new Error("Core client does not support authentication");
    });
    setDefaultClientFn(() => TypeDB.coreClient());
    setSessionOptions(new TypeDBOptions({"infer": true}));
    setTransactionOptions(new TypeDBOptions({"infer": true}));
});

Before(async () => {
    beforeBase();
    clearDB();
});

After(async () => {
    afterBase();
    clearDB()
});

async function clearDB() {
    // TODO: reset the database through the TypeDB runner once it exists
    createDefaultClient();
    const databases = client.databases.all();
    for (const db of databases) {
        db.delete();
    }
    client.close();
}
