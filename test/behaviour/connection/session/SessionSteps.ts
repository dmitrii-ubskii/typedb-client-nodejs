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

import {Given, Then, When} from "@cucumber/cucumber";
import DataTable from "@cucumber/cucumber/lib/models/data_table";
import {SessionType, TypeDBSession} from "../../../../dist";
import {client, optionSetters, sessionOptions, sessions} from "../ConnectionStepsBase";
import assert = require("assert");

When("connection open(s) schema session for database: {word}", (name: string) => {
    sessions.push(client.session(name, SessionType.SCHEMA))
});

When("connection open(s) (data )session for database: {word}", (name: string) => {
    sessions.push(client.session(name, SessionType.DATA))
});

When("connection open(s) schema session(s) for database(s):", (names: DataTable) => {
    for (const name of names.raw()) {
        sessions.push(client.session(name[0], SessionType.SCHEMA))
    }
});

When("connection open(s) (data )session(s) for database(s):", (names: DataTable) => {
    for (const name of names.raw()) {
        sessions.push(client.session(name[0], SessionType.DATA))
    }
});

When("connection open(s) (data )sessions in parallel for databases:", (names: DataTable) => {
    for (const name of names.raw()) {
        sessions.push(client.session(name[0], SessionType.DATA))
    }
});

When("connection close all sessions", () => {
    for (const session of sessions) {
        try {
            if (session.isOpen()) session.close()
        } catch (err) {
            //Pass
        }
    }
    sessions.length = 0;
});

Then("session(s)( in parallel) is/are null: {bool}", function (isNull: boolean) {
    for (const session of sessions) {
        assert.ok(!session === isNull);
    }
});

Then('session(s)( in parallel) is/are open: {bool}', function (isOpen: boolean) {
    for (const session of sessions) {
        assert.ok(session.isOpen() === isOpen);
    }
});

When("session has database: {word}", (name: string) => {
    for (const session of sessions) {
        assert.ok(session.database_name === name);
    }
});

When("sessions( in parallel) have/has databases:", (names: DataTable) => {
    for (let i = 0; i < sessions.length; i++) {
        assert.ok(sessions[i].database_name === names.raw()[i][0]);
    }
});

Given('set session option {word} to: {word}', function (option: string, value: string) {
    if (!(option in optionSetters)) {
        throw ("Unrecognised option: " + option);
    } else {
        optionSetters[option](sessionOptions, value);
    }
});
