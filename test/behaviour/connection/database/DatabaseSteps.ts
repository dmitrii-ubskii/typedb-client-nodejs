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

import { Given, Then, When } from "@cucumber/cucumber";
import DataTable from "@cucumber/cucumber/lib/models/data_table";
import { assertThrows } from "../../util/Util";
import { client, THREAD_POOL_SIZE } from "../ConnectionStepsBase";
import * as assert from "assert";

When("connection create database: {word}", (name: string) => {
    client.databases.create(name);
});

When("connection create database(s):", (names: DataTable) => {
    for (const name of names.raw()) {
        client.databases.create(name[0]);
    }
});

When("connection create databases in parallel:", (names: DataTable) => {
    assert.ok(THREAD_POOL_SIZE >= names.raw().length);
    for (const name of names.raw()) {
        client.databases.create(name[0]);
    }
});

When("connection delete database: {word}", (name: string) => {
    const db = client.databases.get(name);
    db.delete();
});

When("connection delete database(s):", (names: DataTable) => {
    for (const name of names.raw()) {
        const db = client.databases.get(name[0]);
        db.delete();
    }
});

Then("connection delete database; throws exception: {word}", (name: string) => {
    assertThrows(() => {
        client.databases.get(name[0]).delete();
    });
});

Then("connection delete database(s); throws exception", (names: DataTable) => {
    for (const name of names.raw()) {
        assertThrows(() => {
            client.databases.get(name[0]).delete();
        });
    }
});

When("connection delete databases in parallel:", (names: DataTable) => {
    assert.ok(THREAD_POOL_SIZE >= names.raw().length);
    for (const name of names.raw()) {
        client.databases.get(name[0]).delete();
    }
});

When("connection delete all databases", () => {
    for (const db of client.databases.all()) {
        db.delete();
    }
});

Then("connection has database: {word}", (name: string) => {
    const databases = client.databases.all();
    assert.ok(databases.some(x => x.name === name));
});

Then("connection has database(s):", (names: DataTable) => {
    const databases = client.databases.all();
    names.raw().forEach(name => {
        assert.ok(databases.some(x => x.name === name[0]));
    });
});

Then("connection does not have database: {word}", (name: string) => {
    assert.ok(!(client.databases.contains(name)));
});

Then("connection does not have database(s):", (names: DataTable) => {
    const databases = client.databases.all();
    names.raw().forEach(name => {
        assert.ok(!databases.some(x => x.name === name[0]));
    });
});

Given("connection does not have any database", () => {
    const databases = client.databases.all();
    assert.ok(databases.length === 0)
});
